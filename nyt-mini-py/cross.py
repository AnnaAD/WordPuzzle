from distutils.command.build import build
from operator import truediv
import re 
from copy import copy, deepcopy
from time import sleep

class Cross:
    crossword = []

    def __init__(self, dim):
        self.dim = dim
        self.crossword = [ ["."]*dim for i in range(dim)]
        self.usedWords = set()

    def down(self, i):
        return [row[i] for row in self.crossword]
    
    def across(self,i):
        return self.crossword[i]

    def set(self, i, word, dir):
        self.usedWords.add(word)
        if(dir == "down"):
            self.set_down(i, word)
        else:
            self.set_across(i,word)

    def set_down(self, i, word):
        for j,row in enumerate(self.crossword):
            row[i] = word[j]
        self.usedWords.add(word)       

    
    def set_across(self, i, word):
        self.crossword[i] = list(word) 
        self.usedWords.add(word) 

    def get(self, i, dir):   
        if(dir == "down"):
            return self.down(i)
        else:
            return self.across(i)   

    def hasBlank(self):
        for i in self.crossword:
            for j in i:
                if(j == "."):
                    return True
        return False
 
    def __str__(self):
        out = ""
        for i in self.crossword:
            for j in i:
                out += j
            out += "\n"
        return out

class Dictionary:
    def __init__(self,listWord):
        self.words = {}
        for l in listWord:
            if(l != ""):
                out = l.split(";")
                out[0] = out[0].lower()
                val = random.uniform(0, int(out[1]))
                if(int(out[1]) >= 50 and int(out[1]) < 100 and len(out[0]) < 6):
                    if(len(out[0]) == 4):
                        self.words[out[0] + "X"] = val
                        self.words["X" + out[0]] = val
                    elif(len(out[0]) == 3):
                        self.words[out[0] + "XX"] = val
                        self.words["XX" + out[0]] = val
                    else:
                        self.words[out[0]] = val

    def findWord(self, regex, edge = False):
        r = re.compile("^"+regex+"$")
        newlist = list(filter(r.match, self.words.keys())) # Read Note below
        newlist = sorted(newlist, key= lambda x: int(self.words[x]), reverse=True)
        return newlist if edge or ("X" in regex) else [ x for x in newlist if "X" not in x ]
    
    def findWordUnique(self, regex, cross, edge = False):
        r = re.compile("^"+regex+"$")
        newlist = list(filter(r.match, self.words.keys())) # Read Note below
        newlist = sorted(newlist, key= lambda x: int(self.words[x]), reverse=True)
        newlist =  [x for x in newlist if x not in cross.usedWords]
        return newlist if edge or ("X" in regex) else [ x for x in newlist if "X" not in x ]

import random
seen = set()
def build_cross(cross, dictionary, i, dir, precompute = []):
    if(str(cross) in seen):
        print("SEEN?")
        return None
    else:
        seen.add(str(cross))
    print("START")
    print(dir , i)
    print(cross)
    # check if we were done and that last filled across (implicitly filled) is a word.
    if(not cross.hasBlank()):
        return cross
    
    newCross = deepcopy(cross)
    if(dir == "across"):
        nextDir = "down"
    else:
        nextDir = "across"
    
    if(not precompute):
        if(dir == "down"):
            regex = "".join(newCross.down(i))
        else:
            regex = "".join(newCross.across(i))

        options = dictionary.findWordUnique(regex, newCross,i == 0 or i == cross.dim-1)
    else:
        options = precompute

    # try all options in order of best words first
    #print("found options: ", options)
    for j in range(len(options)):
        newCross.set(i,options[j],dir)
        for l in range(cross.dim):
            implicit = "".join(newCross.get(l, nextDir))
            if("." not in implicit):
                if(implicit not in dictionary.words):
                    print("last word invalid: ", implicit)
                    return None

        nextRegexes = []
        for l in range(cross.dim):
            word = "".join(newCross.get(l, nextDir))
            if "." in word:
                poss = dictionary.findWordUnique(word,newCross,l == 0 or l == cross.dim-1)
                nextRegexes.append([word,l,poss])
                if(len(poss) == 0):
                    return None
        
        if(len(nextRegexes) == 0):
            return newCross

        nextRegexes = sorted(nextRegexes, key = lambda x : len(x[2]))

        next = build_cross(newCross, dictionary, nextRegexes[0][1], nextDir, nextRegexes[0][2])
        if(next != None):
            return next
        
    # we tried all options -- fail
    print("could not find word at", str(i), dir, "for")
    print(cross)
    return None
    
        

f = open("peter-broda-wordlist__scored.txt", "r")
wordDict = Dictionary(f.read().split("\n"))
cross = Cross(5)
cross.set_across(2, "atlas")

nextRegexes = []
nextDir = "down"
for l in range(cross.dim):
    word = "".join(cross.get(l, nextDir))
    if "." in word:
        poss = wordDict.findWordUnique(word,cross)
        nextRegexes.append([word,l,poss])
nextRegexes = sorted(nextRegexes, key = lambda x : len(x[2]))
out = build_cross(cross, wordDict, nextRegexes[0][1], nextDir, nextRegexes[0][2])
print(out.crossword)
print(out)

