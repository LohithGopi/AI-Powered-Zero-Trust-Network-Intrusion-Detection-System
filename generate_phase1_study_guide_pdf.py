import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class StudyGuideCanvas(canvas.Canvas):
    """Two-pass canvas for exact 'Page X of Y' headers and footers."""
    def __init__(self, *args, **kwargs):
        super(StudyGuideCanvas, self).__init__(*args, **kwargs)
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
        self.setFillColor(colors.HexColor("#334155"))

        # Skip running header on Cover Page (Page 1)
        if self._pageNumber > 1:
            self.drawString(54, 752, "AI-POWERED ZERO TRUST NIDS — PHASE 1 VIVA & STUDY GUIDE")
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
        
        self.drawString(54, 28, "Final-Year Engineering Project • Comprehensive Viva & Technical Study Guide")
        self.drawRightString(558, 28, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_phase1_study_guide_pdf(output_filename="Zero_Trust_NIDS_Phase1_Study_Guide.pdf"):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Palette
    NAVY = colors.HexColor("#0F172A")
    BLUE = colors.HexColor("#1D4ED8")
    SLATE = colors.HexColor("#334155")
    GREEN = colors.HexColor("#15803D")
    AMBER = colors.HexColor("#B45309")
    BG_LIGHT = colors.HexColor("#F8FAFC")
    BG_NOTE = colors.HexColor("#EFF6FF")
    BG_WARN = colors.HexColor("#FEF3C7")
    BORDER_COLOR = colors.HexColor("#E2E8F0")

    # Styles
    cover_title_style = ParagraphStyle('CoverTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=26, leading=30, textColor=NAVY, alignment=1, spaceAfter=12)
    cover_sub_style = ParagraphStyle('CoverSub', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=BLUE, alignment=1, spaceAfter=24)
    cover_meta_style = ParagraphStyle('CoverMeta', parent=styles['Normal'], fontName='Helvetica', fontSize=10, leading=14, textColor=SLATE, alignment=1)
    
    ch_title_style = ParagraphStyle('ChTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=15, leading=18, textColor=NAVY, spaceBefore=18, spaceAfter=8, keepWithNext=True)
    sec_title_style = ParagraphStyle('SecTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=BLUE, spaceBefore=12, spaceAfter=4, keepWithNext=True)
    body_style = ParagraphStyle('Body', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=13, textColor=SLATE, spaceAfter=6)
    bullet_style = ParagraphStyle('Bullet', parent=body_style, leftIndent=14, firstLineIndent=-10, spaceAfter=4)
    code_style = ParagraphStyle('Code', parent=styles['Normal'], fontName='Courier', fontSize=8, leading=10.5, textColor=NAVY)
    
    table_hdr_style = ParagraphStyle('TblHdr', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=NAVY)
    table_cell_style = ParagraphStyle('TblCell', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=11, textColor=SLATE)
    
    note_style = ParagraphStyle('NoteText', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=8.5, leading=12, textColor=NAVY)
    q_style = ParagraphStyle('QText', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9.5, leading=13, textColor=NAVY, spaceBefore=8, spaceAfter=2, keepWithNext=True)
    a_style = ParagraphStyle('AText', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=13, textColor=SLATE, spaceAfter=6)

    story = []

    def add_callout(title, text, bg_color=BG_NOTE, border_color=BLUE):
        content = [
            Paragraph(f"<b>{title}</b>", ParagraphStyle('CTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9, leading=12, textColor=border_color)),
            Paragraph(text, note_style)
        ]
        t = Table([[content]], colWidths=[500])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg_color),
            ('BOX', (0,0), (-1,-1), 1, border_color),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(t)
        story.append(Spacer(1, 6))

    # =========================================================================
    # COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 40))
    story.append(Paragraph("AI-Powered Zero Trust Network Intrusion Detection System", cover_title_style))
    story.append(HRFlowable(width="80%", thickness=3, color=BLUE, spaceBefore=10, spaceAfter=15))
    story.append(Paragraph("PHASE 1 COMPLETE STUDENT STUDY GUIDE & VIVA MASTERY MANUAL", cover_sub_style))
    story.append(Spacer(1, 40))

    cover_box = [
        [Paragraph("<b>Target Audience:</b> Final-Year Computer Science & Cybersecurity Engineering Student", cover_meta_style)],
        [Paragraph("<b>Purpose:</b> Viva Preparation, Coordinator Review, & Technical Project Defense", cover_meta_style)],
        [Paragraph("<b>Scope:</b> Phase 1 Zero Trust Security, Preprocessing, LSTM Deep Learning & Evaluation", cover_meta_style)],
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
    # CHAPTER 1: PROJECT OVERVIEW
    # =========================================================================
    story.append(Paragraph("Chapter 1: Project Overview & Core Philosophy", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=8))

    story.append(Paragraph("1.1 What is a Network Intrusion Detection System (NIDS)?", sec_title_style))
    story.append(Paragraph(
        "<b>Explanation:</b> A Network Intrusion Detection System (NIDS) acts like a digital security camera for computer networks. It constantly monitors data packets passing through network cables or routers and checks whether any packet is a cyber attack (such as a hacker trying to crash a server or scan open ports).",
        body_style
    ))
    story.append(Paragraph("<b>Example:</b> Imagine a bank teller window. A standard transaction is a normal customer depositing money. A NIDS flags an intruder who tries to slip counterfeit notes through the window.", body_style))
    story.append(Paragraph("<b>Why We Use It:</b> Without a NIDS, hackers can silently probe network ports, steal passwords, or launch Denial-of-Service attacks without anyone knowing until systems crash.", body_style))

    story.append(Paragraph("1.2 Why Artificial Intelligence (AI) is Used Instead of Old Rules", sec_title_style))
    story.append(Paragraph(
        "<b>Explanation:</b> Traditional NIDS systems relied on rigid IF-ELSE rules or static signatures (like an antivirus checking for exact past file names). However, hackers change their attack code daily. AI algorithms learn baseline normal patterns and can detect brand new, unseen cyber attacks (zero-day attacks).",
        body_style
    ))

    story.append(Paragraph("1.3 What is Zero Trust Architecture?", sec_title_style))
    story.append(Paragraph(
        "<b>Explanation:</b> Traditional security followed the 'Perimeter Model'—like a castle with a moat. Once someone crossed the moat, they could enter any room. <b>Zero Trust</b> replaces this with the core rule: <i>'Never Trust, Always Verify'</i>.",
        body_style
    ))
    story.append(Paragraph("Every request made to our web application must present a valid cryptographically signed JWT token proving who the user is and what their role permits.", body_style))

    story.append(Paragraph("1.4 Phase 1 Workflow Flowchart", sec_title_style))
    
    flow_diagram = """
+-------------------+      +-------------------+      +-------------------+
|  1. User Login    | ---> | 2. Select Dataset | ---> | 3. Preprocessing  |
|  (JWT Token Issued) |    | (NSL-KDD / UNSW)  |      | (Clean & Scale)   |
+-------------------+      +-------------------+      +-------------------+
                                                                |
                                                                v
+-------------------+      +-------------------+      +-------------------+
| 6. Dashboard &    | <--- | 5. Save Artifacts | <--- | 4. LSTM Training  |
|    Audit Logs     |      | (.keras / .pkl)   |      | (64 Hidden Units) |
+-------------------+      +-------------------+      +-------------------+
    """
    flow_tbl = Table([[Paragraph(f"<pre>{flow_diagram.strip()}</pre>", code_style)]], colWidths=[500])
    flow_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6)
    ]))
    story.append(flow_tbl)
    story.append(Spacer(1, 8))

    # =========================================================================
    # CHAPTER 2: PROJECT ARCHITECTURE & FILE SYSTEM
    # =========================================================================
    story.append(Paragraph("Chapter 2: Project Architecture & Folder Breakdown", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=8))

    story.append(Paragraph("Every folder in our codebase has a single dedicated responsibility. Here is how they communicate:", body_style))

    arch_data = [
        [Paragraph("<b>File / Folder</b>", table_hdr_style), Paragraph("<b>What it Contains / Does</b>", table_hdr_style), Paragraph("<b>Why it Exists & Execution Context</b>", table_hdr_style)],
        [Paragraph("app.py", code_style), Paragraph("Flask Application Factory & Route Registrar", table_cell_style), Paragraph("Entry point of server. Starts app, initializes SQLite database, and registers blueprints.", table_cell_style)],
        [Paragraph("config.py", code_style), Paragraph("Global Configuration Class (`Config`)", table_cell_style), Paragraph("Stores SECRET_KEY, JWT expiration time, upload folder paths, and database URIs.", table_cell_style)],
        [Paragraph("database/", code_style), Paragraph("SQLite Models (`init_db.py`)", table_cell_style), Paragraph("Contains SQLAlchemy ORM classes: User, Role, DatasetHistory, ModelHistory, AuditLog.", table_cell_style)],
        [Paragraph("security/", code_style), Paragraph("Zero Trust Security Modules", table_cell_style), Paragraph("Includes `jwt_auth.py` (token generation), `password.py` (Bcrypt), and `zero_trust.py` (RBAC decorators).", table_cell_style)],
        [Paragraph("preprocessing/", code_style), Paragraph("Data Preprocessing Pipeline", table_cell_style), Paragraph("Cleans raw CSVs, label encodes text features, scales numbers, and shapes 3D LSTM tensors.", table_cell_style)],
        [Paragraph("training/", code_style), Paragraph("Keras Model Trainer (`train_model.py`)", table_cell_style), Paragraph("Runs background training thread, compiles LSTM network, logs progress, and saves `.keras` model.", table_cell_style)],
        [Paragraph("api/", code_style), Paragraph("Flask REST Blueprints", table_cell_style), Paragraph("Contains `auth_routes.py`, `dataset_routes.py`, and `model_routes.py` API endpoints.", table_cell_style)],
        [Paragraph("models/", code_style), Paragraph("Phase 1 Serialized Output Directory", table_cell_style), Paragraph("Stores final output artifacts: `nids_lstm_model.keras`, `scaler.pkl`, and `label_encoder.pkl`.", table_cell_style)],
        [Paragraph("templates/", code_style), Paragraph("Jinja2 HTML Web Interfaces", table_cell_style), Paragraph("Renders full-width top navigation views: `dashboard.html`, `dataset_list.html`, `train_model.html`, etc.", table_cell_style)]
    ]
    arch_tbl = Table(arch_data, colWidths=[90, 160, 250])
    arch_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(arch_tbl)
    story.append(Spacer(1, 10))

    # =========================================================================
    # CHAPTER 3: ZERO TRUST ARCHITECTURE & SECURITY
    # =========================================================================
    story.append(Paragraph("Chapter 3: Zero Trust Security & Authentication Mechanics", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=8))

    story.append(Paragraph("3.1 Password Hashing with Bcrypt", sec_title_style))
    story.append(Paragraph(
        "<b>Explanation:</b> We never store plain passwords like 'Password123' in the database. If a hacker steals the database file, plain passwords allow instant account hijacking. Instead, we use <b>Bcrypt salting and hashing</b>.",
        body_style
    ))
    story.append(Paragraph("<b>Code Snippet & Line-by-Line Breakdown:</b>", body_style))
    
    code_bcrypt = """
salt = bcrypt.gensalt(rounds=12)
hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    """
    story.append(Table([[Paragraph(f"<pre>{code_bcrypt.strip()}</pre>", code_style)]], colWidths=[500], style=[('BACKGROUND', (0,0), (-1,-1), BG_LIGHT), ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR), ('PADDING', (0,0), (-1,-1), 4)]))
    
    story.append(Paragraph("• <code>salt = bcrypt.gensalt(rounds=12)</code>: Generates a random 16-byte salt string with a computational work factor of 12 rounds to defeat Rainbow Table attacks.", bullet_style))
    story.append(Paragraph("• <code>password.encode('utf-8')</code>: Converts string text into raw byte format required by cryptography algorithms.", bullet_style))
    story.append(Paragraph("• <code>bcrypt.hashpw(...)</code>: One-way mathematical transformation resulting in a 60-character hash stored safely in the database.", bullet_style))

    story.append(Spacer(1, 6))

    story.append(Paragraph("3.2 JWT Token Authentication & RBAC Decorator", sec_title_style))
    story.append(Paragraph(
        "<b>Explanation:</b> After a user logs in successfully, the server creates a digital wristband called a <b>JWT (JSON Web Token)</b>. Every REST API endpoint uses the <code>@require_role(['Admin'])</code> decorator to verify the token before allowing access.",
        body_style
    ))

    add_callout(
        "Viva Tip — Why check JWT on every single API request?",
        "Answer: In a Zero Trust model, there are no 'safe pages'. An attacker could attempt to bypass the frontend UI and send raw HTTP POST calls directly to '/api/dataset/delete/1'. The backend @jwt_required decorator intercepts every raw request and rejects unauthorized calls with a 401 Unauthorized or 403 Forbidden status code.",
        BG_NOTE, BLUE
    )

    story.append(Spacer(1, 8))

    # =========================================================================
    # CHAPTER 4: DATASET MANAGEMENT
    # =========================================================================
    story.append(Paragraph("Chapter 4: Dataset Catalog & Ingestion Module", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=8))

    story.append(Paragraph("4.1 Supported Benchmark Datasets", sec_title_style))
    story.append(Paragraph(
        "Our Phase 1 system supports major benchmark datasets used in cybersecurity research:",
        body_style
    ))
    story.append(Paragraph("• <b>NSL-KDD:</b> An improved benchmark dataset resolving duplicate records from the classic KDD'99 dataset. Contains features like duration, protocol_type, service, flag, src_bytes, dst_bytes.", bullet_style))
    story.append(Paragraph("• <b>UNSW-NB15:</b> Created by the Australian Centre for Cyber Security. Features modern synthetic attack behaviors (Fuzzers, Analysis, Backdoors, DoS, Exploits, Generic, Reconnaissance).", bullet_style))
    story.append(Paragraph("• <b>CICIDS2017:</b> Contains modern real-world benign and attack traffic flows generated by the Canadian Institute for Cybersecurity.", bullet_style))
    story.append(Paragraph("• <b>Custom CSVs:</b> User-uploaded CSV datasets conforming to standard feature column headers.", bullet_style))

    story.append(Paragraph("4.2 Pre-Installed Test Datasets", sec_title_style))
    story.append(Paragraph("To enable out-of-the-box testing without requiring manual file uploads, <code>init_db.py</code> automatically seeds 2 benchmark datasets into <code>datasets/raw/</code> on startup:", body_style))
    story.append(Paragraph("1. <code>nsl_kdd_benchmark_sample.csv</code> (1,000 samples; Pre-selected active dataset).", bullet_style))
    story.append(Paragraph("2. <code>unsw_nb15_benchmark_sample.csv</code> (1,000 samples).", bullet_style))

    story.append(Spacer(1, 8))

    # =========================================================================
    # CHAPTER 5: DATA PREPROCESSING
    # =========================================================================
    story.append(Paragraph("Chapter 5: Data Preprocessing Pipeline", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=8))

    story.append(Paragraph("5.1 Step-by-Step Data Preprocessing Pipeline", sec_title_style))

    prep_data = [
        [Paragraph("<b>Preprocessing Step</b>", table_hdr_style), Paragraph("<b>Why It Is Required</b>", table_hdr_style), Paragraph("<b>Transformation Example</b>", table_hdr_style)],
        [Paragraph("1. Missing Value Imputation", table_cell_style), Paragraph("Neural networks crash if fed NaN or empty values.", table_cell_style), Paragraph("Fills missing numerical values using median statistics.", table_cell_style)],
        [Paragraph("2. Duplicate Removal", table_cell_style), Paragraph("Prevents model from memorizing identical repeated rows.", table_cell_style), Paragraph("Drops duplicate rows via <code>df.drop_duplicates()</code>.", table_cell_style)],
        [Paragraph("3. LabelEncoding", table_cell_style), Paragraph("Computers cannot multiply string text like 'tcp' or 'udp'.", table_cell_style), Paragraph("Converts text categories: ['tcp','udp','icmp'] -> [0, 1, 2].", table_cell_style)],
        [Paragraph("4. StandardScaler Normalization", table_cell_style), Paragraph("Large values (e.g. 100,000 bytes) overpower small values (e.g. 0.5s duration).", table_cell_style), Paragraph("Transforms numbers to Mean = 0, StdDev = 1 using z = (x - µ) / σ.", table_cell_style)],
        [Paragraph("5. 3D Sequence Reshaping", table_cell_style), Paragraph("LSTM memory layers require a 3D time-step tensor input.", table_cell_style), Paragraph("Reshapes matrix from (samples, features) -> (samples, 1, features).", table_cell_style)]
    ]
    prep_tbl = Table(prep_data, colWidths=[120, 180, 200])
    prep_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(prep_tbl)
    story.append(Spacer(1, 10))

    # =========================================================================
    # CHAPTER 6: FEATURE ENGINEERING
    # =========================================================================
    story.append(Paragraph("Chapter 6: Feature Engineering & Attribute Analysis", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=8))

    story.append(Paragraph("Here is how key network features help our LSTM AI engine detect cyber attacks:", body_style))

    feat_data = [
        [Paragraph("<b>Network Feature</b>", table_hdr_style), Paragraph("<b>Description</b>", table_hdr_style), Paragraph("<b>How it Helps Spot Attacks</b>", table_hdr_style)],
        [Paragraph("duration / dur", code_style), Paragraph("Connection duration in seconds", table_cell_style), Paragraph("Extremely short connections (<0.01s) repeated quickly indicate port scans; extremely long connections may indicate data exfiltration.", table_cell_style)],
        [Paragraph("src_bytes / sbytes", code_style), Paragraph("Bytes sent from source host", table_cell_style), Paragraph("Unusually large outgoing byte counts indicate data theft or outbound file transfer attacks.", table_cell_style)],
        [Paragraph("dst_bytes / dbytes", code_style), Paragraph("Bytes received from destination", table_cell_style), Paragraph("Massive incoming bytes indicate high-volume flood attacks (e.g. UDP/ICMP Floods).", table_cell_style)],
        [Paragraph("count / rate", code_style), Paragraph("Connections to same host in window", table_cell_style), Paragraph("High count values (>200 connections/sec) flag Denial-of-Service (DoS) flooding.", table_cell_style)],
        [Paragraph("flag / state", code_style), Paragraph("TCP connection flags (SF, S0, REJ)", table_cell_style), Paragraph("'S0' (SYN sent, no ACK received) flags SYN Flood attacks; 'REJ' flags rejected port probes.", table_cell_style)],
        [Paragraph("dst_port", code_style), Paragraph("Target destination port number", table_cell_style), Paragraph("Probing administrative ports like 22 (SSH) or 3389 (RDP) signals brute-force reconnaissance.", table_cell_style)]
    ]
    feat_tbl = Table(feat_data, colWidths=[110, 150, 240])
    feat_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(feat_tbl)
    story.append(Spacer(1, 10))

    # =========================================================================
    # CHAPTER 7: LSTM DEEP LEARNING MODEL
    # =========================================================================
    story.append(Paragraph("Chapter 7: LSTM Deep Learning Model (Taught From Scratch)", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=8))

    story.append(Paragraph("7.1 What is an LSTM Neural Network?", sec_title_style))
    story.append(Paragraph(
        "<b>Explanation:</b> A <b>Long Short-Term Memory (LSTM)</b> network is a special type of Recurrent Neural Network (RNN). Traditional neural networks treat every sample independently (they have no memory). LSTMs contain internal memory gates (Input Gate, Forget Gate, Output Gate) that remember historical network traffic patterns over time.",
        body_style
    ))
    
    add_callout(
        "Viva Question — Why LSTM instead of Decision Trees or CNNs?",
        "Answer: Decision Trees treat each packet as an isolated row, ignoring time context. CNNs are optimized for 2D spatial grid images. Network traffic is sequential time-series data. LSTMs maintain an internal memory state across sequential packets, making them superior for detecting multi-step attacks.",
        BG_NOTE, BLUE
    )

    story.append(Paragraph("7.2 Model Architecture Code & Line-by-Line Breakdown", sec_title_style))

    code_model = """
model = Sequential([
    LSTM(64, input_shape=(1, X_train.shape[2]), return_sequences=False),
    Dropout(0.2),
    Dense(32, activation='relu'),
    Dense(num_classes, activation='softmax' if num_classes > 2 else 'sigmoid')
])
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    """
    story.append(Table([[Paragraph(f"<pre>{code_model.strip()}</pre>", code_style)]], colWidths=[500], style=[('BACKGROUND', (0,0), (-1,-1), BG_LIGHT), ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR), ('PADDING', (0,0), (-1,-1), 4)]))

    story.append(Paragraph("• <code>Sequential([...])</code>: A linear stack of neural network layers where data flows sequentially from top to bottom.", bullet_style))
    story.append(Paragraph("• <code>LSTM(64, input_shape=(1, features))</code>: 64 hidden LSTM units extracting temporal sequence patterns.", bullet_style))
    story.append(Paragraph("• <code>Dropout(0.2)</code>: Randomly deactivates 20% of neurons during each training step to prevent model overfitting (memorization).", bullet_style))
    story.append(Paragraph("• <code>Dense(32, activation='relu')</code>: Fully-connected layer applying Rectified Linear Unit (ReLU) activation to learn non-linear feature combinations.", bullet_style))
    story.append(Paragraph("• <code>Dense(num_classes, activation='softmax')</code>: Output layer producing class probabilities summing to 1.0 (100%).", bullet_style))
    story.append(Paragraph("• <code>model.compile(optimizer='adam', loss='categorical_crossentropy')</code>: Adam adaptive learning optimizer paired with Categorical Cross-Entropy loss function.", bullet_style))

    story.append(Spacer(1, 8))

    # =========================================================================
    # CHAPTER 8: MODEL TRAINING PROCESS
    # =========================================================================
    story.append(Paragraph("Chapter 8: Model Training Mechanics & Backpropagation", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=8))

    story.append(Paragraph("8.1 How Training Works", sec_title_style))
    story.append(Paragraph("1. <b>Forward Pass:</b> Input features pass through the LSTM and Dense layers to produce initial predictions.", bullet_style))
    story.append(Paragraph("2. <b>Loss Computation:</b> Cross-entropy loss calculates the mathematical error between predicted probabilities and actual target labels.", bullet_style))
    story.append(Paragraph("3. <b>Backpropagation:</b> Gradients are calculated using calculus chain rules, pushing error signals backward through neural layers.", bullet_style))
    story.append(Paragraph("4. <b>Weight Update:</b> The <b>Adam optimizer</b> adjusts internal synaptic weights to reduce loss in subsequent epochs.", bullet_style))

    story.append(Paragraph("8.2 Epochs & Batch Size", sec_title_style))
    story.append(Paragraph("• <b>Epoch (Default = 10):</b> One complete training pass through the entire dataset.", bullet_style))
    story.append(Paragraph("• <b>Batch Size (Default = 64):</b> Number of training samples processed together before updating weights.", bullet_style))

    story.append(Spacer(1, 8))

    # =========================================================================
    # CHAPTER 9: MODEL EVALUATION & PERFORMANCE METRICS
    # =========================================================================
    story.append(Paragraph("Chapter 9: Model Evaluation & Performance Analytics", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=8))

    story.append(Paragraph("9.1 Mathematical Metrics", sec_title_style))

    eval_data = [
        [Paragraph("<b>Metric Name</b>", table_hdr_style), Paragraph("<b>Mathematical Formula</b>", table_hdr_style), Paragraph("<b>Plain English Explanation</b>", table_hdr_style)],
        [Paragraph("Accuracy", table_cell_style), Paragraph("<code>(TP + TN) / Total</code>", code_style), Paragraph("Overall percentage of correctly classified normal and attack traffic.", table_cell_style)],
        [Paragraph("Precision", table_cell_style), Paragraph("<code>TP / (TP + FP)</code>", code_style), Paragraph("Out of all alerts flagged as attacks, what fraction were real attacks?", table_cell_style)],
        [Paragraph("Recall (Sensitivity)", table_cell_style), Paragraph("<code>TP / (TP + FN)</code>", code_style), Paragraph("Out of all actual attacks in the dataset, what fraction did our model catch?", table_cell_style)],
        [Paragraph("F1-Score", table_cell_style), Paragraph("<code>2 * (P * R) / (P + R)</code>", code_style), Paragraph("Harmonic mean balancing Precision and Recall.", table_cell_style)]
    ]
    eval_tbl = Table(eval_data, colWidths=[110, 140, 250])
    eval_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(eval_tbl)

    story.append(Spacer(1, 6))

    add_callout(
        "Common Examiner Trap — When can high accuracy be misleading?",
        "Answer: In imbalanced datasets where 99% of traffic is Normal and 1% is Attack, a naive model that predicts 'Normal' for every packet gets 99% accuracy! However, its Recall for attacks is 0%. That is why we evaluate Precision, Recall, F1-Score, and the Confusion Matrix alongside Accuracy.",
        BG_WARN, AMBER
    )

    story.append(Spacer(1, 8))

    # =========================================================================
    # CHAPTER 10: DASHBOARD ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("Chapter 10: Executive SOC Dashboard Architecture", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=8))

    story.append(Paragraph("The full-width executive dashboard ([templates/dashboard.html](file:///c:/Users/hp/Desktop/ML/templates/dashboard.html)) presents 6 KPI Telemetry Cards:", body_style))
    story.append(Paragraph("1. <b>Uploaded Datasets:</b> Total count of registered CSV datasets in SQLite.", bullet_style))
    story.append(Paragraph("2. <b>Active Dataset:</b> Name of the dataset currently selected for training.", bullet_style))
    story.append(Paragraph("3. <b>Dataset Rows & Cols:</b> Sample row count and attribute column count.", bullet_style))
    story.append(Paragraph("4. <b>Model Status:</b> Shows 'Trained' or 'Not Trained'.", bullet_style))
    story.append(Paragraph("5. <b>Training Accuracy:</b> Final evaluation accuracy percentage.", bullet_style))
    story.append(Paragraph("6. <b>Last Training:</b> Timestamp of most recent training run.", bullet_style))

    story.append(Spacer(1, 8))

    # =========================================================================
    # CHAPTER 11: DATABASE DESIGN & SCHEMA
    # =========================================================================
    story.append(Paragraph("Chapter 11: Database Schema & Relationships", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=8))

    db_data = [
        [Paragraph("<b>Database Table</b>", table_hdr_style), Paragraph("<b>Key Columns / Attributes</b>", table_hdr_style), Paragraph("<b>Purpose & Relationships</b>", table_hdr_style)],
        [Paragraph("users", code_style), Paragraph("id, username, password_hash, role_id", table_cell_style), Paragraph("Stores user accounts. Foreign key to roles table.", table_cell_style)],
        [Paragraph("roles", code_style), Paragraph("id, name ('Admin', 'User')", table_cell_style), Paragraph("Defines RBAC permission levels.", table_cell_style)],
        [Paragraph("dataset_history", code_style), Paragraph("id, filename, dataset_type, row_count, col_count, is_selected", table_cell_style), Paragraph("Catalog of uploaded/seeded CSV datasets.", table_cell_style)],
        [Paragraph("model_history", code_style), Paragraph("id, model_name, accuracy, loss, trained_at, filepath", table_cell_style), Paragraph("Log of trained model runs and evaluation metrics.", table_cell_style)],
        [Paragraph("audit_logs", code_style), Paragraph("id, action, status, username, ip_address, timestamp, details", table_cell_style), Paragraph("Immutable security event log feed.", table_cell_style)]
    ]
    db_tbl = Table(db_data, colWidths=[100, 160, 240])
    db_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(db_tbl)
    story.append(Spacer(1, 8))

    # =========================================================================
    # CHAPTER 12: END-TO-END PROJECT FLOW
    # =========================================================================
    story.append(Paragraph("Chapter 12: End-to-End Execution Pipeline", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=8))

    pipe_steps = [
        "1. <b>User Sign-In:</b> User logs in via <code>/login</code>. Server verifies password hash via Bcrypt and issues JWT token.",
        "2. <b>Dataset Selection:</b> User views <code>/dataset-list</code> and selects an active dataset (e.g. <code>nsl_kdd_benchmark_sample.csv</code>).",
        "3. <b>Preprocessing Trigger:</b> User navigates to <code>/train-model</code> and clicks 'Start Training Model'. Flask API launches background thread.",
        "4. <b>Pipeline Execution:</b> Data is loaded, cleaned, LabelEncoded, StandardScaler normalized, and reshaped into 3D tensors.",
        "5. <b>Keras LSTM Training:</b> 64-unit LSTM model trains across 10 epochs. Frontend polls <code>/api/model/status</code> every 1.5s to update Chart.js.",
        "6. <b>Model Serialization:</b> Trained model saved to <code>models/nids_lstm_model.keras</code>; scaler saved to <code>models/scaler.pkl</code>.",
        "7. <b>Evaluation & Audit Log:</b> Model evaluated on test set; metrics written to JSON report; event logged in audit trail."
    ]
    for s in pipe_steps:
        story.append(Paragraph(s, bullet_style))

    story.append(Spacer(1, 8))

    # =========================================================================
    # CHAPTER 13: CODE WALKTHROUGH
    # =========================================================================
    story.append(Paragraph("Chapter 13: Code Walkthrough of Key Functions", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=8))

    story.append(Paragraph("13.1 Preprocessing Function (<code>preprocessing/preprocess.py</code>)", sec_title_style))
    code_prep = """
def preprocess_dataset(filepath):
    df = pd.read_csv(filepath).drop_duplicates()
    for col in df.select_dtypes(include=['object']).columns:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_3d = X_scaled.reshape((X_scaled.shape[0], 1, X_scaled.shape[1]))
    return X_3d, y, scaler, le
    """
    story.append(Table([[Paragraph(f"<pre>{code_prep.strip()}</pre>", code_style)]], colWidths=[500], style=[('BACKGROUND', (0,0), (-1,-1), BG_LIGHT), ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR), ('PADDING', (0,0), (-1,-1), 4)]))
    story.append(Paragraph("• <code>df.drop_duplicates()</code>: Removes identical rows.", bullet_style))
    story.append(Paragraph("• <code>LabelEncoder().fit_transform(...)</code>: Converts categorical strings to integers.", bullet_style))
    story.append(Paragraph("• <code>StandardScaler().fit_transform(X)</code>: Normalizes features to mean=0, stddev=1.", bullet_style))
    story.append(Paragraph("• <code>X_scaled.reshape((samples, 1, features))</code>: Converts 2D matrix into 3D LSTM tensor format.", bullet_style))

    story.append(Spacer(1, 8))

    # =========================================================================
    # CHAPTER 14: 50 VIVA & COORDINATOR QUESTIONS
    # =========================================================================
    story.append(Paragraph("Chapter 14: 50 Coordinator Review & Viva Questions (With Simple Answers)", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=8))

    viva_qas = [
        ("1. What is an NIDS?", "A system that monitors network traffic to detect unauthorized intrusion and attack patterns."),
        ("2. What is Zero Trust?", "A security framework operating on 'Never Trust, Always Verify', checking identity and permissions on every request."),
        ("3. Why use JWT instead of sessions?", "JWT is stateless, scalable, and stores signed user identity in tokens without burdening server memory."),
        ("4. What algorithm is used for password hashing?", "Bcrypt with a 12-round computational salt."),
        ("5. What is RBAC?", "Role-Based Access Control, restricting administrative actions (e.g. train/delete) to Admin roles."),
        ("6. Why use LSTM for NIDS?", "Network traffic is sequential time-series data. LSTMs maintain internal memory to detect temporal attack sequences."),
        ("7. Why not Decision Trees?", "Decision Trees process each packet independently without temporal memory across time steps."),
        ("8. Why not CNNs?", "CNNs excel at 2D grid image feature extraction, whereas LSTMs excel at 1D sequential data."),
        ("9. What is the role of Flask in this project?", "Flask acts as the lightweight Python web framework hosting REST APIs and serving UI views."),
        ("10. What database is used?", "SQLite managed via Flask-SQLAlchemy ORM."),
        ("11. What is LabelEncoding?", "Converting categorical text values (e.g. 'tcp') into integers (e.g. 0)."),
        ("12. What is StandardScaler?", "Normalizing feature distributions to Mean = 0 and Standard Deviation = 1."),
        ("13. Why do we scale features?", "To prevent large numerical values (e.g. 100,000 bytes) from dominating model weight updates."),
        ("14. Why reshape data to 3D?", "Keras LSTM layers require input shape `(batch_size, time_steps, features)`."),
        ("15. What is an Epoch?", "One complete forward and backward pass through the entire training dataset."),
        ("16. What is Batch Size?", "Number of samples processed before updating internal neural network weights."),
        ("17. What optimizer is used?", "Adam (Adaptive Moment Estimation), combining AdaGrad and RMSProp for fast convergence."),
        ("18. What loss function is used?", "Categorical Cross-Entropy for multi-class classification (or Binary Cross-Entropy for 2 classes)."),
        ("19. What is Dropout?", "Randomly deactivating a fraction of neurons (20%) during training to prevent overfitting."),
        ("20. What is Dense Layer?", "A standard fully-connected neural network layer."),
        ("21. What is Softmax?", "An activation function converting output logits into class probabilities summing to 1.0."),
        ("22. What is ReLU?", "Rectified Linear Unit (`max(0, x)`), providing fast non-linear activation."),
        ("23. What is Accuracy?", "Total correct predictions divided by total predictions."),
        ("24. Why can high accuracy be misleading?", "In imbalanced datasets, predicting only the majority class gives high accuracy but fails to catch attacks."),
        ("25. What is Precision?", "Fraction of flagged attacks that were actual attacks (`TP / (TP + FP)`)."),
        ("26. What is Recall?", "Fraction of actual attacks successfully detected (`TP / (TP + FN)`)."),
        ("27. What is F1-Score?", "Harmonic mean of Precision and Recall (`2 * P * R / (P + R)`)."),
        ("28. What is a Confusion Matrix?", "A table comparing actual vs predicted classes showing TP, FP, TN, FN."),
        ("29. What is ROC Curve?", "Receiver Operating Characteristic curve plotting True Positive Rate vs False Positive Rate."),
        ("30. What is AUC?", "Area Under the ROC Curve; higher AUC (near 1.0) indicates better class separation."),
        ("31. What datasets are pre-installed?", "NSL-KDD and UNSW-NB15 sample datasets (1,000 rows each)."),
        ("32. Where are trained models saved?", "In `models/nids_lstm_model.keras`."),
        ("33. Where are scalers saved?", "In `models/scaler.pkl` using Python pickle serialization."),
        ("34. Where are evaluation metrics stored?", "In `reports/latest_evaluation_report.json`."),
        ("35. What is the Audit Log?", "An immutable database table tracking user actions, logins, dataset uploads, and training runs."),
        ("36. Can audit logs be exported?", "Yes, via one-click CSV export on the dashboard."),
        ("37. What Python version is used?", "Python 3.11+."),
        ("38. What deep learning framework is used?", "TensorFlow 2.x with Keras API."),
        ("39. What is `app.py`?", "Application Factory initializing Flask, database, and blueprints."),
        ("40. What is `config.py`?", "Central configuration file storing secret keys, folder paths, and parameters."),
        ("41. How does frontend communicate with backend?", "Via asynchronous `fetch()` API calls sending JSON payloads and JWT headers."),
        ("42. What frontend framework is used?", "Bootstrap 5 for responsive CSS layout."),
        ("43. What charting library is used?", "Chart.js for rendering live loss/accuracy graphs."),
        ("44. How is training progress monitored live?", "Frontend polls `/api/model/status` every 1.5s to fetch current epoch metrics."),
        ("45. What is overfitting?", "When a model memorizes training data noise and performs poorly on unseen test data."),
        ("46. How do we prevent overfitting?", "Using 20% Dropout layers and Train/Test dataset splitting."),
        ("47. What is the default Train/Test split ratio?", "80% Training, 20% Testing."),
        ("48. What is `is_selected` in DatasetHistory?", "A boolean flag indicating which dataset is currently active for training."),
        ("49. Can common users delete datasets?", "No, dataset deletion requires Admin role protected by `@require_role(['Admin'])`."),
        ("50. What is the ultimate deliverable of Phase 1?", "A serialized `.keras` LSTM model, `.pkl` scaler, `.pkl` label encoder, and metric evaluation report.")
    ]

    for q, a in viva_qas:
        story.append(Paragraph(q, q_style))
        story.append(Paragraph(a, a_style))

    story.append(Spacer(1, 8))

    # =========================================================================
    # CHAPTER 15: PHASE 2 INTEGRATION PREVIEW
    # =========================================================================
    story.append(Paragraph("Chapter 15: Phase 2 Integration Preview", ch_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceBefore=0, spaceAfter=8))

    story.append(Paragraph(
        "<b>Explanation:</b> Phase 1 ends cleanly after the AI model (`nids_lstm_model.keras`) and scaler (`scaler.pkl`) are trained, evaluated, and serialized. In future Phase 2 development, a live packet sniffer engine (e.g. Scapy or raw sockets) can be added as a separate module. It will capture network traffic frames, extract identical features, scale them using `scaler.pkl`, and pass them into `nids_lstm_model.keras` for real-time attack detection without needing to alter any Phase 1 code!",
        body_style
    ))

    add_callout(
        "Final Study Summary",
        "Phase 1 provides the complete foundation: Zero Trust Security + Data Preprocessing + LSTM AI Model Training + Evaluation Metrics + SOC Dashboard. You are fully equipped to explain and defend every line of code!",
        BG_NOTE, BLUE
    )

    doc.build(story, canvasmaker=StudyGuideCanvas)
    print(f"Successfully generated Phase 1 Complete Study Guide PDF: {output_filename}")

if __name__ == "__main__":
    build_phase1_study_guide_pdf()
