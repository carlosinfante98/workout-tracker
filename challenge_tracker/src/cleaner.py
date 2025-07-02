import pandas as pd

def detect_anomalies(df: pd.DataFrame, autocorrect: bool = True) -> pd.DataFrame:
    """
    Flags score drops and optionally corrects them by forward-filling previous values.
    Adds an 'anomaly' column for each player with True/False.
    """
    df_out = df.copy()
    for col in df.columns:
        prev = df_out[col].shift(1)
        anomaly = (df_out[col] < prev)
        df_out[f'{col}_anomaly'] = anomaly
        if autocorrect:
            df_out.loc[anomaly, col] = prev[anomaly]
    return df_out
