import compression from 'compression';
import dns from 'dns';
import express, { Request, Response } from 'express';
import path from 'path';

interface RequestField {
  displayName: string;
  value: string | string[] | undefined;
}

interface RemoteRequest {
  ip: RequestField;
  hostname: RequestField;
  ua: RequestField;
  language: RequestField;
  connection: RequestField;
  encoding: RequestField;
  mimeType: RequestField;
  charset: RequestField;
}

const app = express();
const port = parseInt(process.env.PORT ?? '9000', 10);

app.set('trust proxy', true);

app.use(compression());
app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'static/html/httpconfig.html'));
});

app.get('/api/httpconfig', (req: Request, res: Response) => {
  const remoteReq: RemoteRequest = {
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

  dns.reverse(req.ip ?? '', (err, domains) => {
    if (domains) {
      remoteReq.hostname.value = domains[0];
    }

    res.json(remoteReq);
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).send("404: Sorry, we've had an error.");
});

if (require.main === module) {
  app.listen(port);
  console.log('Listening on port ' + port);
}

export default app;
