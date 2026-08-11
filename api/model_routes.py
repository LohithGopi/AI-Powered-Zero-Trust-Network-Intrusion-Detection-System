import os
import json
import numpy as np
from flask import Blueprint, request, jsonify, render_template, g
from config import Config
from database.init_db import db, DatasetHistory, ModelHistory
from preprocessing.dataset_loader import DatasetLoader
from preprocessing.preprocess import DataPreprocessor
from training.train_model import LSTMTrainer, start_training_in_background, training_status
from security.zero_trust import jwt_required, require_role
from utils.logger import log_audit_event, logger

model_bp = Blueprint("model", __name__)

@model_bp.route("/train-model", methods=["GET"])
@jwt_required
def train_page():
    all_datasets = DatasetHistory.query.order_by(DatasetHistory.upload_date.desc()).all()
    selected_ds = DatasetHistory.query.filter_by(is_selected=True).first()
    if not selected_ds and all_datasets:
        selected_ds = all_datasets[0]
    return render_template(
        "train_model.html",
        datasets=[d.to_dict() for d in all_datasets],
        dataset=selected_ds.to_dict() if selected_ds else None,
        user=g.user
    )


@model_bp.route("/model-report", methods=["GET"])
@jwt_required
def report_page():
    report_data = None
    if os.path.exists(Config.REPORT_FILE_PATH):
        try:
            with open(Config.REPORT_FILE_PATH, "r", encoding="utf-8") as f:
                report_data = json.load(f)
        except Exception as e:
            logger.error(f"Error reading report file: {e}")

    latest_model = ModelHistory.query.order_by(ModelHistory.trained_at.desc()).first()
    return render_template(
        "model_report.html",
        report=report_data,
        model_info=latest_model.to_dict() if latest_model else None,
        user=g.user
    )

@model_bp.route("/api/train", methods=["POST"])
@jwt_required
@require_role(["Admin", "Analyst"])
def train_model_api():
    if training_status["is_training"]:
        return jsonify({"error": "Model training is already in progress.", "status": training_status}), 400

    data = request.get_json() or {}
    epochs = int(data.get("epochs", 10))
    dataset_id = data.get("dataset_id")

    # Get target dataset
    if dataset_id:
        ds = DatasetHistory.query.get(dataset_id)
    else:
        ds = DatasetHistory.query.filter_by(is_selected=True).first()
        if not ds:
            ds = DatasetHistory.query.order_by(DatasetHistory.upload_date.desc()).first()

    if not ds:
        return jsonify({"error": "No dataset found. Please upload a CSV dataset first."}), 400


    if not os.path.exists(ds.filepath):
        return jsonify({"error": f"Dataset file not found at path: {ds.filepath}"}), 404

    try:
        # Step 1: Preprocess dataset
        df = DatasetLoader.load_dataset(ds.filepath, ds.dataset_type)
        preprocessor = DataPreprocessor()
        summary, (X_train, X_test, y_train, y_test) = preprocessor.process(df)

        log_audit_event(
            action="DATASET_PREPROCESSED",
            status="SUCCESS",
            user_id=g.user.get("user_id"),
            username=g.user.get("username"),
            ip_address=request.remote_addr,
            details=f"Preprocessed {ds.filename}. Features: {summary['total_features']}, Classes: {summary['num_classes']}"
        )

        # Step 2: Start Training in background or synchronous
        start_training_in_background(X_train, y_train, X_test, y_test, epochs=epochs, dataset_name=ds.filename)

        # Save model history record stub
        history_entry = ModelHistory(
            model_name="LSTM Intrusion Detection Model",
            dataset_name=ds.filename,
            params_json=json.dumps({"epochs": epochs, "features": summary['total_features'], "architecture": "LSTM(64)->Dropout(0.2)->Dense(32)->Softmax"}),
            artifact_path=Config.MODEL_FILE_PATH
        )
        db.session.add(history_entry)
        db.session.commit()

        log_audit_event(
            action="MODEL_TRAINING_STARTED",
            status="SUCCESS",
            user_id=g.user.get("user_id"),
            username=g.user.get("username"),
            ip_address=request.remote_addr,
            details=f"Started training LSTM model on '{ds.filename}' for {epochs} epochs."
        )

        return jsonify({
            "message": "Preprocessing completed. Training started in background.",
            "preprocessing_summary": summary,
            "status": training_status
        }), 202

    except Exception as e:
        logger.error(f"Failed to start training: {str(e)}")
        log_audit_event(
            action="MODEL_TRAINING",
            status="FAILED",
            user_id=g.user.get("user_id"),
            username=g.user.get("username"),
            ip_address=request.remote_addr,
            details=f"Training initialization error: {str(e)}"
        )
        return jsonify({"error": f"Training failed: {str(e)}"}), 500

