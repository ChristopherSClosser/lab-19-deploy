'use strict';

const chai = require('chai');
const superagent = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../models/user');
const Gallery = require('../models/gallery');
// const Pic = require('../models/pic');

const expect = chai.expect;
mongoose.Promise = Promise;

require('../server');

const url = `http://localhost:3000`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com',
};

const exampleGallery = {
  name: 'test gallery',
  desc: 'test gallery description',
};

let resBody = [];

mongoose.Promise = Promise;

describe('pic-routes', function() {

  afterEach( done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
    ])
    .then(() => done())
    .catch(() => done());
  });

  describe('POST /gallery/:id/pic', function() {

    before( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        console.log('temp user', this.tempUser);
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(() => done());
    });

    it('should return a gallery', done => {
      superagent.post(`${url}/api/gallery`)
      .send(exampleGallery)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        if (err) return done(err);
        resBody.push(res.body);
        // console.log('resBody', resBody);

        expect(res.body).to.not.equal('undefined');
        done();
      });
    });

    it('should post a pic to the correct gallery', done => {
      // superagent.post(`http://localhost:3000/api/gallery/${resBody._id}/pic`)
      // .set({
      //   'Content-Type': 'application/json',
      //   'Authorization': `Bearer ${this.tempToken}`,
      // })
      // .field({
      //   'name': 'functional-programming',
      //   'desc': 'functional-programming',
      //   'imageURI': `${__dirname}/../functional-programming.png`,
      // })
      // .set('Authorization', `Bearer ${this.tempToken}`)
      // .field('name', 'functional-programming')
      // .field('desc', 'informational')
      // .attatch('image', `${__dirname}/../functional-programming.png`)
      // .then((pic) => {
        // console.log('made it here', pic);
        // if(err) console.error(err);
        // expect(res).to.have.status(200);

      done();
      // })
      // .catch(done);
    });
  });
});
