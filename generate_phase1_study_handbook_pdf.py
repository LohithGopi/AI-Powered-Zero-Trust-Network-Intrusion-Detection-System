import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class HandbookCanvas(canvas.Canvas):
    """Two-pass canvas for exact page numbering and headers/footers."""
    def __init__(self, *args, **kwargs):
        super(HandbookCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#1E293B"))

        # Skip header on cover page
        if self._pageNumber > 1:
            self.drawString(54, 752, "ZERO TRUST AI-NIDS — DASHBOARD, TRAINING & EVALUATION STUDY HANDBOOK")
            self.drawRightString(558, 752, "STUDENT MASTERY MANUAL")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.75)
            self.line(54, 744, 558, 744)

        # Footer (All Pages)
        self.setFont("Helvetica", 8.5)
        self.setFillColor(colors.HexColor("#64748B"))
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(54, 42, 558, 42)
        
        self.drawString(54, 28, "Final-Year Engineering Project • Phase 1 Study & Viva Handbook")
        self.drawRightString(558, 28, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_study_handbook_pdf(output_filename="Zero_Trust_NIDS_Phase1_Study_Handbook.pdf"):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Color Palette
    NAVY = colors.HexColor("#0F172A")
    BLUE = colors.HexColor("#1D4ED8")
    SLATE = colors.HexColor("#334155")
    GREEN = colors.HexColor("#15803D")
    AMBER = colors.HexColor("#B45309")
    RED = colors.HexColor("#DC2626")
    BG_LIGHT = colors.HexColor("#F8FAFC")
    BG_NOTE = colors.HexColor("#EFF6FF")
    BG_WARN = colors.HexColor("#FEF3C7")
    BORDER_COLOR = colors.HexColor("#E2E8F0")

    # Paragraph Styles
    cover_title_style = ParagraphStyle('CoverTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=24, leading=28, textColor=NAVY, alignment=1, spaceAfter=10)
    cover_sub_style = ParagraphStyle('CoverSub', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=13, leading=17, textColor=BLUE, alignment=1, spaceAfter=20)
    cover_meta_style = ParagraphStyle('CoverMeta', parent=styles['Normal'], fontName='Helvetica', fontSize=9.5, leading=13.5, textColor=SLATE, alignment=1)

    ch_title_style = ParagraphStyle('ChTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=14, leading=17, textColor=NAVY, spaceBefore=16, spaceAfter=8, keepWithNext=True)
    sec_title_style = ParagraphStyle('SecTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10.5, leading=13.5, textColor=BLUE, spaceBefore=10, spaceAfter=4, keepWithNext=True)
    body_style = ParagraphStyle('Body', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=12, textColor=SLATE, spaceAfter=5)
    bullet_style = ParagraphStyle('Bullet', parent=body_style, leftIndent=12, firstLineIndent=-8, spaceAfter=3)
    code_style = ParagraphStyle('Code', parent=styles['Normal'], fontName='Courier', fontSize=7.5, leading=10, textColor=NAVY)

    table_hdr_style = ParagraphStyle('TblHdr', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10.5, textColor=NAVY)
    table_cell_style = ParagraphStyle('TblCell', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=10.5, textColor=SLATE)
    
    note_style = ParagraphStyle('NoteText', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=8, leading=11, textColor=NAVY)
    q_style = ParagraphStyle('QText', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11.5, textColor=NAVY, spaceBefore=6, spaceAfter=2, keepWithNext=True)
    a_style = ParagraphStyle('AText', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=11.5, textColor=SLATE, spaceAfter=4)

    story = []

    def add_callout(title, text, bg_color=BG_NOTE, border_color=BLUE):
        content = [
            Paragraph(f"<b>{title}</b>", ParagraphStyle('CTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=border_color)),
            Paragraph(text, note_style)
        ]
        t = Table([[content]], colWidths=[500])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg_color),
            ('BOX', (0,0), (-1,-1), 1, border_color),
            ('PADDING', (0,0), (-1,-1), 5),
        ]))
        story.append(t)
        story.append(Spacer(1, 5))

    # =========================================================================
    # COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 30))
    story.append(Paragraph("Understanding the Dashboard, Model Training & Model Evaluation", cover_title_style))
    story.append(HRFlowable(width="85%", thickness=3, color=BLUE, spaceBefore=8, spaceAfter=12))
    story.append(Paragraph("AI-POWERED ZERO TRUST NETWORK INTRUSION DETECTION SYSTEM<br/>PHASE 1 COMPLETE STUDY HANDBOOK & VIVA MANUAL", cover_sub_style))
    story.append(Spacer(1, 30))

    cover_box = [
        [Paragraph("<b>Target Audience:</b> Final-Year Computer Science & Cybersecurity Engineering Student", cover_meta_style)],
        [Paragraph("<b>Purpose:</b> Master Project Architecture, Dashboard, Training & Evaluation Screens for Viva Defense", cover_meta_style)],
        [Paragraph("<b>Includes:</b> 17 Detailed Chapters, Line-by-Line Code Breakdowns, 100 Viva Q&As, & Quick Revision Notes", cover_meta_style)],
        [Paragraph("<b>Academic Year:</b> 2026", cover_meta_style)]
    ]
    cover_tbl = Table(cover_box, colWidths=[460])
    cover_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 10),
        ('ALIGN', (0,0), (-1,-1), 'CENTER')
    ]))
    story.append(cover_tbl)
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 1: INTRODUCTION
    # =========================================================================
    story.append(Paragraph("Chapter 1: Introduction & System Philosophy", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    story.append(Paragraph("1.1 What is a Network Intrusion Detection System (NIDS)?", sec_title_style))
    story.append(Paragraph("<b>Explanation:</b> A Network Intrusion Detection System (NIDS) is a security software module that monitors network traffic flow and analyzes patterns to identify malicious activity such as unauthorized port scans, flooding, or data theft attempts.", body_style))
    story.append(Paragraph("<b>Real-World Analogy:</b> Imagine an airport security scanner. It scans every piece of luggage going through the x-ray conveyor belt to detect prohibited items before passengers reach the gate.", body_style))

    story.append(Paragraph("1.2 What is Zero Trust Architecture?", sec_title_style))
    story.append(Paragraph("<b>Explanation:</b> Zero Trust is a cybersecurity framework based on the principle <i>'Never Trust, Always Verify'</i>. In traditional networks, anyone inside the internal network was trusted automatically. Zero Trust requires identity verification and role permission checks on every single HTTP request.", body_style))

    story.append(Paragraph("1.3 Why Artificial Intelligence (AI) is Used", sec_title_style))
    story.append(Paragraph("<b>Explanation:</b> Traditional NIDS systems use static IF-ELSE rules. Attackers can easily bypass static rules by modifying packet headers slightly. Deep learning AI models (like LSTMs) learn high-level mathematical patterns, allowing them to detect novel, previously unseen zero-day attacks.", body_style))

    story.append(Paragraph("1.4 How the Three Screens Fit Together", sec_title_style))
    story.append(Paragraph("• <b>Screen 1 (Dashboard & Audit Trail):</b> Displays system health, active dataset, model status, and logs all security events.", bullet_style))
    story.append(Paragraph("• <b>Screen 2 (Model Training Interface):</b> Configures hyperparameters, executes dataset preprocessing, and trains the LSTM neural network with real-time status polling.", bullet_style))
    story.append(Paragraph("• <b>Screen 3 (Model Evaluation & Verification Report):</b> Analyzes model test accuracy, Precision, Recall, F1-Score, Confusion Matrix, and ROC Curve AUC.", bullet_style))

    story.append(Spacer(1, 6))

    # =========================================================================
    # CHAPTER 2: COMPLETE PROJECT WORKFLOW
    # =========================================================================
    story.append(Paragraph("Chapter 2: Complete Project End-to-End Workflow", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    workflow_diagram = """
+-----------------------+      +-----------------------+      +-----------------------+
|  1. User Sign-In      | ---> |  2. Auth Middleware   | ---> |  3. SOC Dashboard     |
|  (JWT Token Issued)   |      |  (Bcrypt & JWT Check) |      |  (KPI Cards & Audit)  |
+-----------------------+      +-----------------------+      +-----------------------+
                                                                          |
                                                                          v
+-----------------------+      +-----------------------+      +-----------------------+
|  6. LSTM Training     | <--- |  5. Data Preprocess   | <--- |  4. Select Dataset    |
|  (64 Units, Epochs)   |      |  (Scale & 3D Reshape) |      |  (NSL-KDD / UNSW)     |
+-----------------------+      +-----------------------+      +-----------------------+
            |
            v
+-----------------------+      +-----------------------+      +-----------------------+
|  7. Model Evaluation  | ---> |  8. Save Artifacts    | ---> |  9. Audit Log Entry   |
|  (Confusion & ROC)    |      |  (.keras, .pkl, .json)|      |  (Recorded in SQLite) |
+-----------------------+      +-----------------------+      +-----------------------+
    """
    flow_tbl = Table([[Paragraph(f"<pre>{workflow_diagram.strip()}</pre>", code_style)]], colWidths=[500])
    flow_tbl.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), BG_LIGHT), ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR), ('PADDING', (0,0), (-1,-1), 4)]))
    story.append(flow_tbl)
    story.append(Spacer(1, 6))

    # =========================================================================
    # CHAPTER 3: DASHBOARD
    # =========================================================================
    story.append(Paragraph("Chapter 3: Dashboard Architecture & Controls", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    story.append(Paragraph("The Executive SOC Dashboard ([templates/dashboard.html](file:///c:/Users/hp/Desktop/ML/templates/dashboard.html)) provides a full-width overview of system health:", body_style))

    dash_data = [
        [Paragraph("<b>Dashboard Element</b>", table_hdr_style), Paragraph("<b>UI Purpose & Description</b>", table_hdr_style), Paragraph("<b>Backend Data Source</b>", table_hdr_style)],
        [Paragraph("Top Navigation Bar", table_cell_style), Paragraph("Sticky header with links: Dashboard, Datasets, Compare, Training, Reports, Audit Logs.", table_cell_style), Paragraph("Flask endpoint routing via `navbar.html`.", table_cell_style)],
        [Paragraph("Uploaded Datasets Card", table_cell_style), Paragraph("Displays total number of datasets registered in catalog.", table_cell_style), Paragraph("`DatasetHistory.query.count()`", code_style)],
        [Paragraph("Active Dataset Card", table_cell_style), Paragraph("Shows name and row/col count of selected training dataset.", table_cell_style), Paragraph("`DatasetHistory.query.filter_by(is_selected=True)`", code_style)],
        [Paragraph("Model Status Card", table_cell_style), Paragraph("Indicates whether an LSTM model has been trained ('Trained' / 'Not Trained').", table_cell_style), Paragraph("`ModelHistory.query.first()` check.", code_style)],
        [Paragraph("Training Accuracy Card", table_cell_style), Paragraph("Displays evaluation accuracy percentage of current trained model.", table_cell_style), Paragraph("`ModelHistory.accuracy * 100`", code_style)],
        [Paragraph("Admin Portal Badge", table_cell_style), Paragraph("Red badge identifying Admin role privileges vs blue User Portal badge.", table_cell_style), Paragraph("`g.user.role` from JWT payload.", code_style)],
        [Paragraph("Logout Button", table_cell_style), Paragraph("Clears JWT session token from browser localStorage and redirects to `/login`.", table_cell_style), Paragraph("`auth_routes.py` logout API.", code_style)]
    ]
    dash_tbl = Table(dash_data, colWidths=[110, 210, 180])
    dash_tbl.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,0), BG_LIGHT), ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR), ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR), ('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('PADDING', (0,0), (-1,-1), 4)]))
    story.append(dash_tbl)
    story.append(Spacer(1, 6))

    # =========================================================================
    # CHAPTER 4: SECURITY AUDIT TRAIL
    # =========================================================================
    story.append(Paragraph("Chapter 4: Security Audit Trail & Event Logging", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    story.append(Paragraph("4.1 Audit Trail Table Schema", sec_title_style))
    story.append(Paragraph("The Security Audit Trail records every administrative and security event into SQLite. Table columns:", body_style))
    story.append(Paragraph("• <b>Time:</b> UTC timestamp (`%Y-%m-%d %H:%M:%S`).", bullet_style))
    story.append(Paragraph("• <b>User:</b> Username of the operator who executed the action.", bullet_style))
    story.append(Paragraph("• <b>Action:</b> System action code (`MODEL_TRAINING_STARTED`, `DATASET_PREPROCESSED`, `DATASET_SELECT`, `DATASET_DELETE`).", bullet_style))
    story.append(Paragraph("• <b>Status:</b> Success/Failure status (`SUCCESS`, `FAILED`, `ACCESS_DENIED`).", bullet_style))
    story.append(Paragraph("• <b>IP Address:</b> Remote IP address of client browser.", bullet_style))
    story.append(Paragraph("• <b>Details:</b> Context description string.", bullet_style))

    story.append(Paragraph("4.2 Flask Audit Log Code Snippet with Line-by-Line Breakdown", sec_title_style))
    code_audit = """
def log_audit_event(action, status, user_id, username, ip_address, details):
    log = AuditLog(
        action=action, status=status, user_id=user_id,
        username=username, ip_address=ip_address, details=details
    )
    db.session.add(log)
    db.session.commit()
    """
    story.append(Table([[Paragraph(f"<pre>{code_audit.strip()}</pre>", code_style)]], colWidths=[500], style=[('BACKGROUND', (0,0), (-1,-1), BG_LIGHT), ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR), ('PADDING', (0,0), (-1,-1), 4)]))
    story.append(Paragraph("• <code>log = AuditLog(...)</code>: Instantiates a new ORM object matching the audit_logs table schema.", bullet_style))
    story.append(Paragraph("• <code>db.session.add(log)</code>: Stages the event log record inside SQLAlchemy session transaction.", bullet_style))
    story.append(Paragraph("• <code>db.session.commit()</code>: Persists the transaction permanently into the SQLite database file.", bullet_style))

    story.append(Spacer(1, 6))

    # =========================================================================
    # CHAPTER 5: DATASET WORKFLOW
    # =========================================================================
    story.append(Paragraph("Chapter 5: Dataset Workflow & Catalog Management", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    story.append(Paragraph("5.1 Dataset Operations", sec_title_style))
    story.append(Paragraph("• <b>Upload:</b> Ingests custom CSV datasets into `datasets/raw/` via `/upload-dataset`.", bullet_style))
    story.append(Paragraph("• <b>Inventory:</b> Lists all registered datasets with row/col counts and file sizes at `/dataset-list`.", bullet_style))
    story.append(Paragraph("• <b>Selection:</b> Sets `is_selected=True` for target dataset via `/api/dataset/select`.", bullet_style))
    story.append(Paragraph("• <b>Delete:</b> Admin-only removal of dataset records and physical files via `/api/dataset/delete/<id>`.", bullet_style))
    story.append(Paragraph("• <b>Compare:</b> Side-by-side comparison matrix of datasets at `/dataset-compare`.", bullet_style))

    story.append(Spacer(1, 6))

    # =========================================================================
    # CHAPTER 6: MODEL TRAINING INTERFACE
    # =========================================================================
    story.append(Paragraph("Chapter 6: Model Training Interface Architecture", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    story.append(Paragraph("The Model Training Interface ([templates/train_model.html](file:///c:/Users/hp/Desktop/ML/templates/train_model.html)) consists of:", body_style))
    story.append(Paragraph("1. <b>Hyperparameter Panel:</b> Inputs for Epochs (10), Batch Size (64), Learning Rate (0.001), Optimizer (Adam), and Target Dataset dropdown.", bullet_style))
    story.append(Paragraph("2. <b>Real-Time Training Progress:</b> Displays progress bar (0% - 100%), epoch counter, accuracy/loss badges, and status text.", bullet_style))
    story.append(Paragraph("3. <b>Training Graph:</b> Live updating Chart.js line plot displaying Train Loss, Val Loss, Train Acc, and Val Acc across epochs.", bullet_style))
    story.append(Paragraph("4. <b>Latest Evaluation Report Button:</b> Appears upon completion to redirect user to `/model-report`.", bullet_style))

    story.append(Spacer(1, 6))

    # =========================================================================
    # CHAPTER 7: HYPERPARAMETERS
    # =========================================================================
    story.append(Paragraph("Chapter 7: Hyperparameters Explained", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    hp_data = [
        [Paragraph("<b>Hyperparameter</b>", table_hdr_style), Paragraph("<b>Definition & Plain English Explanation</b>", table_hdr_style), Paragraph("<b>Default Value & Why Used</b>", table_hdr_style)],
        [Paragraph("Epochs", table_cell_style), Paragraph("One complete pass through the entire training dataset.", table_cell_style), Paragraph("`10` — Allows model to learn weights without overfitting.", table_cell_style)],
        [Paragraph("Batch Size", table_cell_style), Paragraph("Number of training samples processed before updating weights.", table_cell_style), Paragraph("`64` — Balances memory efficiency and gradient stability.", table_cell_style)],
        [Paragraph("Optimizer", table_cell_style), Paragraph("Algorithm used to adjust weight values to minimize loss error.", table_cell_style), Paragraph("`Adam` — Adaptive Moment Estimation combining momentum and RMSProp.", table_cell_style)],
        [Paragraph("Learning Rate", table_cell_style), Paragraph("Step size taken by optimizer during gradient descent updates.", table_cell_style), Paragraph("`0.001` — Optimal step size preventing gradient divergence.", table_cell_style)],
        [Paragraph("Loss Function", table_cell_style), Paragraph("Mathematical function measuring error between predictions and target labels.", table_cell_style), Paragraph("`Categorical Crossentropy` — Measures loss across multi-class probability outputs.", table_cell_style)]
    ]
    hp_tbl = Table(hp_data, colWidths=[100, 220, 180])
    hp_tbl.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,0), BG_LIGHT), ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR), ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR), ('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('PADDING', (0,0), (-1,-1), 4)]))
    story.append(hp_tbl)
    story.append(Spacer(1, 6))

    # =========================================================================
    # CHAPTER 8: LSTM TRAINING
    # =========================================================================
    story.append(Paragraph("Chapter 8: LSTM Neural Network Architecture from Scratch", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    story.append(Paragraph("8.1 Deep Learning Concepts", sec_title_style))
    story.append(Paragraph("• <b>Artificial Intelligence (AI):</b> Broad discipline of making machines simulate human intelligence.", bullet_style))
    story.append(Paragraph("• <b>Machine Learning (ML):</b> Subfield where algorithms learn statistical patterns from data.", bullet_style))
    story.append(Paragraph("• <b>Deep Learning (DL):</b> Subset of ML utilizing multi-layered artificial neural networks.", bullet_style))
    story.append(Paragraph("• <b>LSTM:</b> Long Short-Term Memory network equipped with Input, Forget, and Output gates to remember temporal time-series patterns.", bullet_style))

    story.append(Paragraph("8.2 Neural Network Code Breakdown", sec_title_style))
    code_lstm = """
model = Sequential([
    LSTM(64, input_shape=(1, features), return_sequences=False),
    Dropout(0.2),
    Dense(32, activation='relu'),
    Dense(num_classes, activation='softmax')
])
    """
    story.append(Table([[Paragraph(f"<pre>{code_lstm.strip()}</pre>", code_style)]], colWidths=[500], style=[('BACKGROUND', (0,0), (-1,-1), BG_LIGHT), ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR), ('PADDING', (0,0), (-1,-1), 4)]))
    story.append(Paragraph("• <code>Sequential([...])</code>: Defines a linear stack of neural layers.", bullet_style))
    story.append(Paragraph("• <code>LSTM(64, input_shape=(1, features))</code>: 64 unit LSTM cell extracting sequential time-series patterns.", bullet_style))
    story.append(Paragraph("• <code>Dropout(0.2)</code>: Drops 20% of hidden neurons randomly during training to prevent overfitting.", bullet_style))
    story.append(Paragraph("• <code>Dense(32, activation='relu')</code>: Fully-connected layer applying Rectified Linear Unit activation.", bullet_style))
    story.append(Paragraph("• <code>Dense(num_classes, activation='softmax')</code>: Output classification layer producing probability scores.", bullet_style))

    story.append(Spacer(1, 6))

    # =========================================================================
    # CHAPTER 9: REAL-TIME TRAINING PROGRESS
    # =========================================================================
    story.append(Paragraph("Chapter 9: Real-Time Training Progress & Graph Analysis", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    story.append(Paragraph("9.1 Identifying Training Behavior", sec_title_style))
    story.append(Paragraph("• <b>Good Training:</b> Training Loss and Validation Loss decrease steadily together; Training Accuracy and Validation Accuracy increase together.", bullet_style))
    story.append(Paragraph("• <b>Overfitting:</b> Training Loss decreases near 0 while Validation Loss starts increasing; Training Accuracy is 99% while Validation Accuracy drops.", bullet_style))
    story.append(Paragraph("• <b>Underfitting:</b> Both Training Loss and Validation Loss remain high and flat across all epochs.", bullet_style))

    story.append(Spacer(1, 6))

    # =========================================================================
    # CHAPTER 10: MODEL EVALUATION REPORT
    # =========================================================================
    story.append(Paragraph("Chapter 10: Model Evaluation Report & Mathematics", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    eval_data = [
        [Paragraph("<b>Metric Name</b>", table_hdr_style), Paragraph("<b>Mathematical Formula</b>", table_hdr_style), Paragraph("<b>Simple English Interpretation</b>", table_hdr_style)],
        [Paragraph("Accuracy", table_cell_style), Paragraph("`(TP + TN) / (TP + TN + FP + FN)`", code_style), Paragraph("Overall percentage of correctly classified normal and attack samples.", table_cell_style)],
        [Paragraph("Precision", table_cell_style), Paragraph("`TP / (TP + FP)`", code_style), Paragraph("Out of all alerts flagged as attacks, what fraction were actual attacks?", table_cell_style)],
        [Paragraph("Recall", table_cell_style), Paragraph("`TP / (TP + FN)`", code_style), Paragraph("Out of all real attacks in dataset, what fraction did the model detect?", table_cell_style)],
        [Paragraph("F1-Score", table_cell_style), Paragraph("`2 * (P * R) / (P + R)`", code_style), Paragraph("Harmonic mean balancing Precision and Recall.", table_cell_style)],
        [Paragraph("AUC (ROC)", table_cell_style), Paragraph("Area under ROC curve plot", table_cell_style), Paragraph("Model's capability to discriminate between normal and attack classes (1.0 = Perfect).", table_cell_style)]
    ]
    eval_tbl = Table(eval_data, colWidths=[100, 160, 240])
    eval_tbl.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,0), BG_LIGHT), ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR), ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR), ('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('PADDING', (0,0), (-1,-1), 4)]))
    story.append(eval_tbl)

    story.append(Spacer(1, 6))

    # =========================================================================
    # CHAPTER 11: CONFUSION MATRIX
    # =========================================================================
    story.append(Paragraph("Chapter 11: Confusion Matrix Analysis & Class Imbalance", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    story.append(Paragraph("11.1 Matrix Structure", sec_title_style))
    story.append(Paragraph("• <b>True Positive (TP):</b> Actual Attack correctly predicted as Attack.", bullet_style))
    story.append(Paragraph("• <b>True Negative (TN):</b> Actual Normal correctly predicted as Normal.", bullet_style))
    story.append(Paragraph("• <b>False Positive (FP):</b> Actual Normal incorrectly predicted as Attack (False Alarm).", bullet_style))
    story.append(Paragraph("• <b>False Negative (FN):</b> Actual Attack incorrectly predicted as Normal (Missed Threat!).", bullet_style))

    add_callout(
        "Viva Note — Why might a model predict attack classes as Normal?",
        "Answer: Class Imbalance! If 95% of training samples are Normal and only 5% are Attack, the neural network learns that guessing 'Normal' minimizes cross-entropy loss. Solutions include SMOTE oversampling, class weighting, or gathering balanced datasets.",
        BG_WARN, AMBER
    )

    story.append(Spacer(1, 6))

    # =========================================================================
    # CHAPTER 12: ROC CURVE
    # =========================================================================
    story.append(Paragraph("Chapter 12: ROC Curve & Area Under Curve (AUC)", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    story.append(Paragraph("The **ROC Curve (Receiver Operating Characteristic)** plots the **True Positive Rate (TPR)** against the **False Positive Rate (FPR)** at various probability thresholds.", body_style))
    story.append(Paragraph("• **AUC = 1.0:** Perfect model with 100% true positive detection and 0% false alarms.", bullet_style))
    story.append(Paragraph("• **AUC = 0.5:** Random guessing (diagonal baseline).", bullet_style))

    story.append(Spacer(1, 6))

    # =========================================================================
    # CHAPTER 13: UNDERSTANDING THE RESULTS
    # =========================================================================
    story.append(Paragraph("Chapter 13: Interpreting Results & System Improvement", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    story.append(Paragraph("How to evaluate your model performance:", body_style))
    story.append(Paragraph("• **Accuracy > 95%, F1-Score > 0.90:** High performance model ready for deployment.", bullet_style))
    story.append(Paragraph("• **High Accuracy, Low Recall:** Model is suffering from class imbalance. Apply class weights in Keras (`class_weight={0: 1.0, 1: 5.0}`).", bullet_style))
    story.append(Paragraph("• **High Loss, Low Accuracy:** Increase training epochs (from 10 to 25) or add more units to LSTM layer.", bullet_style))

    story.append(Spacer(1, 6))

    # =========================================================================
    # CHAPTER 14: FILES GENERATED
    # =========================================================================
    story.append(Paragraph("Chapter 14: Phase 1 Serialized Output Files", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    files_data = [
        [Paragraph("<b>File Name & Location</b>", table_hdr_style), Paragraph("<b>What it Contains / Format</b>", table_hdr_style), Paragraph("<b>How Phase 2 Uses It</b>", table_hdr_style)],
        [Paragraph("models/nids_lstm_model.keras", code_style), Paragraph("Trained Keras LSTM neural network binary weights and architecture topology.", table_cell_style), Paragraph("Phase 2 loads model via `keras.models.load_model()` to predict attacks on live packets.", table_cell_style)],
        [Paragraph("models/scaler.pkl", code_style), Paragraph("Fitted Scikit-Learn `StandardScaler` object serialized via Python pickle.", table_cell_style), Paragraph("Phase 2 normalizes live packet feature vectors using `scaler.transform()`.", table_cell_style)],
        [Paragraph("models/label_encoder.pkl", code_style), Paragraph("Fitted `LabelEncoder` object.", table_cell_style), Paragraph("Phase 2 maps text labels to numerical integers.", table_cell_style)],
        [Paragraph("reports/latest_evaluation_report.json", code_style), Paragraph("JSON file storing test accuracy, precision, recall, f1, and confusion matrix.", table_cell_style), Paragraph("Loaded by `/model-report` web view to render dashboard performance graphs.", table_cell_style)],
        [Paragraph("database/database.db", code_style), Paragraph("SQLite relational database file.", table_cell_style), Paragraph("Stores user accounts, dataset history, model runs, and audit logs.", table_cell_style)]
    ]
    files_tbl = Table(files_data, colWidths=[140, 180, 180])
    files_tbl.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,0), BG_LIGHT), ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR), ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR), ('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('PADDING', (0,0), (-1,-1), 4)]))
    story.append(files_tbl)

    story.append(Spacer(1, 6))

    # =========================================================================
    # CHAPTER 15: INTERNAL WORKING
    # =========================================================================
    story.append(Paragraph("Chapter 15: Internal Working & System Pipeline", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    pipe_data = [
        "1. <b>User Login:</b> User enters credentials at <code>/login</code>. Server verifies password via Bcrypt and returns JWT token.",
        "2. <b>JWT Storage:</b> Token saved in browser localStorage and appended to Authorization header on every request.",
        "3. <b>Dashboard Load:</b> User lands at <code>/</code>. Flask reads dataset count and audit logs from SQLite.",
        "4. <b>Dataset Upload:</b> Admin uploads dataset CSV at <code>/upload-dataset</code>; metadata saved to <code>dataset_history</code> table.",
        "5. <b>Dataset Selection:</b> Admin selects dataset at <code>/dataset-list</code>; sets <code>is_selected=True</code> in SQLite.",
        "6. <b>Training Trigger:</b> Admin clicks 'Start Training Model' at <code>/train-model</code>. Flask starts background training thread.",
        "7. <b>Data Preprocessing:</b> Data loaded, median imputed, LabelEncoded, StandardScaler normalized, and reshaped to 3D tensor.",
        "8. <b>LSTM Model Compilation:</b> 64-unit LSTM model compiled with Adam optimizer and Categorical Crossentropy loss.",
        "9. <b>Training Epochs:</b> Model trains for 10 epochs. Status progress polled every 1.5s via <code>/api/model/status</code> to update Chart.js.",
        "10. <b>Model Serialization:</b> Trained model saved to <code>models/nids_lstm_model.keras</code>; scaler saved to <code>models/scaler.pkl</code>.",
        "11. <b>Evaluation:</b> Model tested on test split; evaluation JSON report generated.",
        "12. <b>Audit Trail Entry:</b> Event logged in SQLite <code>audit_logs</code> table; Dashboard updated."
    ]
    for p in pipe_data:
        story.append(Paragraph(p, bullet_style))

    story.append(Spacer(1, 6))

    # =========================================================================
    # CHAPTER 16: 100 POSSIBLE COORDINATOR QUESTIONS
    # =========================================================================
    story.append(Paragraph("Chapter 16: 100 Coordinator & Viva Questions (With Simple Answers)", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    viva_qas = [
        ("1. What is an NIDS?", "A Network Intrusion Detection System that monitors traffic to identify cyber attacks."),
        ("2. What is Zero Trust?", "A security model operating on 'Never Trust, Always Verify', checking identity on every request."),
        ("3. Why use JWT instead of sessions?", "JWT is stateless and scalable, eliminating the need to store session state in server memory."),
        ("4. What algorithm is used for password hashing?", "Bcrypt with 12 rounds of computational salting."),
        ("5. What is RBAC?", "Role-Based Access Control, restricting administrative functions to Admin roles."),
        ("6. Why use LSTM for NIDS?", "Network traffic is sequential time-series data; LSTMs maintain internal memory to catch temporal attack patterns."),
        ("7. Why not Decision Trees?", "Decision Trees process packets independently, ignoring time sequence context."),
        ("8. Why not CNNs?", "CNNs excel at 2D spatial grid image data, whereas LSTMs excel at 1D sequential time-series data."),
        ("9. What is Flask?", "A lightweight Python WSGI web application framework."),
        ("10. What database is used?", "SQLite managed via Flask-SQLAlchemy ORM."),
        ("11. What is LabelEncoding?", "Converting text categories (e.g. 'tcp') into integers (e.g. 0)."),
        ("12. What is StandardScaler?", "Transforming features to Mean = 0 and Standard Deviation = 1."),
        ("13. Why do we scale features?", "To prevent large byte values (100,000) from dominating weight updates over small values (0.5s)."),
        ("14. Why reshape data to 3D?", "Keras LSTM memory cells require 3D tensors `(samples, time_steps, features)`."),
        ("15. What is an Epoch?", "One complete forward and backward pass through the entire training dataset."),
        ("16. What is Batch Size?", "Number of training samples processed before updating neural weights."),
        ("17. What optimizer is used?", "Adam (Adaptive Moment Estimation), combining momentum and RMSProp."),
        ("18. What loss function is used?", "Categorical Cross-Entropy for multi-class classification."),
        ("19. What is Dropout?", "Randomly deactivating a fraction of neurons (20%) during training to prevent overfitting."),
        ("20. What is Dense Layer?", "A fully-connected neural network layer."),
        ("21. What is Softmax?", "An activation function converting logits into class probabilities summing to 1.0."),
        ("22. What is ReLU?", "Rectified Linear Unit (`max(0, x)`), providing fast non-linear activation."),
        ("23. What is Accuracy?", "Total correct predictions divided by total predictions."),
        ("24. Why can high accuracy be misleading?", "In imbalanced datasets, predicting only the majority class gives high accuracy but misses all attacks."),
        ("25. What is Precision?", "Fraction of flagged attacks that were real attacks (`TP / (TP + FP)`)."),
        ("26. What is Recall?", "Fraction of real attacks successfully detected (`TP / (TP + FN)`)."),
        ("27. What is F1-Score?", "Harmonic mean of Precision and Recall (`2 * P * R / (P + R)`)."),
        ("28. What is a Confusion Matrix?", "A table comparing actual vs predicted classes showing TP, FP, TN, FN."),
        ("29. What is ROC Curve?", "Plots True Positive Rate vs False Positive Rate at various thresholds."),
        ("30. What is AUC?", "Area Under the ROC Curve; values near 1.0 indicate superior class discrimination."),
        ("31. What datasets are pre-installed?", "NSL-KDD and UNSW-NB15 sample datasets (1,000 rows each)."),
        ("32. Where are trained models saved?", "In `models/nids_lstm_model.keras`."),
        ("33. Where are scalers saved?", "In `models/scaler.pkl` using Python pickle."),
        ("34. Where are evaluation metrics stored?", "In `reports/latest_evaluation_report.json`."),
        ("35. What is the Audit Log?", "An immutable database table tracking user actions, logins, uploads, and training runs."),
        ("36. Can audit logs be exported?", "Yes, via one-click CSV export on the dashboard."),
        ("37. What Python version is used?", "Python 3.11+."),
        ("38. What deep learning framework is used?", "TensorFlow 2.x with Keras API."),
        ("39. What is `app.py`?", "Application Factory initializing Flask, database, and blueprints."),
        ("40. What is `config.py`?", "Central configuration file storing secret keys, folder paths, and parameters."),
        ("41. How does frontend communicate with backend?", "Via asynchronous `fetch()` API calls sending JSON payloads and JWT headers."),
        ("42. What frontend framework is used?", "Bootstrap 5 for responsive CSS layout."),
        ("43. What charting library is used?", "Chart.js for rendering live loss/accuracy graphs."),
        ("44. How is training progress monitored live?", "Frontend polls `/api/model/status` every 1.5s to fetch current epoch metrics."),
        ("45. What is overfitting?", "When a model memorizes training noise and performs poorly on unseen test data."),
        ("46. How do we prevent overfitting?", "Using 20% Dropout layers and Train/Test dataset splitting."),
        ("47. What is the default Train/Test split ratio?", "80% Training, 20% Testing."),
        ("48. What is `is_selected` in DatasetHistory?", "A boolean flag indicating which dataset is currently active for training."),
        ("49. Can common users delete datasets?", "No, dataset deletion requires Admin role protected by `@require_role(['Admin'])`."),
        ("50. What is the ultimate deliverable of Phase 1?", "A serialized `.keras` LSTM model, `.pkl` scaler, `.pkl` label encoder, and metric evaluation report."),
        ("51. What is learning rate?", "Step size taken by optimizer during gradient descent updates."),
        ("52. What happens if learning rate is too high?", "Optimizer overshoots optimal weights and training diverges."),
        ("53. What happens if learning rate is too low?", "Training converges extremely slowly and may get stuck in local minima."),
        ("54. What is forward pass?", "Passing input data through network layers to produce output predictions."),
        ("55. What is backpropagation?", "Calculating loss gradients using chain rules and propagating errors backward."),
        ("56. What is Gradient Descent?", "Optimization algorithm that adjusts weights in the direction of steepest loss descent."),
        ("57. What is a tensor?", "A multi-dimensional numerical array (e.g. 1D vector, 2D matrix, 3D tensor)."),
        ("58. Why do we drop duplicate rows?", "To prevent the model from memorizing repeated identical samples."),
        ("59. How are missing values handled?", "Imputed using numerical median statistics."),
        ("60. What is a confusion matrix cell FN?", "False Negative: An actual attack that the model incorrectly predicted as Normal."),
        ("61. Why is False Negative dangerous in cybersecurity?", "Because a missed attack allows hackers inside the network undetected."),
        ("62. What is False Positive?", "A false alarm: Normal traffic incorrectly flagged as an attack."),
        ("63. What is True Positive?", "An actual attack correctly detected by the model."),
        ("64. What is True Negative?", "Normal traffic correctly classified as Normal."),
        ("65. What is `model.summary()`?", "Prints layer names, output shapes, and trainable parameter counts."),
        ("66. What is `input_shape=(1, features)`?", "Specifies 1 time-step and N feature columns for LSTM input."),
        ("67. What is SMOTE?", "Synthetic Minority Over-sampling Technique used to balance datasets."),
        ("68. What is class weighting?", "Assigning higher loss penalties to underrepresented attack classes during training."),
        ("69. What is EarlyStopping?", "Keras callback that halts training when validation loss stops improving."),
        ("70. What is ModelCheckpoint?", "Keras callback that saves the best model weights during training."),
        ("71. What is secret key in Flask?", "Cryptographic key used to sign session cookies and JWT tokens."),
        ("72. What is HS256?", "HMAC with SHA-256 hash algorithm used to sign JWT tokens."),
        ("73. What happens if a JWT token is tampered with?", "Signature verification fails and backend rejects request with 401 Unauthorized."),
        ("74. What is ORM?", "Object-Relational Mapping (SQLAlchemy), bridging Python classes to database tables."),
        ("75. Why use SQLite for Phase 1?", "Zero configuration, lightweight file-based SQL database ideal for local development."),
        ("76. What is `db.session.commit()`?", "Persists staged database changes permanently to disk."),
        ("77. What is `g.user` in Flask?", "Application context object storing current authenticated user payload during request execution."),
        ("78. What is `@before_request`?", "Flask middleware running before every incoming request to extract JWT tokens."),
        ("79. What is a blueprint in Flask?", "A modular component grouping related API routes together."),
        ("80. What blueprints exist in our app?", "`auth_bp`, `dataset_bp`, and `model_bp`."),
        ("81. What is `jsonify()`?", "Flask helper converting Python dictionaries into JSON HTTP responses."),
        ("82. What is `render_template()`?", "Renders Jinja2 HTML templates with dynamic Python variables."),
        ("83. What is Jinja2?", "Templating engine for Python Flask used to build dynamic web pages."),
        ("84. What is `url_for()`?", "Flask helper generating URLs for view functions based on endpoint names."),
        ("85. Why use Bootstrap 5?", "Provides modern, responsive CSS grid layout and UI components."),
        ("86. What is Chart.js?", "JavaScript charting library rendering interactive HTML5 canvas graphs."),
        ("87. How does live search work on audit trail?", "Debounced JS listener filters table rows based on input text matching."),
        ("88. How does CSV export work on dashboard?", "JS extracts HTML table content and generates a downloadable CSV data URI link."),
        ("89. What is `pickle` in Python?", "Standard module for serializing and deserializing Python objects to byte streams."),
        ("90. What is `.keras` file format?", "Native Keras v3 format storing model architecture, weights, and optimizer state in zip archive."),
        ("91. What is `num_classes`?", "Total number of unique classification labels in target dataset."),
        ("92. What is binary vs multi-class classification?", "Binary classifies Normal vs Attack; Multi-class classifies specific attack types (DoS, Probe, R2L, U2R)."),
        ("93. What is NSL-KDD dataset?", "Cleaned benchmark dataset derived from KDD Cup 1999."),
        ("94. What is UNSW-NB15 dataset?", "Modern network intrusion dataset created by Australian Centre for Cyber Security."),
        ("95. How does Phase 1 prepare for Phase 2?", "Phase 1 trains and serializes `.keras` model and `.pkl` scaler; Phase 2 loads them to classify live packet streams."),
        ("96. Will Phase 2 modify Phase 1 code?", "No, Phase 2 imports Phase 1 model artifacts modularly without altering Phase 1 codebase."),
        ("97. What is a REST API?", "Representational State Transfer API using standard HTTP verbs (GET, POST, DELETE) with JSON payloads."),
        ("98. What is 401 vs 403 status code?", "401 = Unauthorized (Invalid or missing JWT token); 403 = Forbidden (Insufficient RBAC role permissions)."),
        ("99. How is password salting implemented?", "Bcrypt appends a random salt to password before hashing to defeat precomputed rainbow tables."),
        ("100. Why are you confident in your project?", "Because every module—from Zero Trust authentication to LSTM training and evaluation—is fully implemented, tested, and modularly designed!")
    ]

    for q, a in viva_qas:
        story.append(Paragraph(q, q_style))
        story.append(Paragraph(a, a_style))

    story.append(Spacer(1, 6))

    # =========================================================================
    # CHAPTER 17: REVISION NOTES
    # =========================================================================
    story.append(Paragraph("Chapter 17: Quick Revision Notes & Exam Cheat Sheet", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=6))

    story.append(Paragraph("17.1 Key Formulas Cheat Sheet", sec_title_style))
    story.append(Paragraph("• <b>StandardScaler Normalization:</b> $z = \\frac{x - \\mu}{\\sigma}$", body_style))
    story.append(Paragraph("• <b>Accuracy:</b> $\\frac{TP + TN}{TP + TN + FP + FN}$", body_style))
    story.append(Paragraph("• <b>Precision:</b> $\\frac{TP}{TP + FP}$", body_style))
    story.append(Paragraph("• <b>Recall:</b> $\\frac{TP}{TP + FN}$", body_style))
    story.append(Paragraph("• <b>F1-Score:</b> $2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}$", body_style))

    story.append(Paragraph("17.2 Top Coordinator Presentation Tips", sec_title_style))
    story.append(Paragraph("1. Emphasize **Zero Trust**: Explain that every API request verifies JWT tokens and RBAC roles.", bullet_style))
    story.append(Paragraph("2. Emphasize **LSTM Sequence Memory**: Explain why LSTMs outperform static decision trees on time-series network data.", bullet_style))
    story.append(Paragraph("3. Highlight **Phase 1 Output Serialization**: Point out that Phase 1 outputs `.keras` model and `.pkl` scaler ready for Phase 2 deployment.", bullet_style))

    add_callout(
        "Final Mastery Note",
        "You have completed the Phase 1 Study Handbook! Review these 17 chapters and 100 viva questions to deliver a flaw-free presentation.",
        BG_NOTE, BLUE
    )

    doc.build(story, canvasmaker=HandbookCanvas)
    print(f"Successfully generated Phase 1 Complete Study Handbook PDF: {output_filename}")

if __name__ == "__main__":
    build_study_handbook_pdf()
