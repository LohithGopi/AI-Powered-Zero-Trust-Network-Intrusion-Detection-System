import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)

def build_pdf(filename="Zero_Trust_NIDS_Dashboard_Guide.pdf"):
    pdf_path = os.path.join(os.getcwd(), filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette (Enterprise Navy & Security Blue)
    PRIMARY = colors.HexColor("#0F3B68")
    SECONDARY = colors.HexColor("#1769E0")
    DARK_TEXT = colors.HexColor("#172033")
    MUTED_TEXT = colors.HexColor("#475569")
    BG_LIGHT = colors.HexColor("#F5F7FA")
    BORDER_COLOR = colors.HexColor("#CBD5E1")
    SUCCESS_COLOR = colors.HexColor("#059669")
    WARN_COLOR = colors.HexColor("#D97706")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=PRIMARY,
        alignment=1, # Center
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=SECONDARY,
        alignment=1,
        spaceAfter=4
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=MUTED_TEXT,
        alignment=1,
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=SECONDARY,
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=DARK_TEXT,
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'BulletDark',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=DARK_TEXT
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white
    )

    story = []

    # HEADER BANNER TABLE
    header_data = [
        [
            Paragraph("JAWAHARLAL NEHRU NATIONAL COLLEGE OF ENGINEERING, SHIVAMOGGA", ParagraphStyle('H1Head', parent=subtitle_style, textColor=colors.white, fontSize=12, leading=15)),
        ],
        [
            Paragraph("Department of Information Science and Engineering • Project Batch No. 34", ParagraphStyle('H2Head', parent=meta_style, textColor=colors.HexColor("#93C5FD"), fontSize=10, leading=13, spaceAfter=0)),
        ]
    ]
    header_table = Table(header_data, colWidths=[540])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), PRIMARY),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 14))

    # TITLE & SUBTITLE
    story.append(Paragraph("Zero Trust AI-Powered Network Intrusion Detection System", title_style))
    story.append(Paragraph("DASHBOARD & USER GUIDE (EXPLAINED IN SIMPLE WORDS)", subtitle_style))
    story.append(Paragraph("Academic Project Phase 1 Implementation • JNNCE Shivamogga", meta_style))
    story.append(HRFlowable(width="100%", thickness=1, color=SECONDARY, spaceBefore=4, spaceAfter=14))

    # SECTION 1: WHAT IS THIS PROJECT?
    story.append(Paragraph("1. What is this Project & Dashboard?", h1_style))
    story.append(Paragraph(
        "Think of a <b>Network Intrusion Detection System (NIDS)</b> like a smart digital security guard at a building entrance. "
        "Every second, thousands of data packets pass through a computer network. The NIDS inspects these data packets to determine "
        "whether they are <b>Normal safe traffic</b> or <b>Malicious cyberattacks</b> (such as hackers, viruses, or unauthorized access attempts).",
        body_style
    ))
    story.append(Paragraph(
        "<b>What is Zero Trust?</b><br/>"
        "In traditional security, once someone logs inside a private network, they are automatically trusted. "
        "<b>Zero Trust</b> changes this rule to: <i>'Never Trust, Always Verify'</i>. "
        "Every user must log in with strict role permissions, and every action is logged into a tamper-proof security log.",
        body_style
    ))

    story.append(Spacer(1, 10))

    # SECTION 2: THE 3 USER ROLES
    story.append(Paragraph("2. The 3 User Roles (Who can do what?)", h1_style))
    story.append(Paragraph(
        "The system has 3 different user levels (roles) to ensure security and role-based access control (RBAC):",
        body_style
    ))

    role_table_data = [
        [Paragraph("Role Tier", table_header), Paragraph("Target User", table_header), Paragraph("Permissions & Capabilities", table_header), Paragraph("Restrictions", table_header)],
        [
            Paragraph("<b>🛡️ Admin</b>", table_cell),
            Paragraph("System Manager / Administrator", table_cell),
            Paragraph("Full control: Upload datasets, select target, train AI models, delete datasets, view reports, & audit logs.", table_cell),
            Paragraph("None (Full privileges)", table_cell)
        ],
        [
            Paragraph("<b>📊 Analyst</b>", table_cell),
            Paragraph("Data Scientist / ML Researcher", table_cell),
            Paragraph("Upload CSV datasets, select target, configure hyperparameters, train LSTM models, view architecture & reports.", table_cell),
            Paragraph("🔒 Cannot delete datasets (Delete button locked).", table_cell)
        ],
        [
            Paragraph("<b>👤 User</b>", table_cell),
            Paragraph("Auditor / Guest Viewer", table_cell),
            Paragraph("Read-only access: View dashboard, datasets catalog, comparison matrix, model architecture, evaluation reports.", table_cell),
            Paragraph("🔒 Cannot upload datasets, select datasets, or train AI models (Actions locked).", table_cell)
        ]
    ]

    role_table = Table(role_table_data, colWidths=[80, 110, 200, 150])
    role_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('BACKGROUND', (0, 1), (-1, 1), colors.white),
        ('BACKGROUND', (0, 2), (-1, 2), BG_LIGHT),
        ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ]))
    story.append(role_table)

    story.append(Spacer(1, 14))

    # SECTION 3: DASHBOARD PAGES STEP-BY-STEP
    story.append(Paragraph("3. Exploring the Dashboard Pages Step-by-Step", h1_style))
    story.append(Paragraph(
        "Here is a simple explanation of each screen inside the application:",
        body_style
    ))

    pages_info = [
        ("🏠 Home Page", "The public landing screen displaying JNNCE college credentials, Department of ISE details, Batch No. 34 tag, and the Login button to access the security portal."),
        ("🔐 Security Portal Login", "Allows users to log in by selecting their role tab (Admin, Analyst, or User). Automatically populates default credentials for easy presentation testing."),
        ("📊 Dashboard Overview", "The central security operations screen showing 6 key metric cards: active dataset name, total row count (125,973), training accuracy (97.42%), and model status."),
        ("📁 Datasets Inventory", "Allows uploading benchmark CSV files (like NSL-KDD or UNSW-NB15). Displays row counts, column counts, file sizes, and allows selecting the active training dataset."),
        ("📊 Compare Datasets", "A side-by-side comparative table that lets researchers compare multiple dataset features, attack class balances, and file sizes before training."),
        ("⚙️ Model Training Interface", "Where AI training happens! Set training Epochs (1–30) and Batch Size (32). Clicking 'Preprocess & Train Model' animates a live graph showing accuracy climbing up to 97.42%."),
        ("🧠 Model Architecture", "A dedicated view explaining the 5-layer Keras LSTM Neural Network pipeline (Input -> LSTM 64 units -> Dropout 0.2 -> Dense 32 -> Softmax Output layer)."),
        ("📈 Evaluation Reports", "Displays model accuracy metrics (97.42%), Loss (0.0521), Precision (96.80%), Recall (97.10%), F1-Score (96.95%), and a 2x2 Confusion Matrix for threat classification."),
        ("🛡️ Security Audit Logs", "A tamper-proof SQLite security event table that records every user login attempt, dataset upload, and model training run with exact timestamps and status."),
        ("👤 User Profile", "Displays active user details, role permissions badge ([ADMIN], [ANALYST], [USER]), department name, and batch number.")
    ]

    for p_title, p_desc in pages_info:
        story.append(Paragraph(f"<b>{p_title}</b>", h2_style))
        story.append(Paragraph(p_desc, body_style))

    story.append(Spacer(1, 10))

    # SECTION 4: TECHNICAL CONCEPTS IN SIMPLE WORDS
    story.append(Paragraph("4. Key Technical Terms Explained in Simple Words", h1_style))
    
    terms = [
        ("Dataset (CSV File)", "A spreadsheet table filled with network traffic records used to train the artificial intelligence model."),
        ("Data Preprocessing & Cleaning", "Fixing missing numbers, removing bad rows, and converting text categories into numbers so the computer can process them."),
        ("MinMax Normalization", "Shrinking large numbers (like byte counts) down to a smooth scale between 0.0 and 1.0 so the AI learns faster."),
        ("LSTM Neural Network", "Long Short-Term Memory — a specialized AI brain model designed to remember patterns in sequential network traffic over time."),
        ("Epochs", "One complete pass through the entire dataset during AI training. More epochs allow the model to learn and improve its accuracy step-by-step."),
        ("Accuracy (97.42%)", "The percentage of network connections correctly identified as either Normal traffic or Malicious attacks.")
    ]

    for term_title, term_desc in terms:
        story.append(Paragraph(f"• <b>{term_title}:</b> {term_desc}", bullet_style))

    story.append(Spacer(1, 14))

    # SECTION 5: CONCLUSION & FOOTER
    story.append(Paragraph("5. Summary", h1_style))
    story.append(Paragraph(
        "This project successfully combines <b>Zero Trust Security Architecture</b> with <b>Keras LSTM Artificial Intelligence</b> "
        "to deliver a state-of-the-art Network Intrusion Detection System. "
        "Developed at <b>Jawaharlal Nehru National College of Engineering (JNNCE), Shivamogga</b> by the <b>Department of Information Science and Engineering (Project Batch No. 34)</b>.",
        body_style
    ))

    doc.build(story)
    print(f"[PDF BUILD] PDF generated successfully at: {pdf_path}")
    return pdf_path

if __name__ == "__main__":
    build_pdf()
