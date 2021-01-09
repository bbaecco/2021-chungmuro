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

//회원 가입(안드 회원 가입 버튼 클릭)
router.post('/signup', function(req, res, next) {
  User.create({ 
    userid: req.body.user.userid, 
    pwd: req.body.user.pwd, 
    sex: req.body.user.sex,
    interest: req.body.user.interest
  });
  console.log('✓가입 성공');
  res.send({
  "result_user_signup": "ok"
  })
});

//아이디 중복 체크
router.post('/idcheck', function(req, res, next) {
  User.findOne({
    where: {userid: req.body.user.userid}
  }).then(user => {
    if(user != null){  //중복된 아이디 있을 때
      console.log('✗아이디 중복'); 
      res.send({
        "result_user_idcheck": "no"
      })
    }else{  //중복된 아이디 없을 때
      console.log('✓아이디 중복 안됨');
      res.send({
        "result_user_idcheck": "ok"
      })
    }
  })
});

//로그인(로그인 버튼 클릭)
router.post('/login', function(req, res, next){
  //아이디가 db에 있는지 확인
  User.findOne({
    where: {userid: req.body.user.userid}
  }).then(user => {
    /*아이디 있을 때*/
    if(user !=null){  
      console.log('✓가입된 아이디 입니다.'); 
      //비밀번호 일치 여부 확인
      if(req.body.user.pwd == user.pwd){  //패스워드 일치 할 때
        console.log('✓비밀번호가 일치합니다.');
          res.send({
            "result_user_login": "ok",
          })
      }
      else{
        //비밀번호 불일치 할 때
        console.log('✗비밀번호가 일치하지 않습니다.');
        res.send({
          "result_user_login_pwd": "no"
      })
    }
  }
    /*아이디 없을 때*/
    else{  
      console.log('✗가입되지 않은 아이디 입니다.');
      res.send({
        "result_user_login": "no"
      })
    }
  })
});

module.exports = router;
