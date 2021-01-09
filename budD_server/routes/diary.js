var express = require('express');
var router = express.Router();
var User = require('../models').User;
var Diary = require('../models').Diary;
var Diary_front = require('../models').Diary_front;
const multer = require('multer');  //파일 관련 모듈
const upload = multer({dest: 'C:/xampp/htdocs/test/'});  //dest : 저장 위치
var fs = require('fs')
const sequelize = require("sequelize");
const Op = sequelize.Op;



module.exports = router;
