const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  link : {
    type: String,
    required: true,
		validate: {
			validator: link => /^https?:\/\/(www\.)?.+#?$/.test(link),
			message: 'Некорректная ссылка!'
		}
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('card', cardSchema)
