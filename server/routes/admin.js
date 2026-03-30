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

let c = 0;
/*move to middleware file */

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./public/uploads");
    },
    filename: (req, file, cb)=>{
        const ff=file;
        let newFileName = Date.now() + ff.originalname;
        cb(null,newFileName);
    }
});

const storage_game = multer.diskStorage({
    destination: (req, file, cb) =>{
        let dest = "./public/uploads/" + c.toString();
        fs.mkdirSync(dest, {recursive: true});
        cb(null, dest);
    },
    filename: (req, file, cb)=>{
        const ff=file;
        let newFileName = ff.originalname;
        cb(null,newFileName);
    }
});

const upload_cover = multer({storage: storage}).single('cover');
const upload_cover_song = multer({storage: storage}).fields([{name: 'cover'},{name: 'audio'}]);
const upload_cover_video = multer({storage: storage}).fields([{name: 'cover'},{name: 'video'}]);
const upload_game = multer({storage: storage_game}).fields([{name: 'cover'},{name: 'game'}]);

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

        const data = await Post.find({});
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

/*GET ADMIN CREATE NEW BLOG POST EMBED*/
router.get('/add-blog-post-embed',authMiddleware,async (req,res) =>{

    try {
        const locals = {
            title: "ADD BLOG POST",
            description: "YUP"
        }
        res.render("admin/add-blog-post-embed",{
            locals,
            layout: adminLayout
        });


    } catch (error) {
        console.log(error);
    }

});

/*GET ADMIN CREATE NEW MINI JAM */
router.get('/add-mini-jam',authMiddleware,async (req,res) =>{

    try {
        const locals = {
            title: "ADD MINI JAM",
            description: "YUP"
        }


        res.render("admin/add-mini-jam",{
            locals,
            layout: adminLayout
        });


    } catch (error) {
        console.log(error);
    }

});

