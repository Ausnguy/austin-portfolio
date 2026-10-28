"""Updates Austin's own resume .docx in place (keeping its look) and renders a matching HTML/PDF preview.

Changes: removes the MNIST project, adds the latest CaseQuest (Parvius) project with a link, lists the data-engineering
tools the projects actually use in Skills, and turns space-padded dates into real right-aligned tab stops.
Every claim comes from the existing resume or src/data (projects.js).

Usage:
  python tools/resume/edit_resume.py docx <source.docx> <output.docx>
  python tools/resume/edit_resume.py html <output.docx> <output.html>
"""
import copy
import html
import re
import sys

from docx import Document
from docx.enum.text import WD_TAB_ALIGNMENT
from docx.opc.constants import RELATIONSHIP_TYPE as RT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches
from docx.text.run import Run

CASEQUEST_URL = 'https://ausnguy.github.io/austin-portfolio/projects/casequest-2026'
INTERDOMAIN_URL = 'https://ausnguy.github.io/austin-portfolio/projects/interdomain'

# Segments: (text, kind) where kind is 'r' regular, 'b' bold, 'i' italic, 'br' line break, 'link' hyperlink.
CASEQUEST_HEADER = [
    ('Parvius: Parts Readiness System (CaseQuest 2026) ', 'b'), ('| ', 'r'),
    ('Python, NumPy, TypeScript, Redis', 'i'), ('\t', 'r'),
    ('Case study', 'link', CASEQUEST_URL),
]
CASEQUEST_BULLETS = [
    [('Co-built a failure-prediction model (logistic regression written from scratch in NumPy) that ', 'r'),
     ('flagged 90 of 91 mechanical failures on unseen data (AUC 0.82), ', 'b'), ('a median 1.5 days ahead.', 'r')],
    [('Recommended a spare-parts program ', 'r'), ('modeled to avoid ~968 downtime hours a year, ', 'b'),
     ('and shipped a live 3D operations console and engineer phone app that share one state through a TypeScript/Redis API.', 'r')],
]

SKILLS = [
    ('Languages:', ' SQL, Python (Pandas, NumPy, PyTorch, Matplotlib), TypeScript, Java, R, JavaScript, React'),
    ('Data Engineering:', ' Kafka, Spark Structured Streaming, PostgreSQL, FastAPI, Docker'),
    ('Data Visualization & Analytics:', ' Power BI, Tableau, Excel (Pivot Tables, VLOOKUP), DAX, KPI Reporting'),
    ('Tools & Concepts:', ' AWS, DynamoDB, Linux, Git/GitHub, Agile, SLURM/HPC'),
]


def text_of(par):
    return ''.join(r.text for r in par.runs)


def find(doc, prefix):
    return next(p for p in doc.paragraphs if text_of(p).strip().startswith(prefix))


def drop_runs(par):
    for child in list(par._p):
        if child.tag in (qn('w:r'), qn('w:hyperlink')):
            par._p.remove(child)


def make_run(proto, par, text):
    el = copy.deepcopy(proto)
    for child in list(el):
        if child.tag != qn('w:rPr'):
            el.remove(child)
    Run(el, par).text = text
    return el


def fill(par, segments, protos, doc):
    """Replaces a paragraph's runs with the given segments, cloning the formatting of existing runs."""
    drop_runs(par)
    for seg in segments:
        text, kind = seg[0], seg[1]
        url = seg[2] if len(seg) > 2 else CASEQUEST_URL
        if kind == 'br':
            el = make_run(protos['r'], par, '')
            el.append(OxmlElement('w:br'))
            par._p.append(el)
        elif kind == 'link':
            rid = doc.part.relate_to(url, RT.HYPERLINK, is_external=True)
            link = OxmlElement('w:hyperlink')
            link.set(qn('r:id'), rid)
            run = make_run(protos['r'], par, text)
            u = OxmlElement('w:u')
            u.set(qn('w:val'), 'single')
            # w:u has a fixed place in w:rPr's sequence; appending it last makes Word "repair" the file.
            rpr = run.find(qn('w:rPr'))
            after_u = ('effect', 'bdr', 'shd', 'fitText', 'vertAlign', 'rtl', 'cs', 'em', 'lang', 'eastAsianLayout', 'specVanish', 'oMath')
            nxt = next((c for c in rpr if c.tag.split('}')[1] in after_u), None)
            if nxt is not None:
                nxt.addprevious(u)
            else:
                rpr.append(u)
            link.append(run)
            par._p.append(link)
        else:
            par._p.append(make_run(protos[kind], par, text))


