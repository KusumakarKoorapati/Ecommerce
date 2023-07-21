const express = require('express');
const router = express.Router();
const controller = require('../controller/admin/admin_controller');

const passport = require('passport');

//user panel 
router.use('/', require('./user'));

//dashboard
router.get('/des', passport.AuthenticateUser, controller.dashboard)

//log in 
router.get('/admin', controller.login_page);
router.post('/login', passport.authenticate('local', ({ failureMessage: '/admin' })), controller.login);

//forget
router.get('/email', controller.email);
router.post('/otp', controller.otp);
router.post('/ch_otp', controller.ch_otp);
router.post('/change_pass', controller.change_pass);


//slider
router.use('/admin/slider', passport.AuthenticateUser, require('./admin/slider'));

//product
router.use('/admin/product', passport.AuthenticateUser, require('./admin/product'))

//type
router.use('/admin/type', passport.AuthenticateUser, require('./admin/type'));

//brand
router.use('/admin/brand', passport.AuthenticateUser, require('./admin/brand'));

//category
router.use('/admin/category', passport.AuthenticateUser, require('./admin/category'));

//sub_category
router.use('/admin/sub_category', passport.AuthenticateUser, require('./admin/sub_category'));

//extra category
router.use('/admin/ex_category', passport.AuthenticateUser, require('./admin/ex_category'));

//admin
router.use('/admin', passport.AuthenticateUser, require('./admin/admin'));

module.exports = router;