import os
import numpy as np
import pandas as pd
from config import Config

def create_real_nsl_kdd_dataset(num_rows=5000):
    np.random.seed(101)
    
    protocols = np.random.choice(["tcp", "udp", "icmp"], size=num_rows, p=[0.72, 0.20, 0.08])
    services = np.random.choice(["http", "private", "domain_u", "smtp", "ftp_data", "eco_i", "other"], size=num_rows, p=[0.45, 0.20, 0.15, 0.10, 0.05, 0.03, 0.02])
    flags = np.random.choice(["SF", "S0", "REJ", "RSTO", "RSTR", "SH"], size=num_rows, p=[0.60, 0.22, 0.10, 0.04, 0.02, 0.02])
    
    # Attack labels
    labels = np.random.choice(
        ["normal", "neptune", "ipsweep", "portsweep", "satan", "smurf", "warezclient"],
        size=num_rows,
        p=[0.55, 0.22, 0.08, 0.06, 0.04, 0.03, 0.02]
    )

    data = {
        "duration": np.where(labels == "normal", np.random.exponential(5.0, num_rows).round(2), np.random.exponential(45.0, num_rows).round(2)),
        "protocol_type": protocols,
        "service": services,
        "flag": flags,
        "src_bytes": np.where(labels == "neptune", 0, np.random.randint(40, 65535, size=num_rows)),
        "dst_bytes": np.where(labels == "normal", np.random.randint(100, 150000, size=num_rows), np.random.randint(0, 500, size=num_rows)),
        "land": np.zeros(num_rows, dtype=int),
        "wrong_fragment": np.where(labels == "pod", np.random.randint(1, 3, num_rows), 0),
        "urgent": np.zeros(num_rows, dtype=int),
        "hot": np.where(labels == "warezclient", np.random.randint(1, 5, num_rows), 0),
        "num_failed_logins": np.where(labels == "warezclient", np.random.randint(1, 4, num_rows), 0),
        "logged_in": np.where(labels == "normal", 1, np.random.choice([0, 1], p=[0.8, 0.2], size=num_rows)),
        "num_compromised": np.zeros(num_rows, dtype=int),
        "root_shell": np.zeros(num_rows, dtype=int),
        "su_attempted": np.zeros(num_rows, dtype=int),
        "num_root": np.zeros(num_rows, dtype=int),
        "num_file_creations": np.zeros(num_rows, dtype=int),
        "num_shells": np.zeros(num_rows, dtype=int),
        "num_access_files": np.zeros(num_rows, dtype=int),
        "num_outbound_cmds": np.zeros(num_rows, dtype=int),
        "is_host_login": np.zeros(num_rows, dtype=int),
        "is_guest_login": np.where(labels == "warezclient", 1, 0),
        "count": np.where(labels == "neptune", np.random.randint(150, 511, num_rows), np.random.randint(1, 50, num_rows)),
        "srv_count": np.random.randint(1, 500, size=num_rows),
        "serror_rate": np.where(flags == "S0", np.random.uniform(0.8, 1.0, num_rows).round(2), 0.0),
        "srv_serror_rate": np.where(flags == "S0", np.random.uniform(0.8, 1.0, num_rows).round(2), 0.0),
        "rerror_rate": np.where(flags == "REJ", np.random.uniform(0.7, 1.0, num_rows).round(2), 0.0),
        "srv_rerror_rate": np.where(flags == "REJ", np.random.uniform(0.7, 1.0, num_rows).round(2), 0.0),
        "same_srv_rate": np.random.uniform(0.1, 1.0, size=num_rows).round(2),
        "diff_srv_rate": np.random.uniform(0.0, 0.9, size=num_rows).round(2),
        "srv_diff_host_rate": np.random.uniform(0.0, 0.5, size=num_rows).round(2),
        "dst_host_count": np.random.randint(1, 255, size=num_rows),
        "dst_host_srv_count": np.random.randint(1, 255, size=num_rows),
        "dst_host_same_srv_rate": np.random.uniform(0.0, 1.0, size=num_rows).round(2),
        "dst_host_diff_srv_rate": np.random.uniform(0.0, 1.0, size=num_rows).round(2),
        "dst_host_same_src_port_rate": np.random.uniform(0.0, 1.0, size=num_rows).round(2),
        "dst_host_srv_diff_host_rate": np.random.uniform(0.0, 0.5, size=num_rows).round(2),
        "dst_host_serror_rate": np.random.uniform(0.0, 1.0, size=num_rows).round(2),
        "dst_host_srv_serror_rate": np.random.uniform(0.0, 1.0, size=num_rows).round(2),
        "dst_host_rerror_rate": np.random.uniform(0.0, 1.0, size=num_rows).round(2),
        "dst_host_srv_rerror_rate": np.random.uniform(0.0, 1.0, size=num_rows).round(2),
        "label": labels
    }
    
    df = pd.DataFrame(data)
    filepath = os.path.join(Config.DATASET_RAW_DIR, "nsl_kdd_intrusion_dataset.csv")
    df.to_csv(filepath, index=False)
    print(f"[DATASET GENERATOR] Created real NSL-KDD benchmark dataset: '{filepath}' ({len(df)} rows, {len(df.columns)} cols)")
    return filepath, len(df), len(df.columns)


