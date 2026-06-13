import re
import sys
import os

# ============================================================
# CLARITY BRIDGE SCANNER & CONSCIOUS AUDITOR
# ============================================================
# This script evaluates code files for alignment with the
# four Clarity Bridge phases and language resonance.
# ============================================================

FORBIDDEN_NEGATIONS = [
    r"\bnot\b", r"\bdon't\b", r"\bcan't\b", r"\bwon't\b",
    r"\bisn't\b", r"\bdidnt\b", r"\bwasn't\b", r"\bbut\b", r"\bnever\b"
]

def scan_file(filepath):
    if not os.path.exists(filepath):
        print(f":: File path resolved as empty: {filepath}")
        return

    basename = os.path.basename(filepath)
    print(f"\n============================================================")
    print(f":: AUDITING: {basename}")
    print(f"============================================================")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Somatic Grounding Check (Rope Bridge)
    somatic_keywords = ['breath', 'pause', 'posture', 'settle', 'anchor']
    somatic_matches = [w for w in somatic_keywords if re.search(r'\b' + w, content, re.IGNORECASE)]
    somatic_score = min(len(somatic_matches) * 20, 100)

    # 2. Topological Clarity Check (Golden Gate)
    topo_keywords = ['legend', 'map', 'descriptor', 'badge', 'centroid', 'outline']
    topo_matches = [w for w in topo_keywords if re.search(r'\b' + w, content, re.IGNORECASE)]
    topo_score = min(len(topo_matches) * 20, 100)

    # 3. Pacing & Coherence Check (Brooklyn)
    pacing_keywords = ['wpm', 'velocity', 'limit', 'lock', 'debounce', 'slerp', 'momentum']
    pacing_matches = [w for w in pacing_keywords if re.search(r'\b' + w, content, re.IGNORECASE)]
    pacing_score = min(len(pacing_matches) * 20, 100)

    # 4. Reflection Archiving Check (Camelback)
    archive_keywords = ['download', 'journal', 'archive', 'spiral', 'localstorage']
    archive_matches = [w for w in archive_keywords if re.search(r'\b' + w, content, re.IGNORECASE)]
    archive_score = min(len(archive_matches) * 20, 100)

    # 5. Language Resonance Check (Negation hunting in user-facing text)
    # Extract string literals and HTML text blocks to inspect user-facing copy
    user_strings = []
    # Find HTML text blocks (simple tag stripping/matching)
    html_text = re.findall(r'>([^<]+)<', content)
    user_strings.extend(html_text)
    
    # Find double and single quoted string literals
    js_strings = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"|\'([^\'\\]*(?:\\.[^\'\\]*)*)\'', content)
    for pair in js_strings:
        literal = pair[0] or pair[1]
        if literal:
            user_strings.extend(literal.split('\n'))

    negation_hits = []
    for line in user_strings:
        line_clean = line.strip()
        if len(line_clean) < 3:
            continue
        # Skip technical code statements (regexes, logs, console lines, comments)
        if any(marker in line_clean for marker in ['console.', 'url', 'class=', 'import', 'from', 'select']):
            continue
            
        for pattern in FORBIDDEN_NEGATIONS:
            match = re.search(pattern, line_clean, re.IGNORECASE)
            if match:
                negation_hits.append(f"Line segment: \"{line_clean[:80]}\" -> caught: '{match.group()}'")
                break

    lang_score = 100 - min(len(negation_hits) * 10, 80)

    # Overall Resonance Math
    total_score = int((somatic_score + topo_score + pacing_score + archive_score + lang_score) / 5)

    print(f"\n:: CLARITY BRIDGE COMPLIANCE :: {total_score}%")
    print(f"------------------------------------------------------------")
    print(f"1. Somatic Grounding (Anchor)   :: {somatic_score}% (found: {', '.join(somatic_matches) or 'none'})")
    print(f"2. Topological Clarity (Legend)  :: {topo_score}% (found: {', '.join(topo_matches) or 'none'})")
    print(f"3. Pacing & Coherence (Gates)   :: {pacing_score}% (found: {', '.join(pacing_matches) or 'none'})")
    print(f"4. Reflection Archiving (Pool)  :: {archive_score}% (found: {', '.join(archive_matches) or 'none'})")
    print(f"5. Language Resonance           :: {lang_score}%")

    if negation_hits:
        print(f"\n:: LANGUAGE ALIGNMENT OPPORTUNITIES ::")
        for hit in negation_hits[:6]:
            print(f"   * {hit}")
    else:
        print(f"\n:: LANGUAGE ALIGNMENT :: Affirmative language resonance aligned.")

    # Actionable Invitations
    print(f"\n:: ALIGNMENT INVITATIONS ::")
    if somatic_score < 80:
        print("   * Consider introducing posture calibration or breath holds at entry.")
    if topo_score < 80:
        print("   * Consider surfacing visual legends or tooltips for topological geometry.")
    if pacing_score < 80:
        print("   * Consider locking inputs or debouncing keys based on typing velocity.")
    if archive_score < 80:
        print("   * Consider providing a journal download or historical local save link.")
    if lang_score < 90:
        print("   * Consider rewriting identified negations to use affirmative constructions.")
    
    if total_score >= 90:
        print("\n:: RESONANCE STATUS :: Excellent. The bridge stands sturdy.")
    else:
        print("\n:: RESONANCE STATUS :: Opportunities remain to strengthen the crossing.")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        # Default scan both explorer files
        scan_file("explorers/bloom-explorer.html")
        scan_file("explorers/dodecahedron-explorer.html")
    else:
        scan_file(sys.argv[1])
