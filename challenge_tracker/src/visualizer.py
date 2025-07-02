import pandas as pd
import plotly.graph_objs as go
import plotly.io as pio

def plot_scores(df: pd.DataFrame) -> None:
    """
    Plots the score progression of each player over time using plotly for interactivity.
    Adds a language selection dropdown for English, French, and Spanish.
    Translates the chart title, legend, y-axis, and x-axis labels.
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
    # Language translations
    translations = {
        'en': {
            'title': 'Score Progression Over Time',
            'legend': 'Player',
            'yaxis': 'Cumulative Score',
            'xaxis': 'Date',
        },
        'es': {
            'title': 'Progresión de Puntuaciones en el Tiempo',
            'legend': 'Jugador',
            'yaxis': 'Puntuación Acumulada',
            'xaxis': 'Fecha',
        },
        'fr': {
            'title': 'Progression des Scores dans le Temps',
            'legend': 'Joueur',
            'yaxis': 'Score Cumulé',
            'xaxis': 'Date',
        },
        'it': {
            'title': 'Progressione dei Punteggi nel Tempo',
            'legend': 'Giocatore',
            'yaxis': 'Punteggio Cumulativo',
            'xaxis': 'Data',
        },
        'de': {
            'title': 'Punktentwicklung im Zeitverlauf',
            'legend': 'Spieler',
            'yaxis': 'Kumulierte Punktzahl',
            'xaxis': 'Datum',
        },
        'pt': {
            'title': 'Progresso da Pontuação ao Longo do Tempo',
            'legend': 'Jogador',
            'yaxis': 'Pontuação Acumulada',
            'xaxis': 'Data',
        },
    }
    lang_codes = ['en', 'es', 'fr', 'it', 'de', 'pt']
    lang_names = ['English', 'Español', 'Français', 'Italiano', 'Deutsch', 'Português']
    # Initial language
    lang = 'en'
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
                '<br>'.join([f'<b>{p}</b>: %{{customdata[{i}]}}' for i, p in enumerate(players)]) +
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
    # Add language selection dropdown
    updatemenus = [
        dict(
            buttons=[
                dict(
                    args=[{
                        'title.text': translations[code]['title'],
                        'yaxis.title.text': translations[code]['yaxis'],
                        'xaxis.title.text': translations[code]['xaxis'],
                        'xaxis.tickvals': tickvals,
                        'xaxis.tickformat': '%Y-%m-%d',
                        'xaxis.tickangle': 45,
                        'legend.title.text': translations[code]['legend']
                    }],
                    label=lang_names[i],
                    method='relayout',
                ) for i, code in enumerate(lang_codes)
            ],
            direction='down',
            showactive=True,
            x=1.15,
            xanchor='left',
            y=1.15,
            yanchor='top',
        )
    ]
    fig.update_layout(
        xaxis=dict(
            title=dict(text=translations[lang]['xaxis']),
            tickvals=tickvals,
            tickformat='%Y-%m-%d',
            tickangle=45
        ),
        yaxis=dict(title=dict(text=translations[lang]['yaxis'])),
        title=dict(text=translations[lang]['title']),
        legend=dict(title=dict(text=translations[lang]['legend'])),
        hovermode='x unified',
        margin=dict(l=40, r=40, t=60, b=80),
        updatemenus=updatemenus
    )
    pio.write_html(fig, file='scoreboard.html', auto_open=True, config={'displayModeBar': False})
