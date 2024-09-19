

import json
import pandas as pd
import matplotlib.pyplot as plt



file = json.load(open('output.json'))
print(len(file))


file = json.load(open('data.json'))['claims']
print(len(file))

file = json.load(open('data.json'))['claims']


frame = pd.DataFrame(file)
frame.drop(frame[frame['validity'] == 'should not answer'].index)
frame = frame[~frame['validity'].str.contains('should', na=False)]

graph = frame['validity'].value_counts()
print(graph)
graph.plot(kind='pie', autopct='%1.1f%%')
plt.savefig('graph2.png')
quit()
file = json.load(open('output.json'))
def shouldntanswer(row):
    if ("shoudln't" in  row['source'].lower()) or ("shouldnt" in row['source'].lower()) or ("opinion" in row['source'].lower):
        return True
    return False


for(i, row) in enumerate(file):
    if shouldntanswer(row):
        row['real'] = 'opinion'
        row['correct'] = 'Shouldn\'t Answer'
    elif row['real'] == row['ai']:
        row['correct'] = 'Correct Answer'
    else:
        row['correct'] = 'Incorrect Answer'
dataframe = pd.DataFrame(file)
graph = dataframe['correct'].value_counts()
print(graph)

graph.plot(kind= 'pie', autopct='%1.1f%%')
plt.savefig('graph.png')
