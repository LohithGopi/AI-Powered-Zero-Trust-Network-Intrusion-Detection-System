import os
import time
import json
import uuid
import joblib
import threading
import numpy as np
import pandas as pd
from config import Config
from utils.logger import logger
from training.evaluate_model import ModelEvaluator
from preprocessing.sampler import StratifiedNIDSSampler
from preprocessing.preprocess import DataPreprocessor

# Global Training State Dictionary for Live Progress Tracking
training_status = {
    "run_id": None,
    "dataset_name": "N/A",
    "is_training": False,
    "current_epoch": 0,
    "total_epochs": 10,
    "accuracy": 0.0,
    "loss": 0.0,
    "val_accuracy": 0.0,
    "val_loss": 0.0,
    "epoch_history": [],
    "estimated_time_remaining": "0s",
    "status": "Idle",
    "message": "No active training job."
}


def get_progress_callback_class():
    """Lazily import Keras Callback to avoid top-level TensorFlow load delay."""
    import tensorflow as tf
    from tensorflow.keras.callbacks import Callback

    class ProgressCallback(Callback):
        def __init__(self, total_epochs):
            super().__init__()
            self.total_epochs = total_epochs
            self.start_time = None

        def on_train_begin(self, logs=None):
            self.start_time = time.time()
            training_status["is_training"] = True
            training_status["total_epochs"] = self.total_epochs
            training_status["status"] = "Training in progress"

        def on_epoch_end(self, epoch, logs=None):
            logs = logs or {}
            elapsed = time.time() - self.start_time
            epochs_completed = epoch + 1
            avg_time_per_epoch = elapsed / epochs_completed
            remaining_epochs = self.total_epochs - epochs_completed
            eta_seconds = int(remaining_epochs * avg_time_per_epoch)

            acc = float(round(logs.get("accuracy", 0.0), 4))
            loss = float(round(logs.get("loss", 0.0), 4))
            val_acc = float(round(logs.get("val_accuracy", 0.0), 4))
            val_loss = float(round(logs.get("val_loss", 0.0), 4))

            training_status["current_epoch"] = epochs_completed
            training_status["accuracy"] = acc
            training_status["loss"] = loss
            training_status["val_accuracy"] = val_acc
            training_status["val_loss"] = val_loss
            training_status["estimated_time_remaining"] = f"{eta_seconds}s"

            epoch_entry = {
                "epoch": epochs_completed,
                "accuracy": acc,
                "loss": loss,
                "val_accuracy": val_acc,
                "val_loss": val_loss
            }

            if not any(e["epoch"] == epochs_completed for e in training_status["epoch_history"]):
                training_status["epoch_history"].append(epoch_entry)

            logger.info(f"[{training_status['run_id']}] Epoch {epochs_completed}/{self.total_epochs} - Loss: {loss} - Acc: {acc}")

        def on_train_end(self, logs=None):
            training_status["is_training"] = False
            training_status["status"] = "Completed"
            training_status["message"] = "Model trained successfully from actual dataset."

    return ProgressCallback


