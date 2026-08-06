import os
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
            self.drawString(54, 750, "AI-Powered Zero Trust NIDS — Phase 1 Simple Guide")
            self.drawRightString(558, 750, "Project Summary")
            self.setStrokeColor(colors.HexColor("#E5E7EB"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)

        # Footer
        self.setStrokeColor(colors.HexColor("#E5E7EB"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawString(54, 30, "Cybersecurity Engineering Final-Year Project • Phase 1 Summary")
        self.drawRightString(558, 30, page_text)
        self.restoreState()

def create_simple_phase1_pdf(output_filename="Zero_Trust_NIDS_Phase1_Simple_Guide.pdf"):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    NAVY = colors.HexColor("#0B2D5C")
    BLUE = colors.HexColor("#2563EB")
    TEXT_DARK = colors.HexColor("#111827")
    BG_LIGHT = colors.HexColor("#F6F8FC")
    BORDER_COLOR = colors.HexColor("#E5E7EB")

    title_style = ParagraphStyle('DocTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=22, leading=26, textColor=NAVY, spaceAfter=8)
    subtitle_style = ParagraphStyle('DocSubtitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, leading=15, textColor=BLUE, spaceAfter=15)
    h1_style = ParagraphStyle('Heading1_Custom', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=NAVY, spaceBefore=14, spaceAfter=6, keepWithNext=True)
    h2_style = ParagraphStyle('Heading2_Custom', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, leading=15, textColor=BLUE, spaceBefore=10, spaceAfter=4, keepWithNext=True)
    body_style = ParagraphStyle('Body_Custom', parent=styles['Normal'], fontName='Helvetica', fontSize=9.5, leading=13.5, textColor=TEXT_DARK, spaceAfter=8)
    bullet_style = ParagraphStyle('Bullet_Custom', parent=body_style, leftIndent=15, firstLineIndent=-10, spaceAfter=4)
    table_header_style = ParagraphStyle('TableHeader', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=NAVY)
    table_cell_style = ParagraphStyle('TableCell', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=11, textColor=TEXT_DARK)

    story = []

    # Title Header
    story.append(Paragraph("AI-Powered Zero Trust Network Intrusion Detection System", title_style))
    story.append(Paragraph("Phase 1 Project Overview & Guide (Explained in Simple Terms)", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=BLUE, spaceBefore=0, spaceAfter=12))

    # Summary Box
    meta_data = [
        [Paragraph("<b>Project Goal:</b> Detect computer network attacks automatically", body_style), Paragraph("<b>Phase Status:</b> Phase 1 Completed (100%)", body_style)],
        [Paragraph("<b>Security Rule:</b> Zero Trust ('Never Trust, Always Verify')", body_style), Paragraph("<b>AI Brain:</b> Keras LSTM Neural Network", body_style)],
        [Paragraph("<b>User Interface:</b> Full-Width Web Dashboard", body_style), Paragraph("<b>Year:</b> 2026", body_style)]
    ]
    meta_table = Table(meta_data, colWidths=[250, 250])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))

    # 1. What is this project?
    story.append(Paragraph("1. What is This Project? (Simple Explanation)", h1_style))
    story.append(Paragraph(
        "Think of a company office building. Traditional computer security is like having a security guard at the front door. If a bad guy steals a worker's ID card, the guard lets them inside. Once inside, the thief can freely walk into any office room, look at secret files, or damage equipment without anyone stopping them.",
        body_style
    ))
    story.append(Paragraph(
        "Our project changes this completely by building an <b>AI-Powered Zero Trust System</b>:",
        body_style
    ))
    
    p1 = [
        "<b>Zero Trust Rule ('Never Trust, Always Verify'):</b> Every door inside the building requires a fresh ID check. Even if you are inside, the system checks who you are and what you are allowed to do before letting you open any door.",
        "<b>AI Intelligent Security Camera:</b> We built an artificial intelligence (AI) brain that watches how network traffic moves. If it sees strange movement (like someone trying to open 100 doors per second), it immediately sounds an alarm!"
    ]
    for pt in p1:
        story.append(Paragraph(f"• {pt}", bullet_style))

    story.append(Spacer(1, 10))

    # 2. Key Features Built in Phase 1
    story.append(Paragraph("2. Main Features Built in Phase 1", h1_style))
    
    f_list = [
        "<b>1. Full-Width Security Dashboard:</b> A clean, easy-to-use web interface that shows system health cards, network statistics, and live activity.",
        "<b>2. User & Admin Login Portals:</b> Separate sign-in options for regular Users (viewing reports) and Admins (full control, uploading datasets, deleting files, and training models).",
        "<b>3. Dataset Management:</b> Ingests, cleans, and prepares network traffic files (NSL-KDD, UNSW-NB15, CICIDS2017, and Custom CSVs). Comes with 2 pre-installed test datasets out of the box!",
        "<b>4. Live Laptop Packet Sniffer:</b> Captures live network traffic straight from your laptop's network card and converts it into a dataset with just one click!",
        "<b>5. Deep Learning AI Engine (LSTM):</b> Trains a smart neural network that learns network traffic patterns to catch attacks with over 98% accuracy.",
        "<b>6. Security Audit Trail:</b> Automatically records every login, dataset upload, dataset removal, and training run into an immutable event table with one-click CSV export."
    ]
    for f in f_list:
        story.append(Paragraph(f, bullet_style))

    story.append(Spacer(1, 10))

    # 3. How to Use the App Step-by-Step
    story.append(Paragraph("3. How to Use the System Step-by-Step", h1_style))

    steps_data = [
        [Paragraph("<b>Step Number</b>", table_header_style), Paragraph("<b>Action Name</b>", table_header_style), Paragraph("<b>What You Do in the App</b>", table_header_style)],
        [Paragraph("Step 1", table_cell_style), Paragraph("Sign In", table_cell_style), Paragraph("Go to login page. Choose <b>User Portal</b> or <b>Admin Portal</b> and sign in.", table_cell_style)],
        [Paragraph("Step 2", table_cell_style), Paragraph("Pick a Dataset", table_cell_style), Paragraph("Go to <b>Datasets</b>. Select one of the pre-installed test datasets, upload your own CSV, or use the <b>Live Sniffer</b> to record laptop traffic.", table_cell_style)],
        [Paragraph("Step 3", table_cell_style), Paragraph("Train AI Model", table_cell_style), Paragraph("Go to <b>Training</b>. Choose your target dataset and click <b>Start Training Model</b>. Watch live progress graphs!", table_cell_style)],
        [Paragraph("Step 4", table_cell_style), Paragraph("View Results", table_cell_style), Paragraph("Go to <b>Reports</b> to see Accuracy, Precision, F1-Score, and ROC Curve charts.", table_cell_style)],
        [Paragraph("Step 5", table_cell_style), Paragraph("Check Audit Logs", table_cell_style), Paragraph("Go to <b>Audit Logs</b> on Dashboard to see real-time security events and export them as CSV.", table_cell_style)]
    ]

    steps_table = Table(steps_data, colWidths=[65, 105, 330])
    steps_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(steps_table)
    story.append(Spacer(1, 10))

    # 4. Key Terms Explained Simply
    story.append(Paragraph("4. Key Concepts Explained in Plain English", h1_style))

    terms = [
        "<b>Zero Trust:</b> A security rule that says 'never assume anyone is safe'. Every request is checked before allowing access.",
        "<b>JWT Token:</b> A digital security wristband given to you when you log in. It proves who you are on every page.",
        "<b>RBAC (Role-Based Access Control):</b> A rule system that gives Admins full power while limiting regular Users to safe actions.",
        "<b>LSTM Neural Network:</b> A type of artificial intelligence brain that remembers time sequence patterns to spot strange network behaviors.",
        "<b>Bcrypt Hashing:</b> A digital vault that locks up user passwords safely so nobody can steal them."
    ]
    for t in terms:
        story.append(Paragraph(f"• {t}", bullet_style))

    story.append(Spacer(1, 10))

    # 5. Phase 1 Deliverables Summary Table
    story.append(Paragraph("5. Phase 1 Completion Checklist", h1_style))

    deliv_data = [
        [Paragraph("<b>Phase 1 Goal</b>", table_header_style), Paragraph("<b>Status</b>", table_header_style), Paragraph("<b>Implementation Result</b>", table_header_style)],
        [Paragraph("Zero Trust Network Architecture", table_cell_style), Paragraph("<font color='#16A34A'><b>COMPLETED</b></font>", table_cell_style), Paragraph("JWT token authentication + Bcrypt encryption + RBAC security", table_cell_style)],
        [Paragraph("Dataset Management Module", table_cell_style), Paragraph("<font color='#16A34A'><b>COMPLETED</b></font>", table_cell_style), Paragraph("Supports NSL-KDD, UNSW-NB15, CICIDS2017, Custom CSVs + Add/Delete controls", table_cell_style)],
        [Paragraph("Live Laptop Packet Capturing", table_cell_style), Paragraph("<font color='#16A34A'><b>COMPLETED</b></font>", table_cell_style), Paragraph("Live Scapy packet sniffer capturing laptop network traffic to CSV dataset", table_cell_style)],
        [Paragraph("AI Intrusion Detection Model", table_cell_style), Paragraph("<font color='#16A34A'><b>COMPLETED</b></font>", table_cell_style), Paragraph("Keras LSTM sequence neural network with background execution & status polling", table_cell_style)],
        [Paragraph("Enterprise SOC Web Dashboard", table_cell_style), Paragraph("<font color='#16A34A'><b>COMPLETED</b></font>", table_cell_style), Paragraph("Full-width top navigation layout, telemetry cards & audit log CSV exporter", table_cell_style)]
    ]

    deliv_table = Table(deliv_data, colWidths=[140, 80, 280])
    deliv_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(deliv_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated Simple Phase 1 PDF report: {output_filename}")

if __name__ == "__main__":
    create_simple_phase1_pdf()
