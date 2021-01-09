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


//✓✓프런트 갱신
router.post('/front', function(req, res, next){
  //아이디가 db에 있는지 확인
  Diary_front.findAll({
    where: {userid: req.body.diary.userid}
  }).then(result => {
    
    jsonArray = new Array();
    jsonObject = new Object();

    jsonObject.result_diary_front = "ok";
    jsonObject.userid = result;
    jsonArray.push(jsonObject);

    console.log('✓프런트 갱신 완료');
    res.send(jsonArray);
  })
});


/*새로운 사람이랑 */
//✓✓상대 매칭(result = ok값 안보내지는 거)
router.post('/findSomeone', function(req, res, next){
  User.findOne({
    where:{userid: req.body.user.userid}
  }).then(mem => {
    /*내 일기가 4개 미만 */
    if(mem.diary_cnt < 4){  
      //내 아이디는 검색되면 안됨
      let searchWord = req.body.user.opposite_interest

      User.findAll({
        where: {
          userid:{[Op.notLike]: req.body.user.userid},
          sex:req.body.user.opposite_sex, 
          interest:{[Op.like]: "%" + searchWord + "%"},
          diary_cnt:{[Op.lt]:4}
        }

      })
      .then(user => {

        jsonObject = new Object();
        jsonObject.result_diary_findSomeone = "ok";
        jsonObject.userid = user;
        console.log('✓원하는 유저 찾기 성공');
        res.send(jsonObject);

      })
      .catch(err => {

        jsonObject = new Object();
        jsonObject.result_diary_findSomeone = "no";
        console.log('✗원하는 유저 없음');
        res.status(500).json(jsonObject);
      })

    }
    /*내 일기가 4개 이상 */
    else{
      console.log('✓일기 개수가 4개 이상입니다.');
      res.send({
        "result_diary_findSomone": "no"
        })
    }
  })

  

});


//✓✓일기 표지 올리기(프런트에서 매칭)
//파일 업로드 및 디비에 위치 저장
//해당 id, 상대 id, 일기 커버 사진으로 새 필드 만들고
//두 유저 모두 diary_cnt + 1 해줘야 함
router.post('/uploadCover', upload.single('cover_filePath'), function(req, res, next) {
  //새 일기를 작성하기 위한 것이니 diary_cnt를 +1해줘야 함
  //보내는 사람 diary_cnt + 1
  User.findOne({
    where: {userid: req.body.userid}
  }).then(user => {
    var send_cnt = user.diary_cnt + 1;

    User.update({
      diary_cnt: send_cnt
    },{
      where:{
        userid: req.body.userid
      }
    })
  })
  //받는 사람 diary_cnt + 1
  User.findOne({
    where: {userid: req.body.opposite_id}
  }).then(user2 => {
    var recieve_cnt = user2.diary_cnt + 1;

    User.update({
      diary_cnt: recieve_cnt
    },{
      where:{
        userid: req.body.opposite_id
      }
    })
  })
  
  //새 일기는 서로 같은 표지로 만들어짐
  Diary.create({ 
    diary_type: "send",
    userid: req.body.userid, 
    opposite_id: req.body.opposite_id, 
    cover_filePath: req.file.filename
  });
  Diary.create({
    diary_type: "recieve",
    userid: req.body.opposite_id, 
    opposite_id: req.body.userid, 
    cover_filePath: req.file.filename
  });

  Diary_front.create({ 
    userid: req.body.userid, 
    opposite_id: req.body.opposite_id, 
    cover_filePath: req.file.filename
  });
  Diary_front.create({
    userid: req.body.opposite_id, 
    opposite_id: req.body.userid, 
    cover_filePath: req.file.filename
  });

  console.log('✓표지 올리기 및 매칭 완료');
  console.log(req.body.userid)
  console.log(req.body.opposite_id)
  console.log(req.file.filename)
  res.send({
  "result_diary_uploadCover": "ok"
  })

});



//✓✓작성한 일기 올리기
router.post('/uploadContent', upload.single('content_filePath'), function(req, res, next) {
  Diary.update({
    title: req.body.title,
    content_filePath: req.file.filename
  },{
    where:{
      userid: req.body.userid,
      opposite_id: req.body.opposite_id, 
      cover_filePath: req.body.cover_filePath
    }
  })
  
  Diary.update({
    title: req.body.title,
    content_filePath: req.file.filename
  },{
    where:{
      userid: req.body.opposite_id,
      opposite_id: req.body.userid,
      cover_filePath: req.body.cover_filePath
    }
  })

  console.log('✓새 일기 작성 완료')
  res.send({
    "result_diary_uploadContent" : "ok"
  })
});

