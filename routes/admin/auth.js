const express = require('express');
// repositories
const usersRepo = require('../../repositories/users');
// views
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post('/signup', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  // check if user with provided email is already exists
  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) return res.send('Email in use');

  if (password !== passwordConfirmation)
    return res.send('Passwords must match');

  const user = await usersRepo.create({ email, password });
  // .session added by cookie-session
  req.session.userId = user.id;

  res.send('Account created');
});

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out');
});

router.get('/signin', (req, res) => {
  res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await usersRepo.getOneBy({ email });
  if (!user) return res.send('User not found');

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password,
  );

  if (!validPassword) {
    return res.send('Invalid email/password');
  }

  req.session.userId = user.id;

  res.send('You are signed in');
});

module.exports = router;
