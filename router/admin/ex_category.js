const express=require('express');
const   controller = require('../../controller/admin/exCategory_controller');
const router=express.Router();

router.get('/add_page',controller.add_page);
router.post('/add',controller.add);

router.get('/view',controller.view);

router.get('/edit_page/:id',controller.edit_page);
router.post('/edit',controller.edit);

router.post('/ajax_subcategory',controller.ajax_subcategory);

router.get('/delete/:id',controller.delete);

router.post('/mul_del',controller.mul_del);

module.exports=router;