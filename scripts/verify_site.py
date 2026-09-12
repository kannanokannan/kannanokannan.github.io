#!/usr/bin/env python3
"""Gate the load-bearing claims on context-stack.org.

Run from the repository root:  python3 scripts/verify_site.py
Exit 0 = every gate passed. Exit 1 = at least one gate failed.

This file exists because a published governance surface changed once without a
commit behind it. Nothing here checks style or links; it checks only the
statements the project is accountable for.
"""
import glob
import json
import os
import re
import sys
import xml.etree.ElementTree as ET

FAIL = []
PASS = []


def check(name, ok, detail=""):
    (PASS if ok else FAIL).append(name)
    print(("PASS  " if ok else "FAIL  ") + name + (("  -- " + detail) if detail else ""))


def read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


# --- G1: the five constraint statements -------------------------------------
CONSTRAINTS = [
    "AARM is a Cloud Security Alliance standard, not a Context Stack standard.",
    "Context Stack is AARM-aligned. No conformance claim is made.",
    "Not listed on the CSA Builder Registry.",
    "No independent conformance review has been undertaken.",
    "Griha is a reference implementation, not a product.",
]
# Every surface that is required to carry all five, byte-identically.
CONSTRAINT_SURFACES = [
    "index.html",
    "ai-governance.html",
    "ai-governance-framework.html",
    "consulting.html",
    "llms.txt",
    "README.md",
]
for surface in CONSTRAINT_SURFACES:
    if not os.path.exists(surface):
        check("G1 constraints present in " + surface, False, "file missing")
        continue
    text = read(surface)
    missing = [c for c in CONSTRAINTS if c not in text]
    check(
        "G1 constraints present in " + surface,
        not missing,
        "missing: " + " | ".join(missing) if missing else "",
    )

# --- G2: claim ceiling ------------------------------------------------------
# The project is AARM-aligned. It is not conformant, certified or approved.
FORBIDDEN = re.compile(
    r"\b(AARM[- ]conformant|conformant with AARM|AARM[- ]certified|"
    r"CSA[- ]approved|CSA[- ]certified|certified conformant)\b",
    re.IGNORECASE,
)
for path in sorted(glob.glob("*.html")) + sorted(glob.glob("*/*.html")) + [
    "llms.txt",
    "README.md",
]:
    if not os.path.exists(path):
        continue
    hits = FORBIDDEN.findall(read(path))
    check("G2 claim ceiling " + path, not hits, "found: " + ", ".join(hits) if hits else "")

# --- G3: conformsTo is not a schema.org property ----------------------------
# Ratified 2026-08: it 404s and is absent from CreativeWork. It stays out.
for path in sorted(glob.glob("*.html")) + sorted(glob.glob("*/*.html")):
    check("G3 no conformsTo in " + path, "conformsTo" not in read(path))

# --- G4: every JSON-LD block parses -----------------------------------------
LD = re.compile(
    r'<script type="application/ld\+json">(.*?)</script>', re.DOTALL
)
for path in sorted(glob.glob("*.html")) + sorted(glob.glob("*/*.html")):
    blocks = LD.findall(read(path))
    bad = []
    for i, block in enumerate(blocks):
        try:
            json.loads(block)
        except json.JSONDecodeError as exc:
            bad.append("block %d: %s" % (i + 1, exc))
    check(
        "G4 JSON-LD parses in %s (%d block(s))" % (path, len(blocks)),
        not bad,
        "; ".join(bad) if bad else "",
    )

# --- G5: Content Signals stay in robots.txt ---------------------------------
robots = read("robots.txt")
signal = re.findall(r"^Content-Signal:.*$", robots, re.MULTILINE)
check("G5 robots.txt has exactly one Content-Signal line", len(signal) == 1,
      "found %d" % len(signal))
if len(signal) == 1:
    check(
        "G5 Content-Signal value is the ratified one",
        signal[0].strip() == "Content-Signal: ai-train=yes, search=yes, ai-input=yes",
        signal[0].strip(),
    )
check("G5 robots.txt declares the sitemap",
      "Sitemap: https://context-stack.org/sitemap.xml" in robots)

# --- G6: sitemap parses and points only at files that exist -----------------
try:
    root = ET.fromstring(read("sitemap.xml"))
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locs = [el.text.strip() for el in root.findall(".//s:loc", ns)]
    check("G6 sitemap.xml parses (%d url(s))" % len(locs), bool(locs))
    dangling = []
    for loc in locs:
        rel = loc.replace("https://context-stack.org/", "")
        if rel == "":
            rel = "index.html"
        if rel.endswith("/"):
            rel = rel + "index.html"
        if not os.path.exists(rel):
            dangling.append(loc)
    check("G6 every sitemap URL resolves to a file", not dangling,
          ", ".join(dangling) if dangling else "")
except ET.ParseError as exc:
    check("G6 sitemap.xml parses", False, str(exc))

# --- G7: llms.txt carries a dateModified ------------------------------------
llms = read("llms.txt")
check("G7 llms.txt has a dateModified",
      bool(re.search(r"^dateModified:\s*\d{4}-\d{2}-\d{2}\s*$", llms, re.MULTILINE)))

print()
print("%d passed, %d failed" % (len(PASS), len(FAIL)))
if FAIL:
    print()
    print("Failed gates:")
    for name in FAIL:
        print("  - " + name)
sys.exit(1 if FAIL else 0)
