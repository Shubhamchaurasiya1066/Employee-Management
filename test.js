var express = require('express');
var router = express.Router();
var pool=require('./pool')

/* GET users listing. */
router.get('/display', function(req, res, next) {
  
  res.render('test')
});


router.get('/my_page/:id/:name', function(req, res, next) {
  console.log(req.params);
  res.send('This is a my page..');
});

router.get('/search/:id', function (req, res) {
    

    try {
        pool.query("select E.*,(select S.state_name from states S where S.state_id=E.state_id) as statename,(select C.city_name from city C where C.city_id=E.city_id) as cityname from employees E where E.employee_id=?", [req.params.id], function (error, result) {

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


module.exports = router;
