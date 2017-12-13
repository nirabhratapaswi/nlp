from textblob import TextBlob, Word
from textblob.wordnet import VERB
from textblob.np_extractors import ConllExtractor, FastNPExtractor # for noun-phrase chunking
from textblob.classifiers import NaiveBayesClassifier
from textblob.sentiments import NaiveBayesAnalyzer, PatternAnalyzer
import similarity, mine, extract_info
from ast import literal_eval

raw_query1 = "Physics is a better subject to study than Mathematics. I like Physics more than I like Mathematics. Physicists are more intelligent than Mathematicians."
raw_query2 = "I love football. Cristiano Ronaldo is my favourite player."
raw_query3 = "I hate football. Cristiano Ronaldo is the worst player."
raw_query2 = "Automation is good for the economy."

# Uncomment below to create noun_phrases and actually search for related information
# raw_query2 = raw_input('Enter argument: ')
search_query_array = extract_info.noun_phrases(raw_query2)
search_query = ''
for phrase in search_query_array:
    search_query += ' ' + str(phrase)

search_query = 'automation good economy'
print '\nSearch Query: ', search_query

returned_data = mine.get_info(search_query)
# print '\nMined Data Result: ', returned_data["Result"]

file_write_data = ''
file_write_data1 = ''
index = 0
for element in returned_data["Result"]:
    index += 1
    file_write_data += '\n' + element
    file_write_data1 += '\n' + str(index) + ') ' + element

# file_write_data = unicode(file_write_data, 'utf8')
file_write_data = file_write_data.encode('utf8', 'replace')
# print '\nFile Write Data(utf8 encoded): ', file_write_data

# print similarity.symmetric_sentence_similarity(raw_query3, raw_query2)

# f = open('info.txt', 'r+')
# print f.read()
# f.close()
f = open('info.txt', 'w')
# f1 = open('info_dummy.txt', 'w')
f.write(file_write_data)
# f1.write(file_write_data1)
f.close()
# f1.close()

# This part calculates similarity within texts
f = open('info.txt', 'r+')
raw_read = f.read()
f.close()

blob = TextBlob(raw_read)
sentences = []
index = 0
for sentence in blob.sentences:
    index += 1
    sentences.append(str(sentence))
    print '\n', str(index), ') ', str(sentence)

# print '\nSentences: ', sentences
raw_query2 = "Automation is bad for the economy."

reply = []
index = 0
for sentence in sentences:
    index += 1
    # print '\n', str(index), similarity.symmetric_sentence_similarity(sentence, raw_query2)
    if similarity.symmetric_sentence_similarity(sentence, raw_query2) > 0.7:
        reply.append(sentence)

print 'Possible counters: '
index = 0
for line in reply:
    index += 1
    print '\n', str(index), ') ', line
