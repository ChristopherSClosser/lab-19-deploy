// 'use strict';
//
// const server = require('../server');
// const User = require('../models/user');
// const chai = require('chai');
// const http = require('chai-http');
// const expect = chai.expect;
//
// chai.use(http);
//
// describe('server - test', function() {
//   let userObj = [];
//
//
//   describe('/wrong endpoint', function() {
//     it('should respond with a 404 on bad request', done => {
//       chai.request(server)
//       .post('/')
//       .send({})
//       .end((err, res) => {
//         console.log(res.status);
//         expect(res.status).to.equal(404);
//         done();
//       });
//     });
//   });
//
//   describe('POST || signup method', function() {
//     after(done => {
//       User.findOne({username: 'chris'})
//       .then(user => {
//         User.findByIdAndRemove(user._id)
//        .then(() => done());
//       });
//     });
//
//     describe('/signup endpoint', function() {
//       it('should respond with a 200 on proper request', done => {
//         chai.request(server)
//         .post('/api/signup')
//         .send({username:'chris', email:'c@c.com', password:'1234'})
//         .end((err, res) => {
//           console.log(res.status, res.body);
//
//           userObj.push(res.request._data);
//           // expect(res.status).to.equal(200);
//           done();
//         });
//       });
//     });
//   });
//
//   describe('GET || signin method', function() {
//
//     describe('/signin endpoint', function() {
//       it('should respond with a 200 on proper request', done => {
//         chai.request(server)
//         .get('/api/signin')
//         .send(`{${userObj.username}:${userObj.password}}`)
//         .end((err, res) => {
//           console.log(res.status);
//           done();
//         });
//       });
//     });
//   });
//
//
//
// });
