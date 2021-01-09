var express = require('express');
// var bodyParser = require('body-parser')
var router = express.Router();
var User = require('../models').User;
var Diary = require('../models').Diary;
var Diary_front = require('../models').Diary_front;


//통신 테스트
router.post('/test', function(req, res, next) {
  console.log('✓통신 테스트');
  res.send({
    "result_test": "ok"
  })
});



module.exports = router;
