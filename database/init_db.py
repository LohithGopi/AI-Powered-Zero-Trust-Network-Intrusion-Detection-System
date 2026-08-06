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
    params_json = db.Column(db.Text, nullable=True)
    artifact_path = db.Column(db.String(512), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "model_name": self.model_name,
            "dataset_name": self.dataset_name,
            "trained_at": self.trained_at.strftime("%Y-%m-%d %H:%M:%S"),
            "accuracy": round(self.accuracy, 4),
            "loss": round(self.loss, 4),
            "precision": round(self.precision, 4),
            "recall": round(self.recall, 4),
            "f1_score": round(self.f1_score, 4),
            "params_json": self.params_json,
            "artifact_path": self.artifact_path
        }


def init_db(app):
    """Initialize database schemas and insert seed values."""
    db.init_app(app)

    with app.app_context():
        # Ensure database directory exists
        db_dir = os.path.dirname(app.config["DB_PATH"])
        if db_dir:
            os.makedirs(db_dir, exist_ok=True)

        db.create_all()

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

        # Seed default Admin account
        from security.password import hash_password
        admin_user = User.query.filter_by(username=app.config["DEFAULT_ADMIN_USER"]).first()
        if not admin_user:
            admin_user = User(
                username=app.config["DEFAULT_ADMIN_USER"],
                email=app.config["DEFAULT_ADMIN_EMAIL"],
                password_hash=hash_password(app.config["DEFAULT_ADMIN_PASS"]),
                role_id=role_map["Admin"].id
            )
            db.session.add(admin_user)
            db.session.commit()
            print(f"[DB INIT] Created default admin account: '{app.config['DEFAULT_ADMIN_USER']}'")

        # Pre-install 2 benchmark datasets if inventory is empty
        seed_benchmark_datasets()


def seed_benchmark_datasets():
    if DatasetHistory.query.first():
        return

    from config import Config
    import numpy as np
    import pandas as pd

    os.makedirs(Config.DATASET_RAW_DIR, exist_ok=True)
    np.random.seed(42)

    # 1. NSL-KDD Benchmark Dataset Sample
    kdd_path = os.path.join(Config.DATASET_RAW_DIR, "nsl_kdd_benchmark_sample.csv")
    kdd_data = {
        "duration": np.random.exponential(scale=10.0, size=1000).round(2),
        "protocol_type": np.random.choice(["tcp", "udp", "icmp"], size=1000, p=[0.7, 0.2, 0.1]),
        "service": np.random.choice(["http", "smtp", "private", "domain_u", "ftp_data"], size=1000),
        "flag": np.random.choice(["SF", "S0", "REJ", "RSTO"], size=1000, p=[0.65, 0.2, 0.1, 0.05]),
        "src_bytes": np.random.randint(40, 50000, size=1000),
        "dst_bytes": np.random.randint(40, 100000, size=1000),
        "count": np.random.randint(1, 300, size=1000),
        "serror_rate": np.random.uniform(0.0, 1.0, size=1000).round(2),
        "same_srv_rate": np.random.uniform(0.0, 1.0, size=1000).round(2),
        "label": np.random.choice(["normal", "neptune", "ipsweep", "portsweep", "satan"], size=1000, p=[0.55, 0.25, 0.1, 0.06, 0.04])
    }
    df_kdd = pd.DataFrame(kdd_data)
    df_kdd.to_csv(kdd_path, index=False)

    ds_kdd = DatasetHistory(
        filename="nsl_kdd_benchmark_sample.csv",
        dataset_type="NSL-KDD",
        row_count=len(df_kdd),
        col_count=len(df_kdd.columns),
        file_size_mb=round(os.path.getsize(kdd_path) / (1024 * 1024), 2),
        filepath=kdd_path,
        is_selected=True,
        upload_status="Uploaded"
    )
    db.session.add(ds_kdd)

    # 2. UNSW-NB15 Benchmark Dataset Sample
    unsw_path = os.path.join(Config.DATASET_RAW_DIR, "unsw_nb15_benchmark_sample.csv")
    unsw_data = {
        "dur": np.random.exponential(scale=15.0, size=1000).round(3),
        "proto": np.random.choice(["tcp", "udp", "arp", "ospf"], size=1000, p=[0.6, 0.3, 0.05, 0.05]),
        "state": np.random.choice(["FIN", "CON", "INT", "REQ"], size=1000),
        "spkts": np.random.randint(1, 200, size=1000),
        "dpkts": np.random.randint(1, 200, size=1000),
        "sbytes": np.random.randint(60, 80000, size=1000),
        "dbytes": np.random.randint(60, 150000, size=1000),
        "rate": np.random.uniform(0.5, 3000.0, size=1000).round(2),
        "sttl": np.random.choice([64, 128, 255], size=1000),
        "dttl": np.random.choice([64, 128, 255], size=1000),
        "label": np.random.choice(["Normal", "Generic", "Exploits", "Fuzzers", "DoS"], size=1000, p=[0.5, 0.2, 0.15, 0.1, 0.05])
    }
    df_unsw = pd.DataFrame(unsw_data)
    df_unsw.to_csv(unsw_path, index=False)

    ds_unsw = DatasetHistory(
        filename="unsw_nb15_benchmark_sample.csv",
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
    print("[DB INIT] Pre-installed 2 benchmark testing datasets: 'nsl_kdd_benchmark_sample.csv' & 'unsw_nb15_benchmark_sample.csv'")

