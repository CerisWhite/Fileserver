const fs = require('fs');
let http = require('http');

let Configuration = {};
let CertConf = {};
let ServerPort = 80;
if (fs.existsSync('./config.json')) {
	Configuration = JSON.parse(fs.readFileSync('./config.json'));
	if (Configuration['ssl'] == true) {
		http = require('https'); 
		CertConf = {
			key: fs.readFileSync(Configuration['key']),
			cert: fs.readFileSync(Configuration['cert']),
			ca: fs.readFileSync(Configuration['ca'])
		}
	}
	else { ServerPort = Configuration['port']; }
}
else {
	fs.writeFileSync('./config.json', JSON.stringify({
		"ssl": false,
		"key": "./cert/privkey.pem",
		"cert": "./cert/cert.pem",
		"ca": "./cert/chain.pem",
		"port": 80
	}, null, 4));
}

function GetCurrentDate() {
	const date = new Date();
    return date.toUTCString();
}

http.createServer(CertConf, (req, res) => {
	const URLPath = req.url.split("?");
	if (URLPath[0] == Configuration['key']) {
		res.writeHead(404);
		res.end('404: File not found');
	}
	else if (URLPath[0] == Configuration['cert']) {
		res.writeHead(404);
		res.end('404: File not found');
	}
	else if (URLPath[0] == Configuration['ca']) {
		res.writeHead(404);
		res.end('404: File not found');
	}
	else if (URLPath[0] == "/stderr.log") {
		res.writeHead(404);
		res.end('404: File not found');
	}
	else {
		fs.readFile(__dirname + URLPath[0], (err, data) => {
			if (err) {
				res.writeHead(404);
				res.end('404: File not found');
			}
			else {
				res.writeHead(200, HeadersData);
				res.end(data);
			}
		});
	}
}).listen(ServerPort);

console.log('Fileserver started.');
