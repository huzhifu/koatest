/**
 * Created by 胡志甫 on 2016/6/10.
 */
var router=require('express').Router();
var logic=require('../business_logic/todo_logic.js');
var multer = require('multer'); //马特尔
var AVATAR_PATH = '../public/avatars';
var storage = multer.diskStorage({
    destination: AVATAR_PATH,
    filename: function (req, file, cb) {
        var fileName = req.session.user.userName;
        cb(null, fileName)
    }
});
//实例化 upload对象
var uploadObj = multer({ storage: storage }); //将刚才配置好的 storage 作为参数传给 multer

//上传头像
router.get('/upload_avatar',logic.uploadAvatar);
//处理上传头像的逻辑
router.post('/upload_avatar',uploadObj.single('avatar'),logic.uploadAvatarPost);
//用户注册
router.get('/register',logic.register);
//处理用户注册的逻辑
router.post('/register',logic.registerPost);
//用户登录
router.get('/login',logic.login);
//处理用户登录的逻辑
router.post('/login',logic.loginPost);
//用户登出
router.get('/logout',logic.logout);

router.get('/update/:id',logic.update);
router.get('/delete/:id',logic.delete);
router.get('/finish/:id',logic.finish);
router.post('/sumbit/:id',logic.submit);
router.post('/add',logic.add);
/*router.get('/edit',function(req,res,next){
    res.render('edit.ejs',{});
});*/
router.get('/',logic.index);
router.all('*',logic.other);


module.exports=router;