@model_bp.route("/api/model/status", methods=["GET"])
@jwt_required
def get_model_status_api():
    return jsonify(training_status), 200

@model_bp.route("/api/model/report", methods=["GET"])
@jwt_required
def get_model_report_api():
    if not os.path.exists(Config.REPORT_FILE_PATH):
        return jsonify({"error": "No model evaluation report found. Train a model first."}), 404

    try:
        with open(Config.REPORT_FILE_PATH, "r", encoding="utf-8") as f:
            report = json.load(f)
        return jsonify(report), 200
    except Exception as e:
        return jsonify({"error": f"Failed to load evaluation report: {str(e)}"}), 500


# ── Model Comparison API Endpoints ──

@model_bp.route("/api/models/compare", methods=["POST"])
@model_bp.route("/models/compare", methods=["POST"])
@jwt_required
@require_role(["Admin", "Analyst"])
def compare_models_api():
    """Train baseline models and evaluate LSTM, Logistic Regression, and Random Forest on identical test data."""
    try:
        ds = DatasetHistory.query.filter_by(is_selected=True).first()
        dataset_name = ds.filename if ds else "Network Intrusion Dataset"

        user_id = g.user.get("user_id") if g.user else None
        username = g.user.get("username", "admin") if g.user else "admin"

        log_audit_event(
            action="MODEL_COMPARISON_STARTED",
            status="SUCCESS",
            user_id=user_id,
            username=username,
            ip_address=request.remote_addr,
            details=f"Initiated 3-model comparison (LSTM vs. Logistic Regression vs. Random Forest) on dataset '{dataset_name}'."
        )

        from training.compare_models import ModelComparator
        comparator = ModelComparator()
        report = comparator.run_comparison(dataset_name=dataset_name)

        # Save model history entries for each comparison model
        for m in report.get("models", []):
            history_entry = ModelHistory(
                model_name=f"{m['name']} Baseline",
                dataset_name=dataset_name,
                accuracy=m.get("accuracy", 0.0),
                precision=m.get("precision", 0.0),
                recall=m.get("recall", 0.0),
                f1_score=m.get("f1_score", 0.0),
                training_time=m.get("training_time", 0.0),
                prediction_time=m.get("prediction_time", 0.0),
                model_type=m.get("type", "Machine Learning"),
                framework=m.get("framework", "scikit-learn"),
                model_status="Trained & Evaluated",
                params_json=json.dumps({"comparison_run": True})
            )
            db.session.add(history_entry)
        db.session.commit()

        log_audit_event(
            action="MODEL_COMPARISON_COMPLETED",
            status="SUCCESS",
            user_id=user_id,
            username=username,
            ip_address=request.remote_addr,
            details=f"Model comparison finished. Best Model identified: '{report.get('best_model', {}).get('name')}'."
        )

        return jsonify(report), 200

    except Exception as e:
        logger.error(f"Model comparison execution failed: {str(e)}")
        log_audit_event(
            action="MODEL_COMPARISON_FAILED",
            status="FAILED",
            user_id=g.user.get("user_id") if g.user else None,
            username=g.user.get("username", "admin") if g.user else "admin",
            ip_address=request.remote_addr,
            details=f"Model comparison failed: {str(e)}"
        )
        return jsonify({
            "status": "error",
            "message": f"Model comparison failed: {str(e)}"
        }), 500


@model_bp.route("/api/models/comparison", methods=["GET"])
@model_bp.route("/models/comparison", methods=["GET"])
@jwt_required
def get_model_comparison_api():
    """Retrieve latest stored 3-model comparison report JSON."""
    report_file = os.path.join(Config.MODEL_DIR, "model_comparison_report.json")
    if not os.path.exists(report_file):
        return jsonify({
            "status": "not_available",
            "message": "No model comparison has been performed."
        }), 200

    try:
        with open(report_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        return jsonify(data), 200
    except Exception as e:
        logger.error(f"Error reading model comparison report: {e}")
        return jsonify({
            "status": "not_available",
            "message": f"Error reading comparison report: {str(e)}"
        }), 200

