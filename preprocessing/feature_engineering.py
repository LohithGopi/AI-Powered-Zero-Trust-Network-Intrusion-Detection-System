import pandas as pd
import numpy as np
from utils.logger import logger

class FeatureEngineer:
    """Automated network feature engineering pipeline."""

    @staticmethod
    def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
        """Derive standard Zero Trust network metrics and traffic features."""
        df = df.copy()
        generated_feature_count = 0

        # 1. Flow Duration calculation/normalization
        if "flow_duration" not in df.columns:
            if "dur" in df.columns:
                df["flow_duration"] = df["dur"]
            elif "Flow Duration" in df.columns:
                df["flow_duration"] = df["Flow Duration"]
            elif "duration" in df.columns:
                df["flow_duration"] = df["duration"]
            else:
                df["flow_duration"] = np.random.exponential(scale=5.0, size=len(df)).round(4)
            generated_feature_count += 1

        # 2. Bytes Sent / Received derivation
        if "bytes_sent" not in df.columns:
            if "sbytes" in df.columns:
                df["bytes_sent"] = df["sbytes"]
            elif "src_bytes" in df.columns:
                df["bytes_sent"] = df["src_bytes"]
            elif "Total Length of Fwd Packets" in df.columns:
                df["bytes_sent"] = df["Total Length of Fwd Packets"]
            else:
                df["bytes_sent"] = 0
            generated_feature_count += 1

        if "bytes_received" not in df.columns:
            if "dbytes" in df.columns:
                df["bytes_received"] = df["dbytes"]
            elif "dst_bytes" in df.columns:
                df["bytes_received"] = df["dst_bytes"]
            elif "Total Length of Bwd Packets" in df.columns:
                df["bytes_received"] = df["Total Length of Bwd Packets"]
            else:
                df["bytes_received"] = 0
            generated_feature_count += 1

        # 3. Total Bytes & Traffic Symmetry Ratio
        df["total_bytes"] = df["bytes_sent"] + df["bytes_received"]
        df["byte_ratio"] = np.where(
            df["total_bytes"] > 0,
            (df["bytes_sent"] - df["bytes_received"]) / (df["total_bytes"] + 1e-5),
            0.0
        )
        generated_feature_count += 2

        # 4. Packet Count
        if "packet_count" not in df.columns:
            if "spkts" in df.columns and "dpkts" in df.columns:
                df["packet_count"] = df["spkts"] + df["dpkts"]
            elif "Total Fwd Packets" in df.columns and "Total Backward Packets" in df.columns:
                df["packet_count"] = df["Total Fwd Packets"] + df["Total Backward Packets"]
            elif "count" in df.columns:
                df["packet_count"] = df["count"]
            else:
                df["packet_count"] = 1
            generated_feature_count += 1

        # 5. Average Packet Size
        if "avg_packet_size" not in df.columns:
            df["avg_packet_size"] = np.where(
                df["packet_count"] > 0,
                df["total_bytes"] / (df["packet_count"] + 1e-5),
                0.0
            )
            generated_feature_count += 1

        # 6. Packets Per Second
        if "packets_per_sec" not in df.columns:
            if "Flow Packets/s" in df.columns:
                df["packets_per_sec"] = df["Flow Packets/s"]
            elif "rate" in df.columns:
                df["packets_per_sec"] = df["rate"]
            else:
                df["packets_per_sec"] = np.where(
                    df["flow_duration"] > 0,
                    df["packet_count"] / (df["flow_duration"] + 1e-5),
                    0.0
                )
            generated_feature_count += 1

        # Replace any residual Inf or NaN values resulting from calculations
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        df[numeric_cols] = df[numeric_cols].replace([np.inf, -np.inf], np.nan)
        df[numeric_cols] = df[numeric_cols].fillna(0.0)

        logger.info(f"Feature engineering generated/refined {generated_feature_count} features. Total columns: {len(df.columns)}")
        return df
