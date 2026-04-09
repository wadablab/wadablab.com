const express = require('express');
const router = express.Router();
const Post = require("../models/Post");


//Routes

/*GET HOME*/
router.get('',async (req,res) =>{
    try {
        const locals = {
        title:"wadablab.com",
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
        const prevPage = parseInt(page) -1;
        const hasPrevPage = parseInt(page) > 1;


        res.render('index', {
            locals,
            data,
            type : "",
            current: page,
            nextPage: hasNextPage? nextPage : null,
            prevPage: hasPrevPage? prevPage : null
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
});

router.get('/experiments',async (req,res) =>{
    try{
        res.render('experiments',{});
    }
    catch(error){
        console.log(error);
    }
});

router.get('/:type',async (req,res) =>{
    try {
        const locals = {
        title:"wadablab.com",
        description: "where worms can feel at home"
        }
        let perPage = 5;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{$sort:{createdAt: -1}},{$match:{type: req.params.type}}])
        .skip(perPage*page-perPage)
        .limit(perPage)
        .exec();

        const count = (await Post.aggregate([{$match:{type: req.params.type}}])).length;
        const nextPage = parseInt(page) +1;
        console.log(count);
        const hasNextPage = nextPage <= Math.ceil(count/perPage);
        const prevPage = parseInt(page) -1;
        const hasPrevPage = parseInt(page) > 1;




        res.render('index', {
            locals,
            data,
            type: req.params.type ? req.params.type : "",
            current: page,
            nextPage: hasNextPage? nextPage : null,
            prevPage: hasPrevPage? prevPage : null
        });
    } catch (error) {
    console.log(error);
} 
});



module.exports = router;