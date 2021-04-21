const fs = require('fs');
const { randomBytes, scrypt } = require('crypto');
const util = require('util');

const asyncScrypt = util.promisify(scrypt);

class UserRepository {
  constructor(filename) {
    if (!filename) throw new Error('Creating a repository requires a filename');
    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      // no such file exists
      // create new one
      fs.writeFileSync(this.filename, '[]');
    }
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8',
      }),
    );
  }

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

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2),
      {
        encoding: 'utf8',
      },
    );
  }

  randomId() {
    return randomBytes(4).toString('hex');
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);
    if (!record) throw new Error(`Record with ${id} not found`);
    // update record
    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      // for each one record -> new found variable
      let found = true;

      for (let key in filters) {
        // change found variable if one of the key-value pair
        // is not match
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      // or not change if all key-value pairs are match to the filters
      // and return this record as found
      if (found) return record;
    }
  }
}
module.exports = new UserRepository('users.json');
