process.env.NODE_ENV = "test";
const chai = require('chai')
const { expect } = require('chai');
const request = require('supertest');
const chaiSorted = require('chai-sorted')

chai.use(chaiSorted)

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
    describe('/api/users/:username', () => {
        it('GET:200, responds with a user object', () => {
            return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then(({ body }) => {
                expect(body).to.be.an('object');
                expect(body).to.contain.keys('username', 'avatar_url','name');
                expect(body).to.deep.equal({
                    username: 'lurker',
                    avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    name: 'do_nothing'
                  });
            });
        });
        it('GET:404 for a username that does not exist', () => {
            return request(app)
            .get('/api/users/notAnID')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).to.equal(`No user found for username: notAnID`);
            })
        });
    });
    describe('/api/articles/:article_id', () => {
        it('GET: 200, responds with article object for a given article_id', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                expect(body).to.be.an('object');
                expect(body).to.deep.equal({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: "2018-11-15T12:21:54.171Z",
                    votes: 100,
                    // comment_count: 
                });
            })
        });
        it('GET:404 for a valid article_id that does not exist', () => {
            return request(app)
            .get('/api/articles/9999')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).to.equal(`No article exists for given article_id`);
            })
        });
        it('GET:400 for a bad request', () => {
            return request(app)
            .get('/api/articles/dog')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).to.equal(`Bad Request`);
            })
        });
        it('PATCH: 202 for incrementing a votes property by a given number', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({inc_votes: 23})
            .expect(202)
            .then(({body}) => {
                expect(body.votes).to.equal(123);
                expect(body).to.be.an('object');
                expect(body).to.deep.equal({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: "2018-11-15T12:21:54.171Z",
                    votes: 123,
                })
            })
        })
        it('PATCH:400 for an invalid input on inc_votes', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({inc_votes: "cat"})
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).to.equal(`Bad Request`);
            })
        });
        it('PATCH:400 for no inc_votes on request body', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({})
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).to.equal(`No votes included in body`);
            })
        });
        it('PATCH:400 for some other property on request body', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({inc_votes: 87, name: 'Paula'})
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).to.equal(`Invalid property on request body`);
            })
        });
        it('POST: 202, returns a status 202 and a comment object containing the comment', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({
                username: 'butter_bridge', 
                body: 'Great article! Keep up the good work!'
            })
            .expect(202)
            .then((res) => {
                expect(res.body.comment.body).to.equal('Great article! Keep up the good work!');
                expect(res.body.comment).to.be.an('object');
                expect(res.body.comment).to.contain.keys({
                    body: 'Great article! Keep up the good work!',
                    author: 'butter_bridge',
                    article_id: 1,
                    comment_id: 19,
                    votes: 0,
                    created_at: '019-11-21T16:54:21.870Z'
                });
                expect(res.body.comment.article_id).to.equal(1);
                expect(res.body.comment.author).to.equal('butter_bridge');
                expect(res.body.comment.comment_id).to.equal(19);
            });
        })
        it('POST:400 no body or username', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({})
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).to.equal(`Bad Request`);
            })
        });
        it('POST:404 article_d does not exist', () => {
            return request(app)
            .post('/api/articles/1000/comments')
            .send({
                username: 'butter_bridge', 
                body: 'Great article! Keep up the good work!'
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).to.equal(`Not Found`);
            })
        });
        it('POST:404 username does not exist', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({username: 'Paula123', 
            body: 'Great article! Keep up the good work!'})
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).to.equal(`Not Found`);
            })
        });
        it('POST:400 invalid article id', () => {
            return request(app)
            .post('/api/articles/Paula123/comments')
            .send({username: 'butter_bridge', 
            body: 'Great article! Keep up the good work!'})
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).to.equal(`Bad Request`);
            })
        });
        // it('GET: 200, returns a status 200 and a comment object containing the comment', () => {
        //     return request(app)
        //     .get('/api/articles/1/comments')
        //     .expect(200)
        //     .then(({body}) => {
        //         expect(body).to.be.an('array');
        //         expect(body[0]).to.contain.keys({
        //             body: 'Great article! Keep up the good work!',
        //             author: 'butter_bridge',
        //             article_id: 1,
        //             comment_id: 2,
        //             votes: 14,
        //             created_at: '2019-11-21T16:54:21.870Z'
        //         });
        //         expect(body[0].article_id).to.equal(1);
        //         expect(body[0].author).to.equal('butter_bridge');
        //         expect(body[0].comment_id).to.equal(2);
        //     });
        // });
        it('GET: 200, returns a status 200 and a comment object containing the comment', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .query({ sort_by: 'comment_id' ,
        order: 'asc'})
            .query()
            .expect(200)
            .then(({body}) => {
                expect(body).to.be.an('array');
                expect(body[0]).to.contain.keys({
                    body: 'Great article! Keep up the good work!',
                    author: 'butter_bridge',
                    article_id: 1,
                    comment_id: 2,
                    votes: 14,
                    created_at: '2019-11-21T16:54:21.870Z'
                });
                expect(body[0].article_id).to.equal(1);
                expect(body[0].author).to.equal('butter_bridge');    
            });
        });
        it.only('GET 200 and returns comments in the order requested and sorted by requested column', () => {
            return request(app)
            // .get('api/articles/1/comments?sort_by=comment_id&&order_by=asc')
            .get('/api/articles/1/comments')
            .query({sort_by: "comment_id", order: "desc"})
            .expect(200)
            .then(({body}) => {
                expect(body.comments).to.be.sortedBy('comment_id', {descending: true})
            })
        })
    });
});

