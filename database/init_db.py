from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

class Role(db.Model):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)

    users = db.relationship('User', backref='role', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description
        }


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role.name if self.role else None,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }


class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)
    username = db.Column(db.String(80), nullable=True)
    action = db.Column(db.String(100), nullable=False)
    ip_address = db.Column(db.String(45), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), nullable=False)  # SUCCESS, FAILED, REJECTED
    details = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "username": self.username or "Anonymous",
            "action": self.action,
            "ip_address": self.ip_address,
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "status": self.status,
            "details": self.details
        }


class DatasetHistory(db.Model):
    __tablename__ = 'dataset_history'

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    dataset_type = db.Column(db.String(50), nullable=False)  # NSL-KDD, UNSW-NB15, CICIDS2017, Custom
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    row_count = db.Column(db.Integer, default=0)
    col_count = db.Column(db.Integer, default=0)
    file_size_mb = db.Column(db.Float, default=0.0)
    filepath = db.Column(db.String(512), nullable=False)
    is_selected = db.Column(db.Boolean, default=False)
    upload_status = db.Column(db.String(50), default="Uploaded")

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "dataset_type": self.dataset_type,
            "upload_date": self.upload_date.strftime("%Y-%m-%d %H:%M:%S"),
            "row_count": self.row_count,
            "col_count": self.col_count,
            "file_size_mb": round(self.file_size_mb, 2),
            "filepath": self.filepath,
            "is_selected": self.is_selected,
            "upload_status": self.upload_status
        }


class ModelHistory(db.Model):
    __tablename__ = 'model_history'

    id = db.Column(db.Integer, primary_key=True)
    model_name = db.Column(db.String(100), nullable=False)
    dataset_name = db.Column(db.String(255), nullable=False)
    trained_at = db.Column(db.DateTime, default=datetime.utcnow)
    accuracy = db.Column(db.Float, default=0.0)
    loss = db.Column(db.Float, default=0.0)
    precision = db.Column(db.Float, default=0.0)
    recall = db.Column(db.Float, default=0.0)
    f1_score = db.Column(db.Float, default=0.0)
    training_time = db.Column(db.Float, default=0.0)
    prediction_time = db.Column(db.Float, default=0.0)
    model_type = db.Column(db.String(100), default="Deep Learning")
    framework = db.Column(db.String(100), default="TensorFlow/Keras")
    model_status = db.Column(db.String(50), default="Trained")
    params_json = db.Column(db.Text, nullable=True)
    artifact_path = db.Column(db.String(512), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "model_name": self.model_name,
            "dataset_name": self.dataset_name,
            "trained_at": self.trained_at.strftime("%Y-%m-%d %H:%M:%S") if self.trained_at else "N/A",
            "accuracy": round(self.accuracy, 4),
            "loss": round(self.loss, 4),
            "precision": round(self.precision, 4),
            "recall": round(self.recall, 4),
            "f1_score": round(self.f1_score, 4),
            "training_time": round(self.training_time, 3),
            "prediction_time": round(self.prediction_time, 4),
            "model_type": self.model_type,
            "framework": self.framework,
            "model_status": self.model_status,
            "params_json": self.params_json,
            "artifact_path": self.artifact_path
        }



def init_db(app):
    """Initialize database schemas and insert seed values efficiently."""
    db.init_app(app)

    with app.app_context():
        # Ensure database directory exists
        db_dir = os.path.dirname(app.config["DB_PATH"])
        if db_dir:
            os.makedirs(db_dir, exist_ok=True)

        db.create_all()

        # Quick check: if roles already exist, skip detailed role & dataset seeding
        if Role.query.first():
            return

        # Seed roles
        role_map = {}
        for role_name in app.config["ROLES"]:
            role = Role.query.filter_by(name=role_name).first()
            if not role:
                desc = f"Zero Trust {role_name} Role"
                role = Role(name=role_name, description=desc)
                db.session.add(role)
                db.session.commit()
            role_map[role_name] = role

        # Seed default role accounts (Admin, Analyst, User)
        from security.password import hash_password

        default_users = [
            ("admin", "admin@jnnce.ac.in", "admin123", "Admin"),
            ("analyst", "analyst@jnnce.ac.in", "analyst123", "Analyst"),
            ("user", "user@jnnce.ac.in", "user123", "User")
        ]

        for uname, uemail, upass, rname in default_users:
            u_obj = User.query.filter_by(username=uname).first()
            if not u_obj:
                u_obj = User(
                    username=uname,
                    email=uemail,
                    password_hash=hash_password(upass),
                    role_id=role_map[rname].id
                )
                db.session.add(u_obj)
                db.session.commit()

        # Pre-install 2 real benchmark datasets if inventory is empty
        seed_real_benchmark_datasets()


def seed_real_benchmark_datasets():
    # If datasets are already recorded in DB, skip completely (Fast Startup)
    if DatasetHistory.query.first():
        return

    from config import Config
    import pandas as pd
    from generate_real_benchmark_datasets import create_real_nsl_kdd_dataset, create_real_unsw_nb15_dataset

    os.makedirs(Config.DATASET_RAW_DIR, exist_ok=True)

    # 1. NSL-KDD Real Intrusion Benchmark Dataset
    kdd_path = os.path.join(Config.DATASET_RAW_DIR, "nsl_kdd_intrusion_dataset.csv")
    if not os.path.exists(kdd_path):
        create_real_nsl_kdd_dataset(5000)

    df_kdd = pd.read_csv(kdd_path)
    ds_kdd = DatasetHistory(
        filename="nsl_kdd_intrusion_dataset.csv",
        dataset_type="NSL-KDD",
        row_count=len(df_kdd),
        col_count=len(df_kdd.columns),
        file_size_mb=round(os.path.getsize(kdd_path) / (1024 * 1024), 2),
        filepath=kdd_path,
        is_selected=True,
        upload_status="Uploaded"
    )
    db.session.add(ds_kdd)

    # 2. UNSW-NB15 Real Network Flow Dataset
    unsw_path = os.path.join(Config.DATASET_RAW_DIR, "unsw_nb15_network_flow_dataset.csv")
    if not os.path.exists(unsw_path):
        create_real_unsw_nb15_dataset(5000)

    df_unsw = pd.read_csv(unsw_path)
    ds_unsw = DatasetHistory(
        filename="unsw_nb15_network_flow_dataset.csv",
        dataset_type="UNSW-NB15",
        row_count=len(df_unsw),
        col_count=len(df_unsw.columns),
        file_size_mb=round(os.path.getsize(unsw_path) / (1024 * 1024), 2),
        filepath=unsw_path,
        is_selected=False,
        upload_status="Uploaded"
    )
    db.session.add(ds_unsw)

    db.session.commit()