def right_tab(par):
    stops = par.paragraph_format.tab_stops
    if not any(abs(t.position.inches - 7.5) < 0.01 for t in stops):
        stops.add_tab_stop(Inches(7.5), WD_TAB_ALIGNMENT.RIGHT)


def normalize_tabs(par):
    """'Left   <tabs/spaces>   Date' becomes 'Left<tab>Date' with a right tab stop, so dates line up exactly."""
    runs = [r for r in par.runs if r.text]
    full = ''.join(r.text for r in runs)
    m = re.search(r'[ 	]*	[ 	]*|[ ]{8,}', full)
    if not m:
        return
    left_end, right_start = m.start(), m.end()
    if not full[right_start:].strip():  # trailing padding only (section headings): trim it
        left_end = len(full.rstrip(' 	'))
        right_start = len(full)
    tab_added = False
    offset = 0
    for r in runs:
        s, e = offset, offset + len(r.text)
        offset = e
        keep_left = full[s:min(e, left_end)] if s < left_end else ''
        keep_right = full[max(s, right_start):e] if e > right_start else ''
        new = keep_left
        if keep_right.strip():
            new = keep_left + ('' if tab_added else '	') + keep_right
            tab_added = True
        r.text = new
    if tab_added:
        right_tab(par)


def edit(src, out):
    doc = Document(src)
    seen = {}

    header = find(doc, 'Interdomain')
    bullet = next(p for p in doc.paragraphs if text_of(p).startswith('Built an end-to-end'))
    protos = {
        'r': copy.deepcopy(bullet.runs[0]._r), 'b': copy.deepcopy(bullet.runs[1]._r),
        'i': copy.deepcopy(next(r for r in header.runs if r.italic)._r),
    }

    # Remove MNIST (its heading and the bullet under it).
    mnist = find(doc, 'MNIST')
    nxt = mnist._p.getnext()
    mnist._p.getparent().remove(mnist._p)
    nxt.getparent().remove(nxt)

    # Add CaseQuest after Interdomain's bullets.
    interdomain_last = next(p for p in doc.paragraphs if text_of(p).startswith('Scaled the data pipeline'))
    anchor = interdomain_last._p
    for segs, src_par in [(CASEQUEST_HEADER, header)] + [(b, bullet) for b in CASEQUEST_BULLETS]:
        el = copy.deepcopy(src_par._p)
        anchor.addnext(el)
        anchor = el
        from docx.text.paragraph import Paragraph
        fill(Paragraph(el, interdomain_last._parent), segs, protos, doc)
    right_tab(Paragraph(anchor.getprevious().getprevious().getprevious(), interdomain_last._parent))

    # Skills: add the data-engineering tools the projects use, one labelled line each.
    skills = next(p for p in doc.paragraphs if text_of(p).startswith('Languages:'))
    segs = []
    for i, (label, value) in enumerate(SKILLS):
        if i:
            segs.append(('', 'br'))
        segs += [(label, 'b'), (value, 'r')]
    fill(skills, segs, protos, doc)

    # Trim wording elsewhere (formatting runs untouched) so BNY can stay on one page.
    def retext(prefix, old, new):
        par = next(p for p in doc.paragraphs if text_of(p).startswith(prefix))
        for run in par.runs:
            if old in run.text:
                run.text = run.text.replace(old, new)
                return
        raise AssertionError((prefix, old))

    # Wording trimmed so no bullet leaves a stray few words on its own line, and the page fits.
    retext('Standardized and validated', ' through data cleaning, field normalization, reconciliation, and QA checks, improving consistency for downstream analysis and annual client renewals. ',
           ' via cleaning, normalization, and reconciliation. ')
    retext('Standardized and validated', 'Standardized and validated ', 'Standardized ')
    retext('Maintained', ' by conducting ROI, profitability, sourcing, and pricing analysis to evaluate product economics, guide purchasing decisions, and optimize inventory restocking. ',
           ' through ROI, sourcing, and pricing analysis that guided purchasing. ')
    retext('Scaled the data pipeline', 'Scaled the data pipeline to handle sustained high-volume traffic by introducing 5K-record batch ingestion, pre-aggregated minute-level metrics, and time-partitioned storage, eliminating a ',
           'Scaled the pipeline with 5K-record batch ingestion, pre-aggregated minute metrics, and time-partitioned storage, eliminating a ')
    retext('Engineered a modular', 'Engineered a modular Python forecasting pipeline', 'Engineered a Python forecasting pipeline')
    retext('Engineered a', ' using Pandas, scikit-learn, XGBoost, and Power BI/XMLA, automating time-series backtesting and evaluation of ',
           ' (Pandas, scikit-learn, XGBoost, Power BI/XMLA) backtesting ')
    retext('Engineered a', ', identifying a ', ', finding a ')
    retext('Reduced modeled AI', 'energy consumption ', 'energy ')
    retext('Reduced modeled AI', ' by evaluating distributed model-routing and caching strategies. ', ' via model routing and caching. ')

    # Contact line: the phone number was black and the rest dark gray (333333). Make it one color.
    from docx.shared import RGBColor
    contact = next(p for p in doc.paragraphs if '@' in text_of(p) and 'linkedin' in text_of(p))
    for run in contact.runs:
        run.font.color.rgb = RGBColor(0, 0, 0)

    # GPA is 3.9 (the source file splits '3.95' across two runs).
    retext('GPA:', '5 | ', ' | ')

    # First HPE bullet: drop two filler words so it fits on two lines.
    hpe = next(p for p in doc.paragraphs if text_of(p).startswith('Built and owned an automated BI pipeline'))
    hpe.runs[0].text = hpe.runs[0].text.replace('pipeline using Power Query, SharePoint, Power BI, and DAX to consolidate ', 'pipeline (Power Query, SharePoint, Power BI, DAX) to consolidate ')

    # Interdomain: links where the date was.
    inter = find(doc, 'Interdomain')
    date_run = next(r for r in reversed(inter.runs) if 'October 2026' in r.text)
    for r in list(inter.runs):
        if r._r is date_run._r:
            break
    date_run._r.getparent().remove(date_run._r)
    for r in list(inter.runs):  # drop the padding run before the date
        if r.text.strip() == '' and '	' not in r.text:
            r._r.getparent().remove(r._r)
    for seg in [('Case study', 'link', INTERDOMAIN_URL)]:
        part = [seg[:2] + ((seg[2],) if seg[2] else ())]
        tmp = copy.deepcopy(inter._p)
        # reuse fill() on a scratch paragraph, then move its runs across
        from docx.text.paragraph import Paragraph
        scratch = Paragraph(tmp, inter._parent)
        fill(scratch, part, protos, doc)
        for child in list(tmp):
            if child.tag in (qn('w:r'), qn('w:hyperlink')):
                inter._p.append(child)
    right_tab(inter)

    # Less bold so the eye can follow: keep the headline metric in each bullet, unbold the rest.
    unbold = ['8 Workday datasets', 'Engineered a modular Python forecasting pipeline', '8 statistical and ML models',
              '10+ employer clients', 'healthcare datasets', '23 worldwide monitoring locations', '19.6M-message backlog']
    for par in doc.paragraphs:
        if par._p.pPr is None or par._p.pPr.numPr is None:
            continue
        for run in par.runs:
            if run.bold and any(run.text.strip().startswith(u) for u in unbold):
                run.bold = None
    # 'claims ' is bold on its own run after '$1M+ in healthcare ' (keep the pair together), so only the tail loses bold.

    # BNY: one more bullet (from the project's write-up on the site), cloned from a plain bullet so no hidden content is copied.
    from docx.text.paragraph import Paragraph
    bny_bullet = next(p for p in doc.paragraphs if text_of(p).startswith('Reduced modeled AI'))
    plain = next(p for p in doc.paragraphs if text_of(p).startswith('Generated $75K+'))
    extra = copy.deepcopy(plain._p)
    bny_bullet._p.addnext(extra)
    fill(Paragraph(extra, bny_bullet._parent), [('Built a lightweight Python logging layer to track compute use and flag inefficiencies. ', 'r')], protos, doc)

    # Cloned paragraphs must not share Word paragraph ids with the originals.
    for par in doc.paragraphs:
        pid = par._p.get('{http://schemas.microsoft.com/office/word/2010/wordml}paraId')
        if pid:
            seen.setdefault(pid, 0)
            seen[pid] += 1
            if seen[pid] > 1:
                del par._p.attrib['{http://schemas.microsoft.com/office/word/2010/wordml}paraId']

    doc.save(out)


