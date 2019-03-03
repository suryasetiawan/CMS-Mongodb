var express = require('express');
var router = express.Router();
const User = require('../models/user');
const config = require('../config/config');
// const helpers = require('../helpers/util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


/* GET users listing. */
// router.post('/api/users/register', function (req, res, next) {
//   if (req.body.password == req.body.retypepassword) {
//     let token = jwt.sign(req.body.email, config.secret)
//     // hash pake bcrypt

//     let user = new User({
//       email: req.body.email,
//       password: req.body.password,
//       token: token
//     })

//     user.save().then(users => {
//       res.json({
//         data: {
//           email: users.email
//         },
//         token: token
//       })
//     }).catch(err => {
//       res.json({
//         error: true,
//         message: err.message
//       })
//     })
//   } else {
//     res.json({
//       error: true,
//       message: 'password and retypepassword are not match'
//     })

//   }
// })

router.post('/api/users/register', (req, res) => {
  User.find({
      email: req.body.email
    })
    .then(user => {
      if (user.length > 0) {
        console.log(user);

        return res.status(409).json({
          message: 'email exists'
        })
      }
      if (req.body.password == req.body.retypepassword) {
      jwt.sign({
        email: req.body.email
      }, config.secret, { expiresIn: 86400 },
       (err, token) => {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            })
          } else {
            const user = new User({
              email: req.body.email,
              password: hash,
              token: token
            })
            user
              .save()
              .then(result => {
                console.log(result);
                res.json({
                  data: {
                    email: result.email
                  },
                  token
                })
              })
              .catch(err => res.send(err))
          }
        });
      })
    } else {
      res.json({
        error: true,
        message: 'password and retypepassword are not match'
      })
  
    }
    }).catch(err => res.send(err))
  
});

// router.post('/api/users/login', (req, res) => {
//   User.findOne({
//     email: req.body.email,
//   }).then(user => {
//     if (!user) {
//       res.json({ error: true, message: "Email is invalid" })
//     } else {
//       bcrypt.compare(req.body.password, user.password, function (err) {
//         if (err) {
//           res.json({ error: false, message: "Password is invalid" })
//         } else {
//           let token = jwt.sign({ email: user.email }, config.secret);
//           console.log(token)
//           user.token = token
//           user.save(err => {
//             res.json({
//               data: {
//                 email: user.email
//               },
//               token: token
//             })
//           })
//         }
//       })
//     }
//   })
// })

// router.post('/api/users/login', function (req, res, next) {
//   User.findOne({ email: req.body.email }).then(user => {
//     if (!user) {
//       res.json({
//         err: true,
//         message: "Email Not Found"
//       })
//     } else {
//       if (!bcrypt.compareSync(req.body.password, user.password)) {
//         res.json({
//           error: true,
//           message: 'Password Invalid'
//         });
//       } else {
//         let token = jwt.sign(user.email, config.secret);

//         User.updateOne({ email: req.params.email }, { $set: { token: token } }, (err) => {
//           if (err) return res.send(err);
//           res.status(201).json({
//             data: {
//               email: user.email
//             },
//             token: token
//           })
//         })
//       }
//     }
//   }).catch(err => console.log(err))
// })

router.post('/api/users/login', (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then(user => {
      if (!user) {
        res.json({ error: true, message: "Email Not Found" })
      } else {
        
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.json({
          error: true,
          message: 'Password Invalid'
        });
      } else {
          let token = jwt.sign({email:user.email} , config.secret, { expiresIn: 86400 });
          user.token = token
          user.save(err =>{
            res.json({
              data: {
                email: user.email
              },
              token: token
            })
          })
        }
      }
      
    })
    .catch(err => 
      res.send(err)
    )
})



router.post('/api/users/check', (req, res) => {
  var token = req.body.token || req.query.token || req.header['x-access-token'];
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) res.json({ valid: false })
      else {
        User.findOne({
          email: decoded.email,
          token: token
        }, (err, user) => {
          if (user) {
            res.json({ valid: true })
          } else {
            res.json({ valid: false })
          }

        })

      }

    })
  }
})

router.get('/api/users/destroy', (req, res) => {
  res.json({
    logout: true
  })
})


module.exports = router;
