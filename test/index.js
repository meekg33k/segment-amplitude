//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var assert = chai.assert;
var expect = chai.expect;

/** Test events **/
var event = require('../event'); 
var malformedEvent = require('../malformed-event'); 
chai.use(chaiHttp);


describe('Amplitude-Integration', () => {

  describe('/GET index page', () => {
      it('it should REDIRECT to endpoint page', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
              expect(res).to.redirect;
              done();
            });
      });
  });

  describe('/GET index page', () => {
      it('it should GET the info page', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
              expect(res).to.be.html;
              expect(res).to.have.status(200);
              done();
            });
      });
  });

  describe('/GET amplitude endpoint', () => {
      it('it should GET the info page', (done) => {
        chai.request(server)
            .get('/v1/amplitude')
            .end((err, res) => {
              expect(res).to.be.html;
              expect(res).to.have.status(200);
              done();
            });
      });
  });

  describe('/POST to endpoint without event', () => {
      it('it should return 400 with status message', (done) => {
        chai.request(server)
            .post('/v1/amplitude')
            .end((err, res) => {
              expect(res).to.be.json;
              assert.equal(res.body.message, 'No Event Params provided');
              expect(res).to.have.status(400);
              done();
            });
      });
  });

  describe('/POST to endpoint with malformed event', () => {
      it('it should return 400 with status message', (done) => {
        chai.request(server)
            .post('/v1/amplitude')
            .send({
              "event": malformedEvent
            })
            .end((err, res) => {
              expect(res).to.be.json;
              assert.equal(res.body.message, 'missing field event_type from event');
              expect(res).to.have.status(400);
              done();
            });
      });
  });

  describe('/POST to endpoint with invalid API key', () => {
      it('it should return 403 with status message', (done) => {
        chai.request(server)
            .post('/v1/amplitude')
            .send({
              "api_key": "some_invalid_api_key",
              "event": event,
            })
            .end((err, res) => {
              expect(res).to.be.json;
              assert.equal(res.body.message, 'Invalid Amplitude API Key');
              expect(res).to.have.status(403);
              done();
            });
      });
  });

  describe('/POST event with correct apiKey to endpoint', () => {
      it('it should return 200 with success message', (done) => {
        chai.request(server)
            .post('/v1/amplitude')
            .send({
              "event": event
            })
            .end((err, res) => {
              expect(res).to.be.json;
              assert.equal(res.body.message, 'Success');
              expect(res).to.have.status(200);
              done();
            });
      });
  });

});