/*여기까지 새로운 사람이랑 새 일기 작성 */


//✓✓일기 작성(원래 쓰던 사람이랑)
router.post('/write', upload.single('content_filePath'), function(req, res, next) {
  Diary_front.findOne({
    where:{userid: req.body.userid, opposite_id: req.body.opposite_id}
  }).then(send => {
    Diary.create({ 
      diary_type: "send",
      userid: req.body.userid, 
      opposite_id: req.body.opposite_id, 
      cover_filePath: send.cover_filePath, 
      title: req.body.title, 
      content_filePath: req.file.filename
    });
  })
  
  Diary_front.findOne({
    where:{userid: req.body.opposite_id, opposite_id: req.body.userid}
  }).then(recieve => {
    Diary.create({
      diary_type: "recieve",
      userid: req.body.opposite_id, 
      opposite_id: req.body.userid, 
      cover_filePath: recieve.cover_filePath, 
      title: req.body.title, 
      content_filePath: req.file.filename
    });
  })
  
  console.log('✓일기 작성 완료');
  res.send({
  "result_diary_write": "ok"
  })
});

//✓✓일기 내용 전달
router.post('/whatContent', function(req, res, next){
  //아이디가 db에 있는지 확인
  Diary.findAll({
    //내 아이디랑 상대 아이디 같은 내용만 추려서 보내기
    where: {
      userid: req.body.diary.userid,
      opposite_id: req.body.diary.opposite_id
    }
  }).then(result => {
    // jsonArray = new Array();
    jsonObject = new Object();

    jsonObject.result_diary_whatContent = "ok";
    jsonObject.userid = result;
    // jsonArray.push(jsonObject);

    console.log('✓일기 내용 전달 완료');
    res.send(jsonObject);
    // res.send(jsonArray);
  })
});

//해당하는 제목이 없을 때의 로그가 안뜸
//✓✓일기 제목 검색
router.post('/findTitle', function(req, res, next){
  //내가 보낸 거랑 받은 거랑 둘 다 검색되어야 함
  //diary_type 분류해서 받은 거, 보낸 거 둘 다 저장하기 때문에 아래처럼 하면 됨
  let searchWord = req.body.diary.title

  Diary.findAll({
    where: {
      [Op.and]: [
        {
          userid:req.body.diary.userid, 
          opposite_id:req.body.diary.opposite_id
        },
        {
          title:{ [Op.like]: "%" + searchWord + "%" }
        }
      ]
      
    }

  })
  .then(diary => {
    if(diary != null){
      jsonObject = new Object();

      jsonObject.result_diary_findTitle = "ok";
      jsonObject.title = diary;
  
      console.log('✓일기 제목 검색 성공');
      res.send(jsonObject);

    }

  })
  

});

//✓✓절교
router.post('/break', function(req, res, next) {
  //절교하는 사람 diary_cnt - 1
  User.findOne({
    where: {userid: req.body.diary.userid}
  }).then(user => {
    var send_cnt = user.diary_cnt - 1;
  
    User.update({
      diary_cnt: send_cnt
    },{
      where:{
        userid: req.body.diary.userid
      }
    })
  })
  //절교 당하는 사람 diary_cnt - 1
  User.findOne({
    where: {userid: req.body.diary.opposite_id}
  }).then(user2 => {
    var recieve_cnt = user2.diary_cnt - 1;
  
    User.update({
      diary_cnt: recieve_cnt
    },{
      where:{
        userid: req.body.diary.opposite_id
      }
    })
  })
  
  
    Diary.destroy({ 
      where: { 
        [Op.or]: [
          {
            userid:req.body.diary.userid, opposite_id:req.body.diary.opposite_id
          },
          {
            userid:req.body.diary.opposite_id, opposite_id:req.body.diary.userid
          }
        ]
      } 
     });
    
    Diary_front.destroy({ 
      where: { 
        [Op.or]: [
          {
            userid:req.body.diary.userid, opposite_id:req.body.diary.opposite_id
          },
          {
            userid:req.body.diary.opposite_id, opposite_id:req.body.diary.userid
          }
        ]
      } 
     });
  
     console.log('✓절교 성공');
     res.send({
      "result_diary_break": "ok"
     })
  });
  

module.exports = router;
