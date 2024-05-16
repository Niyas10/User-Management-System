
const express=require('express');
const user_route=express()
const session =require('express-session');
const config=require('../config/config');
const {randomUUID}=require('crypto')
const nocache = require('nocache');

user_route.use(nocache());

user_route.use(express.json());

user_route.use(express.urlencoded({extended:true}))
user_route.use(session(
{secret:randomUUID(), /** To complete secure we can use hash values 
eg: 1b3dige3-bgbfd-ddf-ddd ,instead of string eg:'sectret' used now by uuid module */
resave:false,
saveUninitialized:true }))

const path=require('path')

const auth=require('../middleware/auth');



user_route.set('view engine','ejs');
user_route.set('views','./views/users')


const userController=require('../controllers/userController');

user_route.get('/register',nocache(),auth.isLogout,userController.loadRegister);
user_route.post('/register',userController.insertUser);

user_route.get('/',cacheBuster,userController.loginLoad,auth.isLogout);
user_route.get('/login',cacheBuster,userController.loginLoad,auth.isLogout);

user_route.post('/login',nocache(),userController.verifyLogin);

user_route.get('/home',nocache(),userController.loadHome,auth.isLogin);

user_route.post('/logout',userController.userLogout,nocache()); 

function cacheBuster(req,res,next){

    req.url += `?cacheBuster=${Math.random()}`;
    next();
}
  
module.exports= user_route;