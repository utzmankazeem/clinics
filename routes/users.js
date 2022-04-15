const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Doctor = require('../models/doctor');
const Personnel = require('../models/doctor');
const Patient = require('../models/patient');

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.post('/signup', (req, res) => {
    const {firstname, lastname, gender, phoneNumber, qualification, specialization, hospitalName, username, pass1, pass2} = req.body;

    let errors = []; //WE CREATE AN EMPTY ERROR ARRAY

    if(!firstname || !lastname || !gender || !phoneNumber || !qualification || !specialization || !hospitalName || !username || !pass1 || !pass2) {
        errors.push({msg: "some fields are missing, empty fields are not accepted"});
    }

    if(pass1 !== pass2) {
            errors.push({msg: "Password do not match. try again"});
    }

    if(pass1.length < 6) {
        errors.push({msg: "password must be at least 6 character"});
    }

    if(errors.length > 0) {
        res.render('signup', {errors, firstname, lastname, gender, phoneNumber, qualification, 
                                specialization, hospitalName, username, pass1, pass2});
    } else {
            //WE WANT TO ENSURE NO USERS HAVE THE SAME USERNAME
            Doctor.findOne({username:username}, (er, doctor) => {
                if(er) {//rewritting error msg in flash
                    req.flash('error_msg', 'There\'s an issue. please retry');
                    res.redirect('/signup');
                }                
                if(doctor) {
                    req.flash('error_msg', 'This username already exists. please find another');
                    res.redirect('/signup');
                } else {
                    bcrypt.hash(pass1, 10, (error, hash) => {
                        const doc = new Doctor ({
                            firstname,
                            lastname,
                            gender,
                            phoneNumber,
                            qualification,
                            specialization,
                            hospitalName,
                            username,
                            password: hash
                        })
                        doc.save((er)=> {
                        if(er) {
                            req.flash('error_msg', 'there was a problem register');
                            res.redirect('/signup');
                            } else {
                                req.flash("message", "you are now registered");
                                res.redirect('/login');
                        }
                    })
                })
            }
        })
    }
})

router.get('/login', (req, res) => {
    res.render("login");
})

router.post('/login', (req, res) => {
    const {username, password} = req.body;
    
    Doctor.findOne({username: username}, (er, person) => {
        if(er){
            req.flash('error_msg',"username & password does not exist");
            res.redirect('/login');
        }
        if(person == undefined) {
            req.flash('error_msg',"no user found try again");
            res.redirect('/login');
        } else {
            bcrypt.compare(password, person.password, (er, isVerify) => {
                if(er) {
                    req.flash('error_msg', "Incorrect password");
                    res.redirect('/login')
                }
                if(isVerify) {
                    req.session.user_id = person._id;
                    req.session.username = person.username;
                    req.flash("message", "welcome you have logged in");
                    res.redirect('/dashboard');
                } else {
                    req.flash('error_msg', "Incorrect password");
                    res.redirect('/login')
                }
            })
        }
    })
})

router.get('/logout', (req,res) =>{
    req.session.destroy()
       res.redirect('/login');
    
})

module.exports = router;