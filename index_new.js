var http = require('http'),
    https = require('https'),
    querystring = require('querystring'),
    fs = require('fs'),
    path = require('path'),
    config = require(path.join(process.cwd(), 'config')),
    readline = require('readline');

var port = 3000;

function storeAccessToken(chunk) {
    fs.writeFile(path.join(process.cwd(), 'accesstoken.json'), JSON.parse(JSON.stringify(chunk)), function(error) {
        if (error) {
            throw error;
        }

        console.log('Chunk saved in file');
    });
}

function storeAnalysisData(chunk) {
    fs.writeFile(path.join(process.cwd(), 'analysisdata.json'), JSON.parse(JSON.stringify(chunk)), function(error) {
        if (error) {
            throw error;
        }

        console.log('Chunk saved in file');
    });
}

function storeEntityData(chunk) {
    fs.writeFile(path.join(process.cwd(), 'entities.json'), JSON.parse(JSON.stringify(chunk)), function(error) {
        if (error) {
            throw error;
        }

        console.log('Chunk saved in file');
    });
}

function storeCategoryData(chunk) {
    fs.writeFile(path.join(process.cwd(), 'categories.json'), JSON.parse(JSON.stringify(chunk)), function(error) {
        if (error) {
            throw error;
        }

        console.log('Chunk saved in file');
    });
}

function oauth(callback) {
    var postData = querystring.stringify({
        'client_id': config.client_id, //'d5973e1a',
        'client_secret': config.client_secret, //'e5b6935c4bf14e8a73cc2501013262d5',
        'grant_type': config.grant_type //'client_credentials'
    });

    var options = {
        hostname: 'api.ambiverse.com',
        port: 443,
        path: '/oauth/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
    };

    var req = https.request(options, function(res) {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log(`BODY: ${chunk}`);
            // storeAccessToken(chunk);
            fs.writeFile(path.join(process.cwd(), 'accesstoken.json'), '', function(err) {
                fs.appendFile(path.join(process.cwd(), 'accesstoken.json'), JSON.parse(JSON.stringify(chunk)), function(err) {
                    if (err) {
                        throw err;
                    }

                    console.log('Chunk written');
                });
            });
        });
        res.on('end', function() {
            console.log('No more data in response.');
            callback(null);
        });
    });

    req.on('error', function(error) {
        console.error(`problem with request: ${error.message}`);
        callback(error);
    });

    // write data to request body
    req.write(postData);
    req.end();
}

function analyze(data, text, callback) {
    var postData = JSON.stringify({
        "coherentDocument": true,
        "confidenceThreshold": 0.075,
        "docId": "home-live-Mumbai",
        "text": "India is a poor country", // "I live in Mumbai and I find it very interesting. I like Kolkata too.",
        "language": "en",
        "annotatedMentions": [{
            "charLength": 2,
            "charOffset": 0
        }]
    });

    var options = {
        hostname: 'api.ambiverse.com',
        port: 443,
        path: '/v1/entitylinking/analyze',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': data.access_token
        }
    };

    var req = https.request(options, function(res) {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log(`BODY: ${chunk}`);
            // storeAnalysisData(chunk);
            fs.writeFile(path.join(process.cwd(), 'analysisdata.json'), '', function(err) {
                fs.appendFile(path.join(process.cwd(), 'analysisdata.json'), JSON.parse(JSON.stringify(chunk)), function(err) {
                    if (err) {
                        throw err;
                    }

                    console.log('Chunk written');
                });
            });
        });
        res.on('end', function() {
            console.log('No more data in response.');
            callback(null);
        });
    });

    req.on('error', function(error) {
        console.error(`problem with request: ${error.message}`);
        callback(error);
    });

    // write data to request body
    req.write(postData);
    req.end();
}

function entity(dataArray, data, callback) {
    var postData = JSON.stringify(dataArray);

    var options = {
        hostname: 'api.ambiverse.com',
        port: 443,
        path: '/v1/knowledgegraph/entities?offset=0&limit=10', // offset and limit can be changed
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': data.access_token
        }
    };

    var req = https.request(options, function(res) {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log(`BODY: ${chunk}`);
            // storeEntityData(chunk);
            fs.writeFile(path.join(process.cwd(), 'entities.json'), '', function(err) {
                fs.appendFile(path.join(process.cwd(), 'entities.json'), JSON.parse(JSON.stringify(chunk)), function(err) {
                    if (err) {
                        throw err;
                    }

                    console.log('Chunk written');
                });
            });
        });
        res.on('end', function() {
            console.log('No more data in response.');
            callback(null);
        });
    });

    req.on('error', function(error) {
        console.error(`problem with request: ${error.message}`);
        callback(error);
    });

    // write data to request body
    req.write(postData);
    req.end();
}

