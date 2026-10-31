"""Streamlit wrapper for the standalone radio portfolio site."""

from pathlib import Path
import re

import streamlit as st

st.set_page_config(page_title="Portfolio — Radio 88.1", layout="wide")

ROOT = Path(__file__).parent
index_html = (ROOT / "index.html").read_text(encoding="utf-8")
styles = (ROOT / "styles.css").read_text(encoding="utf-8")
script = (ROOT / "script.js").read_text(encoding="utf-8")
body_match = re.search(r"<body[^>]*>(.*?)</body>", index_html, flags=re.I | re.S)
if not body_match:
    raise RuntimeError("index.html에서 본문을 찾지 못했습니다.")

body = body_match.group(1)
streamlit_shell = """
<style>
  [data-testid="stHeader"], [data-testid="stToolbar"],
  [data-testid="stDecoration"], footer { display: none !important; }
  [data-testid="stAppViewContainer"] { background: #f5f5f3; }
  [data-testid="stMain"] { padding: 0 !important; }
  [data-testid="stMainBlockContainer"] {
    max-width: none !important; padding: 0 !important; margin: 0 !important;
  }
  .stApp, html, body { margin: 0 !important; padding: 0 !important; }
</style>
"""
st.html(f"{streamlit_shell}<style>{styles}</style>{body}<script>{script}</script>", unsafe_allow_javascript=True)
