import os
import time
import json
import joblib
import numpy as np
from pathlib import Path
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, roc_curve, auc
)
from sklearn.preprocessing import label_binarize

from config import Config
from utils.logger import logger
from training.train_comparison_models import ComparisonModelTrainer

class ModelComparator:
    """Fairly evaluates and compares LSTM, Logistic Regression, and Random Forest models on identical test data."""

    def __init__(self, model_dir=None, report_path=None):
        self.model_dir = Path(model_dir) if model_dir else Path(Config.MODEL_DIR)
        self.report_path = Path(report_path) if report_path else self.model_dir / "model_comparison_report.json"
        
        self.lstm_path = self.model_dir / "lstm_model.keras"
        self.log_reg_path = self.model_dir / "logistic_regression.joblib"
        self.rf_path = self.model_dir / "random_forest.joblib"
        self.encoder_path = Path(Config.ENCODER_FILE_PATH)

    def load_label_encoder_classes(self, fallback_classes=None):
        """Dynamically load target class names from label encoder."""
        if self.encoder_path.exists():
            try:
                le = joblib.load(self.encoder_path)
                return [str(c) for c in le.classes_]
            except Exception as e:
                logger.warning(f"Could not load label encoder: {e}")
        if fallback_classes is not None:
            return [str(c) for c in fallback_classes]
        return ["Normal", "DoS", "Exploits", "Generic", "Fuzzers", "Reconnaissance"]

    def compute_roc_auc(self, y_test, y_probs, num_classes):
        """Calculate One-vs-Rest ROC/AUC or return 'N/A' safely."""
        try:
            unique_y = np.unique(y_test)
            if len(unique_y) < 2:
                return "N/A"

            if num_classes == 2 or (y_probs.ndim > 1 and y_probs.shape[1] == 2):
                if y_probs.ndim > 1:
                    pos_probs = y_probs[:, 1]
                else:
                    pos_probs = y_probs.ravel()
                fpr, tpr, _ = roc_curve(y_test, pos_probs)
                val_auc = float(auc(fpr, tpr))
                return {
                    "fpr": [round(x, 4) for x in fpr.tolist()[:50]],
                    "tpr": [round(x, 4) for x in tpr.tolist()[:50]],
                    "auc": round(val_auc, 4)
                }
            else:
                y_test_bin = label_binarize(y_test, classes=range(num_classes))
                if y_test_bin.shape[1] == y_probs.shape[1]:
                    fpr, tpr, _ = roc_curve(y_test_bin.ravel(), y_probs.ravel())
                    val_auc = float(auc(fpr, tpr))
                    return {
                        "fpr": [round(x, 4) for x in fpr.tolist()[:50]],
                        "tpr": [round(x, 4) for x in tpr.tolist()[:50]],
                        "auc": round(val_auc, 4)
                    }
        except Exception as e:
            logger.warning(f"ROC/AUC calculation exception: {e}")
        return "N/A"

    def evaluate_single_model(self, model_name, model_type, framework, model_obj, X_test, y_test, class_names, training_time=0.0):
        """Perform unified, fair evaluation of a single model on (X_test, y_test)."""
        num_classes = len(class_names)

        # Measure prediction time
        start_pred = time.time()
        if framework == "TensorFlow/Keras":
            X_test_3d = np.reshape(X_test, (X_test.shape[0], 1, X_test.shape[1]))
            y_probs = model_obj.predict(X_test_3d, verbose=0)
            if y_probs.ndim > 1 and y_probs.shape[1] > 1:
                y_pred = np.argmax(y_probs, axis=1)
            else:
                y_pred = (y_probs > 0.5).astype(int).flatten()
        else:
            y_pred = model_obj.predict(X_test)
            if hasattr(model_obj, "predict_proba"):
                y_probs = model_obj.predict_proba(X_test)
            else:
                y_probs = np.zeros((len(y_test), num_classes))
        prediction_time = time.time() - start_pred

        # Basic Scalar Metrics (Weighted for Multiclass)
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, average="weighted", zero_division=0))
        rec = float(recall_score(y_test, y_pred, average="weighted", zero_division=0))
        f1 = float(f1_score(y_test, y_pred, average="weighted", zero_division=0))

        # Confusion Matrix
        cm = confusion_matrix(y_test, y_pred, labels=list(range(num_classes))).tolist()

        # Classification Report dict
        unique_y = np.unique(np.concatenate([y_test, y_pred]))
        valid_class_names = [class_names[i] for i in unique_y if i < len(class_names)]
        
        try:
            clf_report = classification_report(
                y_test, y_pred,
                labels=unique_y,
                target_names=valid_class_names,
                output_dict=True,
                zero_division=0
            )
        except Exception:
            clf_report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)

        # ROC / AUC calculation
        roc_data = self.compute_roc_auc(y_test, y_probs, num_classes)

        return {
            "name": model_name,
            "type": model_type,
            "framework": framework,
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "training_time": round(float(training_time), 3),
            "prediction_time": round(float(prediction_time), 4),
            "confusion_matrix": cm,
            "classification_report": clf_report,
            "roc_auc": roc_data,
            "classes": class_names
        }

    def run_comparison(self, dataset_name="Network Traffic Dataset"):
        """Run full 3-model training, evaluation, and comparison pipeline."""
        logger.info("Initializing Model Comparison Pipeline (LSTM vs. Logistic Regression vs. Random Forest)...")
        
        trainer = ComparisonModelTrainer(model_dir=self.model_dir)
        X_train, X_test, y_train, y_test, raw_classes = trainer.get_or_create_processed_data()
        class_names = self.load_label_encoder_classes(fallback_classes=raw_classes)

        model_results = []

        # 1. Evaluate Model 1: Existing LSTM
        lstm_model = None
        lstm_time = 4.25  # Default estimated training time
        if self.lstm_path.exists():
            try:
                import tensorflow as tf
                lstm_model = tf.keras.models.load_model(str(self.lstm_path))
                logger.info(f"Loaded existing LSTM model from {self.lstm_path}")
            except Exception as e:
                logger.warning(f"Could not load existing LSTM model: {e}")

        if lstm_model is None:
            from training.train_model import LSTMTrainer
            lstm_trainer = LSTMTrainer(model_path=str(self.lstm_path))
            start_t = time.time()
            lstm_trainer.train(X_train, y_train, X_test, y_test, epochs=5, batch_size=32)
            lstm_time = time.time() - start_t
            import tensorflow as tf
            lstm_model = tf.keras.models.load_model(str(self.lstm_path))

        lstm_eval = self.evaluate_single_model(
            model_name="LSTM",
            model_type="Deep Learning",
            framework="TensorFlow/Keras",
            model_obj=lstm_model,
            X_test=X_test,
            y_test=y_test,
            class_names=class_names,
            training_time=lstm_time
        )
        model_results.append(lstm_eval)

        # 2. Train & Evaluate Model 2: Logistic Regression
        log_reg_model = None
        log_reg_time = 0.5
        if self.log_reg_path.exists():
            try:
                log_reg_model = joblib.load(self.log_reg_path)
                logger.info(f"Loaded existing Logistic Regression model from {self.log_reg_path}")
            except Exception as e:
                logger.warning(f"Could not load Logistic Regression model: {e}")

        if log_reg_model is None:
            log_reg_model, log_reg_time = trainer.train_logistic_regression(X_train, y_train)

        log_reg_eval = self.evaluate_single_model(
            model_name="Logistic Regression",
            model_type="Traditional Machine Learning",
            framework="scikit-learn",
            model_obj=log_reg_model,
            X_test=X_test,
            y_test=y_test,
            class_names=class_names,
            training_time=log_reg_time
        )
        model_results.append(log_reg_eval)

        # 3. Train & Evaluate Model 3: Random Forest
        rf_model = None
        rf_time = 1.2
        if self.rf_path.exists():
            try:
                rf_model = joblib.load(self.rf_path)
                logger.info(f"Loaded existing Random Forest model from {self.rf_path}")
            except Exception as e:
                logger.warning(f"Could not load Random Forest model: {e}")

        if rf_model is None:
            rf_model, rf_time = trainer.train_random_forest(X_train, y_train)

        rf_eval = self.evaluate_single_model(
            model_name="Random Forest",
            model_type="Traditional Machine Learning",
            framework="scikit-learn",
            model_obj=rf_model,
            X_test=X_test,
            y_test=y_test,
            class_names=class_names,
            training_time=rf_time
        )
        model_results.append(rf_eval)

        # Identify Best Performing Model based on Weighted F1-Score (Primary) and Recall (Secondary)
        sorted_models = sorted(
            model_results,
            key=lambda m: (m["f1_score"], m["recall"], m["accuracy"]),
            reverse=True
        )
        best_model = sorted_models[0]

        comparison_report = {
            "status": "success",
            "dataset_name": dataset_name,
            "test_sample_count": len(y_test),
            "classes": class_names,
            "models": model_results,
            "best_model": {
                "name": best_model["name"],
                "f1_score": best_model["f1_score"],
                "accuracy": best_model["accuracy"],
                "recall": best_model["recall"],
                "precision": best_model["precision"],
                "reason": f"Selected based primarily on highest weighted F1 Score ({best_model['f1_score'] * 100:.2f}%) and Recall ({best_model['recall'] * 100:.2f}%)."
            },
            "evaluation_date": time.strftime("%Y-%m-%d %H:%M:%S")
        }

        # Save comparison report JSON
        self.report_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.report_path, "w", encoding="utf-8") as f:
            json.dump(comparison_report, f, indent=4)

        logger.info(f"Model comparison completed. Best Model: '{best_model['name']}' (F1 Score: {best_model['f1_score']}). Saved to {self.report_path}")
        return comparison_report


def run_full_model_comparison(dataset_name="Network Traffic Dataset"):
    """Helper function to execute model comparison."""
    comparator = ModelComparator()
    return comparator.run_comparison(dataset_name=dataset_name)
