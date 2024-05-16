const express = require('express');
const admin_route = express();
const session = require('express-session');
const config = require('../config/config');
const { randomUUID } = require('crypto');

const nocache=require('nocache');

admin_route.use(nocache());

admin_route.use(express.json());
admin_route.use(express.urlencoded({ extended: true }));

admin_route.use(
  session({
    secret: randomUUID(),
    resave: false,
    saveUninitialized: true,
  })
);

admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');

const auth=require('../middleware/adminAuth');

const adminController = require('../controllers/adminController');
const { cache } = require('ejs');

admin_route.get('/',adminController.loadLogin,auth.isLogOut);
admin_route.post('/login',addcacheBuster,adminController.verifyLogin); 

admin_route.get('/home',auth.isLogin,addcacheBuster,adminController.loadDashboard); 

admin_route.post('/logout',adminController.logout,addcacheBuster); 

admin_route.get('/new-user',nocache(),auth.isLogin,adminController.newUserLoad); 

admin_route.post('/new-user',adminController.addUser);

admin_route.get('/edit-user',nocache(),auth.isLogin,adminController.editUserLoad);
 
admin_route.post('/edit-user',adminController.updateUsers);

admin_route.get('/delete-user',nocache(),adminController.deleteUser);  

// admin_route.get('*',function(req,res){

//     res.redirect('/admin');
// })


function addcacheBuster(req,res,next){

  req.url += `?cacheBuster=${Math.random()}`;
  next();
}

module.exports = admin_route;

