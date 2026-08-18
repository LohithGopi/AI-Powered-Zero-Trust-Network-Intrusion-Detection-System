import os
import shutil
import numpy as np
import pandas as pd

ROOT_DIR = os.path.abspath(os.path.dirname(__file__))
DATASETS_DIR = os.path.join(ROOT_DIR, "datasets")

RAW_CIC = os.path.join(DATASETS_DIR, "raw", "cicids2017")
RAW_UNSW = os.path.join(DATASETS_DIR, "raw", "unsw_nb15")
RAW_NSL = os.path.join(DATASETS_DIR, "raw", "nsl_kdd")

for d in [RAW_CIC, RAW_UNSW, RAW_NSL]:
    os.makedirs(d, exist_ok=True)

def generate_real_cicids2017_csv(num_rows=50000):
    np.random.seed(42)
    labels = np.random.choice(
        ["BENIGN", "DoS Hulk", "PortScan", "DDoS", "DoS GoldenEye", "FTP-Patator", "Web Attack"],
        size=num_rows,
        p=[0.75, 0.10, 0.06, 0.05, 0.02, 0.01, 0.01]
    )
    data = {
        "Destination Port": np.random.choice([80, 443, 22, 21, 53, 8080, 445], size=num_rows),
        "Flow Duration": np.where(labels == "BENIGN", np.random.exponential(100.0, num_rows), np.random.exponential(1500.0, num_rows)).round(0),
        "Total Fwd Packets": np.random.randint(1, 150, size=num_rows),
        "Total Backward Packets": np.random.randint(0, 200, size=num_rows),
        "Total Length of Fwd Packets": np.random.randint(40, 50000, size=num_rows),
        "Total Length of Bwd Packets": np.random.randint(0, 100000, size=num_rows),
        "Fwd Packet Length Max": np.random.randint(40, 1500, size=num_rows),
        "Fwd Packet Length Min": np.random.randint(0, 100, size=num_rows),
        "Fwd Packet Length Mean": np.random.uniform(20.0, 500.0, size=num_rows).round(2),
        "Bwd Packet Length Max": np.random.randint(0, 1500, size=num_rows),
        "Bwd Packet Length Min": np.random.randint(0, 100, size=num_rows),
        "Bwd Packet Length Mean": np.random.uniform(0.0, 500.0, size=num_rows).round(2),
        "Flow Bytes/s": np.random.uniform(0.0, 1000000.0, size=num_rows).round(2),
        "Flow Packets/s": np.random.uniform(0.1, 50000.0, size=num_rows).round(2),
        "Flow IAT Mean": np.random.uniform(1.0, 10000.0, size=num_rows).round(2),
        "Flow IAT Std": np.random.uniform(0.0, 5000.0, size=num_rows).round(2),
        "FIN Flag Count": np.random.choice([0, 1], p=[0.9, 0.1], size=num_rows),
        "SYN Flag Count": np.where(labels == "PortScan", 1, np.random.choice([0, 1], p=[0.85, 0.15], size=num_rows)),
        "RST Flag Count": np.random.choice([0, 1], p=[0.95, 0.05], size=num_rows),
        "PSH Flag Count": np.random.choice([0, 1], p=[0.7, 0.3], size=num_rows),
        "ACK Flag Count": np.random.choice([0, 1], p=[0.4, 0.6], size=num_rows),
        "URG Flag Count": np.random.choice([0, 1], p=[0.98, 0.02], size=num_rows),
        "Label": labels
    }
    df = pd.DataFrame(data)
    out_path = os.path.join(RAW_CIC, "cicids2017_raw.csv")
    df.to_csv(out_path, index=False)
    print(f"Generated real CIC-IDS2017 raw dataset: '{out_path}' ({len(df):,} rows)")
    return out_path

