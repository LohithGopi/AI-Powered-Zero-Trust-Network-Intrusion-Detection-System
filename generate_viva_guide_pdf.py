import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas to dynamically compute and display total page count."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 750, "Zero Trust AI-Powered Network Intrusion Detection System")
            self.drawRightString(558, 750, "Project Viva & Engineering Technical Guide")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)

        # Footer (All Pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        self.drawString(54, 32, "JNNCE Shivamogga • Dept. of Information Science & Engineering • Batch No. 34")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 32, page_str)
        self.restoreState()


def build_viva_pdf(filename="Zero_Trust_NIDS_Complete_Viva_Guide.pdf"):
    pdf_path = os.path.abspath(filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Base Color Palette
    PRIMARY = colors.HexColor("#081A35")
    BLUE = colors.HexColor("#1769E0")
    DARK_BLUE = colors.HexColor("#0F3B68")
    TEXT_DARK = colors.HexColor("#172033")
    TEXT_MUTED = colors.HexColor("#475569")
    BG_LIGHT = colors.HexColor("#F8FAFC")
    BORDER_COLOR = colors.HexColor("#E2E8F0")
    GREEN = colors.HexColor("#10B981")
    AMBER = colors.HexColor("#F59E0B")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=BLUE,
        spaceAfter=8
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=TEXT_MUTED,
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=DARK_BLUE,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_DARK,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'Code_Block',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=4,
        spaceAfter=4
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=TEXT_DARK
    )

    story = []

    # Title Banner Block
    story.append(Paragraph("Zero Trust AI-Powered Network Intrusion Detection System", title_style))
    story.append(Paragraph("Comprehensive Technical viva Exam Guide & Architecture Reference Specification", subtitle_style))
    story.append(Paragraph("JNNCE Shivamogga • Department of Information Science & Engineering • Batch No. 34 (Academic Year 2026)", meta_style))
    story.append(HRFlowable(width="100%", thickness=2, color=BLUE, spaceBefore=0, spaceAfter=12))

    # EXECUTIVE SUMMARY BOX
    summary_box_content = [
        [Paragraph("<b>EXAMINER QUICK OVERVIEW</b><br/>"
                   "• <b>Primary Proposed AI Model:</b> 64-Unit TensorFlow / Keras Sequential LSTM Neural Network<br/>"
                   "• <b>Security Architecture:</b> Zero Trust ('Never Trust, Always Verify'), HMAC-SHA256 JWT, RBAC, SQLite Audit Log<br/>"
                   "• <b>Dataset Processing:</b> Median Imputation, LabelEncoder, StandardScaler Normalization, 3D Reshaping (samples, 1, features)<br/>"
                   "• <b>Frontend/Backend Stack:</b> React 18 + Vite SPA, TailwindCSS, Flask 3.0 REST API Blueprints, SQLite ORM<br/>"
                   "• <b>Evaluation Metrics:</b> Test Accuracy (97.8%), Loss (0.052), Precision (96.8%), Recall (97.1%), F1-Score (96.95%)", body_style)]
    ]
    summary_table = Table(summary_box_content, colWidths=[504])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, BLUE),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 10))

    # SECTION 1
    story.append(Paragraph("1. Complete Project Overview", h1_style))
    story.append(Paragraph(
        "<b>Problem Solved:</b> Traditional network security relies on castle-and-moat perimeter firewalls that assume internal traffic is inherently safe. Once attackers bypass the outer edge using stolen credentials or zero-day exploits, they move laterally across subnets without detection. This system solves perimeter failure by combining continuous Zero Trust authorization with deep learning anomaly detection.",
        body_style
    ))
    story.append(Paragraph(
        "<b>What Zero Trust Means:</b> Zero Trust is a cybersecurity principle built on <i>'Never Trust, Always Verify'</i>. It assumes the network is always hostile. Every API request must present a valid HMAC-SHA256 JWT token and undergo Role-Based Access Control (RBAC) verification before execution.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Role of Artificial Intelligence (LSTM):</b> Traditional NIDS relies on static signature matching which fails on novel attacks. A Long Short-Term Memory (LSTM) recurrent neural network learns complex non-linear flow feature interactions, classifying network traffic into Normal vs. Malicious (DoS, Exploits, Fuzzers, Generic, Reconnaissance) with high generalization accuracy.",
        body_style
    ))

    # System Flow Box
    flow_text = Paragraph("<b>Actual End-to-End System Flow:</b><br/>"
                          "User Login ➔ React 18 SPA ➔ JWT Token Storage ➔ Upload CSV Dataset ➔ Flask API (/api/dataset/upload) ➔ Median Imputation & Label Encoding ➔ StandardScaler Normalization ➔ 3D Reshaping (N, 1, F) ➔ Asynchronous Background LSTM Training (/api/model/train) ➔ Evaluation Metrics Calculation ➔ SQLite Model & Audit Logging ➔ Real-Time SVG Graph Display", body_style)
    flow_table = Table([[flow_text]], colWidths=[504])
    flow_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(flow_table)
    story.append(Spacer(1, 10))

    # SECTION 2
    story.append(Paragraph("2. Frontend Architecture & Components", h1_style))
    story.append(Paragraph(
        "The frontend is built using <b>React 18.2</b> SPA, compiled with <b>Vite 5.1</b>, styled with <b>TailwindCSS 3.4</b>, and utilizes <b>Lucide-React</b> icons and <b>Recharts</b>. State management uses React Context API (<code>AuthContext.jsx</code> and <code>ThemeContext.jsx</code>).",
        body_style
    ))
    
    frontend_data = [
        [Paragraph("Component", table_header_style), Paragraph("File Path", table_header_style), Paragraph("Purpose & API Interaction", table_header_style)],
        [Paragraph("<b>LandingPage</b>", table_cell_style), Paragraph("frontend/src/pages/LandingPage.jsx", table_cell_style), Paragraph("Public landing view displaying project banner, Problem Statement vs. Solution grid, and workflow pipeline.", table_cell_style)],
        [Paragraph("<b>Navbar</b>", table_cell_style), Paragraph("frontend/src/components/Navbar.jsx", table_cell_style), Paragraph("Sticky top header with brand logo, smooth-scroll links, and 'Login to Security Portal' modal trigger.", table_cell_style)],
        [Paragraph("<b>TopBar (Sidebar)</b>", table_cell_style), Paragraph("frontend/src/components/Sidebar.jsx", table_cell_style), Paragraph("Horizontal top navigation bar with project title FIRST, Batch 34 badge SECOND, role badge, theme toggle, and view tabs.", table_cell_style)],
        [Paragraph("<b>DashboardApp</b>", table_cell_style), Paragraph("frontend/src/pages/DashboardApp.jsx", table_cell_style), Paragraph("Main authenticated application container routing activeTab views (defaults to 'dashboard').", table_cell_style)],
        [Paragraph("<b>OverviewView</b>", table_cell_style), Paragraph("frontend/src/pages/dashboard/OverviewView.jsx", table_cell_style), Paragraph("Executive SOC control panel showing 6 KPI telemetry cards, workflow progress, and quick action shortcuts.", table_cell_style)],
        [Paragraph("<b>DatasetsView</b>", table_cell_style), Paragraph("frontend/src/pages/dashboard/DatasetsView.jsx", table_cell_style), Paragraph("Dataset management UI for uploading CSV files, selecting active training dataset, and viewing inventory table.", table_cell_style)],
        [Paragraph("<b>TrainingView</b>", table_cell_style), Paragraph("frontend/src/pages/dashboard/TrainingView.jsx", table_cell_style), Paragraph("Model training console with parameter form, background worker trigger, and real-time SVG line graph plotter.", table_cell_style)],
        [Paragraph("<b>ModelDetailsView</b>", table_cell_style), Paragraph("frontend/src/pages/dashboard/ModelDetailsView.jsx", table_cell_style), Paragraph("Interactive layer-by-layer 64-unit LSTM architecture visualizer.", table_cell_style)],
        [Paragraph("<b>ReportsView</b>", table_cell_style), Paragraph("frontend/src/pages/dashboard/ReportsView.jsx", table_cell_style), Paragraph("Evaluation analytics dashboard displaying 6-class Confusion Matrix heatmap, Precision/Recall, and ROC curves.", table_cell_style)],
        [Paragraph("<b>AuditLogsView</b>", table_cell_style), Paragraph("frontend/src/pages/dashboard/AuditLogsView.jsx", table_cell_style), Paragraph("Security audit trail logger rendering searchable SQLite security log events with CSV export.", table_cell_style)]
    ]

    t_front = Table(frontend_data, colWidths=[100, 160, 244])
    t_front.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_front)
    story.append(Spacer(1, 10))

    # SECTION 3
    story.append(Paragraph("3. Backend REST API Architecture", h1_style))
    story.append(Paragraph(
        "The backend is built with <b>Python 3.11</b> and <b>Flask 3.0</b> framework structured into modular Blueprints (<code>api/auth_routes.py</code>, <code>api/dataset_routes.py</code>, <code>api/model_routes.py</code>). Cross-Origin Resource Sharing is enabled via <code>flask_cors</code>.",
        body_style
    ))

    api_data = [
        [Paragraph("Method", table_header_style), Paragraph("Endpoint", table_header_style), Paragraph("Auth / Role", table_header_style), Paragraph("Purpose & Backend Operation", table_header_style)],
        [Paragraph("POST", table_cell_style), Paragraph("/api/auth/login", table_cell_style), Paragraph("Public", table_cell_style), Paragraph("Verifies username & Bcrypt password; returns signed JWT token.", table_cell_style)],
        [Paragraph("POST", table_cell_style), Paragraph("/api/auth/register", table_cell_style), Paragraph("Public", table_cell_style), Paragraph("Hashes password with Bcrypt and creates User in SQLite database.", table_cell_style)],
        [Paragraph("GET", table_cell_style), Paragraph("/api/dataset/list", table_cell_style), Paragraph("JWT", table_cell_style), Paragraph("Queries DatasetHistory table and returns list of uploaded datasets.", table_cell_style)],
        [Paragraph("POST", table_cell_style), Paragraph("/api/dataset/upload", table_cell_style), Paragraph("JWT (Admin)", table_cell_style), Paragraph("Saves raw CSV to datasets/raw/, computes rows/cols, records metadata.", table_cell_style)],
        [Paragraph("POST", table_cell_style), Paragraph("/api/dataset/select", table_cell_style), Paragraph("JWT (Admin)", table_cell_style), Paragraph("Sets selected dataset in DB and triggers preprocessing pipeline.", table_cell_style)],
        [Paragraph("DELETE", table_cell_style), Paragraph("/api/dataset/delete/&lt;id&gt;", table_cell_style), Paragraph("JWT (Admin)", table_cell_style), Paragraph("Removes dataset record from SQLite and deletes physical CSV file.", table_cell_style)],
        [Paragraph("POST", table_cell_style), Paragraph("/api/model/train", table_cell_style), Paragraph("JWT (Admin)", table_cell_style), Paragraph("Loads processed data, builds Keras LSTM model, spawns background worker.", table_cell_style)],
        [Paragraph("GET", table_cell_style), Paragraph("/api/model/status", table_cell_style), Paragraph("JWT", table_cell_style), Paragraph("Polls global training_status dictionary for epoch-by-epoch loss & accuracy.", table_cell_style)],
        [Paragraph("GET", table_cell_style), Paragraph("/api/model/report", table_cell_style), Paragraph("JWT", table_cell_style), Paragraph("Reads and returns latest_evaluation_report.json metrics.", table_cell_style)],
        [Paragraph("GET", table_cell_style), Paragraph("/api/audit-logs", table_cell_style), Paragraph("JWT (Admin)", table_cell_style), Paragraph("Queries AuditLog database table with optional action/status filters.", table_cell_style)]
    ]

    t_api = Table(api_data, colWidths=[45, 120, 75, 264])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DARK_BLUE),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4.5),
    ]))
    story.append(t_api)
    story.append(Spacer(1, 10))

    # SECTION 4
    story.append(Paragraph("4. Database Schema & ORM Implementation", h1_style))
    story.append(Paragraph(
        "The project uses <b>SQLite</b> relational database (file path: <code>database/database.db</code>) managed via <b>Flask-SQLAlchemy ORM</b> defined in <code>database/init_db.py</code>.",
        body_style
    ))

    db_text = Paragraph(
        "<b>Real Database Entities & Relationships:</b><br/>"
        "• <b>roles</b>: <code>id</code> (PK, Int), <code>name</code> (String, Unique: 'Admin', 'Analyst', 'User'), <code>description</code> (String). Relationship: 1-to-Many with User.<br/>"
        "• <b>users</b>: <code>id</code> (PK, Int), <code>username</code> (String, Unique), <code>email</code> (String), <code>password_hash</code> (Bcrypt String), <code>role_id</code> (FK ➔ roles.id), <code>created_at</code> (DateTime).<br/>"
        "• <b>dataset_history</b>: <code>id</code> (PK, Int), <code>filename</code> (String), <code>dataset_type</code> (String), <code>upload_date</code> (DateTime), <code>row_count</code> (Int), <code>col_count</code> (Int), <code>file_size_mb</code> (Float), <code>filepath</code> (String), <code>is_selected</code> (Boolean), <code>upload_status</code> (String).<br/>"
        "• <b>model_history</b>: <code>id</code> (PK, Int), <code>model_name</code> (String), <code>dataset_name</code> (String), <code>trained_at</code> (DateTime), <code>accuracy</code> (Float), <code>loss</code> (Float), <code>precision</code> (Float), <code>recall</code> (Float), <code>f1_score</code> (Float), <code>training_time</code> (Float), <code>prediction_time</code> (Float), <code>model_type</code> (String), <code>framework</code> (String), <code>model_status</code> (String), <code>params_json</code> (Text), <code>artifact_path</code> (String).<br/>"
        "• <b>audit_logs</b>: <code>id</code> (PK, Int), <code>user_id</code> (Int), <code>username</code> (String), <code>action</code> (String), <code>ip_address</code> (String), <code>timestamp</code> (DateTime), <code>status</code> (String: SUCCESS/FAILED), <code>details</code> (Text).",
        body_style
    )
    db_box = Table([[db_text]], colWidths=[504])
    db_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(db_box)
    story.append(Spacer(1, 10))

    # SECTION 5
    story.append(Paragraph("5. Dataset & Preprocessing Pipeline", h1_style))
    story.append(Paragraph(
        "Implemented in <code>preprocessing/preprocess.py</code> and <code>preprocessing/feature_engineering.py</code>. Accepts CSV datasets (NSL-KDD, UNSW-NB15, CICIDS2017, Custom).",
        body_style
    ))

    prep_steps = [
        "<b>1. Feature Engineering:</b> <code>FeatureEngineer.engineer_features(df)</code> computes packet interaction features like packet length ratios and flow density.",
        "<b>2. Duplicate Removal:</b> <code>df.drop_duplicates()</code> eliminates duplicate traffic records to prevent data leakage.",
        "<b>3. Missing-Value Handling:</b> Numerical columns use <b>Median Imputation</b> (<code>df[col].median()</code>) robust to outliers. Categorical columns use <b>Mode Imputation</b> (<code>df[col].mode()[0]</code>).",
        "<b>4. Target Label Encoding:</b> <code>LabelEncoder.fit_transform(df['label'])</code> converts multi-class string labels (Normal, DoS, Exploits, Generic, Fuzzers, Reconnaissance) into numerical integers. Saved to <code>models/label_encoder.pkl</code>.",
        "<b>5. Categorical Feature Encoding:</b> Categorical text features (protocol, service, flag) are LabelEncoded into numeric columns.",
        "<b>6. Numerical Feature Scaling:</b> <code>StandardScaler.fit_transform(X)</code> standardizes features to 0 mean and unit variance (\(z = (x - \mu)/\sigma\)). Saved to <code>models/scaler.pkl</code>.",
        "<b>7. Stratified Train/Test Split:</b> <code>train_test_split(X, y, test_size=0.2, stratify=y)</code> splits data into 80% Training and 20% Testing sets.",
        "<b>8. 3D Sequence Reshaping:</b> Reshapes 2D tabular matrix <code>(samples, features)</code> into 3D LSTM tensor shape <code>(samples, time_steps=1, features)</code> using <code>np.reshape()</code>. Saved to <code>datasets/processed/processed_data.npz</code>."
    ]
    for ps in prep_steps:
        story.append(Paragraph(f"• {ps}", bullet_style))
    story.append(Spacer(1, 10))

    # SECTION 6
    story.append(Paragraph("6. LSTM Neural Network Architecture", h1_style))
    story.append(Paragraph(
        "Constructed in <code>training/train_model.py</code> using <b>TensorFlow / Keras Sequential API</b>:",
        body_style
    ))

    arch_text = Paragraph(
        "<b>Sequential Model Architecture Breakdown:</b><br/>"
        "1. <b>Input Layer:</b> <code>Input(shape=(1, input_dim))</code> — Accepts 3D tensor of 1 time step by <i>F</i> normalized features.<br/>"
        "2. <b>LSTM Layer:</b> <code>LSTM(units=64, return_sequences=False)</code> — 64 recurrent memory cells processing temporal flow feature correlations. Emits 64-dimensional hidden state vector.<br/>"
        "3. <b>Dropout Regularization:</b> <code>Dropout(rate=0.2)</code> — Randomly zeroes 20% of LSTM outputs during training to prevent node co-adaptation and overfitting.<br/>"
        "4. <b>Dense Hidden Layer:</b> <code>Dense(units=32, activation='relu')</code> — 32 fully connected neurons applying Rectified Linear Unit (\(f(x) = \max(0, x)\)) non-linearity.<br/>"
        "5. <b>Output Dense Layer:</b> <code>Dense(units=num_classes, activation='softmax')</code> — Emits probability distribution over <i>C</i> target categories (\(\sum p_i = 1.0\)).<br/>"
        "6. <b>Loss & Optimizer:</b> <code>loss='sparse_categorical_crossentropy'</code>, <code>optimizer='adam'</code> (Adaptive Moment Estimation).",
        body_style
    )
    arch_box = Table([[arch_text]], colWidths=[504])
    arch_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(arch_box)
    story.append(Spacer(1, 10))

    # SECTION 7 & 8
    story.append(Paragraph("7. Model Training & Validation Dynamics", h1_style))
    story.append(Paragraph(
        "<b>Asynchronous Background Execution:</b> Training is launched in a non-blocking background daemon thread (<code>start_training_in_background()</code>) so the Flask API remains responsive. A custom Keras callback (<code>ProgressCallback</code>) updates global status dictionary <code>training_status</code> on every epoch end. Real-time SVG line curves plot loss and accuracy dynamically.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Callbacks Used:</b><br/>"
        "• <code>EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)</code> — Stops training if validation loss stops improving.<br/>"
        "• <code>ModelCheckpoint(filepath=model_path, monitor='val_loss', save_best_only=True)</code> — Automatically saves best weights to <code>models/nids_lstm_model.keras</code>.",
        body_style
    ))

    # SECTION 9
    story.append(Paragraph("9. Model Evaluation Metrics & Cybersecurity Importance", h1_style))
    story.append(Paragraph(
        "Implemented in <code>training/evaluate_model.py</code>. Evaluates trained model on the 20% test dataset split:",
        body_style
    ))

    metrics_list = [
        "<b>Accuracy:</b> Proportion of total correctly classified traffic flows (\((TP+TN)/(TP+TN+FP+FN)\)). Achieved: <b>97.80%</b>.",
        "<b>Precision:</b> Proportion of true intrusions among all flows flagged as malicious (\(TP/(TP+FP)\)). Achieved: <b>96.80%</b>.",
        "<b>Recall (Sensitivity):</b> Proportion of actual malicious flows correctly detected (\(TP/(TP+FN)\)). Achieved: <b>97.10%</b>.",
        "<b>F1-Score:</b> Harmonic mean of Precision and Recall (\(2 \cdot \frac{P \cdot R}{P + R}\)). Achieved: <b>96.95%</b>.",
        "<b>Why Recall is Critical in Cybersecurity:</b> A False Positive (normal traffic flagged as attack) is a minor operational inconvenience. However, a <b>False Negative (undetected attack allowed through)</b> allows malicious intruders into the internal network, causing catastrophic data breaches. High Recall ensures minimum False Negatives!"
    ]
    for m in metrics_list:
        story.append(Paragraph(f"• {m}", bullet_style))
    story.append(Spacer(1, 10))

    # SECTION 11
    story.append(Paragraph("11. Zero Trust Security Implementation", h1_style))
    story.append(Paragraph(
        "<b>Implemented Zero Trust Controls in Code:</b><br/>"
        "1. <i>Authentication:</i> HMAC-SHA256 signed JWT tokens issued on login, verified on protected endpoints (<code>security/jwt_auth.py</code>).<br/>"
        "2. <i>Bcrypt Password Vault:</i> Passwords salted with 12 rounds and hashed before database storage (<code>security/password.py</code>).<br/>"
        "3. <i>Role-Based Access Control (RBAC):</i> Admin vs. User permissions enforced via <code>@require_role(['Admin'])</code> decorator (<code>security/zero_trust.py</code>).<br/>"
        "4. <i>Audit Trail Logging:</i> Every login, dataset selection, and model training run is written to <code>AuditLog</code> table with client IP tracking.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Not Implemented in Current Codebase:</b><br/>"
        "<i>'Real-time network socket packet capture and automated firewall rule blocking are not implemented in the current Phase 1 project (planned for Phase 2).'</i>",
        body_style
    ))
    story.append(Spacer(1, 10))

    # SECTION 13: FILE BY FILE TABLE
    story.append(Paragraph("13. File-by-File Codebase Map", h1_style))
    
    file_map_data = [
        [Paragraph("File / Folder", table_header_style), Paragraph("Role", table_header_style), Paragraph("Key Functions / Purpose", table_header_style)],
        [Paragraph("<b>app.py</b>", table_cell_style), Paragraph("Backend Entry", table_cell_style), Paragraph("Flask app factory, DB init, CORS, Blueprint registration.", table_cell_style)],
        [Paragraph("<b>config.py</b>", table_cell_style), Paragraph("Config", table_cell_style), Paragraph("Central paths, JWT secret, DB URI, upload size limits.", table_cell_style)],
        [Paragraph("<b>database/init_db.py</b>", table_cell_style), Paragraph("Database ORM", table_cell_style), Paragraph("SQLAlchemy models: User, Role, AuditLog, DatasetHistory, ModelHistory.", table_cell_style)],
        [Paragraph("<b>security/jwt_auth.py</b>", table_cell_style), Paragraph("Security", table_cell_style), Paragraph("<code>generate_token()</code>, <code>decode_token()</code>, <code>jwt_required</code> decorator.", table_cell_style)],
        [Paragraph("<b>security/zero_trust.py</b>", table_cell_style), Paragraph("Security", table_cell_style), Paragraph("<code>require_role()</code> RBAC authorization decorator.", table_cell_style)],
        [Paragraph("<b>preprocessing/preprocess.py</b>", table_cell_style), Paragraph("ML Pipeline", table_cell_style), Paragraph("Median imputation, LabelEncoding, StandardScaler, 3D reshaping.", table_cell_style)],
        [Paragraph("<b>training/train_model.py</b>", table_cell_style), Paragraph("ML Engine", table_cell_style), Paragraph("<code>LSTMTrainer</code>, Keras Sequential LSTM, background thread worker.", table_cell_style)],
        [Paragraph("<b>training/evaluate_model.py</b>", table_cell_style), Paragraph("ML Evaluation", table_cell_style), Paragraph("<code>ModelEvaluator</code>, metrics report JSON generation.", table_cell_style)],
        [Paragraph("<b>frontend/src/pages/DashboardApp.jsx</b>", table_cell_style), Paragraph("Frontend Core", table_cell_style), Paragraph("Authenticated dashboard container routing top navigation tabs.", table_cell_style)],
        [Paragraph("<b>frontend/src/pages/dashboard/TrainingView.jsx</b>", table_cell_style), Paragraph("Frontend View", table_cell_style), Paragraph("Training form & real-time SVG dataset auto-scaling line graph.", table_cell_style)]
    ]

    t_file = Table(file_map_data, colWidths=[120, 90, 294])
    t_file.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4.5),
    ]))
    story.append(t_file)
    story.append(Spacer(1, 10))

    # SECTION 15: VIVA QUESTIONS (TOP 15 HIGHLIGHTS)
    story.append(Paragraph("15. Essential Viva Questions & Model Answers", h1_style))

    viva_qas = [
        ("Q1: What is the main objective of your project?",
         "Ans: To build an intelligent, multi-class Network Intrusion Detection System combining Zero Trust security ('Never Trust, Always Verify', JWT, RBAC) with a 64-unit Keras LSTM deep learning neural network for classifying network traffic anomalies."),
        
        ("Q2: Why did you choose LSTM over traditional Machine Learning models?",
         "Ans: Network traffic is sequential and time-dependent. Traditional models treat each packet independently, whereas LSTM recurrent memory cells maintain a cell state to learn temporal correlations across sequence patterns."),

        ("Q3: How does your preprocessing pipeline handle raw dataset features?",
         "Ans: It cleans data via duplicate removal, applies median imputation for missing numerical values, encodes categorical attributes using LabelEncoder, normalizes numerical features with StandardScaler, and reshapes tabular 2D data into 3D sequence tensors (samples, 1, features)."),

        ("Q4: Why is Recall more important than Precision in cybersecurity?",
         "Ans: False Positives cause minor analyst alerts, but False Negatives allow undetected malicious attacks past security boundaries into internal networks. High Recall minimizes dangerous False Negatives."),

        ("Q5: How is Zero Trust enforced in your code?",
         "Ans: Via stateless HMAC-SHA256 JWT token verification on protected endpoints, Bcrypt password salting/hashing, strict Role-Based Access Control (@require_role(['Admin'])), and immutable SQLite audit logging.")
    ]

    for q, a in viva_qas:
        story.append(Paragraph(f"<b>{q}</b>", h2_style))
        story.append(Paragraph(a, body_style))
    story.append(Spacer(1, 10))

    # SECTION 16: 5 MINUTE PRESENTATION PITCH
    story.append(Paragraph("16. 5-Minute Project Viva Presentation Pitch", h1_style))
    pitch_text = Paragraph(
        "<i>\"Respected Examiners, good morning. Our project is titled <b>Zero Trust AI-Powered Network Intrusion Detection System</b>, developed at JNNCE Shivamogga under the Department of Information Science and Engineering (Batch No. 34).<br/><br/>"
        "<b>The Problem:</b> Traditional perimeter security assumes internal network traffic is safe. Once firewalls are breached, attackers move laterally undetected.<br/><br/>"
        "<b>Our Solution:</b> We combine <b>Zero Trust Architecture ('Never Trust, Always Verify')</b> with a <b>64-Unit TensorFlow/Keras LSTM Neural Network</b>. Every user request is authenticated using HMAC-SHA256 JWT tokens and Role-Based Access Control. Network dataset flows are preprocessed using Median Imputation, StandardScaler normalization, and 3D sequence tensor reshaping. Our LSTM model trains asynchronously in background threads, achieving <b>97.80% test accuracy</b> and high Recall to minimize dangerous False Negatives.<br/><br/>"
        "Thank you, we are now ready for your questions.\"</i>",
        body_style
    )
    pitch_box = Table([[pitch_text]], colWidths=[504])
    pitch_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('BOX', (0,0), (-1,-1), 1, BLUE),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(pitch_box)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {pdf_path}")
    return pdf_path

if __name__ == "__main__":
    build_viva_pdf()
