import time
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

from config import Config
from utils.logger import logger
from preprocessing.preprocess import DataPreprocessor
from preprocessing.dataset_loader import DatasetLoader

class ComparisonModelTrainer:
    """Trainer for baseline Machine Learning models (Logistic Regression & Random Forest)."""

    def __init__(self, model_dir=None):
        self.model_dir = Path(model_dir) if model_dir else Path(Config.MODEL_DIR)
        self.model_dir.mkdir(parents=True, exist_ok=True)
        self.log_reg_path = self.model_dir / "logistic_regression.joblib"
        self.rf_path = self.model_dir / "random_forest.joblib"

    def get_or_create_processed_data(self):
        """Retrieve existing preprocessed dataset split or run DataPreprocessor."""
        processed_file = Path(Config.DATASET_PROCESSED_DIR) / "processed_data.npz"
        
        if processed_file.exists():
            try:
                data = np.load(processed_file, allow_pickle=True)
                X_train = data["X_train"]
                X_test = data["X_test"]
                y_train = data["y_train"]
                y_test = data["y_test"]
                classes = data["classes"]
                logger.info(f"Loaded processed dataset from {processed_file}")
                return X_train, X_test, y_train, y_test, classes
            except Exception as e:
                logger.warning(f"Could not load processed dataset file: {e}. Reprocessing active dataset...")

        # Fallback: Find active or latest dataset and run DataPreprocessor
        raw_dir = Path(Config.DATASET_RAW_DIR)
        csv_files = list(raw_dir.glob("*.csv"))
        if not csv_files:
            raise FileNotFoundError(f"No CSV dataset files found in {raw_dir}")
        
        target_csv = csv_files[0]
        logger.info(f"Preprocessing dataset file: {target_csv.name}")
        df = DatasetLoader.load_dataset(str(target_csv), "Custom")
        preprocessor = DataPreprocessor()
        summary, (X_train, X_test, y_train, y_test) = preprocessor.process(df)
        classes = np.array(summary.get("classes", [str(c) for c in np.unique(y_train)]))
        return X_train, X_test, y_train, y_test, classes

    def train_logistic_regression(self, X_train: np.ndarray, y_train: np.ndarray, max_iter: int = 1000):
        """Train Logistic Regression classifier on preprocessed features."""
        logger.info(f"Training Logistic Regression Classifier (max_iter={max_iter})...")
        model = LogisticRegression(max_iter=max_iter, random_state=42, solver='lbfgs')
        
        start_time = time.time()
        model.fit(X_train, y_train)
        training_time = time.time() - start_time
        
        joblib.dump(model, self.log_reg_path)
        logger.info(f"Saved Logistic Regression model to {self.log_reg_path} (Training time: {training_time:.3f}s)")
        return model, training_time

    def train_random_forest(self, X_train: np.ndarray, y_train: np.ndarray, n_estimators: int = 100):
        """Train Random Forest classifier on preprocessed features."""
        logger.info(f"Training Random Forest Classifier (n_estimators={n_estimators})...")
        model = RandomForestClassifier(n_estimators=n_estimators, random_state=42, n_jobs=-1)
        
        start_time = time.time()
        model.fit(X_train, y_train)
        training_time = time.time() - start_time
        
        joblib.dump(model, self.rf_path)
        logger.info(f"Saved Random Forest model to {self.rf_path} (Training time: {training_time:.3f}s)")
        return model, training_time

    def train_all_baselines(self):
        """Train both Logistic Regression and Random Forest models on identical preprocessed dataset."""
        X_train, X_test, y_train, y_test, classes = self.get_or_create_processed_data()

        log_reg_model, log_reg_time = self.train_logistic_regression(X_train, y_train)
        rf_model, rf_time = self.train_random_forest(X_train, y_train)

        return {
            "logistic_regression": {"model": log_reg_model, "training_time": log_reg_time},
            "random_forest": {"model": rf_model, "training_time": rf_time},
            "split": (X_train, X_test, y_train, y_test, classes)
        }
