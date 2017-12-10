var http = require('http'),
    https = require('https'),
    querystring = require('querystring'),
    fs = require('fs'),
    path = require('path'),
    config = require(path.join(process.cwd(), 'config'));

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
            storeAccessToken(chunk);
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

function analyze(data, callback) {
    var postData = JSON.stringify({
        "coherentDocument": true,
        "confidenceThreshold": 0.075,
        "docId": "home-live-Mumbai",
        "text": "I live in Mumbai and I find it very interesting. I like Kolkata too.",
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
            storeAnalysisData(chunk);
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

http.createServer(function(req, res) {
    console.log(req.url);
    var body = [];

    if (req.method == 'POST') {
    	req.on('data', function(chunk) {
    		body.push(chunk);
    	})
    	.on('end', function() {
    		body = Buffer.concat(body).toString('utf8');
    		console.log(body);
    	});
    }

    switch (req.url) {
        case '/oauth':
            function callback_1(error) {
                if (error) {
                    throw error;
                }

                res.end('oauth completed');
            }
            oauth(callback_1);
            break;
        case '/analyze':
        	// console.log(req.body);
            function callback_2(error) {
                if (error) {
                    throw error;
                }

                res.end('analysis completed');
            }
            fs.readFile(path.join(process.cwd(), 'accesstoken.json'), function(error, data) {
                if (error) {
                    throw error;
                }

                // console.log(data.toString('utf8'));
                analyze(JSON.parse(data.toString('utf8')), callback_2);
            });
            break;
        default:
            res.end('Select \n1) oauth \n2) analyse');
            break;
    }
}).listen(port, function(error) {
    if (error) {
        throw error;
    }

    console.log(`Server is listening on port ${port}`);
});