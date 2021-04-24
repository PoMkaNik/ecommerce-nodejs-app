const express = require('express');
// validators
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
} = require('./validators');
// middlewares
const { handleErrors } = require('./middlewares');

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
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.create({ email, password });
    // .session added by cookie-session
    req.session.userId = user.id;

    res.redirect('/admin/products');
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
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });
    req.session.userId = user.id;

    res.redirect('/admin/products');
  },
);

module.exports = router;
