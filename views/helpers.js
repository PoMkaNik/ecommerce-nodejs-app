module.exports = {
  getError(errors, prop) {
    return errors && errors.mapped()[prop] ? errors.mapped()[prop].msg : '';
  },
};
