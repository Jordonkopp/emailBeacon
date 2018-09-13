//During the tests the env variable is set to tests
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let assert = require('assert');
let server = require('../../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Trackers', () => {
    /*
    * Test the Tracker routes
    */
    let imageId = '';

    describe('/GET tracker', () => {
        it('it should GET a tracking url', (done) => {
            chai.request(server)
                .get('/tracker')
                .end((err, res) => {
                    imageId = res.body.imageUrl.split('/')[3].split('-')[0];
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('imageUrl');
                    done();
                });
        });
        it('it should GET tracking data when imageUrl is called', (done) => {
            chai.request(server)
                .get('/' + imageId + '-tracker.png')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        it('it should GET status of Opened and open count == 1', (done) => {
            chai.request(server)
                .get('/' + imageId + '/status')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('openCount');
                    assert.equal(res.body.status, 'Opened');
                    assert.equal(res.body.openCount, 1);
                    done();
                });
        });
        it('it should GET tracking data when imageUrl is called', (done) => {
            chai.request(server)
                .get('/' + imageId + '-tracker.png')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        it('it should GET status of Re-Opened and open count == 2', (done) => {
            chai.request(server)
                .get('/' + imageId + '/status')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('openCount');
                    assert.equal(res.body.status, 'Re-Opened');
                    assert.equal(res.body.openCount, 2);
                    done();
                });
        });
        it('it should GET tracking data when imageUrl is called', (done) => {
            chai.request(server)
                .get('/' + imageId + '-tracker.png')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        it('it should GET status of Re-Opened and open count == 3', (done) => {
            chai.request(server)
                .get('/' + imageId + '/status')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.should.have.property('openCount');
                    assert.equal(res.body.status, 'Re-Opened');
                    assert.equal(res.body.openCount, 3);
                    done();
                });
        });
        it('it should GET Not found status', (done) => {
            chai.request(server)
                .get('/not_a_real_id/status')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('it should GET Not track any Ids', (done) => {
            chai.request(server)
                .get('/not_a_real_id-tracker.png')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});
