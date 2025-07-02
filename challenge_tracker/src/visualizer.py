import matplotlib.pyplot as plt
import pandas as pd

def plot_scores(df: pd.DataFrame) -> None:
    """
    Plots the score progression of each player over time.
    Shows only 8 evenly spaced date labels on the X axis for readability.
    """
    plt.figure(figsize=(10, 6))
    for player in [col for col in df.columns if not col.endswith('_anomaly')]:
        plt.plot(df.index, df[player], marker='o', label=player)
    plt.xlabel('Date')
    plt.ylabel('Cumulative Score')
    plt.title('Score Progression Over Time')
    plt.legend()
    # Show only 8 evenly spaced date labels
    n_labels = 8
    if len(df.index) > n_labels:
        step = max(1, len(df.index) // (n_labels - 1))
        label_indices = list(range(0, len(df.index), step))
        if label_indices[-1] != len(df.index) - 1:
            label_indices.append(len(df.index) - 1)
        plt.xticks([df.index[i] for i in label_indices], [df.index[i] for i in label_indices], rotation=45)
    else:
        plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()
