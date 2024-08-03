import pandas
import json

n5_link = 'https://raw.githubusercontent.com/jamsinclair/open-anki-jlpt-decks/a966d28cdf0178933cf629dfabf24346d086d515/src/n5.csv'
df = pandas.read_csv(n5_link)
n5_object = [*df.to_dict(orient='records')]
n5_json = json.dumps(n5_object)

with open('n5.csv', 'w') as file:
    file.write(n5_json)