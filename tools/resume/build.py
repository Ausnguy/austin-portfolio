"""Builds Austin's resume from the CNS General Resume Template.docx.

Keeps the template's page setup, fonts, section headers and bullet style; only the content changes.
Every claim comes from the previous resume or from src/data (experience, projects, profile).

Usage: python tools/resume/build.py "<template.docx>" "<output.docx>"
"""
import copy
import re
import sys

from docx import Document
from docx.enum.text import WD_TAB_ALIGNMENT
from docx.shared import Inches, Pt
from docx.text.paragraph import Paragraph

TEXT_WIDTH = Inches(7.5)  # 8.5in page minus the template's 0.5in margins
BODY_PT = 10  # the template's 12 pt is too large for one page of this content

HEADER = ('(346)-812-3285 | ausnguybusiness@gmail.com | Houston, TX | '
          'linkedin.com/in/austin-nguyen-business | ausnguy.github.io/austin-portfolio')

# (org, place, dates, title, bullets)
EXPERIENCE = [
    ('Hewlett Packard Enterprise (HPE)', 'Spring, TX', 'May 2026 – Present', 'Data Analyst Intern – Compensation & Equity', [
        'Built and own an automated BI pipeline (Power Query, SharePoint, Power BI, DAX) that consolidates 8 Workday datasets, replacing manual reporting and saving 7 Compensation Managers 10–12 hours per reporting cycle.',
        'Created a single source of truth in Power BI for pay guidelines, salary ranges and equity budgets across 66,000+ employee records, enabling faster compensation decisions.',
        'Engineered a modular Python forecasting pipeline (Pandas, scikit-learn, XGBoost) that backtests 8 statistical and ML models across 14 fiscal quarters and identified a $164M gap in projected channel sales.',
    ]),
    ('USI Insurance Services', 'Houston, TX', 'June 2025 – July 2025', 'Data Analytics Intern – Employee Benefits', [
        'Analyzed $1M+ in healthcare claims in Excel (cost trends, utilization, benchmarking) to support renewal strategies for 10+ employer clients.',
        'Standardized and validated 5,000+ row healthcare datasets through cleaning, normalization, reconciliation and QA checks.',
    ]),
    ('ToolAndMore LLC', 'Houston, TX', 'November 2023 – April 2024', 'Owner & Operator', [
        'Generated $75K+ in first-year revenue by launching and scaling an Amazon e-commerce business.',
        'Held 30%+ profit margins through ROI, sourcing and pricing analysis that guided purchasing and inventory restocking.',
    ]),
]

# (name, tools, dates, bullets)
PROJECTS = [
    ('Parvius: Parts Readiness System (CaseQuest 2026, team of 5)', 'Python, NumPy, TypeScript, Redis, React Native', 'October 2026', [
        'With a team of 5, built a failure-prediction model (logistic regression written from scratch in NumPy) that flagged 90 of 91 mechanical failures on unseen data (AUC 0.82), a median 1.5 days ahead.',
        'Recommended a spare-parts program modeled to avoid ~968 downtime hours a year, and shipped a live 3D operations console and engineer phone app sharing one state through a TypeScript/Redis API.',
    ]),
    ('Interdomain: Real-Time Routing Platform', 'Python, Kafka, PostgreSQL, Spark, FastAPI, Docker', 'October 2026 – Present', [
        'Built an end-to-end data platform that processes ~8.7K streaming events/sec from 23 monitoring locations worldwide.',
        'Eliminated a 19.6M-message backlog with batch ingestion, pre-aggregation and partitioned storage, cutting dashboard query latency >99% (13–27 s to 44–62 ms).',
    ]),
    ('MNIST Handwritten Digit Classifier', 'Python, PyTorch, NumPy', 'January 2026 – February 2026', [
        'Trained a PyTorch neural network that reached ~96–98% test accuracy on 10,000 held-out digit images.',
    ]),
]

# (name, place, dates, role, bullets)
PROGRAMS = [
    ('Bloomberg Decoded: Data', 'Princeton, NJ', 'August 2026', 'Selected participant (1 of 35 from 500+ applicants)', [
        'Traced anomalies and data issues in a 50,000+ record trading dataset using Python, Pandas, NumPy and Matplotlib.',
    ]),
    ('Carnegie Mellon University, Tepper School of Business', 'Pittsburgh, PA', 'May 2025', 'Business Analytics Summer Summit', [
        'Built decision tree and random forest churn models in Python and Tableau dashboards on U.S. criminal justice data.',
    ]),
]