class LSTMTrainer:
    """LSTM Network Intrusion Detection Model Builder & Trainer."""

    def __init__(self, artifact_dir=None):
        self.artifact_dir = artifact_dir or Config.MODEL_DIR
        self.model_path = os.path.join(self.artifact_dir, "model.keras")

    def build_model(self, input_dim: int, num_classes: int, learning_rate: float = 0.001):
        """Construct FRESH Keras Sequential LSTM Architecture for every training run."""
        import tensorflow as tf
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import LSTM, Dense, Dropout, Input
        from tensorflow.keras.optimizers import Adam

        model = Sequential([
            Input(shape=(1, input_dim)),
            LSTM(64, return_sequences=False),
            Dropout(0.2),
            Dense(32, activation='relu'),
            Dense(num_classes, activation='softmax' if num_classes > 1 else 'sigmoid')
        ])

        loss_fn = 'sparse_categorical_crossentropy' if num_classes > 1 else 'binary_crossentropy'
        model.compile(
            optimizer=Adam(learning_rate=learning_rate),
            loss=loss_fn,
            metrics=['accuracy']
        )
        return model

    def train(self, X_train: np.ndarray, y_train: np.ndarray, X_val: np.ndarray, y_val: np.ndarray, X_test: np.ndarray, y_test: np.ndarray, epochs: int = 10, batch_size: int = 32, learning_rate: float = 0.001):
        """Train a fresh LSTM model with callbacks and save the versioned model."""
        import tensorflow as tf
        from tensorflow.keras.callbacks import ModelCheckpoint

        os.makedirs(self.artifact_dir, exist_ok=True)

        # Reshape tabular data to 3D sequence format: (batch_size, time_steps=1, features)
        X_train_3d = np.reshape(X_train, (X_train.shape[0], 1, X_train.shape[1]))
        X_val_3d = np.reshape(X_val, (X_val.shape[0], 1, X_val.shape[1]))
        X_test_3d = np.reshape(X_test, (X_test.shape[0], 1, X_test.shape[1]))

        num_classes = len(np.unique(y_train))
        model = self.build_model(input_dim=X_train.shape[1], num_classes=num_classes, learning_rate=learning_rate)

        ProgressCallbackClass = get_progress_callback_class()

        callbacks = [
            ModelCheckpoint(filepath=self.model_path, monitor='val_loss', save_best_only=True, verbose=0),
            ProgressCallbackClass(total_epochs=epochs)
        ]

        logger.info(f"Starting fresh LSTM model training ({epochs} epochs, batch size {batch_size}, lr {learning_rate})...")
        start_t = time.time()
        history = model.fit(
            X_train_3d, y_train,
            validation_data=(X_val_3d, y_val),
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks,
            verbose=1
        )
        train_duration = time.time() - start_t

        model.save(self.model_path)

        # Evaluate model on test set
        evaluator = ModelEvaluator()
        report = evaluator.evaluate(model, X_test_3d, y_test)
        report["training_time"] = round(train_duration, 3)

        return history, report


