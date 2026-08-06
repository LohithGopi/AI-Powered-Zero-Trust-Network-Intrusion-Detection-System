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
