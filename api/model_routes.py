import os
import json
import time
import uuid
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
@model_bp.route("/api/training/start", methods=["POST"])
@jwt_required
@require_role(["Admin"])
def train_model_api():
    if training_status.get("is_training", False) and training_status.get("status") == "Training in progress":
        return jsonify({"error": "Model training is currently in progress.", "status": training_status}), 400

    data = request.get_json() or {}
    epochs = int(data.get("epochs", 10))
    batch_size = int(data.get("batch_size", 32))
    learning_rate = float(data.get("learning_rate", 0.001))
    dataset_id = data.get("dataset_id")
    training_rows = int(data.get("training_rows", 25000))
    random_seed = int(data.get("random_seed", 42))
    sequence_length = int(data.get("sequence_length", 1))

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
        from flask import current_app
        app = current_app._get_current_object()

        run_id = start_training_in_background(
            app=app,
            dataset_id=ds.id,
            training_rows=training_rows,
            epochs=epochs,
            batch_size=batch_size,
            learning_rate=learning_rate,
            random_seed=random_seed,
            sequence_length=sequence_length
        )

        log_audit_event(
            action="MODEL_TRAINING_START",
            status="SUCCESS",
            user_id=g.user.get("user_id"),
            username=g.user.get("username"),
            ip_address=request.remote_addr,
            details=f"Started training run '{run_id}' on {ds.filename} ({training_rows:,} rows, seed {random_seed}, {epochs} epochs)."
        )

        return jsonify({
            "message": f"Model training run '{run_id}' initiated successfully.",
            "run_id": run_id,
            "status": "Started",
            "dataset": ds.filename,
            "training_rows": training_rows,
            "epochs": epochs
        }), 202

    except Exception as e:
        logger.error(f"Failed to start training: {str(e)}")
        return jsonify({"error": f"Failed to launch training: {str(e)}"}), 500


@model_bp.route("/api/training/<run_id>", methods=["GET"])
@jwt_required
def get_training_run_status_api(run_id):
    mh = ModelHistory.query.filter(ModelHistory.model_name.contains(run_id)).first()
    if mh:
        return jsonify(mh.to_dict()), 200
    
    if training_status.get("run_id") == run_id:
        return jsonify(training_status), 200

    return jsonify({"error": f"Training run '{run_id}' not found."}), 404


@model_bp.route("/api/training/<run_id>/history", methods=["GET"])
@jwt_required
def get_training_run_history_api(run_id):
    if training_status.get("run_id") == run_id:
        return jsonify({
            "run_id": run_id,
            "epoch_history": training_status.get("epoch_history", [])
        }), 200

    mh = ModelHistory.query.filter(ModelHistory.model_name.contains(run_id)).first()
    if mh and mh.params_json:
        try:
            params = json.loads(mh.params_json)
            artifact_dir = params.get("artifact_dir")
            if artifact_dir and os.path.exists(os.path.join(artifact_dir, "training_metadata.json")):
                with open(os.path.join(artifact_dir, "training_metadata.json"), "r", encoding="utf-8") as f:
                    meta = json.load(f)
                return jsonify(meta), 200
        except Exception as e:
            logger.warning(f"Error reading artifact history: {e}")

    return jsonify({"run_id": run_id, "epoch_history": []}), 200

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
