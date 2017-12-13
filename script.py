from pattern.web import asynchronous, time, Google, SEARCH, plaintext
import MBSP

if MBSP.started()==True:
	print 'MBSP server has started.'

# Parse the string
# raw = raw_input('Enter a sentence: ')
raw = 'The cat sat on the mat . The cat ate the mouse .'
raw = "I don't like Narendra Modi. Narendra Modi is the Prime Minister of India. He is not my friend."
raw = "During ancient times, the people of Sparta did not use coins. They used iron bars as money"
s = MBSP.parse(raw,
	tokenize=True,
	tags = True,
    chunks = True,
    relations = True,
    anchors = True,
    lemmata = True,
    encoding = 'utf-8')
'''
s = MBSP.split(s) #, token=[MBSP.WORD, MBSP.POS, MBSP.CHUNK, MBSP.PNP, MBSP.RELATION, MBSP.ANCHOR, MBSP.LEMMA])	#'WORD', 'POS', 'CHUNK', 'PNP', 'RELATION', 'ANCHOR', 'LEMMA'])

array = []
index = 0
for s_elements in s:
	index += 1
	for subject in s_elements.subjects:
		# print 'Index: ', index, ' -- Subject: ', subject.string
		array.append(subject.string)

index = 0
for s_elements in s:
	index += 1
	for object1 in s_elements.objects:
		# print 'Index: ', index, ' -- Subject: ', object1.string
		array.append(object1.string)

s = MBSP.parse(raw,
	tokenize=True,
	tags = True,
    chunks = True,
    relations = True,
    anchors = True,
    lemmata = True,
    encoding = 'utf-8')

'''
# Narendra Modi is the Prime Minister of India.

sentence = MBSP.Sentence(string=s, token=[MBSP.WORD, MBSP.POS, MBSP.CHUNK, MBSP.PNP, MBSP.RELATION, MBSP.ANCHOR, MBSP.LEMMA])
# print '\nSentence string: ', sentence.string
nouns = []
adjectives = []
print '\nSentence words: ', sentence.words
for word in sentence.words:
	# print '\n Sentence word: ', word
	# print '\n Sentence word type: ', word.type
	# print '\n Sentence word tags: ', word.tags()
	if word.type in ['NN', 'NNS', 'NNP', 'NNPS']:
		nouns.append(word.string)
	if word.type in ['JJ', 'JJR', 'JJS']:
		adjectives.append(word.string)

print '\nNouns: ', nouns
print '\nAdjectives: ', adjectives
print '\nAnchors: ', sentence.anchors
for chunk in sentence.chunks:
	print '\nSentence chunk: ', chunk
	# print 'Sentence chunk relation: ', chunk.relation
	# print 'Sentence chunk related: ', chunk.related
	print 'Sentence chunk anchor: ', chunk.anchor
	print 'Sentence chunk subject: ', chunk.subject
	print 'Sentence chunk object: ', chunk.object
	print 'Sentence chunk verb: ', chunk.verb

# print '\nSentence subjects: ', sentence.subjects
# print '\nSentence objects: ', sentence.objects
# print '\nSentence relations: ', sentence.relations
# print '\nSentence verbs: ', sentence.verbs

# MBSP.pprint(s)
''' for sentence in s:
	for chunk in sentence.chunks:
		print [word.lemma for word in chunk.words], chunk.attachments
'''

# Make text from the parsed string
# text = MBSP.Text(s, token=[WORD, POS, CHUNK, PNP, REL, ANCHOR, LEMMA])
# print text.sentence

'''
# Form a sentence out of the Text
sentence = MBSP.Sentence(string=s, token=[MBSP.WORD, MBSP.POS, MBSP.CHUNK, MBSP.PNP, MBSP.RELATION, MBSP.ANCHOR, MBSP.LEMMA])

# Form a word object
word = MBSP.Word(sentence, s, lemma=None, type=None, index=0)

# Sentence chunks
chunk = MBSP.Chunk(sentence, words=[word], type=None, role=None, relation=None)
#chunk.start
#chunk.stop
'''

# Print statements
# print repr(s)
# print s[0].pnp
#print '\nSentence chunks: ', sentence.chunks, ', Sentence relations: ', sentence.relations
#print '\nChunk words: ', chunk.words, ', Chunk Relation: ', chunk.relation, ', Chunk relations: ', chunk.relations
#print '\nWord: ', word
#print '\nChunk: ', chunk


request = asynchronous(Google().search, 'I eat pizza with a fork.', timeout=4)
while not request.done:
	time.sleep(0.1)
	print "busy ..."

print request.value


engine = Google(license=None, throttle=0.5, language=None)
for i in range(1,5):
	for result in engine.search('I eat pizza with a fork.', type=SEARCH, start=i):
		print repr(plaintext(result.text))
		print repr(plaintext(result.url)) + '\n\n'

