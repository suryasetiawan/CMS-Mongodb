const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;


const Schema = mongoose.Schema;

let userSchema = new Schema({
  email: String,
  password: String,
  token: String
});

// userSchema.pre('save', function(next){
//     this.password = bcrypt.hashSync(this.password, saltRounds);
//     next();
//     });
    

module.exports = mongoose.model('User', userSchema)