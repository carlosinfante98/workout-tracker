import pandas as pd
from typing import List, Dict

def build_score_dataframe(scoreboards: List[Dict]) -> pd.DataFrame:
    """
    Constructs a chronological DataFrame with scores per player.
    Forward-fills missing players and uses the latest scoreboard for duplicate dates.
    """
    # Build a list of dicts with 'date' and player scores
    records = []
    for block in scoreboards:
        rec = {'date': block['date']}
        rec.update(block['scores'])
        records.append(rec)
    df = pd.DataFrame(records)
    df = df.sort_values('date')
    df = df.drop_duplicates('date', keep='last').set_index('date')
    df = df.astype('float').ffill().astype('Int64')
    return df
