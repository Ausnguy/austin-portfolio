# Resume

`edit_resume.py` applies the content changes to the source Word file and writes a new .docx:

    python tools/resume/edit_resume.py docx "<source>.docx" tools/resume/out/<name>.docx

Convert it to PDF with LibreOffice (run from its program folder so it finds its DLLs), then copy the PDF to `public/resume.pdf`
and bump the `?v=` on the resume links in `src/pages/Home.jsx` and `src/components/Layout.jsx`:

    soffice --headless --convert-to pdf --outdir tools/resume/out tools/resume/out/<name>.docx

`tools/resume/out/` is ignored by git.
