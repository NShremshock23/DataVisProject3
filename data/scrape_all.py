from bs4 import BeautifulSoup
import requests as req
import time, random, re
import scrape_page

# Search function to find a tags with href attrs ending in '/Transcipt'
# Not 100% sure I understand how this works but based it on:
# https://www.crummy.com/software/BeautifulSoup/bs4/doc/#a-function
def transcript_search(href):
    # True if href includes "/Transcript", upper or lowercase (I think they're all uppercase but catching both just in case)
    return (href and re.compile('\/[Tt]ranscript').search(href))


if __name__ == "__main__":

    # Request transcript link page
    # (organized by season)
    main_href = 'https://adventuretime.fandom.com/wiki/Category_talk:Transcripts'

    # (organized alphabetically)
    # main_href = 'https://adventuretime.fandom.com/wiki/Category:Transcripts'

    html_doc = req.get(main_href)

    if html_doc:
        # Create BeautifulSoup object and specify the parser
        S = BeautifulSoup(html_doc.content , 'html.parser')

        # True if skipping past eps before/including skip_past_ep, False if starting from beginning
        # Note: order of episodes is dependent on which main_href is being used!
        skip = False
        skip_past_ep = '/wiki/Abstract/Transcript'

        # (for each tag that matches search function defined above)
        for a in S.find_all(href=transcript_search):
            
            # Skip past all eps before and including skip_past_ep
            if (a['href'] == skip_past_ep):
                skip = False
                continue
            elif (skip):
                continue
            
            print ("Found URL:", a['href'])

            # Call data processing script for each transcript page
            scrape_page.scrape_page(a['href'], 'adventure_time_all_eps_with_scene_num.tsv')

            # Add timer between calls for each page 0.5 - 3s, random (will hopefully prevent getting blocked)
            wait_time = random.random() * 2.5 + 0.5
            print('[wait ' + str(wait_time) + 's]\n')
            time.sleep(wait_time)

            # BREAK FOR TESTING TO ONLY RUN 1 TRANSCRIPT PAGE
            # break
    else:
        print("Request failed: " + main_href)