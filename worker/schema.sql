-- One row per day, event type, name and traffic source. No IPs, cookies or personal data are stored.
CREATE TABLE IF NOT EXISTS counts (
  day  TEXT NOT NULL,
  kind TEXT NOT NULL,   -- 'pv' (a visit's landing page) or 'click' (resume, email, linkedin, github, demo, ask)
  name TEXT NOT NULL,
  ref  TEXT NOT NULL,   -- where the visitor came from: linkedin, github, google, direct, ...
  n    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, kind, name, ref)
);
