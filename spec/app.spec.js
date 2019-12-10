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
                expect(body).to.contain.keys('topics')
                expect(body.topics).to.be.an('array');
                expect(body.topics[0]).to.contain.keys('description', 'slug');
            });
        });
        it('GET:405, respond with error message if client tries to use an unaccepted method', () => {
            return request(app)
              .patch('/api/topics')
              .send({inc_votes: 23})
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal('Method Not Allowed');
              });
          });
    });
    describe('/api/users/:username', () => {
        it('GET:200, responds with a user object', () => {
            return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then(({ body }) => {
                expect(body.user).to.be.an('object');
                expect(body.user).to.contain.keys('username', 'avatar_url','name');
                expect(body.user).to.deep.equal({
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
    
    describe('/api/articles', () => {
        it('GET:200, returns an object with a key of articles, containing an array', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body).to.contain.keys('articles')
                expect(body.articles).to.be.an('array');
            });
        });
        it('GET:200, returns an array', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).to.be.an('array');
            });
        });
        it('GET:200, returns an array of articles containing the correct keys', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles[0]).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count');
            });
        });
        it('GET:200, returns an array of articles sorted by article_id, in ascending order', () => {
            return request(app)
            .get('/api/articles/?sort_by=article_id&order=asc')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).to.be.sortedBy('article_id', {ascending: true});
            });
        });
        it('GET:200, returns an array of articles sorted by date created, in descending order, when not passed any search parameters', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).to.be.sortedBy('created_at', {descending: true});
            });
        });
        it('GET:400, filters out invalid sort_by queries and provides an error message to the client', () => {
            return request(app)
            .get('/api/articles?sort_by=not-a-column')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).to.equal(`No such column exists`);
            });
        });
        it('GET:200, accepts an author query of any author found in database', () => {
            return request(app)
            .get('/api/articles?author=butter_bridge')
            .expect(200)
            .then(({ body }) => {
                body.articles.forEach(article => 
                    expect(article.author).to.equal('butter_bridge')
                    );
            });
        });
        it('GET:200, accepts a topic query of any topic found in database', () => {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body }) => {
                body.articles.forEach(article => 
                    expect(article.topic).to.equal('mitch')
                    );
            });
        });
        it('GET:200, returns an empty array when articles for a topic that does exist, but has no articles is requested ', () => {
            return request(app)
            .get('/api/articles?author=lurker')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).to.deep.equal([]);
                expect(body.articles.length).to.equal(0)
            });
        });
        it('GET:200, returns an array containing articles of only the given topic, sorted by votes, in ascending order', () => {
            return request(app)
            .get('/api/articles/?topic=mitch&sorted_by=votes&order=asc')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles[0].topic).to.equal('mitch')
                expect(body.articles).to.be.sortedBy('votes', {ascending: true});
            });
        });
        it('GET:200, returns all articles in order of date ascending', () => {
            return request(app)
            .get('/api/articles/?order=asc')
            .expect(200)
            .then(({body}) => { 
                expect(body.articles).to.be.sortedBy('created_at',{ascending: true})
            })
        });
        it('GET:200, returns an array containing articles of only the given topic, by the given author and sorted by date, in descending order. This tests for topic', () => {
            return request(app)
            .get('/api/articles/?topic=mitch&author=rogersop&sorted_by=created_at&order=desc')
            .expect(200)
            .then(({ body }) => {
                body.articles.forEach(article => 
                    expect(article.topic).to.equal('mitch')
                    );
            });
        });
        it('GET:200, This tests for sorted by date in descending order', () => {
            return request(app)
            .get('/api/articles/?topic=mitch&author=rogersop&sort_by=created_at&order=desc')
            .expect(200)
            .then(({ body }) => {
                    expect(body.articles).to.be.sortedBy('created_at', {descending: true})
            });
        });
        it('GET:404, return error message when a query value does not exist', () => {
            return request(app)
              .get("/api/articles?topic=alexanderhamilton")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("No such topic exists");
              });
          });
        });
        describe('/api/articles/:article_id', () => {
            it('GET: 200, responds with article object for a given article_id', () => {
                return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({ body }) => {
                    expect(body).to.contain.keys('article')
                    expect(body.article).to.be.an('object');
                    expect(body).to.deep.equal({article: {
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: "2018-11-15T12:21:54.171Z",
                        votes: 100,
                        comment_count: '13'
                    }});
                })
            });
            it('GET: 200, responds with article object for a given article_id', () => {
                return request(app)
                .get('/api/articles/2')
                .expect(200)
                .then(({ body }) => {
                    expect(body).to.deep.equal({article: {
                        article_id: 2,
                        title: 'Sony Vaio; or, The Laptop',
                        topic: 'mitch',
                        author: 'icellusedkars',
                        body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
                        created_at: "2014-11-16T12:21:54.171Z",
                        votes: 0,
                        comment_count: '0'
                    }});
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
            it('PATCH: 200 for incrementing a votes property by a given number', () => {
                return request(app)
                .patch('/api/articles/1')
                .send({inc_votes: 23})
                .expect(200)
                .then(({body}) => {
                    expect(body).to.deep.equal({article: {
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: "2018-11-15T12:21:54.171Z",
                        votes: 123 
                    }})
                    expect(body.article.votes).to.equal(123);
                    expect(body.article).to.be.an('object');
                    expect(body.article).to.deep.equal({
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: "2018-11-15T12:21:54.171Z",
                        votes: 123,
                    })
                })
            });
            it('PATCH: 200 for incrementing a votes property by a given number', () => {
                return request(app)
                .patch('/api/articles/1')
                .send({cats: 'Rory'})
                .expect(200)
                .then(({body}) => {
                    expect(body).to.deep.equal({article: {
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: "2018-11-15T12:21:54.171Z",
                        votes: 100 
                    }})
                    expect(body.article.votes).to.equal(100);
                    expect(body.article).to.be.an('object');
                    expect(body.article).to.deep.equal({
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: "2018-11-15T12:21:54.171Z",
                        votes: 100,
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
            it('PATCH:400 for some other property on request body', () => {
                return request(app)
                .patch('/api/articles/1')
                .send({inc_votes: 87, name: 'Paula'})
                .expect(200)
                .then(({ body }) => {
                    expect(body).to.deep.equal({article: {
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: "2018-11-15T12:21:54.171Z",
                        votes: 187 
                    }})
                })
            });
            it('POST: 201, returns a status 202 and a comment object containing the comment', () => {
                return request(app)
                .post('/api/articles/1/comments')
                .send({
                    username: 'butter_bridge', 
                    body: 'Great article! Keep up the good work!'
                })
                .expect(201)
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
            it('POST:404 article_id does not exist', () => {
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
            it('POST:400 missing required key', () => {
                return request(app)
                .post('/api/articles/Paula123/comments')
                .send({ 
                body: 'Great article! Keep up the good work!'})
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).to.equal(`Bad Request`);
                })
            });
            it('GET: 200, returns a status 200 an array containing  containing the comment objects', () => {
                return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({body}) => {
                    expect(body.comments).to.be.sortedBy('article_id', {descending: true});
                    expect(body.comments).to.be.an('array');
                    expect(body.comments[5]).to.deep.equal({
                        body: 'Lobster pot',
                        author: 'icellusedkars',
                        article_id: 1,
                        comment_id: 7,
                        votes: 0,
                        created_at: '2011-11-24T12:36:03.389Z'
                    });
                    expect(body.comments[0].article_id).to.equal(1);
                    expect(body.comments[0].author).to.equal('butter_bridge');    
                });
            });
            it('GET 200 and returns comments sorted by comment_id', () => {
                return request(app)
                .get('/api/articles/1/comments')
                .query({sort_by: "comment_id", order: "desc"})
                .expect(200)
                .then(({body}) => {
                    expect(body.comments).to.be.sortedBy('comment_id', {descending: true})
                });
            });
            it('GET 200 and returns comments in the order requested and sorted by requested column', () => {
                return request(app)
                .get('/api/articles/1/comments')
                .query({sort_by: "created_at", order: "asc"})
                .expect(200)
                .then(({body}) => {
                    expect(body.comments).to.be.sortedBy('created_at', {ascending: true})
                });
            });
            it('GET:400, filters out invalid sort_by queries and provides an error message to the client', () => {
                return request(app)
                .get('/api/articles/1/comments?sort_by=not-a-valid-column')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).to.equal(`No such column exists`);
                })
            })
            it('GET:200, returns array with length equal to number of comments for given article_id', () => {
                return request(app)
                .get('/api/articles/1/comments')
                .query({sort_by: "created_at", order: "asc"})
                .expect(200)
                .then(({body}) => {
                    expect(body.comments.length).to.equal(13)
                });
            });
            it('GET 200 and returns array sorted by number votes in ascending order', () => {
                return request(app)
                .get('/api/articles/9/comments')
                .query({sort_by: "votes", order: "asc"})
                .expect(200)
                .then(({body}) => {
                    expect(body.comments).to.be.sortedBy('votes', {ascending: true})
                });
            });
            it('GET 200 and returns an empty array because no comments have been posted for the passed article_id', () => {
                    return request(app)
                    .get('/api/articles/2/comments')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.comments.length).to.equal(0);
                        });
                    });
            it('GET:404 for a valid article_id that does not exist', () => {
                return request(app)
                .get('/api/articles/9999/comments')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).to.equal(`No article exists for given article_id`);
                });
            });
            it('GET:400 for a bad request', () => {
                return request(app)
                .get('/api/articles/dog/comments')
                .query({sort_by: "comment_id", order: "desc"})
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).to.equal(`Bad Request`);
                    });
                });
            });
        describe('/api/comments', () => {
            it('PATCH:200 updates the vote count of a comment by amount speficied', () => {
                return request(app)
                .patch('/api/comments/1')
                .send({ inc_votes: 14 })
                .expect(200)
                .then(({ body }) => {
                    expect(body.comment.votes).to.equal(30);
                });
            });
            it('PATCH:200 returns an unchanged comment when no inc_votes is provided in the request body', () => {
                    return request(app)
                    .patch('/api/comments/1')
                    .send({})
                    .expect(200)
                    .then(({body})=> {
                        expect(body.comment).to.deep.equal({
                            comment_id: 1,
                            author: 'butter_bridge',
                            article_id: 9,
                            votes: 16,
                            created_at: '2017-11-22T12:36:03.389Z',
                            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
                        })
                    })
                }); 
            it('PATCH 200 and returns an unaltered comment and ignores additional keys', () => {
                return request(app)
                .patch('/api/comments/2')
                .send({ inc_votes: 14, we_are_done: 5 })
                .expect(200)
                .then(({ body }) => {
                    expect(body.comment).to.deep.equal({
                    comment_id: 2,
                    author: 'butter_bridge',
                    article_id: 1,
                    votes: 28,
                    created_at: "2016-11-22T12:36:03.389Z",
                    body:
                        'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.'
                    });
                });
            });
            it('PATCH:404 returns error message when article_id does not exist', () => {
                return request(app)
                .patch('/api/comments/9999')
                .send({ inc_votes: 14 })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).to.equal('Not Found');
                });
            });
            it('DELETE:204 deletes the given comment', () => {
                return request(app)
                .delete('/api/comments/7')
                .expect(204)
            });
            it('DELETE:404, use a 404: Not Found when DELETE contains a valid comment_id that does not exist', () => {
                return request(app)
                    .del('/api/comments/9876543')
                    .expect(404)
                    .then(({ body }) => {
                    expect(body.msg).to.equal("Not Found");
                    });
            });
            it('DELETE:400, responds with Bad Request when given an invalid id', () => {
                return request(app)
                    .del('/api/comments/catsanddogs')
                    .expect(400)
                    .then(({ body }) => {
                    expect(body.msg).to.equal('Bad Request');
                });
            });
        });
        describe('DELETE /api', () => {
            it('DELETE:405 and Method Not Found when client attempts to delete the api', () => {
                return request(app).delete('/api')
                .expect(405)
                .then(({body}) => {
                    expect(body.msg).to.equal('Method Not Found')
                })
            });
        });
        describe('GET /api', () => {
            it('GET 200 and a json file describing all the available endpoints on the API', () => {
                return request(app).get('/api')
                .expect(200)
                .then(({body}) => {
                    expect(body).to.be.an('object')
                })
            });
        });
});


            
            