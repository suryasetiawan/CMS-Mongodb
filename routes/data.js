var express = require('express');
var router = express.Router();
const Data = require('../models/data');
// const config = require('../config/config');

// 1. SEARCH
router.post('/search', (req, res) => {
    let keyword = {};
    if (req.body.letter) {
        keyword.letter = req.body.letter
    }
    if (req.body.frequency) {
        keyword.frequency = req.body.frequency
    }

    Data.find(keyword).then(data1 => {
        res.json(data1);
      }).catch(err => {
        res.json({
          error: true,
          message: err.message
        })
      })

})

// 2. READ
router.get('/', (req,res) => {
    Data.find().then(data1 => {
        res.json(data1);
    }).catch(err => {
        json({
            error: true,
            message: `something went wrong : ${err.message}`
        })
    })

})

// 3. EDIT
router.put('/:id', (req, res, next) => {
    let id = req.params.id;
    Data.findByIdAndUpdate(id, {
        letter: req.body.letter,
        frequency: req.body.frequency
    }, {new:true}).then(data => {
        if(!data){
            res.json({
                success: false,
                message: `updating data has been failed id : ${id} not found`,
                data: {
                    _id: null,
                    letter: null,
                    frequency: null
                }
            })
        }else {
            res.json({
                success: true,
                message: 'data has been updated',
                data: {
                    _id: data._id,
                    letter: data.letter,
                    frequency: data.frequency
                }
            })
        }
    }).catch(err => {
        res.json({
            success: false,
            message: 'updating data has been failed',
            data: {
                _id: data._id,
                letter: data.letter,
                frequency: data.frequency
            }
        })
    })

})

// 4. ADD
router.post('/', (req, res) => {
    let data = new Data({
        letter: req.body.letter,
        frequency: req.body.frequency
    })
    data.save().then(data1 => {
        res.json({
            success: true,
            message: "data has been added",
            data: {
                _id: data1._id,
                letter: data1.letter,
                frequency: data1.frequency
            }
        })
    }).catch(err => {
        res.json({
            success: false,
            message: "adding data has been failed",
            data: {
                _id: null,
                letter: null,
                frequency: null
            }
        })
    })
})

module.exports = router;