const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {
    
//   token: (email, secret)=>{
//     return jwt.sign({
//       email: email
//     }, secret, )
//   },

//   decoded: (token, secret, cb) =>{
//     jwt.verify(token, secret, (err, decoded)=>{
//       if(err){
//         cb(false);
//       }else{
//         User.findOne({
//           email: decoded.email,
//           password: decoded.password
//         }).then(user=>{
//           if(!user){
//             cb(false);
//           }else{
//           }
//             cb(true)
//         })
//       }
//     })
//   },

}