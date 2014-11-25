#!/usr/bin/env python

import os
import glob
from subprocess import call
import json
import sys

print "publishing to templates\n\n"

##os.mkdir("./ttestt")
statinfo=os.stat("./angular")
print statinfo.st_size
templatesDir="./../../magnetTemplates"
tempAbs=os.path.abspath(templatesDir)
templatesDirExists=os.path.isdir(tempAbs)
componentsLocalAbs=os.path.abspath("./")
#print templatesDirExists
if templatesDirExists:
	orig_json=open('bower.json')
	origMap=json.load(orig_json)
	originalVersion=origMap["version"]
	bowerCompName=origMap["name"]
	orig_json.close()
	#print originalVersion["version"]
	#	sys.exit("no original version in bower.json")
	os.chdir(tempAbs)
	for dir in os.listdir("./"):
		#print(dir.startswith("."))
		os.chdir(tempAbs)
		#print(os.path.isdir(dir))
		compBowerRel="app/bower_components/"+bowerCompName+"/bower.json"
		if dir.startswith(".")==False and os.path.isdir(dir) and os.path.isfile("./"+dir+"/bower.json") and os.path.isfile("./"+dir+"/"+compBowerRel):
			print("template DIR="+dir)
			os.chdir(dir)
			if not os.path.isfile("./.bowerrc"):
				newF=file(".bowerrc", "w")
				newF.write('{"directory": "app/bower_components"}')
				newF.close()
			#print("FF"+os.path.abspath('./'+compBowerRel))
			json_data=open('./'+compBowerRel)
			data = json.load(json_data)
			#print("v2="+data["version"]+" v1="+originalVersion)
			json_data.close()
			#break
			if data["version"]==originalVersion:
				#json_data.close()
				print("same version found")
				continue

			#call(["bower", "uninstall","magnet-pages-app-tools", "--save"])
			
			call(["bower", "install" , componentsLocalAbs, "--save"])
			
		#	print(componentsLocalAbs)
			#break
			#print glob.glob("./bower.json")
			#for file in glob.glob("*.bower"):
			#	print(file)
