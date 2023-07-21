module.exports.setFlash=(req,res,next)=>{
    res.locals.flash={
        'success':req.flash('success'),
        'err':req.flash('err'),
        'val_err':req.flash('val_err')
    }
    next();
}
