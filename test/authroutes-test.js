'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../models/user');

require('../server.js');
mongoose.Promise = Promise;

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com',
};

let results = [];

describe('Auth Routes', function() {
  describe('POST: /api/signup', function() {
    describe('with a valid body', function() {
      after( done => {
        User.remove({})
        .then(() => done())
        .catch(done);
      });

      it('should return a token', done => {
        console.log('exampleUser ', exampleUser);
        request.post(`${url}/api/signup `)
        .send(exampleUser)
        .end((err, res) => {
          if (err) return done(err);
          console.log('\ntoken:', res.text, '\n');
          results.push(res.status);
          expect(res.text).to.be.a('string');
          done();
        });
      });

      it('should have 200 status', done => {

        console.log(results);
        expect(results[0]).to.equal(200);
        results.pop();
        done();

      });
    });
  });

  describe('GET: /api/signin', function() {
    describe('with a valid body', function() {
      before( done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          done();
        })
        .catch(done);
      });

      after( done => {
        User.remove({})
        .then( () => done())
        .catch(done);
      });

      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .auth('exampleuser', '1234')
        .end((err, res) => {
          if (err) return done(err);
          results.push(res.status);
          expect(res.text).to.be.a('string');
          expect(res.status).to.equal(200);
          done();
        });
      });

      it('should have a status of 200', done => {

        console.log(results);
        expect(results[0]).to.equal(200);
        results.pop();
        done();
      });
    });
  });
});
