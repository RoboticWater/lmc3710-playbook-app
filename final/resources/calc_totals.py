import json
jo = json.load(open("questions.json"))
group_totals, play_totals = {},{}

for question in jo:
    if jo[question]["group"] not in group_totals.keys():
        group_totals[jo[question]["group"]] = max(jo[question]["values"])
    else:
        group_totals[jo[question]["group"]] += max(jo[question]["values"])
    if jo[question]["subplay"] not in play_totals.keys():
        play_totals[jo[question]["subplay"]] = max(jo[question]["values"])
    else:
        play_totals[jo[question]["subplay"]] += max(jo[question]["values"])

for k, v in group_totals.items():
    print('"%s": %d,' % (k, v))
    
print()

for k, v in play_totals.items():
    print('"%s": %d,' % (k, v))

'''
for question in jo:
    for nq in jo[question]["next"]:
        if int(question.replace('q','')) >= int(nq.replace('q','')):
            print(question, jo[question]["next"])'''
