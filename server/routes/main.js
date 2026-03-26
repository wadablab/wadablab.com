const express = require('express');
const router = express.Router();
const Post = require("../models/Post");


//Routes

/*GET HOME*/
router.get('',async (req,res) =>{
    try {
        const locals = {
        title:"WADABLAND",
        description: "where worms can feel at home"
        }
        let perPage = 5;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{$sort:{createdAt: -1}}])
        .skip(perPage*page-perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) +1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);



        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage? nextPage : null
        });
    } catch (error) {
    console.log(error);
}

    
});



/*GET POST: id*/
router.get('/post/:id', async(req,res) =>{

    try {
        

        let slug = req.params.id;

        const data = await Post.findById({_id: slug});

        const locals = {
        title:data.title,
        description: "where worms can feel at home"
        }

        res.render('post',{locals,data});
    } catch (error) {
        console.log(error);
    }
})




/*POST :searchTerm*/


router.post('/search', async(req,res) =>{

    try {
        const locals = {
            title:"Search",
            description: "where worms can feel at home"
        }

        let searchTerm = req.body.searchTerm;
        // const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g,"")
       
        const data = await Post.find({
            $or:[
                {title: {$regex: new RegExp(searchTerm,'i')}},
                {body: {$regex: new RegExp(searchTerm,'i')}}
            ]
        });


        res.render("search",{
            data,
            locals
        });
    } catch (error) {
        console.log(error);
    }
})

router.get('/games',(req,res) =>{
    res.render('games');
});

router.get('/art',(req,res) =>{
    res.render('art');
});


module.exports = router;