import bcrypt from 'bcryptjs'
import Doctor from '../models/doctor.js'

export const welcome = async (req, res) => {
    await res.render("welcome")
}

export const getSignUp = async (req, res) => {
    await res.render('signup');
}
export const postSignup = async (req, res) => {
    const {firstname, lastname, gender, phoneNumber, qualification, specialization, hospitalName, email, username, pass1, pass2} = req.body;

    let errors = []; //WE CREATE AN EMPTY ERROR ARRAY

    if(!firstname || !lastname || !gender || !phoneNumber || !qualification || !specialization || !hospitalName || !email || !username || !pass1 || !pass2) {
        errors.push({msg: "some fields are missing, empty fields are not accepted"});
    }
    if(pass1 !== pass2) {
            errors.push({msg: "Password do not match. try again"});
    }
    if(pass1.length < 6) {
        errors.push({msg: "password must be at least 6 character"});
    }  // If there are validation errors, re-render the signup form with errors
    if(errors.length > 0) {
       return res.render('signup', {errors, firstname, lastname, gender, phoneNumber, qualification, specialization, hospitalName, email, username, pass1, pass2});
    }
        try {
            //WE WANT TO ENSURE USER HAS NO DUPLICATE
            const duplicate = await Doctor.findOne({username})            
                if(duplicate) {
                    req.flash('error_msg', 'username already exists');
                    return res.redirect('/users/signup');
                } 
                //Encrypt Password
                const hash = await bcrypt.hash(pass1, 10)
                //create and save new user        
                await Doctor.create ({
                            firstname,
                            lastname,
                            gender,
                            phoneNumber,
                            qualification,
                            specialization,
                            hospitalName, 
                            email,
                            username,
                            password: hash
                        })// Success message and redirect
                        req.flash("message", "you are now registered");
                        return res.redirect('/users/login')
        } catch (error) {
            req.flash('error_msg', 'please retry');
            return res.redirect('/users/signup');
        }         
}
export const getLogin = async (req, res) => {
    await res.render("login");
}
export const postLogin = async (req, res) => {
    const {username, password} = req.body;
    
    if(!username || !password){
        req.flash('error_msg',"enter username & password");
        return res.redirect('/users/login')
    }
    try {
            const person = await Doctor.findOne({username})
            if(!person){
                req.flash('error_msg',"user not found");
                return res.redirect('/users/login');
            }
            //compare hashed Password
            const isVerify = bcrypt.compare(password, person.password)
                if(!isVerify) {
                    req.flash('error_msg', "Incorrect password");
                    return res.redirect('/users/login')
                }
                //if password match set session
                    req.session.user_id = person._id;
                    req.session.username = person.username;
                    req.session.email = person.email;
                    req.flash("message", "welcome you have logged in");
                    return res.redirect('/dashboard');
        } catch (error) {
            req.flash('error_msg', "Incorrect password");
            return res.redirect('/users/login');
        }
}
export const logout = async (req,res) =>{
    req.session.destroy()
    await res.redirect('/');
}