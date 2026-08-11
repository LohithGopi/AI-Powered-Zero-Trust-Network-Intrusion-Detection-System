import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable, Image
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
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
        self.setFillColor(colors.HexColor("#475569"))

        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 750, "Zero Trust AI-NIDS — Phase 1 System Architecture Document")
            self.drawRightString(558, 750, "Academic Project Technical Report")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.75)
            self.line(54, 742, 558, 742)

        # Footer (All Pages)
        self.setFont("Helvetica", 8.5)
        self.setFillColor(colors.HexColor("#64748B"))
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(54, 45, 558, 45)
        
        self.drawString(54, 30, "Department of Computer Science & Cybersecurity • Final-Year Engineering Project")
        self.drawRightString(558, 30, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_phase1_architecture_pdf(output_filename="Zero_Trust_NIDS_Phase1_Architecture_Report.pdf"):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    NAVY = colors.HexColor("#0F172A")
    BLUE = colors.HexColor("#1D4ED8")
    SLATE_DARK = colors.HexColor("#1E293B")
    TEXT_MAIN = colors.HexColor("#334155")
    BG_LIGHT = colors.HexColor("#F8FAFC")
    BORDER_COLOR = colors.HexColor("#E2E8F0")
    ACCENT_BLUE = colors.HexColor("#EFF6FF")

    title_style = ParagraphStyle('DocTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=20, leading=24, textColor=NAVY, spaceAfter=6)
    subtitle_style = ParagraphStyle('DocSubtitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10.5, leading=14, textColor=BLUE, spaceAfter=12)
    h1_style = ParagraphStyle('Heading1_Custom', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=13, leading=16, textColor=NAVY, spaceBefore=14, spaceAfter=6, keepWithNext=True)
    h2_style = ParagraphStyle('Heading2_Custom', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10.5, leading=14, textColor=BLUE, spaceBefore=10, spaceAfter=4, keepWithNext=True)
    body_style = ParagraphStyle('Body_Custom', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=13, textColor=TEXT_MAIN, spaceAfter=6)
    bullet_style = ParagraphStyle('Bullet_Custom', parent=body_style, leftIndent=12, firstLineIndent=-8, spaceAfter=4)
    code_style = ParagraphStyle('Code_Custom', parent=styles['Normal'], fontName='Courier', fontSize=8, leading=10.5, textColor=NAVY)
    table_header_style = ParagraphStyle('TableHeader', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=NAVY)
    table_cell_style = ParagraphStyle('TableCell', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=11, textColor=TEXT_MAIN)

    story = []

    # Title & Header
    story.append(Paragraph("Zero Trust AI-Powered Network Intrusion Detection System", title_style))
    story.append(Paragraph("Phase 1 Complete System Architecture & Component Design Report", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=BLUE, spaceBefore=0, spaceAfter=10))

    # Meta Overview Box
    meta_data = [
        [Paragraph("<b>Project Title:</b> AI Zero Trust NIDS (Phase 1)", body_style), Paragraph("<b>Domain:</b> Cybersecurity & Deep Learning", body_style)],
        [Paragraph("<b>Core Algorithm:</b> Keras LSTM Neural Network", body_style), Paragraph("<b>Security Framework:</b> Zero Trust (JWT + RBAC)", body_style)],
        [Paragraph("<b>Backend Tech:</b> Python Flask, SQLite, Scikit-Learn", body_style), Paragraph("<b>Frontend:</b> Bootstrap 5 Enterprise Dashboard", body_style)]
    ]
    meta_table = Table(meta_data, colWidths=[250, 250])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), ACCENT_BLUE),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#BFDBFE")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # Section 1: Executive Overview & Problem Statement
    story.append(Paragraph("1. Executive Overview & Problem Statement", h1_style))
    story.append(Paragraph(
        "Modern enterprise networks face constant security threats ranging from Denial of Service (DoS) attacks to stealthy network probing. Traditional perimeter-based security systems follow an outdated model: once a connection passes the outer firewall, it is treated as inherently trusted. This creates a severe security vulnerability.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Phase 1 Project Objective:</b> This project implements a comprehensive Phase 1 artificial intelligence platform combining a <b>Zero Trust Architecture</b> ('Never Trust, Always Verify') with a deep learning <b>Long Short-Term Memory (LSTM)</b> neural network to preprocess network traffic datasets, engineer features, train high-accuracy detection models, and evaluate intrusion patterns.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # Section 2: End-to-End System Architecture Diagram & Dataflow
    story.append(Paragraph("2. System Architecture & Dataflow Diagram", h1_style))
    story.append(Paragraph(
        "The architecture is divided into five clean, decoupled layers. Below is the graphical architecture flow from client interaction to model artifact generation:",
        body_style
    ))

    # Path to generated architecture diagram image
    diagram_path = r"C:\Users\hp\.gemini\antigravity\brain\eba597bf-0f24-40fb-b693-db31b50253de\system_architecture_diagram_1786015184571.png"
    if os.path.exists(diagram_path):
        img = Image(diagram_path, width=480, height=270)
        story.append(img)
        story.append(Spacer(1, 8))

    arch_diagram_text = """
+-----------------------------------------------------------------------------------+
|                            USER & ADMIN WEB BROWSERS                              |
|            (Bootstrap 5 Dashboard / Dataset Controls / Training Panel)            |
+-----------------------------------------+-----------------------------------------+
                                          | HTTP REST APIs (JSON / JWT Headers)
                                          v
+-----------------------------------------------------------------------------------+
|                        ZERO TRUST SECURITY & RBAC LAYER                           |
|      - JWT Token Verification (HS256)     - Bcrypt Password Hash Verification      |
|      - Role-Based Access Control (@require_role)  - Audit Logger Middleware       |
+-----------------------------------------+-----------------------------------------+
                                          | Authenticated Requests
                                          v
+-----------------------------------------------------------------------------------+
|                           DATA MANAGEMENT & PREPROCESSING                         |
|   - Ingestion: NSL-KDD / UNSW-NB15 / Custom CSVs  - Data Imputation & Cleaning    |
|   - Label Encoding (Scikit-Learn)                 - StandardScaler Normalization  |
+-----------------------------------------+-----------------------------------------+
                                          | Cleaned 3D Tensor Batches
                                          v
+-----------------------------------------------------------------------------------+
|                       KERAS LSTM DEEP LEARNING MODEL ENGINE                       |
|   - Sequential Model Architecture                 - LSTM Layer (64 Hidden Units)  |
|   - Dropout Layer (Rate: 0.2)                     - Dense Output (Softmax/Sigmoid)|
|   - Optimization: Adam / Categorical Cross-Entropy - Real-Time Epoch Polling      |
+-----------------------------------------+-----------------------------------------+
                                          | Model Artifact Exports
                                          v
+-----------------------------------------------------------------------------------+
|                             PHASE 1 FINAL ARTIFACTS                               |
|   - Trained Model (.keras)                        - StandardScaler (.pkl)         |
|   - Label Encoder (.pkl)                          - Metric Evaluation (.json)     |
+-----------------------------------------------------------------------------------+
    """
    
    diagram_table = Table([[Paragraph(f"<pre>{arch_diagram_text.strip()}</pre>", code_style)]], colWidths=[500])
    diagram_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(diagram_table)
    story.append(Spacer(1, 10))

    # Section 3: Detailed Breakdown of Core Modules
    story.append(Paragraph("3. Detailed Breakdown of Main Modules", h1_style))

    # Submodule 3.1
    story.append(Paragraph("Module 1: Zero Trust Security & Authentication Framework", h2_style))
    story.append(Paragraph(
        "<b>Simple Explanation:</b> Zero Trust means the web application never assumes a request is safe just because a user logged in earlier. Every single page load and API call is checked for identity and permissions.",
        body_style
    ))
    story.append(Paragraph("Key Components:", body_style))
    story.append(Paragraph("• <b>JWT (JSON Web Tokens):</b> Upon successful login, the server issues a cryptographically signed JWT token stored in browser localStorage. Every request sends this token in the Authorization header.", bullet_style))
    story.append(Paragraph("• <b>Bcrypt Password Vault:</b> Passwords are never stored as plain text. They are salted and hashed using Bcrypt with a high work factor.", bullet_style))
    story.append(Paragraph("• <b>Role-Based Access Control (RBAC):</b> Users are assigned roles (Admin vs Common User). Sensitive actions like deleting datasets or initiating model training are restricted to Admin users via Flask decorators.", bullet_style))

    story.append(Spacer(1, 6))

    # Submodule 3.2
    story.append(Paragraph("Module 2: Dataset Catalog & Ingestion Engine", h2_style))
    story.append(Paragraph(
        "<b>Simple Explanation:</b> This module handles loading, storing, and organizing network intrusion benchmark datasets so the AI model can learn from them.",
        body_style
    ))
    story.append(Paragraph("Key Components:", body_style))
    story.append(Paragraph("• <b>Benchmark Support:</b> Out-of-the-box support for NSL-KDD, UNSW-NB15, CICIDS2017, and user-uploaded custom CSV files.", bullet_style))
    story.append(Paragraph("• <b>Database Catalog:</b> SQLite ORM tracks metadata for every dataset including filename, file size (MB), row count, column count, upload timestamp, and active selection status.", bullet_style))
    story.append(Paragraph("• <b>Dataset Comparison:</b> Side-by-side comparison matrix allowing analysts to compare feature counts, sample sizes, and attack label distributions across datasets.", bullet_style))

    story.append(Spacer(1, 6))

    # Submodule 3.3
    story.append(Paragraph("Module 3: Preprocessing & Feature Engineering Pipeline", h2_style))
    story.append(Paragraph(
        "<b>Simple Explanation:</b> AI models cannot read raw text files directly. This pipeline cleans messy network data, converts text categories into numbers, scales values evenly, and shapes the data into 3D sequences for the neural network.",
        body_style
    ))
    story.append(Paragraph("Processing Steps:", body_style))
    story.append(Paragraph("1. <b>Data Cleaning:</b> Drops duplicate rows and imputes missing values using median statistics.", bullet_style))
    story.append(Paragraph("2. <b>Categorical Encoding:</b> Converts text columns (e.g. protocol_type: 'tcp', 'udp', 'icmp') into numerical integer values using Scikit-Learn LabelEncoder.", bullet_style))
    story.append(Paragraph("3. <b>Feature Normalization:</b> Scales numerical values (e.g. packet bytes ranging from 40 to 100,000) using StandardScaler so large numbers don't overwhelm small numbers.", bullet_style))
    story.append(Paragraph("4. <b>3D Tensor Reshaping:</b> Reshapes tabular data matrices from 2D shape (samples, features) into 3D time-sequence tensors (samples, 1, features) required by LSTM memory cells.", bullet_style))

    story.append(Spacer(1, 6))

    # Submodule 3.4
    story.append(Paragraph("Module 4: Keras LSTM Neural Network Engine", h2_style))
    story.append(Paragraph(
        "<b>Simple Explanation:</b> The LSTM (Long Short-Term Memory) is a specialized recurrent neural network (RNN) that excels at detecting patterns in sequential data over time.",
        body_style
    ))
    story.append(Paragraph("Model Neural Architecture:", body_style))

    lstm_arch_data = [
        [Paragraph("<b>Layer Index</b>", table_header_style), Paragraph("<b>Layer Type</b>", table_header_style), Paragraph("<b>Configuration / Parameters</b>", table_header_style), Paragraph("<b>Purpose</b>", table_header_style)],
        [Paragraph("Layer 1", table_cell_style), Paragraph("LSTM Layer", table_cell_style), Paragraph("64 Memory Units, input_shape=(1, features)", table_cell_style), Paragraph("Extracts temporal sequential patterns across network traffic attributes.", table_cell_style)],
        [Paragraph("Layer 2", table_cell_style), Paragraph("Dropout Layer", table_cell_style), Paragraph("Drop Rate = 0.20 (20%)", table_cell_style), Paragraph("Prevents model overfitting by randomly deactivating neurons during training.", table_cell_style)],
        [Paragraph("Layer 3", table_cell_style), Paragraph("Dense Layer", table_cell_style), Paragraph("32 Units, Activation = ReLU", table_cell_style), Paragraph("Learns high-level feature combinations from LSTM outputs.", table_cell_style)],
        [Paragraph("Layer 4", table_cell_style), Paragraph("Output Dense", table_cell_style), Paragraph("N Units, Activation = Softmax / Sigmoid", table_cell_style), Paragraph("Produces class probability distribution across normal vs attack classes.", table_cell_style)]
    ]
    lstm_table = Table(lstm_arch_data, colWidths=[65, 80, 165, 190])
    lstm_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(lstm_table)

    story.append(Spacer(1, 6))

    # Submodule 3.5
    story.append(Paragraph("Module 5: Model Evaluation & Performance Analytics", h2_style))
    story.append(Paragraph(
        "<b>Simple Explanation:</b> Once training completes, the system evaluates the trained model against a separate test dataset and computes standard mathematical metrics.",
        body_style
    ))
    story.append(Paragraph("Metrics Computed:", body_style))
    story.append(Paragraph("• <b>Accuracy:</b> Overall percentage of correctly classified traffic instances.", bullet_style))
    story.append(Paragraph("• <b>Precision & Recall:</b> Precision measures how many flagged attacks were real attacks; Recall measures what percentage of total attacks were successfully caught.", bullet_style))
    story.append(Paragraph("• <b>F1-Score:</b> Harmonic mean of Precision and Recall balancing false positives and false negatives.", bullet_style))
    story.append(Paragraph("• <b>Confusion Matrix & ROC Curve:</b> Visual metrics showing true positive vs false positive trade-offs.", bullet_style))

    story.append(Spacer(1, 6))

    # Submodule 3.6
    story.append(Paragraph("Module 6: Security Audit Logging & SOC Web Dashboard", h2_style))
    story.append(Paragraph(
        "<b>Simple Explanation:</b> Records every administrative and security event in an immutable database table. Provides a full-width executive SOC dashboard featuring KPI telemetry cards and a live-searchable audit trail with CSV export.",
        body_style
    ))

    story.append(Spacer(1, 10))

    # Section 4: Technology Stack Summary Table
    story.append(Paragraph("4. Complete Technology Stack Summary", h1_style))

    tech_data = [
        [Paragraph("<b>Component Layer</b>", table_header_style), Paragraph("<b>Technology Used</b>", table_header_style), Paragraph("<b>Role / Purpose in Phase 1 Architecture</b>", table_header_style)],
        [Paragraph("Web Framework", table_cell_style), Paragraph("Python Flask (3.11+)", table_cell_style), Paragraph("Application server hosting REST APIs and rendering Jinja2 web views.", table_cell_style)],
        [Paragraph("Deep Learning", table_cell_style), Paragraph("TensorFlow / Keras", table_cell_style), Paragraph("Constructs, compiles, trains, and serializes the 64-unit LSTM neural network.", table_cell_style)],
        [Paragraph("Machine Learning", table_cell_style), Paragraph("Scikit-Learn, NumPy, Pandas", table_cell_style), Paragraph("Executes dataset cleaning, LabelEncoding, StandardScaler normalization, and evaluation.", table_cell_style)],
        [Paragraph("Database", table_cell_style), Paragraph("SQLite & Flask-SQLAlchemy", table_cell_style), Paragraph("Stores user accounts, dataset inventory metadata, training runs, and audit logs.", table_cell_style)],
        [Paragraph("Security", table_cell_style), Paragraph("PyJWT & Bcrypt", table_cell_style), Paragraph("Handles cryptographically signed authentication tokens and password hashing.", table_cell_style)],
        [Paragraph("Frontend UI", table_cell_style), Paragraph("Bootstrap 5, Chart.js, HTML5/CSS3", table_cell_style), Paragraph("Full-width top navigation SOC dashboard, live progress graphs, and responsive cards.", table_cell_style)]
    ]
    tech_table = Table(tech_data, colWidths=[110, 140, 250])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(tech_table)

    story.append(Spacer(1, 10))

    # Section 5: Coordinator Presentation & Defense Q&A Guide
    story.append(Paragraph("5. Project Coordinator Presentation & Defense Q&A Guide", h1_style))
    story.append(Paragraph(
        "Use these simple, confident explanations when your coordinators or external examiners ask about the project architecture:",
        body_style
    ))

    qa_list = [
        ("Q1: Why did you choose LSTM over traditional algorithms like Decision Trees or Naive Bayes?",
         "<b>Answer:</b> Network traffic is sequential time-series data. Traditional algorithms treat each packet independently, ignoring time context. LSTM memory cells keep track of historical patterns, allowing the model to detect subtle multi-step probing and volumetric attack patterns over time."),
        
        ("Q2: How does the Zero Trust concept work in your web application?",
         "<b>Answer:</b> We do not rely on traditional server side-sessions. Instead, we issue cryptographically signed JWT tokens upon login. Every REST API endpoint inspects the incoming token and verifies the user's role (Admin vs User) before granting access, enforcing 'Never Trust, Always Verify' on every request."),

        ("Q3: What are the final output artifacts produced at the end of Phase 1?",
         "<b>Answer:</b> Phase 1 outputs four serialized files: (1) The trained Keras LSTM model (.keras), (2) The fitted StandardScaler (.pkl), (3) The fitted LabelEncoder (.pkl), and (4) The evaluation report metrics JSON (.json). These outputs represent a complete, ready-to-deploy intrusion detection model."),

        ("Q4: How do you handle missing values or non-numeric categorical data in network datasets?",
         "<b>Answer:</b> Our preprocessing module uses median statistical imputation for missing numerical fields. For categorical columns (like TCP/UDP protocol names), we apply Scikit-Learn LabelEncoding, followed by StandardScaler feature normalization to prevent large numerical values from skewing weight updates.")
    ]

    for q, a in qa_list:
        story.append(Paragraph(f"<b>{q}</b>", h2_style))
        story.append(Paragraph(a, body_style))
        story.append(Spacer(1, 4))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully re-generated Phase 1 Architecture PDF Report with embedded graphic: {output_filename}")

if __name__ == "__main__":
    build_phase1_architecture_pdf()
