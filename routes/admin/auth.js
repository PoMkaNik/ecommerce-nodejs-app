const express = require('express');
const { check, validationResult } = require('express-validator');
// validators
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
} = require('./validators');
// repositories
const usersRepo = require('../../repositories/users');
// views
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  '/signup',
  // sanitization and validation
  [requireEmail, requirePassword, requirePasswordConfirmation],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.send(signupTemplate({ req, errors }));

    const { email, password } = req.body;

    const user = await usersRepo.create({ email, password });
    // .session added by cookie-session
    req.session.userId = user.id;

    res.send('Account created');
  },
);

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out');
});

router.get('/signin', (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  '/signin',
  // sanitization and validation
  [requireEmailExists, requireValidPasswordForUser],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.send(signinTemplate({ errors }));

    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });
    req.session.userId = user.id;

    res.send('You are signed in');
  },
);

module.exports = router;
