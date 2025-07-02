# WhatsApp Scoreboard Tracker

## Overview

This project extracts and visualizes a scoreboard from a WhatsApp group chat text file. The scoreboard is embedded within regular conversation messages and tracks multiple players' scores over time.

The end goal is to produce clean score progressions and visualizations for each player, along with detecting and correcting any anomalies in score changes.

## Input

- A `.txt` file exported from a WhatsApp chat (e.g., `chat.txt`)
- The file contains normal messages and also scoreboard updates in this approximate format:

March 14  
A: 1  
B: 2  
C: 3  
D: 1  

Notes:
- Scoreboards always start with a date (which can be parsed).
- Messages may be inconsistently formatted (e.g., extra spacing, lowercase names).
- Some dates have multiple score updates, submitted by different participants.
- Players' scores are expected to always increase or stay the same over time. Decreases are likely errors or jokes.

## Requirements

1. **Parse the chat**
   - Extract all scoreboard blocks by identifying messages that start with a date and are followed by 1–4 lines in the format `Name: Score`.
   - Handle format noise gracefully (e.g., extra whitespace, varied capitalization).

2. **Track score progression**
   - Associate each scoreboard block with a timestamp.
   - Build a table (DataFrame) showing each player's cumulative score over time.
   - When multiple entries exist for the same date, use the most recent valid one.

3. **Detect and flag anomalies**
   - If a player's score decreases compared to the previous known score, flag the entry as an anomaly.
   - Provide a mechanism to auto-correct (e.g., forward-fill) or manually review anomalies.

4. **Visualize score evolution**
   - Plot the score progression of each player over time.
   - Use one line per player.
   - X-axis: date, Y-axis: cumulative score.

## Tech Stack

- Python 3.10+
- `pandas` for data handling
- `re` for parsing and extraction
- `matplotlib` or `plotly` for visualization

## Suggested File Structure

project_root/  
├── data/  
│   └── chat.txt  
├── src/  
│   ├── parser.py         # Extracts scoreboard data  
│   ├── tracker.py        # Builds cumulative score DataFrame  
│   ├── cleaner.py        # Detects and corrects anomalies  
│   └── visualizer.py     # Plots score progressions  
├── main.py               # Runs the full pipeline  
├── requirements.txt  
└── README.md

## Functions to Implement

- `extract_scoreboards(text: str) -> list[dict]`  
  Parses raw text and returns a list of scoreboard blocks with date and player scores.

- `build_score_dataframe(scoreboards: list[dict]) -> pd.DataFrame`  
  Constructs a chronological DataFrame with scores per player.

- `detect_anomalies(df: pd.DataFrame) -> pd.DataFrame`  
  Flags score drops and optionally corrects them.

- `plot_scores(df: pd.DataFrame) -> None`  
  Produces a multi-line chart showing each player's score over time.

## Notes

- Dates should be normalized to a consistent format (`YYYY-MM-DD`) using `dateparser` or `datetime`.
- Handle missing players (e.g., only A, B, C reported) by carrying forward their last known value.
- Cleaned data can optionally be exported to CSV for archival.

pandas
matplotlib
dateparser