def start_training_in_background(app, dataset_id, training_rows=25000, epochs=10, batch_size=32, learning_rate=0.001, random_seed=42, sequence_length=1):
    """Launch model training with real stratified dataset sampling in background."""
    run_id = f"run_{time.strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}"

    training_status["run_id"] = run_id
    training_status["is_training"] = True
    training_status["current_epoch"] = 0
    training_status["total_epochs"] = epochs
    training_status["accuracy"] = 0.0
    training_status["loss"] = 0.0
    training_status["val_accuracy"] = 0.0
    training_status["val_loss"] = 0.0
    training_status["epoch_history"] = []
    training_status["status"] = "Started"
    training_status["message"] = f"Initializing training run '{run_id}'..."

    def run():
        with app.app_context():
            from database.init_db import db, DatasetHistory, ModelHistory

            try:
                ds = DatasetHistory.query.get(dataset_id) if dataset_id else DatasetHistory.query.filter_by(is_selected=True).first()
                if not ds:
                    ds = DatasetHistory.query.first()

                if not ds:
                    raise ValueError("No valid NIDS dataset available in database.")

                dataset_name = ds.filename
                dataset_type = ds.dataset_type or "CIC-IDS2017"

                training_status["dataset_name"] = dataset_name
                training_status["message"] = f"Performing stratified sampling ({training_rows:,} rows, seed {random_seed})..."

                # 1. Stratified reproducible sampling
                sampled_df, class_dist_before, class_dist_after, total_raw_rows, actual_sampled_rows, target_col = StratifiedNIDSSampler.sample_dataset(
                    file_path=ds.filepath,
                    target_rows=training_rows,
                    random_seed=random_seed,
                    dataset_type=dataset_type
                )

                # 2. Artifact Directory Setup: models/<dataset_type>/run_<id>/
                ds_key = dataset_type.lower().replace("-", "_")
                artifact_dir = os.path.join(Config.MODEL_DIR, ds_key, run_id)
                os.makedirs(artifact_dir, exist_ok=True)

                # Save raw sampled dataset snapshot
                sampled_path = os.path.join(Config.DATASET_SAMPLED_DIR, ds_key, f"sampled_{run_id}.csv")
                os.makedirs(os.path.dirname(sampled_path), exist_ok=True)
                sampled_df.to_csv(sampled_path, index=False)

                # 3. Preprocess sampled dataset
                preprocessor = DataPreprocessor.get_preprocessor(dataset_type, artifact_dir=artifact_dir)
                summary, (X_train, y_train, X_val, y_val, X_test, y_test) = preprocessor.process(sampled_df, target_col=target_col)

                # 4. Save Scaler & Encoder Artifacts
                scaler_path = os.path.join(artifact_dir, "scaler.pkl")
                encoder_path = os.path.join(artifact_dir, "encoder.pkl")
                joblib.dump(preprocessor.scaler, scaler_path)
                joblib.dump(preprocessor.label_encoder, encoder_path)

                # Save global fallback scaler/encoder for app compatibility
                joblib.dump(preprocessor.scaler, Config.SCALER_FILE_PATH)
                joblib.dump(preprocessor.label_encoder, Config.ENCODER_FILE_PATH)

                # Save feature schema & label mapping JSON
                feature_schema_path = os.path.join(artifact_dir, "feature_schema.json")
                label_mapping_path = os.path.join(artifact_dir, "label_mapping.json")

                with open(feature_schema_path, "w", encoding="utf-8") as f:
                    json.dump({"features": preprocessor.feature_names, "total_features": len(preprocessor.feature_names)}, f, indent=2)

                label_mapping = {int(i): str(cls_name) for i, cls_name in enumerate(preprocessor.label_encoder.classes_)}
                with open(label_mapping_path, "w", encoding="utf-8") as f:
                    json.dump(label_mapping, f, indent=2)

                # 5. Fit Fresh LSTM Model
                trainer = LSTMTrainer(artifact_dir=artifact_dir)
                history, report = trainer.train(
                    X_train, y_train, X_val, y_val, X_test, y_test,
                    epochs=epochs, batch_size=batch_size, learning_rate=learning_rate
                )

                # Copy model to global MODEL_FILE_PATH
                import shutil
                shutil.copy2(trainer.model_path, Config.MODEL_FILE_PATH)

                # 6. Save Training Metadata JSON
                metadata = {
                    "run_id": run_id,
                    "dataset_name": dataset_name,
                    "dataset_type": dataset_type,
                    "total_dataset_rows": total_raw_rows,
                    "training_rows": actual_sampled_rows,
                    "random_seed": random_seed,
                    "sequence_length": sequence_length,
                    "epochs": epochs,
                    "batch_size": batch_size,
                    "learning_rate": learning_rate,
                    "accuracy": report.get("accuracy", 0.0),
                    "loss": report.get("loss", 0.0),
                    "class_distribution_before": class_dist_before,
                    "class_distribution_after": class_dist_after,
                    "artifact_dir": artifact_dir
                }
                with open(os.path.join(artifact_dir, "training_metadata.json"), "w", encoding="utf-8") as f:
                    json.dump(metadata, f, indent=2)

                with open(Config.REPORT_FILE_PATH, "w", encoding="utf-8") as f:
                    json.dump(report, f, indent=2)

                # 7. Record ModelHistory in Database
                mh = ModelHistory(
                    model_name=f"LSTM NIDS ({dataset_type} {run_id[:12]})",
                    dataset_name=dataset_name,
                    trained_at=datetime.utcnow(),
                    accuracy=report.get("accuracy", 0.0),
                    loss=report.get("loss", 0.0),
                    precision=report.get("precision", 0.0),
                    recall=report.get("recall", 0.0),
                    f1_score=report.get("f1_score", 0.0),
                    training_time=report.get("training_time", 0.0),
                    prediction_time=report.get("prediction_time", 0.0),
                    model_type="Deep Learning",
                    framework="TensorFlow/Keras",
                    model_status="Trained",
                    params_json=json.dumps(metadata),
                    artifact_path=artifact_dir,
                    total_dataset_rows=total_raw_rows,
                    training_rows=actual_sampled_rows,
                    random_seed=random_seed
                )
                db.session.add(mh)
                db.session.commit()

                training_status["status"] = "Completed"
                training_status["progress"] = 100
                training_status["message"] = f"Model training run '{run_id}' finished successfully on {actual_sampled_rows:,} real rows."

            except Exception as e:
                logger.error(f"Error during training run '{run_id}': {str(e)}")
                training_status["status"] = "Failed"
                training_status["message"] = f"Training error: {str(e)}"
            finally:
                training_status["is_training"] = False

    thread = threading.Thread(target=run, daemon=True)
    thread.start()
    return run_id
