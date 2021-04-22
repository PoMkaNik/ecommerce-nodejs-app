const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom(async (email) => {
      // check if user with provided email is already exists
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) throw new Error('Email in use');
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters'),
  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters')
    .custom((passwordConfirmation, { req }) => {
      const { password } = req.body;
      if (password !== passwordConfirmation) {
        throw new Error('Passwords must match');
      } else {
        // need to return true because
        // express-validator requires explicit return from synchronous functions
        return true;
      }
    }),
  requireEmailExists: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async (email) => {
      const user = await usersRepo.getOneBy({ email });
      if (!user) throw new Error('Email not found');
    }),
  requireValidPasswordForUser: check('password')
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersRepo.getOneBy({ email: req.body.email });
      if (!user) throw new Error('Invalid password');

      const validPassword = await usersRepo.comparePasswords(
        user.password,
        password,
      );

      if (!validPassword) throw new Error('Invalid password');
    }),
};
