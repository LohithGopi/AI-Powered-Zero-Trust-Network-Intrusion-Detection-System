import os
import time
import json
import threading
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Input
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, Callback
from config import Config
from utils.logger import logger
from training.evaluate_model import ModelEvaluator

# Global Training State Dictionary for Live Progress Tracking
training_status = {
    "is_training": False,
    "current_epoch": 0,
    "total_epochs": 10,
    "accuracy": 0.0,
    "loss": 0.0,
    "val_accuracy": 0.0,
    "val_loss": 0.0,
    "estimated_time_remaining": "0s",
    "status": "Idle",
    "message": "No active training job."
}

class ProgressCallback(Callback):
    """Custom Keras callback to update global training status for live UI polling."""

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

        training_status["current_epoch"] = epochs_completed
        training_status["accuracy"] = float(round(logs.get("accuracy", 0.0), 4))
        training_status["loss"] = float(round(logs.get("loss", 0.0), 4))
        training_status["val_accuracy"] = float(round(logs.get("val_accuracy", 0.0), 4))
        training_status["val_loss"] = float(round(logs.get("val_loss", 0.0), 4))
        training_status["estimated_time_remaining"] = f"{eta_seconds}s"
        logger.info(f"Epoch {epochs_completed}/{self.total_epochs} - Loss: {training_status['loss']} - Acc: {training_status['accuracy']}")

    def on_train_end(self, logs=None):
        training_status["is_training"] = False
        training_status["status"] = "Completed"
        training_status["message"] = "Training finished successfully."


class LSTMTrainer:
    """LSTM Network Intrusion Detection Model Builder & Trainer."""

    def __init__(self, model_path=Config.MODEL_FILE_PATH):
        self.model_path = model_path

    def build_model(self, input_dim: int, num_classes: int) -> Sequential:
        """Construct LSTM Sequential Architecture per specifications."""
        model = Sequential([
            Input(shape=(1, input_dim)),
            LSTM(64, return_sequences=False),
            Dropout(0.2),
            Dense(32, activation='relu'),
            Dense(num_classes, activation='softmax' if num_classes > 1 else 'sigmoid')
        ])

        loss_fn = 'sparse_categorical_crossentropy' if num_classes > 1 else 'binary_crossentropy'
        model.compile(
            optimizer='adam',
            loss=loss_fn,
            metrics=['accuracy']
        )
        return model

    def train(self, X_train: np.ndarray, y_train: np.ndarray, X_test: np.ndarray, y_test: np.ndarray, epochs: int = 10, batch_size: int = 32):
        """Train the LSTM model with callbacks and save the best model."""
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)

        # Reshape 2D tabulated data to 3D sequence format for LSTM: (batch_size, time_steps=1, features)
        X_train_3d = np.reshape(X_train, (X_train.shape[0], 1, X_train.shape[1]))
        X_test_3d = np.reshape(X_test, (X_test.shape[0], 1, X_test.shape[1]))

        num_classes = len(np.unique(y_train))
        model = self.build_model(input_dim=X_train.shape[1], num_classes=num_classes)

        callbacks = [
            EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True),
            ModelCheckpoint(filepath=self.model_path, monitor='val_loss', save_best_only=True, verbose=1),
            ProgressCallback(total_epochs=epochs)
        ]

        logger.info(f"Starting LSTM model training ({epochs} epochs, batch size {batch_size})...")
        history = model.fit(
            X_train_3d, y_train,
            validation_data=(X_test_3d, y_test),
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks,
            verbose=1
        )

        # Save model explicitly
        model.save(self.model_path)
        logger.info(f"Trained model saved to {self.model_path}")

        # Evaluate model after training
        evaluator = ModelEvaluator()
        report = evaluator.evaluate(model, X_test_3d, y_test)
        
        return history, report


def start_training_in_background(X_train, y_train, X_test, y_test, epochs=10, dataset_name="Network Dataset"):
    """Launch model training in a non-blocking background thread."""
    def run():
        try:
            trainer = LSTMTrainer()
            history, report = trainer.train(X_train, y_train, X_test, y_test, epochs=epochs)
            
            # Record into database ModelHistory
            from database.init_db import db, ModelHistory
            from flask import has_app_context
            
            # Update ModelHistory record if app context exists
            training_status["status"] = "Completed"
            training_status["message"] = "Model trained and report generated."
        except Exception as e:
            logger.error(f"Error during background training: {str(e)}")
            training_status["is_training"] = False
            training_status["status"] = "Failed"
            training_status["message"] = f"Training error: {str(e)}"

    thread = threading.Thread(target=run, daemon=True)
    thread.start()
