const fs = require('fs');
const path = require('path');

const {
    validationResult
} = require('express-validator/check');

const Post = require('../models/post');
const User = require('../models/user');
const UNIT = require('../models/hermUnit');
const {
    connect
} = require('http2');


exports.createUnit = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const upvotes = req.body.upvotes;
    const downvotes = req.body.downvotes;
    const content = req.body.content;
    const postId = req.params.postId;
    let creator;
    const unit = new UNIT({
        upvotes: upvotes,
        content: content,
        downvotes: downvotes,
        post: postId,
        creator: req.userId,
    });
    unit
        .save()
        .then(result => {
            return Post.findById(postId);
        })
        .then(post => {
            post.units.push(unit)
            post.save();
            return User.findById(req.userId)
        })
        .then(user => {
            creator = user;
            return unit
        })
        .then(result => {
            res.status(201).json({
                message: 'Post created successfully!',
                unit: unit,
                creator: {
                    _id: creator._id,
                    name: creator.name
                }
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};


exports.updateUnit = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const postId = req.params.postId;
    const unitId = req.params.unitId;
    const content = req.body.content;
    const upvotes = req.body.upvotes;
    const downvotes = req.body.downvotes;


    UNIT.findById(unitId)
        .then(unit => {
            if (!unit) {
                const error = new Error('Could not find unit.');
                error.statusCode = 404;
                throw error;
            }
            if (unit.creator.toString() !== req.userId) {
                const error = new Error('Not authorized!');
                error.statusCode = 403;
                throw error;
            }
            unit.content = content;
            unit.upvotes = upvotes;
            unit.downvotes = downvotes;
            return unit.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Unit updated!',
                unit: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteUnit = (req, res, next) => {
    const unitId = req.params.unitId;
    const postId = req.params.postId;
    UNIT.findById(unitId)
        .then(unit => {
            if (!unit) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            if (unit.creator.toString() !== req.userId) {
                const error = new Error('Not authorized!');
                error.statusCode = 403;
                throw error;
            }

            return UNIT.findByIdAndRemove(unitId);
        })
        .then(result => {
            return Post.findById(postId);
        })
        .then(post => {
            post.units.pull(unitId);
            return post.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Deleted unit.'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
