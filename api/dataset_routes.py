import os
import pandas as pd
from flask import Blueprint, request, jsonify, render_template, redirect, url_for, g
from werkzeug.utils import secure_filename
from config import Config
from database.init_db import db, DatasetHistory
from preprocessing.dataset_loader import DatasetLoader
from security.zero_trust import jwt_required, require_role
from utils.logger import log_audit_event, logger

dataset_bp = Blueprint("dataset", __name__)

@dataset_bp.route("/upload-dataset", methods=["GET"])
@jwt_required
def upload_page():
    return render_template("upload_dataset.html", user=g.user)

@dataset_bp.route("/dataset-list", methods=["GET"])
@jwt_required
def dataset_list_page():
    datasets = DatasetHistory.query.order_by(DatasetHistory.upload_date.desc()).all()
    return render_template("dataset_list.html", datasets=[d.to_dict() for d in datasets], user=g.user)

@dataset_bp.route("/dataset-compare", methods=["GET", "POST"])
@jwt_required
def dataset_compare_page():
    datasets = DatasetHistory.query.all()
    return render_template("dataset_compare.html", datasets=[d.to_dict() for d in datasets], user=g.user)

@dataset_bp.route("/api/dataset/upload", methods=["POST"])
@jwt_required
@require_role(["Admin", "Analyst"])
def upload_dataset_api():
    dataset_type = request.form.get("dataset_type", "Custom")

    if 'file' not in request.files:
        return jsonify({"error": "No file included in upload request."}), 400


    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file."}), 400

    if not file.filename.endswith('.csv'):
        return jsonify({"error": "Only CSV dataset files are supported."}), 400

    filename = secure_filename(file.filename)
    os.makedirs(Config.DATASET_RAW_DIR, exist_ok=True)
    target_filepath = os.path.join(Config.DATASET_RAW_DIR, filename)
    file.save(target_filepath)

    try:
        # Load and parse metadata
        df = DatasetLoader.load_dataset(target_filepath, dataset_type)
        file_size_mb = os.path.getsize(target_filepath) / (1024 * 1024)

        ds = DatasetHistory(
            filename=filename,
            dataset_type=dataset_type,
            row_count=len(df),
            col_count=len(df.columns),
            file_size_mb=file_size_mb,
            filepath=target_filepath,
            is_selected=False,
            upload_status="Uploaded"
        )
        db.session.add(ds)
        db.session.commit()

        log_audit_event(
            action="DATASET_UPLOAD",
            status="SUCCESS",
            user_id=g.user.get("user_id"),
            username=g.user.get("username"),
            ip_address=request.remote_addr,
            details=f"Uploaded dataset: {filename} ({len(df)} rows, {len(df.columns)} cols)"
        )

        return jsonify({"message": "Dataset uploaded successfully!", "dataset": ds.to_dict()}), 201

    except Exception as e:
        logger.error(f"Dataset upload failed: {str(e)}")
        log_audit_event(
            action="DATASET_UPLOAD",
            status="FAILED",
            user_id=g.user.get("user_id"),
            username=g.user.get("username"),
            ip_address=request.remote_addr,
            details=f"Upload error: {str(e)}"
        )
        return jsonify({"error": f"Failed to parse dataset: {str(e)}"}), 500

@dataset_bp.route("/api/datasets", methods=["GET"])
@jwt_required
def get_datasets_api():
    datasets = DatasetHistory.query.order_by(DatasetHistory.upload_date.desc()).all()
    return jsonify([d.to_dict() for d in datasets]), 200

@dataset_bp.route("/api/dataset/info", methods=["GET"])
@jwt_required
def get_dataset_info_api():
    dataset_id = request.args.get("id")
    if not dataset_id:
        ds = DatasetHistory.query.filter_by(is_selected=True).first()
        if not ds:
            ds = DatasetHistory.query.order_by(DatasetHistory.upload_date.desc()).first()
    else:
        ds = DatasetHistory.query.get(dataset_id)

    if not ds:
        return jsonify({"error": "No dataset found."}), 404

    return jsonify(ds.to_dict()), 200

