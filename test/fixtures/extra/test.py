import re, sys
from pprint import pprint


regex = {
    "V":       "\u17C1[\u17BC\u17BD]?[\u17B7\u17B9\u17BA]?|"
               "[\u17C2\u17C3]?[\u17BC\u17BD]?[\u17B7-\u17BA]\u17B6|"
               "[\u17C2\u17C3]?[\u17BB-\u17BD]?\u17B6|"
               "\u17BE[\u17BC\u17BD]?\u17B6?|"
               "[\u17C1-\u17C5]?\u17BB(?![\u17D0\u17DD])|"
               "[\u17BF\u17C0]|[\u17C2-\u17C5][\u17BC\u17BD]?[\u17B7-\u17BA]?",
}
syl = re.compile(regex["V"])
res = syl.search('ល\u17BE\u17B6ក') # លើាក')
pprint(res)