from pattern.web import asynchronous, time, Google, SEARCH, plaintext

def get_info(search_query):
	if isinstance(search_query, str):
		search_query = str(search_query)
	else:
		return { "Error": "Pass a string, from mine.py [7]", "Result": [None] }

	result = []
	engine = Google(license=None, throttle=0.5, language=None)
	for i in range(1,5):
		for para in engine.search(search_query, type=SEARCH, start=i):
			# print repr(plaintext(para.text))
			# print repr(plaintext(para.url)) + '\n\n'
			result.append(repr(plaintext(para.text)))

	# print '\nResult: ', result

	return { "Error": None, "Result": result }

	# return { "Error": None, "Result": ['Hello World', 'Bye Bye Tommy'] }