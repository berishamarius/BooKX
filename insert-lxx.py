#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Insert Septuagint (Greek) verses into all verse files"""

import os
import re
from pathlib import Path

BASE_DIR = Path(r"C:\Users\beris_xrgc50t\KX KroniX\BooKX")
LXX_DIR = BASE_DIR / "temp-septuagint"
DIST_DIR = BASE_DIR / "dist-diebibel"

# OLD TESTAMENT BOOKS (39 total)
BOOKS = [
    ("001-gen", "grcbrent_002_GEN"),
    ("002-exo", "grcbrent_003_EXO"),
    ("003-lev", "grcbrent_004_LEV"),
    ("004-num", "grcbrent_005_NUM"),
    ("005-deu", "grcbrent_006_DEU"),
    ("006-jos", "grcbrent_007_JOS"),
    ("007-jdg", "grcbrent_008_JDG"),
    ("008-rut", "grcbrent_009_RUT"),
    ("009-1sa", "grcbrent_010_1SA"),
    ("010-2sa", "grcbrent_011_2SA"),
    ("011-1ki", "grcbrent_012_1KI"),
    ("012-2ki", "grcbrent_013_2KI"),
    ("013-1ch", "grcbrent_014_1CH"),
    ("014-2ch", "grcbrent_015_2CH"),
    ("015-ezr", "grcbrent_016_EZR"),
    ("016-neh", "grcbrent_017_NEH"),
    ("017-est", "grcbrent_018_EST"),
    ("018-job", "grcbrent_019_JOB"),
    ("019-psa", "grcbrent_020_PSA"),
    ("020-pro", "grcbrent_021_PRO"),
    ("021-ecc", "grcbrent_022_ECC"),
    ("022-sng", "grcbrent_023_SNG"),
    ("023-isa", "grcbrent_024_ISA"),
    ("024-jer", "grcbrent_025_JER"),
    ("025-lam", "grcbrent_026_LAM"),
    ("026-ezk", "grcbrent_027_EZK"),
    ("027-dan", "grcbrent_028_DAN"),
    ("028-hos", "grcbrent_029_HOS"),
    ("029-jol", "grcbrent_030_JOL"),
    ("030-amo", "grcbrent_031_AMO"),
    ("031-oba", "grcbrent_032_OBA"),
    ("032-jon", "grcbrent_033_JON"),
    ("033-mic", "grcbrent_034_MIC"),
    ("034-nam", "grcbrent_035_NAM"),
    ("035-hab", "grcbrent_036_HAB"),
    ("036-zep", "grcbrent_037_ZEP"),
    ("037-hag", "grcbrent_038_HAG"),
    ("038-zec", "grcbrent_039_ZEC"),
    ("039-mal", "grcbrent_040_MAL"),
]

LANGUAGES = [
    "german", "italian", "french", "spanish", "portuguese", "dutch",
    "czech", "polish", "swedish", "russian", "ukrainian", "hungarian",
    "armenian", "albanian", "croatian", "tagalog", "kjv", "serbian", "greek"
]

def main(test_only=True):
    print("=== SEPTUAGINT INSERTION ===\n")
    
    books_to_process = [BOOKS[0]] if test_only else BOOKS  # Genesis only for testing
    langs_to_process = ["german"] if test_only else LANGUAGES
    
    if test_only:
        print("TEST MODE: Genesis only\n")
    
    total_inserted = 0
    
    for lang in langs_to_process:
        print(f"\n→ {lang}")
        
        for book_file, lxx_prefix in books_to_process:
            book_html = f"{book_file}.html"
            book_path = DIST_DIR / lang / "bücher" / book_html
            
            if not book_path.exists():
                print(f"  ⚠ {book_html} not found")
                continue
            
            print(f"  {book_html}...", end=" ")
            
            # Read file
            content = book_path.read_text(encoding="utf-8")
            
            # Check if already has Greek
            if '<p class="base base-o">' in content:
                print("Already has Greek, skipping")
                continue
            
            # Find all LXX chapter files
            lxx_files = sorted(LXX_DIR.glob(f"{lxx_prefix}_*_read.txt"))
            
            if not lxx_files:
                print("No LXX files")
                continue
            
            verses_inserted = 0
            modified = content
            
            # Process each chapter
            for lxx_file in lxx_files:
                # Extract chapter number
                match = re.search(r'_(\d+)_read\.txt$', lxx_file.name)
                if not match:
                    continue
                ch_num = int(match.group(1))
                
                # Read verses (skip first 2 lines)
                with open(lxx_file, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                
                verses = [line.strip() for line in lines[2:] if line.strip()]
                
                if not verses:
                    continue
                
                # Insert each verse
                for v_num, greek_text in enumerate(verses, start=1):
                    if not greek_text:
                        continue
                    
                    # Pattern: find verse block, then insert Greek before .tra
                    # <div class="vb" id="v{ch}-{v}">
                    #   ...
                    #   <p class="base base-p">...</p>
                    #   <p class="tra">        <- insert BEFORE this
                    
                    verse_pattern = rf'(id="v{ch_num}-{v_num}".*?<p class="base base-p">.*?</p>\s*)(<p class="tra">)'
                    
                    greek_line = f'    <p class="base base-o">{greek_text}</p>\n'
                    replacement = rf'\1{greek_line}\2'
                    
                    before = modified
                    modified = re.sub(verse_pattern, replacement, modified, count=1, flags=re.DOTALL)
                    
                    if modified != before:
                        verses_inserted += 1
            
            if verses_inserted > 0:
                book_path.write_text(modified, encoding="utf-8")
                print(f"✓ {verses_inserted} verses")
                total_inserted += verses_inserted
            else:
                print("⚠ 0 verses")
    
    print(f"\n=== DONE ===")
    print(f"Total verses inserted: {total_inserted}")
    
    if test_only:
        print("\nCheck dist-diebibel/german/bücher/001-gen.html")
        print("If OK, run with test_only=False to process all books")

if __name__ == "__main__":
    main(test_only=True)
