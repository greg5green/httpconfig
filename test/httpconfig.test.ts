import request from 'supertest';
import { expect } from 'chai';
import app from '../httpconfig';

describe('GET /', function () {
  it('returns 200 with HTML', async function () {
    const res = await request(app).get('/');

    expect(res.status).to.equal(200);
    expect(res.headers['content-type']).to.match(/html/);
  });
});

describe('GET /api/httpconfig', function () {
  it('returns 200 with JSON content-type', async function () {
    const res = await request(app).get('/api/httpconfig');

    expect(res.status).to.equal(200);
    expect(res.headers['content-type']).to.match(/json/);
  });

  it('response contains all expected fields', async function () {
    const res = await request(app).get('/api/httpconfig');
    const fields = [
      'ip',
      'hostname',
      'ua',
      'language',
      'connection',
      'encoding',
      'mimeType',
      'charset',
    ];

    for (const field of fields) {
      expect(res.body).to.have.property(field);
    }
  });

  it('reflects User-Agent header', async function () {
    const res = await request(app)
      .get('/api/httpconfig')
      .set('User-Agent', 'TestBot/1.0');

    expect(res.body.ua.value).to.equal('TestBot/1.0');
  });

  it('reflects Accept-Language header', async function () {
    const res = await request(app)
      .get('/api/httpconfig')
      .set('Accept-Language', 'en-US,en;q=0.9');

    expect(res.body.language.value).to.equal('en-US,en;q=0.9');
  });

  it('reflects Accept-Encoding header', async function () {
    const res = await request(app)
      .get('/api/httpconfig')
      .set('Accept-Encoding', 'gzip, deflate');

    expect(res.body.encoding.value).to.equal('gzip, deflate');
  });

  it('reflects Accept header as mimeType', async function () {
    const res = await request(app)
      .get('/api/httpconfig')
      .set('Accept', 'text/html,application/json');

    expect(res.body.mimeType.value).to.equal('text/html,application/json');
  });

  it('reads IP from X-Forwarded-For when trust proxy is enabled', async function () {
    const res = await request(app)
      .get('/api/httpconfig')
      .set('X-Forwarded-For', '1.2.3.4');

    expect(res.body.ip.value).to.equal('1.2.3.4');
  });

  it('returns 200 when optional headers are absent', async function () {
    const res = await request(app)
      .get('/api/httpconfig')
      .unset('Accept-Language')
      .unset('Accept-Charset');

    expect(res.status).to.equal(200);
  });

  it('hostname value is a string regardless of DNS result', async function () {
    const res = await request(app).get('/api/httpconfig');

    expect(res.body.hostname.value).to.be.a('string');
  });
});

describe('unknown routes', function () {
  it('returns 404', async function () {
    const res = await request(app).get('/not-a-real-route');

    expect(res.status).to.equal(404);
  });
});
