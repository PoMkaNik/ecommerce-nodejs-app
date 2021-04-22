const Repository = require('./repository');
const { randomBytes, scrypt } = require('crypto');
const util = require('util');

const asyncScrypt = util.promisify(scrypt);

class UserRepository extends Repository {
  async create(attrs) {
    attrs.id = this.randomId();

    const salt = randomBytes(8).toString('hex');
    const buff = await asyncScrypt(attrs.password, salt, 64);

    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${buff.toString('hex')}.${salt}`,
    };
    records.push(record);
    // write to file
    await this.writeAll(records);
    return record;
  }

  async comparePasswords(saved, supplied) {
    // saved password -> password from DB
    // supplied password -> password provided by user during signin process
    const [hashed, salt] = saved.split('.');
    const hashedSuppliedBuff = await asyncScrypt(supplied, salt, 64);

    return hashed === hashedSuppliedBuff.toString('hex');
  }
}
module.exports = new UserRepository('users.json');
