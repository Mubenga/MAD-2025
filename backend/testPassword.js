const bcrypt = require('bcryptjs');

const enteredPassword = '123456';
const hashedPassword = '$2b$10$32wK3I2C2U8rVgQwzG9Ed.dYw0qPmTwB2mrxsiWnCWkPvg9H.QwHW';

bcrypt.compare(enteredPassword, hashedPassword, (err, isMatch) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Do they match?', isMatch);
  }
});
