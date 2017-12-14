from textblob import TextBlob, Word
from textblob.wordnet import VERB
from textblob.np_extractors import ConllExtractor, FastNPExtractor # for noun-phrase chunking
from pattern.web import asynchronous, time, Google, SEARCH, plaintext
from textblob.classifiers import NaiveBayesClassifier
from textblob.sentiments import NaiveBayesAnalyzer, PatternAnalyzer

raw_query = "Physics is a better subject to study than Mathematics. I like Physics more than I like Mathematics. Physicists are more intelligent than Mathematicians."
raw_query = "I love football. Cristiano Ronaldo is my favourite player."
raw_query = "I hate football. Cristiano Ronaldo is the worst player."

'''
# Get input ready for use
query = TextBlob(raw_query)
print 'Query: ', query
tags = query.tags
print 'Tags: ', tags
nouns = query.noun_phrases
print 'Nouns: ', nouns
sentiment = query.sentiment
print 'Sentiment: ', sentiment
words = query.words
print 'Words: ', words
sentences = query.sentences
print 'Sentences: ', sentences
parse = query.parse()
print 'Parse: ', parse
language = query.detect_language()
print 'Language: ', language
# TODO : add spelling checks to correct the input sentences for better searches
corrected = query.correct()
print 'Corrected: ', corrected

# Search for results
w = Word('Octopus')
print '\nSynsets: ', w.synsets
print '\nDefinitions: ', w.definitions
print Word("hack").get_synsets(pos=VERB)
'''

# noun-phrase chunking
raw_query = raw_input('Enter text: ')
# extractor = FastNPExtractor()
extractor = ConllExtractor()
blob = TextBlob(raw_query, np_extractor=extractor)
noun_phrases = blob.noun_phrases
print '\nNoun-Phrases: ', noun_phrases

search_query = ''
for phrase in noun_phrases:
	search_query += ' ' + str(phrase)

print search_query

# Finding the sentiment of the query
# NaiveBayesClassifier
train = [
    ('I love this sandwich.', 'pos'),
    ('this is an amazing place!', 'pos'),
    ('I feel very good about these beers.', 'pos'),
    ('this is my best work.', 'pos'),
    ("what an awesome view", 'pos'),
    ('I like playing badminton', 'pos'),
    ('I do not like this restaurant', 'neg'),
    ('I am tired of this stuff.', 'neg'),
    ("I can't deal with this", 'neg'),
    ('he is my sworn enemy!', 'neg'),
    ('my boss is horrible.', 'neg'),
    ('I hate my friend', 'neg'),
    ('He is jealous of me', 'neg')
]
cl = NaiveBayesClassifier(train)
search_query_sentiment = 1
# prob_dist = cl.prob_classify(search_query)
prob_dist = cl.prob_classify(raw_query)
if round(prob_dist.prob("pos"), 2) <= 0.63 and round(prob_dist.prob("pos"), 2) >= 0.37:
	search_query_sentiment = 0
elif round(prob_dist.prob("pos"), 2) < 0.37:
	search_query_sentiment = -1

print '\nNaive Bayes Classification: ', search_query_sentiment, ', distribution: ', prob_dist.prob("pos")# cl.classify("This is an amazing library!")

# Naive Bayes Analyzer -- use this if data set for Classifier is not proper.
blob = TextBlob(raw_query, analyzer=NaiveBayesAnalyzer())
search_query_sentiment = blob.sentiment

print '\nNaive Bayes Analyzer: ', search_query_sentiment

# Pattern Analyzer -- use this if data set for Classifier is not proper.
blob = TextBlob(raw_query, analyzer=PatternAnalyzer())
search_query_sentiment = blob.sentiment

print '\nPattern Analyzer: ', search_query_sentiment

'''
request = asynchronous(Google().search, 'I eat pizza with a fork.', timeout=4)
while not request.done:
	time.sleep(0.1)
	print "busy ..."

print request.value

engine = Google(license=None, throttle=0.5, language=None)
for i in range(1,2):
	for result in engine.search(search_query, type=SEARCH, start=i):
		print repr(plaintext(result.text))
		print repr(plaintext(result.url)) + '\n\n'
'''
