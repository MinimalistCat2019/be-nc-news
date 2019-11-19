process.env.NODE_ENV = "test"

const { expect } = require('chai');
const request = require('supertest');
const app = require('./app');
const connection = require('../db/connection');

describe('', () => {
    beforeEach(() => connection.seed.run());
    after(() => connection.destroy());
    
    it('', () => {
        
    });
});
