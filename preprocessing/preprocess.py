import os
import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from config import Config
from utils.logger import logger
from preprocessing.feature_engineering import FeatureEngineer

class DataPreprocessor:
    """End-to-end data preprocessing pipeline."""

    def __init__(self, scaler_path=Config.SCALER_FILE_PATH, encoder_path=Config.ENCODER_FILE_PATH):
        self.scaler_path = scaler_path
        self.encoder_path = encoder_path
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()

    def process(self, df: pd.DataFrame) -> tuple[dict, tuple]:
        """Perform full preprocessing pipeline on input DataFrame."""
        original_rows = len(df)
        original_cols = len(df.columns)

        # 1. Feature Engineering
        df = FeatureEngineer.engineer_features(df)

        # 2. Remove Duplicates
        df = df.drop_duplicates().reset_index(drop=True)
        rows_after_dedup = len(df)
        duplicate_count = original_rows - rows_after_dedup

        # 3. Handle Missing Values
        missing_count = df.isnull().sum().sum()
        for col in df.columns:
            if df[col].isnull().sum() > 0:
                if df[col].dtype == object or df[col].dtype.name == 'category':
                    mode_val = df[col].mode()[0] if not df[col].mode().empty else "Unknown"
                    df[col] = df[col].fillna(mode_val)
                else:
                    median_val = df[col].median() if not pd.isna(df[col].median()) else 0.0
                    df[col] = df[col].fillna(median_val)

        # 4. Target Label Encoding
        if "label" not in df.columns:
            raise KeyError("Target 'label' column is missing from dataset.")

        y_raw = df["label"].astype(str).values
        y_encoded = self.label_encoder.fit_transform(y_raw)
        
        # Save LabelEncoder artifact
        os.makedirs(os.path.dirname(self.encoder_path), exist_ok=True)
        joblib.dump(self.label_encoder, self.encoder_path)
        logger.info(f"Saved LabelEncoder to {self.encoder_path} with classes: {self.label_encoder.classes_}")

        # Drop label column from features
        X_df = df.drop(columns=["label"])

        # 5. Categorical Feature Encoding (Ordinal/Label encoding per feature)
        categorical_cols = X_df.select_dtypes(include=['object', 'category']).columns.tolist()
        features_encoded_count = len(categorical_cols)

        for col in categorical_cols:
            fe = LabelEncoder()
            X_df[col] = fe.fit_transform(X_df[col].astype(str))

        # Ensure all columns numeric and finite
        X_df = X_df.apply(pd.to_numeric, errors='coerce').fillna(0.0)

        # 6. Normalize Numerical Features using StandardScaler
        X_scaled = self.scaler.fit_transform(X_df.values)
        
        # Save StandardScaler artifact
        os.makedirs(os.path.dirname(self.scaler_path), exist_ok=True)
        joblib.dump(self.scaler, self.scaler_path)
        logger.info(f"Saved StandardScaler to {self.scaler_path}")

        # 7. Train / Test Split
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded if len(np.unique(y_encoded)) > 1 else None
        )

        # 8. Save Processed Files
        processed_dir = Config.DATASET_PROCESSED_DIR
        os.makedirs(processed_dir, exist_ok=True)
        np.savez_compressed(
            os.path.join(processed_dir, "processed_data.npz"),
            X_train=X_train, X_test=X_test, y_train=y_train, y_test=y_test,
            feature_names=X_df.columns.values, classes=self.label_encoder.classes_
        )

        summary = {
            "original_rows": original_rows,
            "remaining_rows": rows_after_dedup,
            "duplicates_removed": duplicate_count,
            "missing_values_handled": int(missing_count),
            "features_encoded": features_encoded_count,
            "total_features": X_df.shape[1],
            "num_classes": len(self.label_encoder.classes_),
            "classes": self.label_encoder.classes_.tolist(),
            "status": "Ready for Training"
        }

        return summary, (X_train, X_test, y_train, y_test)
