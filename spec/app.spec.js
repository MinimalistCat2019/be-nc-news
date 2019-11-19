process.env.NODE_ENV = "test";

const { expect } = require('chai');
const request = require('supertest');

const app = require('../app');
const connection = require('../db/connection');

describe('/api', () => { 
    beforeEach(() => connection.seed.run());
    after(() => connection.destroy());
    describe('/api/topics', () => {
        it('GET:200, response with an array of topic objects', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                expect(body.topics).to.be.an('array');
                expect(body.topics[0]).to.contain.keys('description', 'slug');
            });
        });
    });
    describe.only('/api/users/:username', () => {
        it('GET:200, responds with a user object', () => {
            return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then(({ body }) => {
                console.log(body)
                expect(body).to.be.an('object');
                expect(body.user).to.be.an('array');
                expect(body.user[0]).to.contain.keys('username', 'avatar_url','name');
            });
        });
    });
});


