var compression = require('compression');
var dns = require('dns');
var express = require('express');
var path = require('path');

var app = express();
var port = parseInt(process.env.PORT, 10) || 9000;

app.enable('trust proxy');
app.enable('jsonp callback');

app.use(compression());
app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'static/html/httpconfig.html'));
});

app.get('/api/httpconfig', function (req, res) {
  var remoteReq = {
    ip: {
      displayName: 'IP Address',
      value: req.ip,
    },
    hostname: {
      displayName: 'Remote Host',
      value: '',
    },
    ua: {
      displayName: 'User Agent',
      value: req.headers['user-agent'],
    },
    language: {
      displayName: 'Language',
      value: req.headers['accept-language'],
    },
    connection: {
      displayName: 'Connection',
      value: req.headers.connection,
    },
    encoding: {
      displayName: 'Encoding',
      value: req.headers['accept-encoding'],
    },
    mimeType: {
      displayName: 'MIME Type',
      value: req.headers.accept,
    },
    charset: {
      displayName: 'Charset',
      value: req.headers['accept-charset'],
    },
  };

  dns.reverse(req.ip, function (err, domains) {
    if (domains) {
      remoteReq.hostname.value = domains[0];
    }

    res.jsonp(remoteReq);
  });
});

app.use(function (req, res, next) {
  res.send(404, "404: Sorry, we've had an error.");
});

app.listen(port);
console.log('Listening on port ' + port);
