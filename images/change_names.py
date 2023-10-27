import os
from os import listdir
from os.path import isfile, join

def ShiftUpNames(mypath, position):

    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]

    file_names = list()

    for i in range(len(onlyfiles)):
        if onlyfiles[i].find(".png") == -1: continue
        file_names.append(int(onlyfiles[i].split(".")[0]))

    file_names.sort(reverse=True)

    for i in file_names:
        if i < position: continue
        #os.rename(f"./bagmons/{i}.png", f"./bagmons/{i+1}.png")
