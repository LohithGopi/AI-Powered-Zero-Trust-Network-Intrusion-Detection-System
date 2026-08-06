import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
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
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#6B7280"))
        
        # Header (Skip on Page 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "AI-Powered Zero Trust Network Intrusion Detection System")
            self.drawRightString(558, 750, "System Architecture Report")
            self.setStrokeColor(colors.HexColor("#E5E7EB"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)

        # Footer
        self.setStrokeColor(colors.HexColor("#E5E7EB"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawString(54, 30, "Confidential — Cybersecurity Engineering Research Project")
        self.drawRightString(558, 30, page_text)
        self.restoreState()

def create_architecture_pdf(output_filename="Zero_Trust_NIDS_Architecture_Report.pdf"):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    NAVY = colors.HexColor("#0B2D5C")
    BLUE = colors.HexColor("#2563EB")
    TEXT_DARK = colors.HexColor("#111827")
    TEXT_MUTED = colors.HexColor("#6B7280")
    BG_LIGHT = colors.HexColor("#F6F8FC")
    BORDER_COLOR = colors.HexColor("#E5E7EB")

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=NAVY,
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=BLUE,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=NAVY,
        spaceBefore=16,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=BLUE,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_DARK,
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=NAVY
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=TEXT_DARK
    )

    story = []

    # Title Banner Block
    story.append(Paragraph("AI-Powered Zero Trust Network Intrusion Detection System", title_style))
    story.append(Paragraph("Comprehensive System Architecture & Technical Specification Report — Phase 1", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=BLUE, spaceBefore=0, spaceAfter=15))

    # Meta Metadata Box
    meta_data = [
        [Paragraph("<b>Project Title:</b> Zero Trust NIDS", body_style), Paragraph("<b>Target OS:</b> Windows 10/11", body_style)],
        [Paragraph("<b>Architecture:</b> Flask + Keras LSTM + SQLite", body_style), Paragraph("<b>Security Standard:</b> JWT + Bcrypt + RBAC", body_style)],
        [Paragraph("<b>Author:</b> Senior Cybersecurity AI Engineer", body_style), Paragraph("<b>Academic Year:</b> 2026", body_style)]
    ]
    meta_table = Table(meta_data, colWidths=[250, 250])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 15))

    # 1. Executive Summary
    story.append(Paragraph("1. Executive Summary & Project Scope", h1_style))
    story.append(Paragraph(
        "Modern enterprise cybersecurity infrastructure faces unprecedented challenges from insider threats, credential theft, and sophisticated zero-day lateral movement. Traditional perimeter-based defenses ('castle-and-moat') fail when adversaries gain internal access. This project implements <b>Phase 1</b> of an enterprise-grade <b>AI-Powered Zero Trust Network Intrusion Detection System (Zero Trust NIDS)</b>.",
        body_style
    ))
    story.append(Paragraph(
        "The system combines a strict <b>Zero Trust Access Control Architecture</b> ('Never Trust, Always Verify') with a <b>Deep Learning Long Short-Term Memory (LSTM) Neural Network</b>. It ingests complex network traffic benchmarks (such as NSL-KDD, UNSW-NB15, and CICIDS2017), executes automated data cleaning and normalization, trains sequence detection models, and renders real-time telemetry on an enterprise Security Operations Center (SOC) dashboard.",
        body_style
    ))

    # 2. System Architecture Overview
    story.append(Paragraph("2. Multi-Tier System Architecture", h1_style))
    story.append(Paragraph(
        "The application is built using a highly modular multi-tier Python software architecture engineered for production reliability on Windows environments:",
        body_style
    ))

    arch_data = [
        [Paragraph("<b>Layer</b>", table_header_style), Paragraph("<b>Technologies & Components</b>", table_header_style), Paragraph("<b>Architectural Function</b>", table_header_style)],
        [
            Paragraph("<b>Presentation Layer</b>", table_cell_style),
            Paragraph("HTML5, Bootstrap 5, Vanilla JS, Inter Font, Chart.js", table_cell_style),
            Paragraph("Full-width enterprise SOC dashboard with top navigation bar, active link indicator, KPI telemetry cards, and real-time Chart.js training graphs.", table_cell_style)
        ],
        [
            Paragraph("<b>Security & Middleware Layer</b>", table_cell_style),
            Paragraph("PyJWT, Bcrypt, Zero Trust Decorators", table_cell_style),
            Paragraph("Enforces stateless JWT session tokens, role-based authorization (@require_role), password encryption, and immutable audit logging.", table_cell_style)
        ],
        [
            Paragraph("<b>Business & API Layer</b>", table_cell_style),
            Paragraph("Flask Blueprints (Auth, Dataset, Model)", table_cell_style),
            Paragraph("Handles RESTful route dispatching, dataset upload validation, dataset removal, and asynchronous background training coordination.", table_cell_style)
        ],
        [
            Paragraph("<b>AI / ML Core Layer</b>", table_cell_style),
            Paragraph("TensorFlow / Keras, Scikit-Learn, Pandas, NumPy", table_cell_style),
            Paragraph("Performs data imputation, LabelEncoding, StandardScaler normalization, and fits a 3D sequence LSTM neural network model.", table_cell_style)
        ],
        [
            Paragraph("<b>Database Layer</b>", table_cell_style),
            Paragraph("SQLite 3, Flask-SQLAlchemy ORM", table_cell_style),
            Paragraph("Stores persistent entities: Users, Roles, DatasetHistory, ModelHistory, and Security Audit Logs.", table_cell_style)
        ]
    ]

    arch_table = Table(arch_data, colWidths=[100, 160, 240])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 15))

    # 3. Zero Trust Security Framework
    story.append(Paragraph("3. Zero Trust Security Framework & Enforcement", h1_style))
    story.append(Paragraph(
        "The security model is structured around four fundamental Zero Trust pillars to guarantee non-repudiation, session integrity, and strict access isolation:",
        body_style
    ))

    zt_points = [
        "<b>Explicit Authentication (Stateless JWT Tokens):</b> Upon successful sign-in, the system issues a cryptographically signed JSON Web Token (JWT) with a 2-hour expiration TTL. Every API request must supply this token via the <code>Authorization: Bearer &lt;token&gt;</code> header.",
        "<b>Least Privilege & Role-Based Access Control (RBAC):</b> System access is partitioned into explicit roles (<code>Admin</code>, <code>Analyst</code>, <code>User</code>). Critical administrative actions—such as dataset removal and neural network training—are guarded by the <code>@require_role(['Admin'])</code> decorator.",
        "<b>Continuous Security Audit Trail:</b> Every authentication attempt, dataset upload, dataset deletion, and model execution is logged in real time to the SQLite <code>audit_logs</code> table with exact UTC timestamps, username, client IP address, action code, and status badges (<code>SUCCESS</code>, <code>REJECTED</code>, <code>FAILED</code>).",
        "<b>Data Protection & Password Hashing:</b> Passwords are salted and hashed using <code>bcrypt</code> (12 work factor rounds) before database insertion. Plaintext credentials are never stored or logged."
    ]

    for pt in zt_points:
        story.append(Paragraph(f"• {pt}", bullet_style))

    story.append(Spacer(1, 15))

    # 4. Dataset Management & Preprocessing Pipeline
    story.append(Paragraph("4. Dataset Management & Data Preprocessing Pipeline", h1_style))
    story.append(Paragraph(
        "The system features a robust dataset ingestion module designed to process tabular network traffic logs. It natively supports benchmark schemas such as <b>NSL-KDD</b>, <b>UNSW-NB15</b>, <b>CICIDS2017</b>, and <b>Custom CSVs</b>.",
        body_style
    ))
    story.append(Paragraph("The multi-stage preprocessing workflow operates as follows:", body_style))

    prep_steps = [
        "<b>Automated Schema Standardisation:</b> Auto-detects headers or maps benchmark-specific column aliases to a unified target column <code>label</code>.",
        "<b>Deduplication & Missing Value Imputation:</b> Identifies duplicate rows and replaces missing numerical values with column medians while removing unparseable records.",
        "<b>Categorical Encoding:</b> Uses Scikit-Learn <code>LabelEncoder</code> to transform categorical protocol types (e.g. TCP, UDP, ICMP) and flag attributes into numeric vectors.",
        "<b>Feature Scaling:</b> Applies <code>StandardScaler</code> to scale continuous flow attributes (duration, bytes sent, packet rates) to zero mean and unit variance.",
        "<b>Sequence Reshaping for LSTM:</b> Reshapes tabular 2D arrays <code>(samples, features)</code> into 3D sequence tensors <code>(samples, 1, features)</code> suitable for recurrent time-series input."
    ]

    for st in prep_steps:
        story.append(Paragraph(f"1. {st}", bullet_style))

    story.append(Spacer(1, 15))

    # 5. AI Intrusion Detection Model Topology
    story.append(Paragraph("5. AI Model Topology & Asynchronous Training Engine", h1_style))
    story.append(Paragraph(
        "Intrusion detection is performed by a Deep Learning <b>Long Short-Term Memory (LSTM)</b> neural network built on TensorFlow / Keras:",
        body_style
    ))

    model_data = [
        [Paragraph("<b>Layer Index</b>", table_header_style), Paragraph("<b>Layer Type</b>", table_header_style), Paragraph("<b>Shape / Parameters</b>", table_header_style), Paragraph("<b>Activation / Function</b>", table_header_style)],
        [Paragraph("Input Layer", table_cell_style), Paragraph("InputSpec", table_cell_style), Paragraph("(Batch Size, 1, Num Features)", table_cell_style), Paragraph("Linear Pass-through", table_cell_style)],
        [Paragraph("Layer 1", table_cell_style), Paragraph("LSTM Layer", table_cell_style), Paragraph("64 Recurrent Units", table_cell_style), Paragraph("tanh / sigmoid recurrent", table_cell_style)],
        [Paragraph("Layer 2", table_cell_style), Paragraph("Dropout", table_cell_style), Paragraph("Rate = 0.2", table_cell_style), Paragraph("Overfitting Regularization", table_cell_style)],
        [Paragraph("Layer 3", table_cell_style), Paragraph("Dense Hidden", table_cell_style), Paragraph("32 Units", table_cell_style), Paragraph("ReLU", table_cell_style)],
        [Paragraph("Output Layer", table_cell_style), Paragraph("Dense Softmax", table_cell_style), Paragraph("N Attack Classes", table_cell_style), Paragraph("Softmax Probability Vector", table_cell_style)]
    ]

    model_table = Table(model_data, colWidths=[80, 110, 160, 150])
    model_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(model_table)
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "<b>Asynchronous Execution:</b> Model training runs in a background daemon thread (preventing UI blocking) while the client polls <code>/api/model/status</code> every 1.5 seconds to render live epoch progression on Chart.js line graphs.",
        body_style
    ))

    story.append(Spacer(1, 15))

    # 6. REST API Matrix
    story.append(Paragraph("6. RESTful API Endpoint Matrix", h1_style))
    
    api_data = [
        [Paragraph("<b>HTTP Method</b>", table_header_style), Paragraph("<b>Endpoint Route</b>", table_header_style), Paragraph("<b>Role Access</b>", table_header_style), Paragraph("<b>Description & Function</b>", table_header_style)],
        [Paragraph("POST", table_cell_style), Paragraph("<code>/api/login</code>", table_cell_style), Paragraph("Public", table_cell_style), Paragraph("Authenticates credentials, returns signed JWT token.", table_cell_style)],
        [Paragraph("POST", table_cell_style), Paragraph("<code>/api/register</code>", table_cell_style), Paragraph("Public", table_cell_style), Paragraph("Registers new user and assigns RBAC role.", table_cell_style)],
        [Paragraph("POST", table_cell_style), Paragraph("<code>/api/dataset/upload</code>", table_cell_style), Paragraph("Admin, Analyst", table_cell_style), Paragraph("Uploads and parses CSV dataset into storage.", table_cell_style)],
        [Paragraph("DELETE", table_cell_style), Paragraph("<code>/api/dataset/delete/&lt;id&gt;</code>", table_cell_style), Paragraph("Admin Only", table_cell_style), Paragraph("Removes CSV file from disk and deletes DB record.", table_cell_style)],
        [Paragraph("POST", table_cell_style), Paragraph("<code>/api/dataset/select</code>", table_cell_style), Paragraph("Admin, Analyst", table_cell_style), Paragraph("Marks chosen dataset as active target for ML pipeline.", table_cell_style)],
        [Paragraph("POST", table_cell_style), Paragraph("<code>/api/train</code>", table_cell_style), Paragraph("Admin, Analyst", table_cell_style), Paragraph("Triggers preprocessing and starts background LSTM training.", table_cell_style)],
        [Paragraph("GET", table_cell_style), Paragraph("<code>/api/model/status</code>", table_cell_style), Paragraph("All Auth Users", table_cell_style), Paragraph("Returns current training metrics (loss, accuracy, ETA).", table_cell_style)],
        [Paragraph("GET", table_cell_style), Paragraph("<code>/api/model/report</code>", table_cell_style), Paragraph("All Auth Users", table_cell_style), Paragraph("Returns evaluation report (matrix, ROC AUC, F1 scores).", table_cell_style)]
    ]

    api_table = Table(api_data, colWidths=[65, 140, 85, 210])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(api_table)
    story.append(Spacer(1, 15))

    # 7. User Interface & Dashboard Specification
    story.append(Paragraph("7. User Interface & SOC Dashboard Layout", h1_style))
    story.append(Paragraph(
        "The application features a full-width enterprise interface designed for high-density SOC monitoring:",
        body_style
    ))
    ui_points = [
        "<b>Top Horizontal Navigation Bar:</b> Replaces restrictive sidebars with a sticky navigation bar featuring active blue underline indicators, search input, system notification center, and role badges (<code>ADMIN PORTAL</code> vs <code>USER PORTAL</code>).",
        "<b>Telemetry KPI Cards:</b> 6 real-time stat cards displaying Uploaded Datasets count, Active Dataset, Model Status, Architecture Type, Training Accuracy, and Last Training Date.",
        "<b>Security Audit Log Feed:</b> Full-width activity table equipped with instant client-side search filtering and one-click <b>Export CSV</b> audit report generation."
    ]
    for up in ui_points:
        story.append(Paragraph(f"• {up}", bullet_style))

    story.append(Spacer(1, 15))

    # 8. Conclusion & Phase 2 Roadmap
    story.append(Paragraph("8. Conclusion & Phase 2 Technical Roadmap", h1_style))
    story.append(Paragraph(
        "Phase 1 successfully establishes a complete, production-ready foundation combining Zero Trust security middleware with deep learning intrusion detection. The modular Python codebase guarantees smooth execution on Windows operating systems using Visual Studio Code.",
        body_style
    ))
    story.append(Paragraph("<b>Phase 2 Development Objectives:</b>", body_style))
    p2_points = [
        "<b>Live Packet Capture:</b> Integration of WinPcap / Scapy for real-time network interface sniffing.",
        "<b>Automated Firewall Rule Enforcement:</b> Dynamic Generation of Windows Firewall (netsh) IP blocking rules upon attack detection.",
        "<b>Distributed Cloud Deployment:</b> Containerization via Docker and Kubernetes orchestration."
    ]
    for p2 in p2_points:
        story.append(Paragraph(f"• {p2}", bullet_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF report: {output_filename}")

if __name__ == "__main__":
    create_architecture_pdf()
