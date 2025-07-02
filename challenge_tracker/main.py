import os
from src.parser import extract_scoreboards
from src.tracker import build_score_dataframe
from src.cleaner import detect_anomalies
from src.visualizer import plot_scores

def main():
    data_path = os.path.join(os.path.dirname(__file__), 'data', 'chat.txt')
    print('Loading chat file...')
    with open(data_path, 'r', encoding='utf-8') as f:
        text = f.read()
    print('Extracting scoreboards...')
    scoreboards = extract_scoreboards(text)
    print(f'Found {len(scoreboards)} scoreboard blocks.')
    print('Building score DataFrame...')
    df = build_score_dataframe(scoreboards)
    print('Detecting and correcting anomalies...')
    df_clean = detect_anomalies(df, autocorrect=True)
    print('Plotting scores...')
    plot_scores(df_clean)
    print('Done!')

if __name__ == '__main__':
    main()
