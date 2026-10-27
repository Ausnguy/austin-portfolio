"""Renders the same resume content as build.py to HTML, styled like the Word template (Calibri, slate text, underlined bold
section heads). tools/resume/pdf.cjs prints it to PDF with Chrome.

Usage: python tools/resume/to_html.py <output.html>
"""
import html
import re
import sys

import build as r


def esc(text):
    out = html.escape(text, quote=False)
    return re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', out)


def row(left, right):
    return f'<div class="row"><span>{left}</span><span>{html.escape(right)}</span></div>'


def bullets(items):
    return '<ul>' + ''.join(f'<li>{esc(i)}</li>' for i in items) + '</ul>'


def main(out):
    parts = [
        f'<h1>AUSTIN NGUYEN</h1><p class="contact">{html.escape(r.HEADER)}</p>',
        '<h2>EDUCATION</h2>',
        row('<b>University of Houston, C. T. Bauer College of Business</b>, Houston, TX', 'May 2027'),
        '<ul>' + ''.join(f'<li>{esc(i)}</li>' for i in r.EDUCATION_LINES) + '</ul>',
        '<h2>EXPERIENCE</h2>',
    ]
    for org, place, dates, role, items in r.EXPERIENCE:
        parts += [row(f'<b>{html.escape(org)}</b>, {html.escape(place)}', dates), f'<div class="role">{html.escape(role)}</div>', bullets(items)]
    parts.append('<h2>PROJECTS</h2>')
    for name, tools, dates, items in r.PROJECTS:
        parts += [row(f'<b>{html.escape(name)}</b> | {html.escape(tools)}', dates), bullets(items)]
    parts.append('<h2>SELECTED PROGRAMS</h2>')
    for name, place, dates, role, items in r.PROGRAMS:
        parts += [row(f'<b>{html.escape(name)}</b>, {html.escape(place)}', dates), f'<div class="role">{html.escape(role)}</div>', bullets(items)]
    parts.append('<h2>SKILLS</h2>')
    parts += [f'<div><b>{html.escape(k)}:</b> {html.escape(v)}</div>' for k, v in r.SKILLS]
    parts += ['<h2>HONORS AND AWARDS</h2>', f'<div>{html.escape(" | ".join(r.AWARDS))}</div>']

    css = f"""
@page {{ size: 8.5in 11in; margin: 0.5in; }}
* {{ box-sizing: border-box; }}
body {{ margin: 0; font: {r.BODY_PT}pt/1.15 Calibri, 'Carlito', sans-serif; color: #333F48; }}
h1 {{ margin: 0; text-align: center; font-size: 15pt; }}
.contact {{ margin: 0 0 2pt; text-align: center; font-size: 9pt; }}
h2 {{ margin: 5pt 0 0; font-size: {r.BODY_PT}pt; text-decoration: underline; }}
.row {{ display: flex; justify-content: space-between; gap: 12pt; margin-top: 3pt; }}
.role {{ font-style: italic; }}
ul {{ margin: 1pt 0 0; padding-left: 18pt; color: #000; }}
li {{ margin: 0 0 1.5pt; }}
"""
    open(out, 'w', encoding='utf-8').write(f'<!doctype html><meta charset="utf-8"><style>{css}</style><body>{"".join(parts)}</body>')


if __name__ == '__main__':
    main(sys.argv[1])
