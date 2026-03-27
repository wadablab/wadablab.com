const express = require('express');
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const adminLayout = '../views/layouts/admin';
const voidLayout = '../views/layouts/void';
const jwtsecret = process.env.JWT_SECRET;

/*move to middleware file */

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./public/uploads");
    },
    filename: (req, file, cb)=>{
        const ff=file;
        console.log(ff);
        let newFileName = Date.now() + ff.originalname
        cb(null,newFileName);
    }
});


const upload_cover = multer({storage: storage}).single('cover');


/*ADMIN CHECK LOGIN*/

const authMiddleware = (req,res,next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: "unauthorized"});
    }

    try{
        const decoded = jwt.verify(token, jwtsecret);
        req.userId = decoded.userId;
        next();

    } catch(error){
        res.status(401).json({message: "unauthorized"});
    }
}



/*GET ADMIN LOGIN PAGE*/

router.get('/admin', async (req,res) =>{
    try {
        const locals = {
        title:"WADABLADMIN",
        description: "where the early birds sleep"
        }
        
        res.render('admin/index', {locals, layout: adminLayout})
        } catch (error) {
        console.log(error);
    }
});


/*POST ADMIN CHECK LOGIN*/



router.post('/admin',async (req,res) =>{
    try {  
        const{username,password} = req.body;

        const user = await User.findOne({username});
        if(!user){
            res.redirect("/uh-oh");
            return
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            res.redirect("/uh-oh");
            return
        }

        const token = jwt.sign({userId: user._id}, jwtsecret);
        res.cookie("token", token, {httpOnly: true});
        res.redirect('/dashboard');

        } catch (error) {
        console.log(error);
    }
});


/*GET UH-OH */

router.get('/uh-oh',async(req,res)=>{
    try {
        const locals = {
            title: "uh-oh",
            description: "scream"
        };
        res.render("admin/uh-oh",{
            locals,
            layout: voidLayout
        });
    } catch (error) {
        console.log(error);
    }
})



/*GET ADMIN DASHBOARD */

router.get('/dashboard',authMiddleware,async (req,res) =>{

    try {
        const locals = {
            title: "Dashboard",
            description: "YUP"
        };

        const data = await Post.find();
        res.render("admin/dashboard",{
            locals,
            data,
            layout: adminLayout
        });


    } catch (error) {
        console.log(error);
    }

});

/*GET ADMIN CREATE NEW POST */
router.get('/add-post',authMiddleware,async (req,res) =>{

    try {
        const locals = {
            title: "ADD POST",
            description: "YUP"
        }


        res.render("admin/add-post",{
            locals,
            layout: adminLayout
        });


    } catch (error) {
        console.log(error);
    }

});


/*GET ADMIN CREATE NEW BLOG POST */
router.get('/add-blog-post',authMiddleware,async (req,res) =>{

    try {
        const locals = {
            title: "ADD BLOG POST",
            description: "YUP"
        }


        res.render("admin/add-blog-post",{
            locals,
            layout: adminLayout
        });


    } catch (error) {
        console.log(error);
    }

});



/*POST ADMIN CREATE NEW BLOG POST */

router.post('/add-blog-post',authMiddleware, async(req,res) =>{
    upload_cover(req,res,async (error)=>{
        if(error){
            console.log(error);
            res.status(400).json({message:"womp womp"});
        } else{
            try{
                let newPost;
                if(req.file !== undefined){
                    newPost = new Post({
                        title: req.body.title,
                        cover_path: res.req.file.filename,
                        body: req.body.body
                    })
                }else{
                    newPost = new Post({
                        title: req.body.title,
                        body: req.body.body
                    })
                }
                await Post.create(newPost);
                res.redirect("/dashboard");
            }catch(error){
                console.log(error);
            }}
    })
});





/*GET ADMIN EDIT POST */
router.get('/edit-post/:id',authMiddleware,async (req,res) =>{

    try {
        const locals ={
            title:"Edit post",
            description: "jesus"
        }
        const data = await Post.findOne({_id: req.params.id});


        res.render('admin/edit-post',{
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }

});


/*PUT ADMIN EDIT POST */
router.put('/edit-post/:id',authMiddleware,async (req,res) =>{

    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect("/dashboard");;
    } catch (error) {
        console.log(error);
    }

});




/**
 * POST /
 * Admin - Register
*/
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password:hashedPassword });
      res.status(201).json({ message: 'User Created', user });
    } catch (error) {
      if(error.code === 11000) {
        res.status(409).json({ message: 'User already in use'});
      }
      res.status(500).json({ message: 'Internal server error'})
    }

  } catch (error) {
    console.log(error);
  }
});



/*DELETE ADMIN DELETE POST */
router.delete('/delete-post/:id',authMiddleware,async (req,res) =>{
    try {
        let file = await Post.findById({_id : req.params.id});
        fs.unlink("./public/uploads/" + file.cover_path, (error)=>{
            if(error){
                console.log(error);
                return
                }
            }   
        );
        await Post.deleteOne({_id: req.params.id});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

//DELETE PICTURE FILE FROM SERVER
// const fs = require('fs')

// const path = './file.txt'

// fs.unlink(path, (err) => {
//   if (err) {
//     console.error(err)
//     return
//   }
// })





/*GET ADMIN LOGOUT */
router.get('/logout',(req,res) =>{
    try {
        res.clearCookie('token');
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;