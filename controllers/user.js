const fs = require('fs');
const path = require('path');

const {
  validationResult
} = require('express-validator/check');


const User = require('../models/user');

exports.getUsers = (req, res, next) => {;
  let totalItems;
  User.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return User.find()
    })
    .then(users => {
      res.status(200).json({
        message: 'Fetched users successfully.',
        users: users,
        totalItems: totalItems
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

