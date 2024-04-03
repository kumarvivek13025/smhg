const path=require('path');
const User=require('../models/user');
const bcrypt=require('bcrypt');
exports.postLogin=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;

    User.findOne({email:email})
    .then(user=>{
        if(!user){
            return res.redirect('/');
        }

        bcrypt.compare(password,user.password)
        .then(doMatch=>{
            if(doMatch){
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/profile');
                })
            }
            res.redirect('/');
        })
        .catch(err=>{
            console.log(err);
        })
    })
    .catch(err=>{
        console.log(err);
    })
}


exports.getProfile=(req,res,next)=>{
    const user=req.user.email;
    res.render('user/profile',{
        path:'/profile',
        user:user
    })
}

exports.getLogin=(req,res,next)=>{
    res.render('auth/login',{
        path:'/login'
    });
}


exports.postLogOut=(req,res,next)=>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/');
    });
}