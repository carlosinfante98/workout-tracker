import re
import dateparser
from typing import List, Dict

def extract_scoreboards(text: str) -> List[Dict]:
    """
    Parses WhatsApp chat text and returns a list of scoreboard blocks with date and player scores.
    Each block is a dict: {'date': 'YYYY-MM-DD', 'scores': {'A': 1, 'B': 2, ...}}
    Skips blocks if any score is a float (not an integer).
    Only considers blocks with exactly the players Pepo, Pocho, Josh, and Mene.
    """
    lines = text.splitlines()
    scoreboards = []
    # Patterns
    date_line_pattern = re.compile(r'^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+\d{1,2}(?:st|nd|rd|th)?$', re.IGNORECASE)
    score_pattern = re.compile(r'^\s*([A-Za-zÁÉÍÓÚáéíóúñÑ ]+)\s*:\s*([\d\.]+)\s*$')
    wa_timestamp_pattern = re.compile(r'^\[(\d{1,2}/\d{1,2}/\d{2,4}),')
    required_players = {"pepo", "pocho", "josh", "mene"}

    i = 0
    while i < len(lines):
        # Look for a scoreboard block (at least 2 consecutive score lines)
        block_scores = {}
        block_start = i
        has_float = False
        while i < len(lines):
            line = lines[i].replace('\u00a0', ' ').strip()
            m = score_pattern.match(line)
            if m:
                name = m.group(1).strip().lower()
                name_clean = name.replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u").replace("ñ", "n").replace(" ", "")
                try:
                    score = float(m.group(2))
                    if not score.is_integer():
                        has_float = True
                        break
                    score = int(score)
                except ValueError:
                    break
                block_scores[name_clean] = score
                i += 1
            else:
                break
        # Only keep blocks with exactly the required players (no more, no less)
        if (
            len(block_scores) == 4 and
            not has_float and
            set(block_scores.keys()) == required_players
        ):
            # Find date: look up to 5 lines above for a date line
            date_str = None
            for j in range(1, 7):
                idx = block_start - j
                if idx < 0:
                    break
                prev_line = lines[idx].replace('\u00a0', ' ').strip()
                if date_line_pattern.match(prev_line):
                    date = dateparser.parse(prev_line, languages=['es', 'en'])
                    if date:
                        date_str = date.strftime('%Y-%m-%d')
                        break
            # If no date line, look for WhatsApp timestamp above
            if not date_str:
                for j in range(1, 11):
                    idx = block_start - j
                    if idx < 0:
                        break
                    prev_line = lines[idx].strip()
                    m = wa_timestamp_pattern.match(prev_line)
                    if m:
                        date = dateparser.parse(m.group(1), languages=['es', 'en'])
                        if date:
                            date_str = date.strftime('%Y-%m-%d')
                            break
            if date_str:
                # Restore original player names for output
                orig_scores = {}
                for orig_name in ["Pepo", "Pocho", "Josh", "Mene"]:
                    key = orig_name.lower().replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u").replace("ñ", "n").replace(" ", "")
                    orig_scores[orig_name] = block_scores[key]
                scoreboards.append({'date': date_str, 'scores': orig_scores})
            # Move to next line after block
            i = block_start + len(block_scores)
        else:
            i += 1
    return scoreboards