/*GET ADMIN CREATE NEW MINI JAM EMBED*/
router.get('/add-mini-jam-embed',authMiddleware,async (req,res) =>{

    try {
        const locals = {
            title: "ADD MINI JAM",
            description: "YUP"
        }
        res.render("admin/add-mini-jam-embed",{
            locals,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }

});

/*GET ADMIN CREATE NEW VIDEO*/
router.get('/add-video',authMiddleware,async (req,res) =>{

    try {
        const locals = {
            title: "ADD MINI JAM",
            description: "YUP"
        }
        res.render("admin/add-video",{
            locals,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }

});

/*GET ADMIN CREATE NEW VIDEO*/
router.get('/add-video-embed',authMiddleware,async (req,res) =>{

    try {
        const locals = {
            title: "ADD VIDEO",
            description: "YUP"
        }
        res.render("admin/add-video-embed",{
            locals,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }

});

/*GET ADMIN CREATE NEW GAME*/
router.get('/add-game',authMiddleware,async (req,res) =>{

    try {
        const locals = {
            title: "ADD GAME",
            description: "YUP"
        }
        res.render("admin/add-game",{
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
            try{
                let newPost;
                newPost = new Post({
                    type:"blog-post",
                    title: req.body.title,
                    body: req.body.body,
                    cover_path: (res.req.file ? res.req.file.filename : ""),
                })
                await Post.create(newPost);
                res.redirect("/dashboard");
            }catch(error){
                console.log(error);
            }
    })
});

/*POST ADMIN CREATE NEW MINI JAM*/

router.post('/add-mini-jam',authMiddleware, async(req,res) =>{
    upload_cover_song(req,res,async (error)=>{
            try{
                let newPost;
                newPost = new Post({
                    type:"mini-jam",
                    title: req.body.title,
                    cover_path: req.files.cover ? req.files.cover[0].filename : "",
                    audio_path: req.files.audio[0].filename,
                    body: req.body.body
                })
                await Post.create(newPost);
                res.redirect("/dashboard");
            }catch(error){
                console.log(error);
            }
    })
});

/*POST ADMIN CREATE NEW VIDEO*/

router.post('/add-video',authMiddleware, async(req,res) =>{
    upload_cover_video(req,res,async (error)=>{
            try{
                let newPost;
                newPost = new Post({
                    type:"video",
                    title: req.body.title,
                    cover_path: req.files.cover ? req.files.cover[0].filename : "",
                    video_path: req.files.video[0].filename,
                    body: req.body.body
                })
                await Post.create(newPost);
                res.redirect("/dashboard");
            }catch(error){
                console.log(error);
            }
    })
});

/*POST ADMIN CREATE NEW GAME*/

router.post('/add-game',authMiddleware, async(req,res) =>{
    upload_game(req,res,async (error)=>{
            try{
                let newPost;
                newPost = new Post({
                    type:"game",
                    title: req.body.title,
                    cover_path: c.toString() + "/cover.png",
                    game_path: c.toString() + "/index.html",
                    body: req.body.body
                })
                c+=1;
                await Post.create(newPost);
                res.redirect("/dashboard");
            }catch(error){
                console.log(error);
            }
    })
});

/*POST ADMIN CREATE NEW BLOG POST EMBED*/

router.post('/add-blog-post-embed',authMiddleware, async(req,res) =>{
    upload_cover(req,res,async (error)=>{
            try{
                let newPost= new Post({
                    type:"blog-post-embed",
                    title: req.body.title,
                    insta_link: req.body.insta_link,
                    body: req.body.body
                }) 
                await Post.create(newPost);
                res.redirect("/dashboard");
            }catch(error){
                console.log(error);
            }
    })
});

/*POST ADMIN CREATE NEW MINI JAM EMBED*/

router.post('/add-mini-jam-embed',authMiddleware, async(req,res) =>{
    upload_cover(req,res,async (error)=>{
            try{
                let newPost= new Post({
                    type:"mini-jam-embed",
                    title: req.body.title,
                    soundcloud_link: req.body.soundcloud_link,
                    body: req.body.body
                }) 
                await Post.create(newPost);
                res.redirect("/dashboard");
            }catch(error){
                console.log(error);
            }
    })
});

/*POST ADMIN CREATE NEW VIDEO EMBED*/

router.post('/add-video-embed',authMiddleware, async(req,res) =>{
    upload_cover(req,res,async (error)=>{
            try{
                let newPost= new Post({
                    type:"video-embed",
                    title: req.body.title,
                    youtube_link: req.body.youtube_link,
                    body: req.body.body
                }) 
                await Post.create(newPost);
                res.redirect("/dashboard");
            }catch(error){
                console.log(error);
            }
    })
});


/*GET ADMIN EDIT BLOG POST */
router.get('/edit-blog-post/:id',authMiddleware,async (req,res) =>{

    try {
        const locals ={
            title:"Edit post",
            description: "jesus"
        }
        const data = await Post.findOne({_id: req.params.id});


        res.render('admin/edit-blog-post',{
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }

});

/*GET ADMIN EDIT BLOG POST EMBED*/
router.get('/edit-blog-post-embed/:id',authMiddleware,async (req,res) =>{

    try {
        const locals ={
            title:"Edit post",
            description: "jesus"
        }
        const data = await Post.findOne({_id: req.params.id});


        res.render('admin/edit-blog-post-embed',{
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }

});

/*GET ADMIN EDIT MINI JAM */
router.get('/edit-mini-jam/:id',authMiddleware,async (req,res) =>{

    try {
        const locals ={
            title:"Edit post",
            description: "jesus"
        }
        const data = await Post.findOne({_id: req.params.id});


        res.render('admin/edit-mini-jam',{
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }

});

/*GET ADMIN EDIT MINI JAM EMBED*/
router.get('/edit-mini-jam-embed/:id',authMiddleware,async (req,res) =>{

    try {
        const locals ={
            title:"Edit post",
            description: "jesus"
        }
        const data = await Post.findOne({_id: req.params.id});


        res.render('admin/edit-mini-jam-embed',{
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }

});

/*GET ADMIN EDIT VIDEO */
router.get('/edit-video/:id',authMiddleware,async (req,res) =>{

    try {
        const locals ={
            title:"Edit post",
            description: "jesus"
        }
        const data = await Post.findOne({_id: req.params.id});


        res.render('admin/edit-video',{
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }

});

/*GET ADMIN EDIT VIDEO EMBED*/
router.get('/edit-video-embed/:id',authMiddleware,async (req,res) =>{

    try {
        const locals ={
            title:"Edit Video",
            description: "jesus"
        }
        const data = await Post.findOne({_id: req.params.id});


        res.render('admin/edit-video-embed',{
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }

});

/*PUT ADMIN EDIT BLOG POST */
router.put('/edit-blog-post/:id',authMiddleware,async (req,res) =>{
    upload_cover(req,res,async (error)=>{
            try{
                let file = await Post.findById({_id : req.params.id});
                if (res.req.file && file.cover_path !== ""){
                    await fs.unlink("./public/uploads/" + file.cover_path, (error)=>{
                    if(error){
                        console.log(error);
                        return;
                    }
                });
                }
                
                await Post.findByIdAndUpdate(req.params.id, {
                    title: req.body.title,
                    cover_path: (res.req.file ? res.req.file.filename : file.cover_path),
                    body: req.body.body,
                    updatedAt: Date.now()
        });
                res.redirect("/dashboard");
            }catch(error){
                console.log(error);
            }
    })

});

/*PUT ADMIN EDIT BLOG POST EMBED*/
router.put('/edit-blog-post-embed/:id',authMiddleware,async (req,res) =>{
    upload_cover(req,res,async (error)=>{
            try{
                let file = await Post.findById({_id : req.params.id});
                await Post.findByIdAndUpdate(req.params.id, {
                    title: req.body.title,
                    insta_link: (req.body.insta_link !== "" ? req.body.insta_link : file.insta_link),
                    body: req.body.body,
                    updatedAt: Date.now()
        });
                res.redirect("/dashboard");
            }catch(error){
                console.log(error);
            }
    })

});


/*PUT ADMIN EDIT MINI JAM */
router.put('/edit-mini-jam/:id',authMiddleware,async (req,res) =>{
    upload_cover_song(req,res,async (error)=>{
            try{
                let file = await Post.findById({_id : req.params.id});
                if (res.req.files.cover && file.cover_path !== ""){
                    await fs.unlink("./public/uploads/" + file.cover_path, (error)=>{
                    if(error){
                        console.log(error);
                        return;
                    }
                });
                }
                if (res.req.files.audio && file.audio_path !== ""){
                    await fs.unlink("./public/uploads/" + file.audio_path, (error)=>{
                    if(error){
                        console.log(error);
                        return;
                    }
                });
                }
                
                await Post.findByIdAndUpdate(req.params.id, {
                    title: req.body.title,
                    cover_path: (res.req.files.cover ? res.req.files.cover[0].filename : file.cover_path),
                    audio_path: (res.req.files.audio ? res.req.files.audio[0].filename : file.audio_path),
                    body: req.body.body,
                    updatedAt: Date.now()
        });
                res.redirect("/dashboard");
            }catch(error){
                console.log(error);
            }
    })

});

/*PUT ADMIN EDIT MINI JAM EMBED*/
router.put('/edit-mini-jam-embed/:id',authMiddleware,async (req,res) =>{
    upload_cover(req,res,async (error)=>{
            try{
                let file = await Post.findById({_id : req.params.id});
                await Post.findByIdAndUpdate(req.params.id, {
                    title: req.body.title,
                    soundcloud_link: (req.body.soundcloud_link !== "" ? req.body.soundcloud_link : file.soundcloud_link),
                    body: req.body.body,
                    updatedAt: Date.now()
        });
                res.redirect("/dashboard");
            }catch(error){
                console.log(error);
            }
    })

});



/*PUT ADMIN EDIT VIDEO*/
router.put('/edit-video/:id',authMiddleware,async (req,res) =>{
    upload_cover_video(req,res,async (error)=>{
            try{
                let file = await Post.findById({_id : req.params.id});
                if (res.req.files.cover && file.cover_path !== ""){
                    await fs.unlink("./public/uploads/" + file.cover_path, (error)=>{
                    if(error){
                        console.log(error);
                        return;
                    }
                });
                }
                if (res.req.files.video){
                    await fs.unlink("./public/uploads/" + file.video_path, (error)=>{
                    if(error){
                        console.log(error);
                        return;
                    }
                });
                }
                console.log(res.req.files);
                await Post.findByIdAndUpdate(req.params.id, {
                    title: req.body.title,
                    cover_path: (res.req.files.cover ? res.req.files.cover[0].filename : file.cover_path),
                    video_path: (res.req.files.video ? res.req.files.video[0].filename : file.video_path),
                    body: req.body.body,
                    updatedAt: Date.now()
        });
                res.redirect("/dashboard");
            }catch(error){
                console.log(error);
            }
    })

});

/*PUT ADMIN EDIT VIDEO EMBED*/
router.put('/edit-video-embed/:id',authMiddleware,async (req,res) =>{
    upload_cover(req,res,async (error)=>{
            try{
                let file = await Post.findById({_id : req.params.id});
                await Post.findByIdAndUpdate(req.params.id, {
                    title: req.body.title,
                    youtube_link: (req.body.youtube_link !== "" ? req.body.youtube_link : file.youtube_link),
                    body: req.body.body,
                    updatedAt: Date.now()
        });
                res.redirect("/dashboard");
            }catch(error){
                console.log(error);
            }
    })

});

/**
 * POST /
 * Admin - Register
*/
// router.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     try {
//       const user = await User.create({ username, password:hashedPassword });
//       res.status(201).json({ message: 'User Created', user });
//     } catch (error) {
//       if(error.code === 11000) {
//         res.status(409).json({ message: 'User already in use'});
//       }
//       res.status(500).json({ message: 'Internal server error'})
//     }

//   } catch (error) {
//     console.log(error);
//   }
// });



/*DELETE ADMIN DELETE POST (ANY)*/
router.delete('/delete-post/:id',authMiddleware,async (req,res) =>{
    try {
        let file = await Post.findById({_id : req.params.id});
        const atts = [file.cover_path,file.audio_path,file.video_path];
        atts.forEach(post_att =>{
            if(post_att !== ""){
                fs.unlink("./public/uploads/" + post_att, (error)=>{
                    if(error){
                        console.log(error);
                        return
                        }
                    }   
                );
            }
        })
        if(file.game_path !== ""){
        let game = "./public/uploads/" + file.game_path
        fs.rmdir(game.slice(0,game.length-11),{ recursive: true },(error)=>{
                    if(error){
                        console.log(error);
                        return
                        }
                    } );
        }
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