function categories(dataArray, data, callback) {
    var writeStream = fs.createWriteStream(path.join(process.cwd(), 'categories.json'), {
        flags: 'a'
    });
    var postData = JSON.stringify(dataArray);

    var options = {
        hostname: 'api.ambiverse.com',
        port: 443,
        path: '/v1/knowledgegraph/categories?offset=0&limit=10', // offset and limit can be changed
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': data.access_token
        }
    };

    var req = https.request(options, function(res) {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log(`BODY: ${chunk}`);
            // storeCategoryData(chunk);
            // req.pipe(writeStream, {end: false});
            fs.appendFile(path.join(process.cwd(), 'categories.json'), JSON.parse(JSON.stringify(chunk)), function(err) {
                if (err) {
                    throw err;
                }

                console.log('Chunk written');
            });
        });
        res.on('end', function() {
            console.log('No more data in response.');
            callback(null);
        });
    });

    req.on('error', function(error) {
        console.error(`problem with request: ${error.message}`);
        callback(error);
    });

    // write data to request body
    req.write(postData);
    req.end();
}


/*console.log(req.url);
var body = [];

if (req.method == 'POST') {
    req.on('data', function(chunk) {
            body.push(chunk);
        })
        .on('end', function() {
            body = Buffer.concat(body).toString('utf8');
            console.log(body);
        });
}*/

// process.stdin.resume();
process.stdin.setEncoding('utf8');
function displayOptions() {
    process.stdout.write(`\n\n\nSelect an option: \n1) Oauth\n2) Analyse\n3) Entity\n4) Categories\n`);
}
displayOptions();

process.stdin.on('data', function(consoleData) {
    switchData = consoleData.toString().slice(0, 1);

    switch (switchData) {
        case '1':
            // process.stdout.write();
            function callback_1(error) {
                if (error) {
                    throw error;
                }

                // res.end('oauth completed');
                process.stdout.write('Oauth Completed');
                displayOptions();
            }
            oauth(callback_1);
            break;
        case '2':
            // console.log(req.body);
            function callback_2(error) {
                if (error) {
                    throw error;
                }

                // res.end('analysis completed');
                process.stdout.write('Analysis Completed');
                displayOptions();
            }
            fs.readFile(path.join(process.cwd(), 'accesstoken.json'), function(error, data) {
                if (error) {
                    throw error;
                }

                // console.log(data.toString('utf8'));
                var text = consoleData.toString().slice(2, consoleData.toString().length-2);
                process.stdout.write(`Text: ${text}`);
                analyze(JSON.parse(data.toString('utf8')), text, callback_2);
            });
            break;
        case '3':
            function callback_3(error) {
                if (error) {
                    throw error;
                }

                // res.end('entity retrieval completed');
                process.stdout.write('Entity Retrieval Completed');
                displayOptions();
            }
            fs.readFile(path.join(process.cwd(), 'analysisdata.json'), function(error, data) {
                if (error) {
                    throw error;
                }

                // console.log(data.toString('utf8'));
                var dataArray = [];
                data = JSON.parse(data.toString('utf8'));
                data.matches.forEach(function(element, index) {
                    if (element.entity) {
                        if (element.entity.id) {
                            dataArray.push(element.entity.id.toString());
                        }
                    }

                    if (data.matches.length - 1 == index) {
                        // console.log('dataArray: ', dataArray);
                        fs.readFile(path.join(process.cwd(), 'accesstoken.json'), function(error, data) {
                            if (error) {
                                throw error;
                            }

                            entity(dataArray, JSON.parse(data.toString('utf8')), callback_3);
                        });
                    }
                });
                // entity(JSON.parse(data.toString('utf8')), callback_3);
            });
            break;
        case '4':
            function callback_4(error) {
                if (error) {
                    throw error;
                }

                // res.end('categories retrieval completed');
                process.stdout.write('Categories Retrieval Completed');
                displayOptions();
            }
            fs.readFile(path.join(process.cwd(), 'entities.json'), function(error, data) {
                if (error) {
                    throw error;
                }

                // console.log(data.toString('utf8'));
                var dataArray = [];
                data = JSON.parse(data.toString('utf8'));
                data.entities.forEach(function(element, index) {
                    if (element.categories) {
                        dataArray.push(element.categories.toString());
                    }

                    if (data.entities.length - 1 == index) {
                        // console.log('dataArray: ', dataArray);
                        fs.readFile(path.join(process.cwd(), 'accesstoken.json'), function(error, data) {
                            if (error) {
                                throw error;
                            }

                            categories(dataArray, JSON.parse(data.toString('utf8')), callback_4);
                        });
                    }
                });
                // entity(JSON.parse(data.toString('utf8')), callback_3);
            });
            break;
        default:
            res.end('Select \n1) oauth \n2) analyse');
            break;
    }
})

process.stdin.on('end', function() {
    process.stdout.write('end');
});
process.on('SIGINT', function() { // detect's signal interrupt -- ctrl+c
    process.exit(0);
});
process.on('exit', function(code) {
    console.log(`About to exit with code: ${code}`);
});

/*const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Configure oauth? ', function(answer) {
    // TODO: Log the answer in a database
    console.log(`Thank you for your valuable feedback: ${answer}`);

    rl.close();
});*/
