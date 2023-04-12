from bs4 import BeautifulSoup
import requests as req
import re

# Search function to find a tags with href attrs ending in '/Transcipt'
# Not 100% sure I understand how this works but based it on:
# https://www.crummy.com/software/BeautifulSoup/bs4/doc/#a-function
def transcript_search(href):
    # True if href includes "/Transcript", upper or lowercase (I think they're all uppercase but catching both just in case)
    return (href and re.compile('\/[Tt]ranscript').search(href))

# Request transcript link page (organized alphabetically)
html_doc = req.get('https://adventuretime.fandom.com/wiki/Category:Transcripts')

if html_doc:
    # Create BeautifulSoup object and specify the parser
    S = BeautifulSoup(html_doc.content , 'html.parser')
  
    # Using the prettify method
    # print(S.prettify())

    # (for each tag that matches search function defined above)
    for a in S.find_all(href=transcript_search):
        print ("Found the URL:", a['href'])
        # TODO: call actual data processing script for each transcript page
        # TODO: add timer between calls for each page?
else:
    print("fail")