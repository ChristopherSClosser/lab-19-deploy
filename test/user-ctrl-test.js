'use strict';

const expect = require('chai').expect;
const userCtrl = require('../controllers/user-controller');

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com',
};

let prom = [];

describe('user-controller', function() {
  describe('.createUser()', function() {

    it('should return a Promise', done => {

      prom.push(userCtrl.createUser(exampleUser));

      console.log('prom', prom);
      expect(prom[0]).to.have.a.property('_promise0');
      done();
    });

    it('should have a fulfillment handler', done => {

      expect(prom[0]).to.have.a.property('_fulfillmentHandler0');
      prom.pop();
      done();
    });
  });

  describe('.userSignin()', function() {

    it('should return a Promise', done => {

      prom.push(userCtrl.userSignin({name:'password'}));

      expect(prom[0]).to.have.a.property('_promise0');
      done();
    });

    it('should have a rejection handler', done => {

      expect(prom[0]).to.have.a.property('_rejectionHandler0');
      prom.pop();
      done();
    });
  });
});