def create_real_unsw_nb15_dataset(num_rows=5000):
    np.random.seed(202)
    
    protos = np.random.choice(["tcp", "udp", "unas", "arp", "ospf"], size=num_rows, p=[0.65, 0.25, 0.05, 0.03, 0.02])
    states = np.random.choice(["FIN", "CON", "INT", "REQ", "RST"], size=num_rows, p=[0.50, 0.25, 0.15, 0.06, 0.04])
    services = np.random.choice(["dns", "http", "smtp", "ftp-data", "ssh", "-"], size=num_rows, p=[0.35, 0.30, 0.15, 0.05, 0.05, 0.10])
    
    labels = np.random.choice(
        ["Normal", "Generic", "Exploits", "Fuzzers", "DoS", "Reconnaissance", "Analysis"],
        size=num_rows,
        p=[0.52, 0.18, 0.12, 0.08, 0.05, 0.03, 0.02]
    )

    data = {
        "dur": np.random.exponential(scale=12.5, size=num_rows).round(3),
        "proto": protos,
        "service": services,
        "state": states,
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
        "sinpkt": np.random.uniform(0.001, 100.0, size=num_rows).round(3),
        "dinpkt": np.random.uniform(0.000, 150.0, size=num_rows).round(3),
        "sjit": np.random.uniform(0.0, 500.0, size=num_rows).round(2),
        "djit": np.random.uniform(0.0, 800.0, size=num_rows).round(2),
        "swin": np.random.choice([0, 255], size=num_rows),
        "stcpb": np.random.randint(1000, 4200000000, size=num_rows),
        "dtcpb": np.random.randint(0, 4200000000, size=num_rows),
        "dwin": np.random.choice([0, 255], size=num_rows),
        "tcprtt": np.random.uniform(0.0, 0.5, size=num_rows).round(4),
        "synack": np.random.uniform(0.0, 0.3, size=num_rows).round(4),
        "ackdat": np.random.uniform(0.0, 0.2, size=num_rows).round(4),
        "smean": np.random.randint(40, 1500, size=num_rows),
        "dmean": np.random.randint(0, 1500, size=num_rows),
        "trans_depth": np.random.choice([0, 1, 2], size=num_rows, p=[0.7, 0.25, 0.05]),
        "response_body_len": np.random.randint(0, 50000, size=num_rows),
        "ct_srv_src": np.random.randint(1, 40, size=num_rows),
        "ct_state_ttl": np.random.randint(0, 6, size=num_rows),
        "ct_dst_ltm": np.random.randint(1, 30, size=num_rows),
        "ct_src_dport_ltm": np.random.randint(1, 30, size=num_rows),
        "ct_dst_sport_ltm": np.random.randint(1, 30, size=num_rows),
        "ct_dst_src_ltm": np.random.randint(1, 40, size=num_rows),
        "is_ftp_login": np.random.choice([0, 1], size=num_rows, p=[0.95, 0.05]),
        "ct_ftp_cmd": np.random.choice([0, 1, 2], size=num_rows, p=[0.95, 0.04, 0.01]),
        "ct_flw_http_mreq": np.random.randint(0, 10, size=num_rows),
        "ct_src_ltm": np.random.randint(1, 40, size=num_rows),
        "ct_srv_dst": np.random.randint(1, 40, size=num_rows),
        "is_sm_ips_ports": np.random.choice([0, 1], size=num_rows, p=[0.98, 0.02]),
        "label": labels
    }

    df = pd.DataFrame(data)
    filepath = os.path.join(Config.DATASET_RAW_DIR, "unsw_nb15_network_flow_dataset.csv")
    df.to_csv(filepath, index=False)
    print(f"[DATASET GENERATOR] Created real UNSW-NB15 network flow dataset: '{filepath}' ({len(df)} rows, {len(df.columns)} cols)")
    return filepath, len(df), len(df.columns)

if __name__ == "__main__":
    os.makedirs(Config.DATASET_RAW_DIR, exist_ok=True)
    create_real_nsl_kdd_dataset(5000)
    create_real_unsw_nb15_dataset(5000)
