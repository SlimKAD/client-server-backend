const express = require('express');
const {
  body
} = require('express-validator/check');

const interviewController = require('../controllers/interview');
const unitController = require('../controllers/hermUnit');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /interview/posts
router.get('/posts', isAuth, interviewController.getPosts);

// POST /interview/post
router.post(
  '/post',
  isAuth,
  [
    body('title')
    .trim()
    .isLength({
      min: 5
    }),
    body('content')
    .trim()
    .isLength({
      min: 5
    })
  ],
  interviewController.createPost
);

router.get('/post/:postId', isAuth, interviewController.getPost);

router.put(
  '/post/:postId',
  isAuth,
  [
    body('title')
    .trim()
    .isLength({
      min: 5
    }),
    body('content')
    .trim()
    .isLength({
      min: 5
    })
  ],
  interviewController.updatePost
);

router.delete('/post/:postId', isAuth, interviewController.deletePost);

router.post(
  '/post/:postId/unit',
  [
    body('content')
    .trim()
    .isLength({
      min: 5
    })
  ],
  unitController.createUnit
);

router.put(
  '/post/:postId/unit/:unitId',
  [
    body('content')
    .trim()
    .isLength({
      min: 5
    })
  ],
  unitController.updateUnit
);

router.delete('/post/:postId/unit/:unitId', unitController.deleteUnit);



module.exports = router;
