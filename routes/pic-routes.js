'use strict';

// 'use strict';
//
// const multer = require('multer');
// const dataDir = `${__dirname}/../data`;
// const upload = multer({dest: dataDir});
// const debug = require('debug')('http:pic-routes');
// const bearerAuth = require('../lib/bearer-auth-middleware');
//
// const picCtrl = require('../controllers/pic-controller');
//
// module.exports = function(router) {
//
//   router.post('/gallery/:id/image', bearerAuth, upload.single('image'), (req, res) => {
//     debug('#POST /gallery/:id/image');
//
//     return picCtrl.createPic(req)
//     .then(pic => res.json(pic))
//     .catch(err => res.send(err));
//   });
//
//   router.get('/pic/:id', bearerAuth, (req, res) => {
//     debug('#GET /pic/:id');
//
//     return picCtrl.fetchPic(req)
//     .then(pic => res.json(pic))
//     .catch(err => res.status(err.status).send(err.message));
//   });
//
//   router.delete('/gallery/:id/pic/:picId', bearerAuth, (req, res) => {
//     debug('#DELETE /gallery/:id/pic/:picId');
//
//     return picCtrl.deletePic(req)
//     .then(() => res.sendStatus(204))
//     .catch(err => res.status(err.status).send(err.message));
//   });
//
//   return router;
// };

const fs = require('fs');
const del = require('del');
const path = require('path');
const AWS = require('aws-sdk');
const multer = require('multer');
const dataDir = `${__dirname}/../data`;
const upload = multer({dest: dataDir});
const createError = require('http-errors');
const debug = require('debug')('cfgram:pic-routes');
const bearerAuth = require('../lib/bearer-auth-middleware');

const Pic = require('../models/pic');
const Gallery = require('../models/gallery');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();

function s3UploadProm(params) {
  // console.log('s3UploadProm params', params);
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if(err) reject(err);
      resolve(data);
    });
  });
}

module.exports = function(router) {
  router.post('/gallery/:id/pic', bearerAuth, upload.single('image'), (req, res) => {
    debug('POST /gallery/:id/pic');

    if(!req.file) return createError(400, 'Resource required');
    if(!req.file.path) return createError(500, 'File not saved');

    let ext = path.extname(req.file.originalname);
    let params = {
      ACL: 'public-read',
      Bucket: process.env.AWS_BUCKET,
      Key: `${req.file.filename}${ext}`,
      Body: fs.createReadStream(req.file.path),
    };

    return Gallery.findById(req.params.id)
    .then(() => s3UploadProm(params))
    .then(s3Data => {
      // console.log('req.user._id', req);
      del([`${dataDir}/*`]);
      let picData = {
        name: req.body.name,
        desc: req.body.desc,
        userID: req.user._id,
        galleryID: req.params.id,
        imageURI: s3Data.Location,
        objectKey: s3Data.Key,
      };
      // console.log('picData', picData);
      return new Pic(picData).save();
    })
    .then(pic => res.json(pic))
    .catch(err => res.send(err));
  });

  // router.get('/pic/:id', bearerAuth, (req, res) => {
  //   debug('#GET /pic/:id');
  //
  // });

  return router;
};
