const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { InputDataError } = require('../utils/errors');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
			validator: email => /^[\w.-]{2,}@([\w-]{2,}\.)+[\w-]{2,}/.test(email),
			message: 'Некорректный Email!'
		}
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  name: { 
    type: String,
    minlength: 2,
    maxlength: 40,
    default: 'Жак-Ив Кусто'
  },
	about: {
    type: String,
    minlength: 2,
    maxlength: 100,
    default: 'Исследователь океана'
	},
  avatar : {
    type: String,
		validate: {
			validator: avatar => /^https?:\/\/(www\.)?.+#?$/.test(avatar),
			message: 'Некорректная ссылка!'
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
	}
})

userSchema.statics.findUserByCredentials = function(email, password) {
  return this.findOne({ email }).select('+password')
    .then(user => {
      if (!user) throw new InputDataError();

      return bcrypt.compare(password, user.password)
        .then(isMatched => {
          if (!isMatched) throw new InputDataError();
          return user
        })
    })
}

module.exports = mongoose.model('user', userSchema)
