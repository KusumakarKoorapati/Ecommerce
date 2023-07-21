const express=require('express');
const router=express.Router();
const controller=require('../../controller/admin/product_controller');
const product=require('../../model/product_model');

router.get('/add_page',controller.add_page);
router.post('/type_brand',controller.type_brand);   

router.post('/add',product.upImg,controller.add);

router.get('/view',controller.view);

router.get('/edit_page/:id',controller.edit_page);
router.post('/edit',product.upImg,controller.edit);
router.get('/delete/:id',controller.delete);

router.post('/mul_del',controller.mul_del);
module.exports=router;