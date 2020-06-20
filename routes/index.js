var express = require('express');
var router = express.Router();
const MemberModifyMethod = require('../controllers/modify_controller');

const MemberModify = new MemberModifyMethod();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'hello' });
});
/* 會員登入 */
router.post('/login', MemberModify.postLogin);

/* 會員註冊 */
router.post('/register',MemberModify.postRegister);

/* 更新會員資料 */
router.post('/update', MemberModify.postUpdate);

module.exports = router;