EDUCATION_LINES = [
    'B.B.A. in Management Information Systems',
    'GPA: 3.9 | Dean’s List: Fall 2023 – Fall 2026',
    '**Relevant Coursework:** Data Programming, Database Management Systems, Systems Analysis & Design, Business Statistics',
]

SKILLS = [
    ('Languages', 'SQL, Python (Pandas, NumPy, PyTorch, Matplotlib), Java, R, JavaScript, React'),
    ('Data & Analytics', 'Power BI, DAX, Tableau, Excel (Pivot Tables, VLOOKUP), KPI reporting'),
    ('Tools & Concepts', 'Kafka, Spark, PostgreSQL, Docker, AWS, DynamoDB, Linux, Git/GitHub, Agile, SLURM/HPC'),
    ('Certifications', 'Databricks Fundamentals, SQL (Intermediate) – HackerRank, Programming in Python – HPE'),
]

AWARDS = ['Ted Bauer Scholarship', 'Lockheed Martin Vocational Scholarship', 'George Foundation Scholarship']


def clear(par):
    for child in list(par._p):
        if child.tag.endswith('}r') or child.tag.endswith('}hyperlink'):
            par._p.remove(child)


def add_runs(par, text, italic=False, bold=False):
    """Adds runs to a paragraph; **text** is bold."""
    for i, part in enumerate(re.split(r'\*\*(.+?)\*\*', text)):
        if not part:
            continue
        run = par.add_run(part)
        run.bold = True if (i % 2 == 1 or bold) else None
        run.italic = True if italic else None
        run.font.size = Pt(BODY_PT)


def main(template, output):
    doc = Document(template)
    body = doc.element.body
    src = doc.paragraphs
    proto = {
        'name': src[0], 'contact': src[1], 'section': src[3], 'org': src[12], 'title': src[13],
        'bullet': src[14], 'plain': src[37], 'edu_bullet': src[6],
    }
    proto = {k: copy.deepcopy(v._p) for k, v in proto.items()}
    sect = body.sectPr
    for par in src:
        body.remove(par._p)

    def new(kind):
        el = copy.deepcopy(proto[kind])
        sect.addprevious(el)
        par = Paragraph(el, doc._body)
        clear(par)
        fmt = par.paragraph_format
        fmt.line_spacing = 1.0
        fmt.space_after = Pt(1.5 if kind in ('bullet', 'edu_bullet') else 0)
        fmt.space_before = Pt(5 if kind == 'section' else (3 if kind == 'org' else 0))
        return par

    def right_tab(par):
        par.paragraph_format.tab_stops.clear_all()
        par.paragraph_format.tab_stops.add_tab_stop(TEXT_WIDTH, WD_TAB_ALIGNMENT.RIGHT)

    def section(name):
        add_runs(new('section'), name)

    def heading(org, place, dates, bold_org=True):
        par = new('org')
        right_tab(par)
        add_runs(par, org, bold=bold_org)
        if place:
            add_runs(par, ', ' + place)
        add_runs(par, '\t' + dates)

    def title(text):
        add_runs(new('title'), text, italic=True)

    def bullets(items, kind='bullet'):
        for item in items:
            add_runs(new(kind), item)

    name = new('name')
    add_runs(name, 'AUSTIN NGUYEN', bold=True)
    for run in name.runs:
        run.font.size = Pt(15)
    contact = new('contact')
    add_runs(contact, HEADER)
    for run in contact.runs:
        run.font.size = Pt(9)

    section('EDUCATION')
    heading('University of Houston, C. T. Bauer College of Business', 'Houston, TX', 'May 2027')
    for line in EDUCATION_LINES:
        add_runs(new('edu_bullet'), line)

    section('EXPERIENCE')
    for org, place, dates, role, items in EXPERIENCE:
        heading(org, place, dates)
        title(role)
        bullets(items)

    section('PROJECTS')
    for pname, tools, dates, items in PROJECTS:
        par = new('org')
        right_tab(par)
        add_runs(par, pname, bold=True)
        add_runs(par, ' | ' + tools + '\t' + dates)
        bullets(items)

    section('SELECTED PROGRAMS')
    for pname, place, dates, role, items in PROGRAMS:
        heading(pname, place, dates)
        title(role)
        bullets(items)

    section('SKILLS')
    for label, value in SKILLS:
        add_runs(new('plain'), f'**{label}:** {value}')

    section('HONORS AND AWARDS')
    add_runs(new('plain'), ' | '.join(AWARDS))

    doc.save(output)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