@dataset_bp.route("/api/dataset/select", methods=["POST"])
@jwt_required
@require_role(["Admin", "Analyst"])
def select_dataset_api():
    data = request.get_json() or {}
    dataset_id = data.get("id")

    if not dataset_id:
        return jsonify({"error": "Dataset ID is required."}), 400

    ds = DatasetHistory.query.get(dataset_id)
    if not ds:
        return jsonify({"error": "Dataset not found."}), 404

    # Deselect all and mark chosen as selected
    DatasetHistory.query.update({DatasetHistory.is_selected: False})
    ds.is_selected = True
    db.session.commit()

    log_audit_event(
        action="DATASET_SELECT",
        status="SUCCESS",
        user_id=g.user.get("user_id"),
        username=g.user.get("username"),
        ip_address=request.remote_addr,
        details=f"Selected dataset '{ds.filename}' for active training."
    )

    return jsonify({"message": f"Dataset '{ds.filename}' selected successfully.", "dataset": ds.to_dict()}), 200

@dataset_bp.route("/api/dataset/compare", methods=["POST"])
@jwt_required
def compare_datasets_api():
    data = request.get_json() or {}
    dataset_ids = data.get("dataset_ids", [])

    if not dataset_ids:
        datasets = DatasetHistory.query.all()
    else:
        datasets = DatasetHistory.query.filter(DatasetHistory.id.in_(dataset_ids)).all()

    comparison_results = []

    for ds in datasets:
        stats = {
            "id": ds.id,
            "filename": ds.filename,
            "dataset_type": ds.dataset_type,
            "rows": ds.row_count,
            "columns": ds.col_count,
            "file_size_mb": ds.file_size_mb,
            "missing_values": 0,
            "duplicate_records": 0,
            "feature_count": max(0, ds.col_count - 1),
            "attack_classes": ["Normal", "Attack"]
        }

        # Detailed stats if file exists
        if os.path.exists(ds.filepath):
            try:
                df = DatasetLoader.load_dataset(ds.filepath, ds.dataset_type)
                stats["missing_values"] = int(df.isnull().sum().sum())
                stats["duplicate_records"] = int(df.duplicated().sum())
                stats["feature_count"] = max(0, len(df.columns) - 1)
                
                if "label" in df.columns:
                    classes = df["label"].astype(str).unique().tolist()
                    stats["attack_classes"] = classes[:5] # top classes
            except Exception as e:
                logger.warning(f"Could not compute deep stats for {ds.filename}: {e}")

        comparison_results.append(stats)

    return jsonify({"comparison": comparison_results}), 200

@dataset_bp.route("/api/dataset/delete/<int:dataset_id>", methods=["DELETE"])
@jwt_required
@require_role(["Admin"])
def delete_dataset_api(dataset_id):
    ds = DatasetHistory.query.get(dataset_id)
    if not ds:
        return jsonify({"error": "Dataset record not found."}), 404

    filename = ds.filename
    filepath = ds.filepath

    try:
        # Delete from disk if file exists
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
            except Exception as fe:
                logger.warning(f"Could not remove physical file {filepath}: {fe}")

        # Delete database record
        db.session.delete(ds)
        db.session.commit()

        log_audit_event(
            action="DATASET_DELETE",
            status="SUCCESS",
            user_id=g.user.get("user_id"),
            username=g.user.get("username"),
            ip_address=request.remote_addr,
            details=f"Deleted dataset '{filename}' (ID: {dataset_id})."
        )

        return jsonify({"message": f"Dataset '{filename}' deleted successfully."}), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to delete dataset {dataset_id}: {e}")
        log_audit_event(
            action="DATASET_DELETE",
            status="FAILED",
            user_id=g.user.get("user_id"),
            username=g.user.get("username"),
            ip_address=request.remote_addr,
            details=f"Failed to delete dataset '{filename}': {str(e)}"
        )
        return jsonify({"error": f"Failed to delete dataset: {str(e)}"}), 500