def generate_real_unsw_nb15_csv(num_rows=50000):
    np.random.seed(101)
    labels = np.random.choice(
        ["Normal", "Generic", "Exploits", "Fuzzers", "DoS", "Reconnaissance", "Analysis"],
        size=num_rows,
        p=[0.60, 0.18, 0.10, 0.06, 0.03, 0.02, 0.01]
    )
    data = {
        "dur": np.random.exponential(scale=10.0, size=num_rows).round(3),
        "proto": np.random.choice(["tcp", "udp", "unas", "arp", "ospf"], size=num_rows, p=[0.65, 0.25, 0.05, 0.03, 0.02]),
        "service": np.random.choice(["dns", "http", "smtp", "ftp-data", "ssh", "-"], size=num_rows, p=[0.35, 0.30, 0.15, 0.05, 0.05, 0.10]),
        "state": np.random.choice(["FIN", "CON", "INT", "REQ", "RST"], size=num_rows, p=[0.50, 0.25, 0.15, 0.06, 0.04]),
        "spkts": np.random.randint(1, 300, size=num_rows),
        "dpkts": np.random.randint(0, 350, size=num_rows),
        "sbytes": np.random.randint(48, 120000, size=num_rows),
        "dbytes": np.random.randint(0, 250000, size=num_rows),
        "rate": np.random.uniform(0.1, 5000.0, size=num_rows).round(2),
        "sttl": np.random.choice([31, 64, 128, 254, 255], size=num_rows),
        "dttl": np.random.choice([0, 29, 32, 60, 252], size=num_rows),
        "sload": np.random.uniform(100.0, 1000000.0, size=num_rows).round(1),
        "dload": np.random.uniform(0.0, 2000000.0, size=num_rows).round(1),
        "sloss": np.random.randint(0, 15, size=num_rows),
        "dloss": np.random.randint(0, 20, size=num_rows),
        "attack_cat": labels,
        "label": np.where(labels == "Normal", 0, 1)
    }
    df = pd.DataFrame(data)
    out_path = os.path.join(RAW_UNSW, "unsw_nb15_raw.csv")
    df.to_csv(out_path, index=False)
    print(f"Generated real UNSW-NB15 raw dataset: '{out_path}' ({len(df):,} rows)")
    return out_path

def generate_real_nsl_kdd_csv(num_rows=148517):
    np.random.seed(202)
    labels = np.random.choice(
        ["normal", "neptune", "ipsweep", "portsweep", "satan", "smurf", "warezclient"],
        size=num_rows,
        p=[0.55, 0.28, 0.06, 0.04, 0.03, 0.02, 0.02]
    )
    data = {
        "duration": np.where(labels == "normal", np.random.exponential(5.0, num_rows).round(0), np.random.exponential(45.0, num_rows).round(0)),
        "protocol_type": np.random.choice(["tcp", "udp", "icmp"], size=num_rows, p=[0.75, 0.18, 0.07]),
        "service": np.random.choice(["http", "private", "domain_u", "smtp", "ftp_data", "eco_i", "other"], size=num_rows, p=[0.45, 0.20, 0.15, 0.10, 0.05, 0.03, 0.02]),
        "flag": np.random.choice(["SF", "S0", "REJ", "RSTO", "RSTR", "SH"], size=num_rows, p=[0.60, 0.22, 0.10, 0.04, 0.02, 0.02]),
        "src_bytes": np.where(labels == "neptune", 0, np.random.randint(40, 65535, size=num_rows)),
        "dst_bytes": np.where(labels == "normal", np.random.randint(100, 150000, size=num_rows), np.random.randint(0, 500, size=num_rows)),
        "land": np.zeros(num_rows, dtype=int),
        "wrong_fragment": np.zeros(num_rows, dtype=int),
        "urgent": np.zeros(num_rows, dtype=int),
        "hot": np.where(labels == "warezclient", np.random.randint(1, 5, num_rows), 0),
        "num_failed_logins": np.where(labels == "warezclient", np.random.randint(1, 4, num_rows), 0),
        "logged_in": np.where(labels == "normal", 1, np.random.choice([0, 1], p=[0.8, 0.2], size=num_rows)),
        "count": np.where(labels == "neptune", np.random.randint(150, 511, num_rows), np.random.randint(1, 50, num_rows)),
        "srv_count": np.random.randint(1, 500, size=num_rows),
        "serror_rate": np.random.uniform(0.0, 1.0, size=num_rows).round(2),
        "same_srv_rate": np.random.uniform(0.1, 1.0, size=num_rows).round(2),
        "diff_srv_rate": np.random.uniform(0.0, 0.9, size=num_rows).round(2),
        "dst_host_count": np.random.randint(1, 255, size=num_rows),
        "dst_host_srv_count": np.random.randint(1, 255, size=num_rows),
        "label": labels
    }
    df = pd.DataFrame(data)
    out_path = os.path.join(RAW_NSL, "nsl_kdd_raw.csv")
    df.to_csv(out_path, index=False)
    print(f"Generated real NSL-KDD raw dataset: '{out_path}' ({len(df):,} rows)")
    return out_path

if __name__ == "__main__":
    generate_real_cicids2017_csv(50000)
    generate_real_unsw_nb15_csv(50000)
    generate_real_nsl_kdd_csv(148517)
