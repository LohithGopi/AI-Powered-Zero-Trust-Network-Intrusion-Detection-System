import os
import json
import joblib
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, roc_curve, auc
)
from config import Config
from utils.logger import logger

class ModelEvaluator:
    """Evaluates NIDS Machine Learning models and constructs JSON reports."""

    def __init__(self, report_path=Config.REPORT_FILE_PATH, encoder_path=Config.ENCODER_FILE_PATH):
        self.report_path = report_path
        self.encoder_path = encoder_path

    def evaluate(self, model, X_test_3d: np.ndarray, y_test: np.ndarray) -> dict:
        """Calculate complete evaluation metrics, confusion matrix, ROC curve, and save JSON report."""
        logger.info("Evaluating trained LSTM intrusion detection model...")

        # Obtain prediction probabilities and crisp class predictions
        y_pred_probs = model.predict(X_test_3d)
        
        if y_pred_probs.ndim > 1 and y_pred_probs.shape[1] > 1:
            y_pred = np.argmax(y_pred_probs, axis=1)
        else:
            y_pred = (y_pred_probs > 0.5).astype(int).flatten()

        # Load LabelEncoder if available
        classes = None
        if os.path.exists(self.encoder_path):
            try:
                le = joblib.load(self.encoder_path)
                classes = [str(c) for c in le.classes_]
            except Exception as e:
                logger.warning(f"Could not load label encoder classes: {e}")

        if classes is None:
            classes = [str(c) for c in np.unique(y_test)]

        # Basic scalar metrics
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, average='weighted', zero_division=0))
        rec = float(recall_score(y_test, y_pred, average='weighted', zero_division=0))
        f1 = float(f1_score(y_test, y_pred, average='weighted', zero_division=0))

        # Confusion Matrix
        cm = confusion_matrix(y_test, y_pred).tolist()

        # Classification Report dict
        clf_report = classification_report(y_test, y_pred, target_names=classes if len(classes) == len(np.unique(y_test)) else None, output_dict=True, zero_division=0)

        # ROC Curve generation (for binary or weighted average multi-class)
        roc_data = {"fpr": [], "tpr": [], "auc": 0.0}
        try:
            if len(np.unique(y_test)) == 2:
                # Binary classification
                if y_pred_probs.ndim > 1 and y_pred_probs.shape[1] == 2:
                    pos_probs = y_pred_probs[:, 1]
                else:
                    pos_probs = y_pred_probs.ravel()
                fpr, tpr, _ = roc_curve(y_test, pos_probs)
                roc_auc = float(auc(fpr, tpr))
                roc_data = {
                    "fpr": [round(x, 4) for x in fpr.tolist()[:100]],
                    "tpr": [round(x, 4) for x in tpr.tolist()[:100]],
                    "auc": round(roc_auc, 4)
                }
            else:
                # Binarize labels for multi-class ROC curve average
                from sklearn.preprocessing import label_binarize
                y_test_bin = label_binarize(y_test, classes=range(len(classes)))
                if y_test_bin.shape[1] == y_pred_probs.shape[1]:
                    fpr, tpr, _ = roc_curve(y_test_bin.ravel(), y_pred_probs.ravel())
                    roc_auc = float(auc(fpr, tpr))
                    roc_data = {
                        "fpr": [round(x, 4) for x in fpr.tolist()[:100]],
                        "tpr": [round(x, 4) for x in tpr.tolist()[:100]],
                        "auc": round(roc_auc, 4)
                    }
        except Exception as e:
            logger.warning(f"Could not compute ROC curve data: {str(e)}")

        report = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "confusion_matrix": cm,
            "classes": classes,
            "classification_report": clf_report,
            "roc_curve": roc_data
        }

        # Save evaluation report to JSON file
        os.makedirs(os.path.dirname(self.report_path), exist_ok=True)
        with open(self.report_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=4)
            
        logger.info(f"Model evaluation report saved to {self.report_path}")
        return report
