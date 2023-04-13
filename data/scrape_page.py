from bs4 import BeautifulSoup
import requests as req
import csv
import re

def scrape_page(transcript_href, filename):
  
	# Request transcript page
	# html_doc = req.get('https://adventuretime.fandom.com/wiki/A_Glitch_is_a_Glitch/Transcript')
	html_doc = req.get('https://adventuretime.fandom.com' + transcript_href)

	if html_doc:
		# Creating a BeautifulSoup object and specifying the parser
		S = BeautifulSoup(html_doc.content , 'html.parser')

		# Check if page is incomplete/"under construction"
		tables = S.find_all('table')
		table_text = ''
		for table in tables:
			table_text += table.get_text()
		if (re.search('[Uu]nder\s+[Cc]onstruction', table_text)):
			print('[Page incomplete. Scraping aborted]')
			return
	
		# Using the prettify method
		# print(S.prettify())

		list_of_lines =  S.find_all('dd')
		infobox_text = S.find('aside', class_='portable-infobox').get_text()

		# Extract season, ep info
		season = re.search('[Ss]eason\s+([0-9]+)', infobox_text).group(1)
		ep_num = re.search('[Ee]pisode\s+([0-9]+)', infobox_text).group(1)
		ep_title = S.find('h1').get_text().strip()
		air_date = re.search('[Aa]ir [Dd]ate[: ]\s+(.*)', infobox_text).group(1).strip()

		# Remove extra bits from ep title ('/Transcript', '(episode)')
		ep_title = re.sub('\/[Tt]ranscript', '', ep_title)
		ep_title = re.sub('\([Ee]pisode\)', '', ep_title)

		print('season:\t\t' + season)
		print('ep_num:\t\t' + ep_num)
		print('ep_title:\t' + ep_title)
		print(air_date)

		# loop through lines to find what characters are in each scene
		chars_in_scene = []
		current_scene = []
		scene_num = 0
		for item in list_of_lines:
			txt = item.get_text()
			said = txt.split(":", 1)
			quote = said[len(said)-1].strip()
			bold = item.find('b')
			# Check if current line contains [*.[Ss]cene*.] and isn't dialog 
			# (there was a bug in s4ep2 with "scene pauses" in the middle of dialog, this dodges it)
			if (re.search('\[.*[Ss]cene.*\]', quote) and not bold):	
				# if it does, store current list of chars at chars_in_scene[scene_num], clear list of chars, increment scene_num
				# print(current_scene)
				# print(quote)
				chars_in_scene.append(current_scene)
				current_scene = []
				scene_num += 1
				continue

			if (bold):
				character = bold.get_text()
				# If current list of chars doesn't contain current line's speaker, add them
				if (current_scene.count(character) == 0):
					current_scene.append(character)

		# if current list of chars isn't empty after end of loop, repeat steps as if it's a new scene
		if (len(current_scene) > 0):
			# print(current_scene)
			chars_in_scene.append(current_scene)

		# print(chars_in_scene)

		with open(filename, 'a', encoding='utf-8', newline='') as csvfile:
			writer = csv.writer(csvfile, delimiter = '\t')

			scene_num = 0
			line_num = 0
			for item in list_of_lines:
				bold = item.find('b')
				if (bold):
					character = bold.get_text()
					# print(character) 
				else:
					character = ''
				txt = item.get_text()
				said = txt.split(":", 1)
				quote = said[len(said)-1].strip()
				# print(quote)

				# Data to be extracted/stored:
				# season | ep_num | ep_title | air_date | line_num | character (blank if not dialog) | chars_in_scene (blank if scene change) | quote

				if (re.search('\[.*[Ss]cene.*\]', quote) and not bold):
					# Scene change - increment scene index and store empty string for chars_in_scene to indicate scene change
					scene_num += 1
					writer.writerow([season, ep_num, ep_title, air_date, line_num, character, '', quote])
				else:
					writer.writerow([season, ep_num, ep_title, air_date, line_num, character, ', '.join(chars_in_scene[scene_num]), quote])
				
				line_num += 1
	else:
		print("Request failed: " + 'https://adventuretime.fandom.com' + transcript_href)


if __name__ == "__main__":
	scrape_page('/wiki/Cloudy/Transcript', 'test.tsv')
	scrape_page('/wiki/Too_Young/Transcript', 'test.tsv')