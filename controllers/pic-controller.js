// 'use strict';
//
// const fs = require('fs');
// const del = require('del');
// const path = require('path');
// const AWS = require('aws-sdk');
// const dataDir = `${__dirname}/../data`;
// const debug = require('debug')('http:pic-controller');
// const createError = require('http-errors');
// const Pic = require('../models/pic');
// const Gallery = require('../models/gallery');
//
// AWS.config.setPromisesDependency(require('bluebird'));
//
// const s3 = new AWS.S3();
//
// function s3UploadProm(params) {
//   return new Promise((resolve, reject) => {
//     s3.upload(params, (err, data) => {
//       if(err) reject(err);
//       resolve(data);
//     });
//   });
// }
//
// module.exports = exports = {};
//
// exports.createPic = function(pic) {
//   debug('createPic()');
//
//   if(!pic.file) return createError(400, 'picture required');
//   if(!pic.file.path) return createError(500, 'file not saved');
//
//   let ext = path.extname(pic.file.originalname);
//   let params = {
//     ACL: 'public-read',
//     Bucket: process.env.AWS_BUCKET,
//     Key: `${pic.file.filenname}${ext}`,
//     Body: fs.createReadStream(pic.file.path),
//   };
//
//   return Gallery.findById(pic.params.id)
//   .then(() => s3UploadProm(params))
//   .then(s3Data => {
//     del([`${dataDir}/*`]);
//     let picData ={
//       name: pic.body.name,
//       desc: pic.body.desc,
//       userId: pic.user._id,
//       galleryId: pic.params.id,
//       imageURI: s3Data.Location,
//       objectKey: s3Data.Key,
//     };
//     return new Pic(picData).save();
//   });
// };
//
// exports.fetchPic = function(pic) {
//   debug('#fetchPic');
//
//   return Pic.findById(pic.params.id)
//   .then(pic => {
//     if (pic.userId.toString() !== pic.user._id.toString()) {
//       return Promise.reject(createError(401, 'Invalid user'));
//     }
//     return Promise.resolve(pic);
//   })
//   .catch(() => Promise.reject(createError(404, 'Pic not found')));
// };
//
// exports.deletePic = function(pic) {
//   debug('#deletePic');
//   let params = {};
//
//   return Pic.findById(pic.params.picId)
//   .then(pic => {
//     if (pic.galleryId.toString() !== pic.params.id.toString()) {
//       return Promise.reject(createError(401, 'pic not associated with this gallery'));
//     }
//     if (pic.userId.toString() !== pic.user._id.toString()) {
//       return Promise.reject(createError(401, 'Invalid user'));
//     }
//
//     params = {
//       Bucket: process.env.AWS_BUCKET,
//       Key: pic.objectKey,
//     };
//   })
//   .then(() => s3.deleteObject(params))
//   .then(data => {
//     console.log(data);
//     return Pic.findByIdAndRemove(pic.params.picId);
//   })
//   .catch(err => Promise.reject(createError(404, err.message)));
// };
