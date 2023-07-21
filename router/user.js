const express=require('express');
const router=express.Router();
const controller=require('../controller/user/user_controller');
const passport=require('passport');

router.get('/',controller.index);
router.get('/product/:cat/:sub/:ex',controller.product);
router.get('/single_product/:id',controller.single_product);

router.post('/user_register',controller.user_register);
router.get('/product_cat/:id',controller.product_cat);

router.post('/login_user',passport.authenticate('user',({failureRedirect:'/'})),controller.login);
router.get('/logout',(req,res)=>{
    req.logOut((err)=>{
        if(err){
            console.log("logout err in user : ",err);
        }
        else{
            return res.redirect('/')
        }
    })
})

router.post('/add_cart',controller.add_cart);
router.get('/all_product',controller.all_product);
// add to cart page 
router.get('/cart_page',passport.checkUser,controller.cart_page);
router.post('/change_quantity',controller.change_quantity);
router.get('/delete/:id',controller.delete);

//check out 
router.get('/check_out_page',passport.checkUser,controller.check_out_page);

//payment

router.post('/payment',controller.payment); 
router.post('/add_address',controller.add_address)

//order
router.get('/order_page',passport.checkUser,controller.order_page);
router.get('/cancel_ord/:id',passport.checkUser,controller.cancel_ord);

//filter
router.post('/filter',controller.filter);
router.post('/filter_all',controller.filter_all);
module.exports=router;