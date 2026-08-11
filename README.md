# Zero Trust AI-Powered Network Intrusion Detection System (Phase 1)

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0+-black.svg)](https://flask.palletsprojects.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange.svg)](https://www.tensorflow.org/)
[![Keras](https://img.shields.io/badge/Keras-LSTM-red.svg)](https://keras.io/)
[![Zero Trust](https://img.shields.io/badge/Security-Zero%20Trust-green.svg)](#zero-trust-architecture)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

An enterprise-grade, deep learning **Network Intrusion Detection System (NIDS)** combined with a **Zero Trust Network Security Architecture** (*"Never Trust, Always Verify"*). This Phase 1 platform provides dataset ingestion, automated preprocessing, feature engineering, Keras LSTM neural network training, evaluation metrics analytics, and an executive SOC web dashboard.

---

## 📌 Table of Contents
- [Project Overview](#-project-overview)
- [Zero Trust Architecture](#-zero-trust-architecture)
- [Phase 1 Core Features](#-phase-1-core-features)
- [Technology Stack](#-technology-stack)
- [Project Folder Structure](#-project-folder-structure)
- [Installation & Setup](#-installation--setup)
- [How to Run](#-how-to-run)
- [API Endpoints Documentation](#-api-endpoints-documentation)
- [Phase 1 Output Artifacts](#-phase-1-output-artifacts)
- [Phase 2 Integration Roadmap](#-phase-2-integration-roadmap)
- [Author & License](#-author--license)

---

## 🛡️ Project Overview

Traditional perimeter network security relies on outdated castle-and-moat models: once a connection crosses the outer firewall, it is treated as inherently trusted. Attackers taking advantage of compromised credentials or lateral movements can silently probe network infrastructure without triggering alerts.

This project addresses perimeter vulnerabilities by combining:
1. **Zero Trust Security Principle**: Every user request and REST API call must verify identity (JWT token) and permissions (Role-Based Access Control) regardless of network location.
2. **Keras LSTM Deep Learning Engine**: A Long Short-Term Memory recurrent neural network that learns temporal sequence patterns across network flow attributes to detect attacks (DoS, Probe, Exploits) with high precision.

---

## 🔒 Zero Trust Architecture

- **Stateless Authentication**: Issues cryptographically signed JSON Web Tokens (JWT) signed via HS256 upon successful login.
- **Bcrypt Password Vault**: Password strings are salted (12 rounds) and hashed prior to database persistence.
- **Role-Based Access Control (RBAC)**: Enforces role permissions (`Admin` vs `User`). Administrative actions like dataset deletion or launching model training are protected via `@require_role(["Admin"])` decorators.
- **Immutable Security Audit Log**: Records every login, upload, selection, deletion, and training event into SQLite with client IP tracking and one-click CSV export.

---

## ✨ Phase 1 Core Features

- **Full-Width SOC Executive Dashboard**: Displays 6 KPI Telemetry Cards, active dataset metadata, model status, and live-searchable audit trail.
- **Dataset Ingestion Catalog**: Ingests, compares, and manages benchmark datasets (NSL-KDD, UNSW-NB15, CICIDS2017, and Custom CSVs) with out-of-the-box pre-installed test samples.
- **Automated Data Preprocessing**: Executes missing value statistical median imputation, duplicate removal, Scikit-Learn `LabelEncoder`, `StandardScaler` normalization, and 3D tensor sequence reshaping `(samples, 1, features)`.
- **Keras LSTM Neural Network Engine**: Asynchronous background thread model training featuring 64-unit LSTM cells, 20% Dropout regularization, ReLU dense layers, and Softmax classification.
- **Real-Time Status Polling & Graphs**: Interactive Chart.js line plots rendering epoch-by-epoch loss and accuracy metrics.
- **Model Evaluation Analytics**: Computes test accuracy, Precision, Recall, F1-Score, Confusion Matrix heatmaps, and ROC Curve AUC plots.

---

## 💻 Technology Stack

| Layer | Technology Used | Purpose |
| :--- | :--- | :--- |
| **Language** | Python 3.11+ | Primary application programming language |
| **Web Framework** | Flask 3.0+ | Application server hosting REST APIs and serving web views |
| **Deep Learning** | Keras / TensorFlow 2.x | Constructs, compiles, trains, and serializes the 64-unit LSTM model |
| **Machine Learning** | Scikit-Learn, NumPy, Pandas | Dataset cleaning, LabelEncoding, StandardScaler, and evaluation metrics |
| **Database** | SQLite & Flask-SQLAlchemy ORM | Stores user accounts, dataset history, model runs, and audit logs |
| **Security** | PyJWT & Bcrypt | Cryptographically signed authentication tokens and password salting |
| **Frontend** | Bootstrap 5, Chart.js, HTML5/CSS3 | Full-width top navigation SOC dashboard and live progress charts |

---

## 📁 Project Folder Structure

```
AI-Powered-Zero-Trust-Network-Intrusion-Detection-System/
├── api/                        # Flask REST API Blueprints
│   ├── auth_routes.py          # Login, Register, Logout APIs
│   ├── dataset_routes.py       # Upload, Select, Compare, Delete APIs
│   └── model_routes.py         # Model Training & Report APIs
├── database/                   # SQLite Models & Database Seeder
│   ├── database.db             # Relational Database File
│   └── init_db.py              # ORM Schemas (User, Role, DatasetHistory, ModelHistory, AuditLog)
├── datasets/                   # Dataset Files Inventory
│   ├── raw/                    # Raw Benchmark CSV Datasets
│   └── processed/              # Preprocessed Tensor Cache
├── models/                     # Phase 1 Serialized Output Directory
│   ├── .gitkeep
│   ├── nids_lstm_model.keras   # Trained Keras LSTM Model
│   ├── scaler.pkl              # Fitted StandardScaler
│   └── label_encoder.pkl       # Fitted LabelEncoder
├── preprocessing/              # Feature Engineering & Cleaning Pipeline
│   ├── dataset_loader.py       # CSV Reader & Schema Parser
│   └── preprocess.py           # Imputation, LabelEncoding, Scaling & 3D Reshaping
├── reports/                    # Phase 1 Evaluation Metric JSONs
│   ├── .gitkeep
│   └── latest_evaluation_report.json
├── security/                   # Zero Trust Framework
│   ├── jwt_auth.py             # JWT Token Encoding & Verification
│   ├── password.py             # Bcrypt Password Hashing & Salting
│   └── zero_trust.py           # RBAC Authorization Decorators
├── static/                     # CSS, JavaScript & Visual Assets
│   ├── css/                    # Custom Enterprise Stylesheets
│   └── js/                     # Async Fetch Handlers & Chart Renderers
├── templates/                  # Jinja2 HTML Views (Top Navigation Layout)
│   ├── navbar.html             # Sticky Top Navigation Header
│   ├── dashboard.html          # Executive SOC Control Panel
│   ├── dataset_list.html       # Dataset Catalog & Upload Modal
│   ├── dataset_compare.html    # Matrix Comparison View
│   ├── train_model.html        # Training Panel & Chart Progress
│   └── model_report.html       # Evaluation Metrics & ROC View
├── training/                   # Model Training Engine
│   └── train_model.py          # Asynchronous Background Training Worker
├── utils/                      # Logger & Audit Event Helpers
├── app.py                      # Flask Application Factory
├── config.py                   # Central Configuration Class
├── requirements.txt            # Python Dependencies
├── README.md                   # Project Documentation
└── .gitignore                  # Git Exclusion Rules
```

---

## ⚙️ Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/LohithGopi/AI-Powered-Zero-Trust-Network-Intrusion-Detection-System.git
   cd AI-Powered-Zero-Trust-Network-Intrusion-Detection-System
   ```

2. **Create and Activate Virtual Environment**:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

---

## 🚀 How to Run

1. **Start the Flask Application**:
   ```bash
   python app.py
   ```

2. **Access the Web Dashboard**:
   Open your browser and navigate to **`http://127.0.0.1:5000`**.

3. **Default Admin Login**:
   - **Username**: `admin`
   - **Password**: `admin123`

---

## 🔌 API Endpoints Documentation

| HTTP Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates user credentials and issues JWT token |
| `POST` | `/api/auth/register` | Public | Registers new User account |
| `GET` | `/api/dataset/list` | JWT Required | Fetches catalog list of registered datasets |
| `POST` | `/api/dataset/upload` | JWT (Admin) | Uploads new CSV dataset to `datasets/raw/` |
| `POST` | `/api/dataset/select` | JWT (Admin) | Selects active dataset for model training |
| `DELETE` | `/api/dataset/delete/<id>`| JWT (Admin) | Deletes dataset record and physical CSV file |
| `POST` | `/api/model/train` | JWT (Admin) | Launches asynchronous background LSTM training |
| `GET` | `/api/model/status` | JWT Required | Polls current training progress and epoch metrics |
| `GET` | `/api/model/report` | JWT Required | Returns latest evaluation metrics JSON |

---

## 📦 Phase 1 Output Artifacts

Upon completing model training, Phase 1 outputs:
- `models/nids_lstm_model.keras` — Serialized Keras LSTM Model.
- `models/scaler.pkl` — Serialized `StandardScaler` normalizer.
- `models/label_encoder.pkl` — Serialized `LabelEncoder` object.
- `reports/latest_evaluation_report.json` — Evaluation metrics summary.

---

## 🔮 Phase 2 Integration Roadmap

Phase 1 provides a modular foundation. In Phase 2, the trained model artifacts (`.keras` and `.pkl`) will be imported into a live intrusion detection pipeline featuring:
- Live network packet sniffing & flow aggregation.
- Real-time feature extraction matching Phase 1 attributes.
- Live threat classification using `nids_lstm_model.keras`.
- Automated firewall blocking and active IPS countermeasures.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

## 👤 Author

**Lohith Gopi**
- **GitHub**: [@LohithGopi](https://github.com/LohithGopi)
- **Project Repository**: [AI-Powered-Zero-Trust-Network-Intrusion-Detection-System](https://github.com/LohithGopi/AI-Powered-Zero-Trust-Network-Intrusion-Detection-System)
