import pandas as pd
import plotly.graph_objs as go
import plotly.io as pio

def plot_scores(df: pd.DataFrame) -> None:
    """
    Plots the score progression of each player over time using plotly for interactivity.
    Shows only 8 evenly spaced date labels on the X axis for readability.
    Plots smooth lines for each player, and a dot marker for the first entry of each month.
    Hovering shows all 4 players' scores for each date (only once per hover).
    """
    df = df.copy()
    df.index = pd.to_datetime(df.index)
    players = [col for col in df.columns if not col.endswith('_anomaly')]
    customdata = df[players].values
    marker_mask = pd.Series(False, index=df.index)
    months = df.index.to_period('M')
    marker_mask[df.groupby(months).head(1).index] = True
    fig = go.Figure()
    # Add player lines (first player gets the hovertemplate, others are hoverinfo='skip')
    for idx, player in enumerate(players):
        fig.add_trace(go.Scatter(
            x=df.index,
            y=df[player],
            mode='lines+markers',
            name=player,
            marker=dict(
                size=[10 if m else 0 for m in marker_mask],
                symbol='circle',
                line=dict(width=0)
            ),
            line=dict(width=2),
            customdata=customdata,
            hovertemplate=(
                '<b>Date</b>: %{x|%Y-%m-%d}<br>' +
                '<br>'.join([f'{p}: %{{customdata[{i}]}}' for i, p in enumerate(players)]) +
                '<extra></extra>'
            ) if idx == 0 else None,
            hoverinfo='skip' if idx != 0 else None
        ))
    # X axis ticks: only 8 evenly spaced
    n_labels = 8
    if len(df.index) > n_labels:
        step = max(1, len(df.index) // (n_labels - 1))
        label_indices = list(range(0, len(df.index), step))
        if label_indices[-1] != len(df.index) - 1:
            label_indices.append(len(df.index) - 1)
        tickvals = [df.index[i] for i in label_indices]
    else:
        tickvals = df.index
    fig.update_layout(
        xaxis=dict(
            title='Date',
            tickvals=tickvals,
            tickformat='%Y-%m-%d',
            tickangle=45
        ),
        yaxis_title='Cumulative Score',
        title='Score Progression Over Time',
        legend_title='Player',
        hovermode='x unified',
        margin=dict(l=40, r=40, t=60, b=80)
    )
    pio.show(fig)
