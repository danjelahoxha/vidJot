module.exports={
    ensureAuthenticated:function(req,res,next){
if(req.isAuthenticated()){
    return next();
}else{
    req.flash("error_msg","You should be loged in to have access");
    res.redirect("../users/login");

}
    }
}