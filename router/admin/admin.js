const express = require('express');
const router = express.Router();
const controller = require('../../controller/admin/admin_controller');
const admin = require('../../model/admin_model');
const passport = require('passport');

router.get('/change_password/:id',controller.change_password)

router.get('/add_page', controller.add_page)
router.post('/add', admin.upImg, controller.add);
router.get('/view', controller.view);

router.get('/edit_page/:id', controller.edit_page);
router.post('/edit', admin.upImg, controller.edit);
router.get('/delete/:id', controller.delete);

router.post('/mul_del',controller.mul_del);
router.get('/profile',controller.profile);

router.get('/edit_profile_page/:id',controller.edit_profile_page);
router.post('/edit_profile',admin.upImg,controller.edit_profile);

router.get('/user_view',controller.user_view);
router.get('/delete_user/:id',controller.delete_user);
router.post('/mul_del_user',controller.mul_del_user);

router.get('/order_view',controller.order_view);
router.get('/delete_order/:id',controller.delete_order);
router.post('/mul_del_order',controller.mul_del_order);

router.get('/logout',(req,res)=>{
    req.logOut((err)=>{
        if(err){
            console.log('logout err in admin : ',err);
            return false;
        }
        return res.redirect('/');
    })
})

router.post('/')

module.exports = router;