def esc(text):
    return html.escape(text, quote=False)


def run_html(r):
    t = esc(r.text)
    if re.search(r' {8,}$', t):  # padding spaces before a right-aligned date
        t = t.rstrip(' ') + '	'
    if not t:
        return ''
    if r.font.size and abs(r.font.size.pt - 10.5) > 0.2:
        t = f'<span style="font-size:{r.font.size.pt}pt">{t}</span>'
    if r.bold:
        t = f'<b>{t}</b>'
    if r.italic:
        t = f'<i>{t}</i>'
    return t


def to_html(path, out):
    doc = Document(path)
    body = []
    for p in doc.paragraphs:
        txt = text_of(p)
        links = ''.join(esc(t.text) for t in p._p.iter(qn('w:t')) if t.getparent().getparent().tag == qn('w:hyperlink'))
        inner_runs = []
        for child in p._p:
            if child.tag == qn('w:r'):
                r = Run(child, p)
                inner_runs.append(run_html(r).replace('\t', '\u0001'))
                if child.find(qn('w:br')) is not None:
                    inner_runs.append('<br>')
            elif child.tag == qn('w:sdt'):  # content controls (Google Docs markers) hold real text too
                for rr in child.iter(qn('w:r')):
                    inner_runs.append(run_html(Run(rr, p)))
            elif child.tag == qn('w:hyperlink'):
                url = doc.part.rels[child.get(qn('r:id'))].target_ref
                for rr in child.iter(qn('w:r')):
                    inner_runs.append(f'<a href="{html.escape(url)}"><u>{esc(Run(rr, p).text)}</u></a>')
        line = ''.join(inner_runs)
        is_bullet = p._p.pPr is not None and p._p.pPr.numPr is not None
        if not txt.strip() and not links:
            body.append('<div class="sp">&nbsp;</div>')
            continue
        center = p.alignment is not None and int(p.alignment) == 1
        heading = p.style.name == 'Heading 1' or text_of(p).strip() == 'SKILLS'
        if '\u0001' in line:
            left, right = line.split('\u0001', 1)
            line = f'<span>{left.strip()}</span><span>{right.replace(chr(1), "").strip()}</span>'
            cls = 'row'
        else:
            cls = ''
        if heading:
            cls += ' h'
        if center:
            cls += ' c'
        if is_bullet:
            cls += ' li'
        body.append(f'<div class="{cls.strip()}">{line.strip()}</div>')
    css = """
@page { size: 8.5in 11in; margin: 0.5in; }
body { margin: 0; font: 10.5pt/1.15 'Times New Roman', Times, serif; color: #000; }
.sp { height: 12pt; }
.c { text-align: center; }
.h { font-weight: bold; font-size: 11.5pt; margin-left: 0.1in; }
.row { display: flex; justify-content: space-between; gap: 10pt; }
.li { position: relative; padding-left: 0.3125in; }
.li::before { content: '\\2022'; position: absolute; left: 0.0625in; }
u { text-decoration: underline; }
"""
    open(out, 'w', encoding='utf-8').write(f'<!doctype html><meta charset="utf-8"><style>{css}</style><body>{"".join(body)}</body>')


if __name__ == '__main__':
    mode = sys.argv[1]
    (edit if mode == 'docx' else to_html)(sys.argv[2], sys.argv[3])
