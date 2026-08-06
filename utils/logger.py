import logging
import os
from datetime import datetime
from config import Config

def setup_logger(name="AI_NIDS"):
    """Configure console and file loggers."""
    log_dir = Config.LOG_DIR
    os.makedirs(log_dir, exist_ok=True)

    log_file = os.path.join(log_dir, "app.log")

    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # Avoid duplicate handlers
    if not logger.handlers:
        # Formatter
        formatter = logging.Formatter(
            '[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )

        # Console Handler
        c_handler = logging.StreamHandler()
        c_handler.setFormatter(formatter)
        logger.addHandler(c_handler)

        # File Handler
        f_handler = logging.FileHandler(log_file, encoding='utf-8')
        f_handler.setFormatter(formatter)
        logger.addHandler(f_handler)

    return logger

logger = setup_logger()

def log_audit_event(action, status, user_id=None, username=None, ip_address=None, details=None):
    """Log audit event to system logger and database AuditLog table."""
    logger.info(f"AUDIT | Action: {action} | Status: {status} | User: {username or 'Anon'} | IP: {ip_address} | Details: {details}")

    try:
        from database.init_db import db, AuditLog
        from flask import has_app_context

        if has_app_context():
            audit = AuditLog(
                user_id=user_id,
                username=username,
                action=action,
                ip_address=ip_address,
                status=status,
                details=str(details) if details else None,
                timestamp=datetime.utcnow()
            )
            db.session.add(audit)
            db.session.commit()
    except Exception as e:
        logger.error(f"Failed to record audit log to database: {str(e)}")
