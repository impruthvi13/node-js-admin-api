const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Section = require('../models/sectionModel');
const Role = require('../models/roleModel');
const User = require('../models/userModel');

dotenv.config({ path: '../.env' });
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })

  .then(() => console.log('Database connection successfull'));

//   Read JSON FILE
const sections = JSON.parse(
  fs.readFileSync(`${__dirname}/sections.json`, 'utf-8')
);

const roles = JSON.parse(fs.readFileSync(`${__dirname}/roles.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// IMPORT DATA TO DB
const importData = async () => {
  try {
    await Section.create(sections);
    await Role.create(roles);
    await User.create(users);
    console.log('Data successfully added');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// DELETE DATA TO DB
const deleteData = async () => {
  try {
    await Section.deleteMany();
    await Role.deleteMany();
    await User.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
