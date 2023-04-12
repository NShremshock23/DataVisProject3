from bs4 import BeautifulSoup
import requests as req
import re
  
# Request transcript page
html_doc = req.get('https://adventuretime.fandom.com/wiki/A_Glitch_is_a_Glitch/Transcript')
# html_doc = req.get('https://adventuretime.fandom.com' + transcript_href)

if html_doc:
	# Creating a BeautifulSoup object and specifying the parser
	S = BeautifulSoup(html_doc.content , 'html.parser')
  
	# Using the prettify method
	# print(S.prettify())

	listOfLines =  S.find_all('dd'); 


	for item in listOfLines:
		# TODO: differentiate between items with and without bold tags; 
		# items without aren't dialog and should probably be treated/stored differently
		bold = item.find('b')
		if (bold):
			print(bold.get_text()) 
		txt = item.get_text()
		said = txt.split(":")
		print(said[len(said)-1].strip())
else:
	print("fail")
