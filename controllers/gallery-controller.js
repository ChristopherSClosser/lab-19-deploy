'use strict';

const debug = require('debug')('http:controller');
const Gallery = require('../models/user');

module.exports = exports = {};

// exports.createGallery = function(gallery) {
//   debug('gallery-controller.createGallery()');
//
//
// }
//
exports.viewGallery = function(gallery) {
  debug('gallery-controller.viewGallery()');

  console.log('gallery: ', gallery);

  return Gallery.findById(gallery.id);
};
