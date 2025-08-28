var express = require('express');
var pool = require('./pool')
var upload=require('./multer')
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');

router.get('/admin_login', function (req, res, next) {
    res.render('adminlogin',{message:''});
})
router.get('/dashboard', function (req, res, next) {
    res.render('dashboard');
})
router.post('/chk_admin_login', function (req, res) {
    try {
        pool.query("select * from admins where (emailid=? or mobileno=?) and password=?", [req.body.emailid,req.body.emailid,req.body.password], function (error, result) {

            if (error) {
                
                res.render("adminlogin", { status: false, message: "Error in database query" })
            }
            else {
                if(result.length==1)
                { localStorage.setItem('ADMIN',JSON.stringify(result[0]))
                    res.render("dashboard",{status:true,data:result[0]})}
                else{
                    res.render("adminlogin",{message:'Invalid EmailId/Mobile No'})
                }
            }
        })
    }
    catch (e) {
        res.render("adminlogin", { status: false, message: "Critical server error" })

    }

})
router.get('/logout',function(req,res){
    localStorage.clear()
    res.redirect('/admin/admin_login')
})

module.exports=router