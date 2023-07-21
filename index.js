const express = require('express');
const port = 8017;
const path = require('path');
const app = express();


const db=require('./config/mongodb');

const cookie=require('cookie-parser');
var stripe = require('stripe')('sk_test_51NWLAvSCbq47A1Wicvibul7sgVAnyRoideWAovWeJwks9K0261MRuBay4LLElWJzUkOf0O7fy5kgmVJd2zRia32j00qs3TV3TH');

app.use(cookie());

app.use(express.static('assets'));
app.use(express.static('user_assets'));

app.use(express.urlencoded());
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'view'));

app.use('/uploads',express.static(path.join(__dirname,'uploads')))

//flash
const flash= require('express-flash')
const flash_mid= require('./config/flash_message');
//session
const session=require('express-session');
const passport=require('passport'); 
const pass_mid=require('./config/passport');

app.use(session({
    name:'admin',
    secret:'e_com',
    saveUninitialized:true,
    resave:true,
    cookie:{
        maxAge:60*100*690
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(flash_mid.setFlash);

app.use('/',require('./router/index'));
app.listen(port,(err)=>{
    if(err){
        console.log('server is not running : ',err);
    }
    console.log('server is running: ',port);
})