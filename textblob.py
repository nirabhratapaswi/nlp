from textblob import TextBlob, Word
from textblob.wordnet import VERB

raw_query = "Physics is a better subject to study than Mathematics. I like Physics more than I like Mathematics. Physicists are more intelligent than Mathematicians."

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
