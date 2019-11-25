process.env.NODE_ENV = "test";
const chai = require('chai')
const { expect } = require('chai');
const request = require('supertest');
const chaiSorted = require('chai-sorted')

chai.use(chaiSorted)

const app = require('../app');
const connection = require('../db/connection');
const {
  checkArticle_Id_Exists,
} = require('../helperFunctions');

describe('checkArticle_Id_Exists', () => {
    beforeEach(() => connection.seed.run());
    after(() => connection.destroy());
  it('Returns with false if given article does not exist in the database', () => {
      return request(app)
      .get('/api/articles/99999')
      .expect()
      .then(({body}) => {
          expect(body.article_id).to.be(true);
      })
    
  })
});