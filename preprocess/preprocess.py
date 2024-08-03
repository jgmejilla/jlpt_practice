import pandas

link = 'https://raw.githubusercontent.com/jamsinclair/open-anki-jlpt-decks/a966d28cdf0178933cf629dfabf24346d086d515/src/n5.csv'
df = pandas.read_csv(link)
df_processed = df[['expression', 'reading', 'meaning']]
csv = df_processed.to_csv(index=False, sep='\t')

with open('n5.csv', 'w') as file:
    file.write(csv)
