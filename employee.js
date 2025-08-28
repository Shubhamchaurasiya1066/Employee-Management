var express = require('express');
var pool = require('./pool')
var upload = require('./multer')
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');


router.get('/employee_interface', function (req, res, next) {
    try{
        var ADMIN=localStorage.getItem('ADMIN')
        if(ADMIN)     
    res.render('employeeform', { message:'', color: 'black' });
    else
            res.redirect('/admin/admin_login')

    }
    
    catch(e){
        res.redirect('/admin/admin_login')
    }
})
router.get('/employee_search', function (req, res, next) {
    try{
        var ADMIN=localStorage.getItem('ADMIN')
        if(!ADMIN)     
    
       res.redirect('/admin/admin_login')

    }
    
    catch(e){
        res.redirect('/admin/admin_login')
    }
    
    res.render('searchemployee', { message:'', color: 'black' });
})
router.get('/fetch_all_states', function (req, res) {
    
    pool.query('select * from states', function (error, result) {
        if (error) {
            res.json({ status: false, data: [], message: 'Error in query Pls contact Data Administrator:' })
        }
        else {
            res.json({ status: true, data: result, message: 'successful' })
        }
    })
})
router.get('/fetch_all_city', function (req, res) {
   

    pool.query('select * from city where state_id=?', [req.query.state_id], function (error, result) {
        if (error) {
            res.json({ status: false, data: [], message: 'Error in query Pls contact Data Administrator:' })
        }
        else {
            res.json({ status: true, data: result, message: 'successful' })
        }
    })
})
router.post('/insert_record', upload.single('picture'), function (req, res) {
   try{
        
        if(!ADMIN)     
    
       res.redirect('/admin/admin_login')

    }
    
    catch(e){
        res.redirect('/admin/admin_login')
    }
 

    try {
        pool.query("insert into employees(employee_name, dob, gender, address, state_id, city_id, department, grade, salary, picture) values(?,?,?,?,?,?,?,?,?,?)", [req.body.employee_name, req.body.dob, req.body.gender, req.body.address, req.body.state_id, req.body.city_id, req.body.department, req.body.grade, req.body.salary, req.file.filename], function (error, result) {
            if (error) {
                res.render("employeeform", { status: false, message: error, color: 'red' })
            }
            else {
                res.render("employeeform", { status: true, message: "Employee submitted successful", color: 'green' })

            }
        })
    }
    catch (e) {
        console.log(e)
        res.render("employeeform", { status: false, message: "Some critical Error,Contact to Backend Team...." })

    }
})
router.get('/display_all', function (req, res) {
try{
        var ADMIN=localStorage.getItem('ADMIN')        
        if(!ADMIN)     
    
       res.redirect('/admin/admin_login')

    }
    
    catch(e){
        res.redirect('/admin/admin_login')
    }

    try {
        pool.query("select E.*,(select S.state_name from states S where S.state_id=E.state_id) as statename,(select C.city_name from city C where C.city_id=E.city_id) as cityname from employees E ", function (error, result) {

            if (error) {
                console.log(error)
                res.render("displayall", { status: false, message: "Error in database query" })
            }
            else {
                res.render("displayall", { status: true, data: result })
            }
        })
    }
    catch (e) {
        res.render("displayall", { status: false, message: "Critical server error" })

    }
})
router.get('/edit_delete_display', function (req, res) {
   

    try {
        pool.query("select E.*,(select S.state_name from states S where S.state_id=E.state_id) as statename,(select C.city_name from city C where C.city_id=E.city_id) as cityname from employees E where E.employee_id=?", [req.query.employee_id], function (error, result) {

            if (error) {
                console.log(error)
                res.render("editdeletedisplay", { status: false, message: "Error in database query" })
            }
            else {
                if(result.length==1)
                {res.render("editdeletedisplay", { status: true, data: result[0] })}
                else{
                    res.render("searchemployee",{message:'Employee Not Exist',color:'red'})
                }
            }
        })
    }
    catch (e) {
        res.render("editdeletedisplay", { status: false, message: "Critical server error" })

    }

})

router.post('/final_edit_delete', function (req, res) {
    try{
        
        if(!ADMIN)     
    
       res.redirect('/admin/admin_login')

    }
    
    catch(e){
        res.redirect('/admin/admin_login')
    }


    try {
        if (req.body.btn == 'Edit') {
            pool.query("update employees set employee_name=?, dob=?, gender=?, address=?, state_id=?, city_id=?, department=?, grade=?, salary=? where employee_id=? ", [req.body.employee_name, req.body.dob, req.body.gender, req.body.address, req.body.state_id, req.body.city_id, req.body.department, req.body.grade, req.body.salary, req.body.employee_id], function (error, result) {
                if (error) {
                    res.redirect("/employee/display_all")
                }
                else {
                    res.redirect("/employee/display_all")

                }
            })
        }
        else {
            pool.query("delete from employees where employee_id=? ", [req.body.employee_id], function (error, result) {
                if (error) {
                    res.redirect("/employee/display_all")
                }
                else {
                    res.redirect("/employee/display_all")

                }
            })
        }
    }
    catch (e) {
        console.log(e)
        res.redirect("/employee/display_all")

    }

})

router.get('/show_picture', function (req, res) {
    
        console.log(req.query)
    res.render('showpicture', { data: req.query })
})

router.post('/show_picture', upload.single('picture'), function (req, res) {
    try{
        
        if(!ADMIN)     
    
       res.redirect('/admin/admin_login')

    }
    
    catch(e){
        res.redirect('/admin/admin_login')
    }


    try {
        pool.query("update employees set picture=?,employee_name=? where employee_id=?", [req.file.filename, req.body.employee_id], function (error, result) {
            if (error) {
                console.log(error)
                res.redirect("/employee/display_all")
            }
            else {
                res.redirect("/employee/display_all")

            }
        })
    }
    catch (e) {

        res.redirect("/employee/display_all")

    }
})


module.exports = router;