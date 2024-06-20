import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';

// render homepage / login page
export const home = (req,res) => {

    // if user is alredy logged in 
    // redirect user to their respective dashboard
    if(req.isAuthenticated()){
        const user = req.user;
        // if admin
        if(user.role === 'Admin'){
            return res.redirect('/dashboard/admin');
        }
        // else employee
        return res.redirect('/dashboard/employee');
    }

    // if user is not logged in 
    // render the sign in page
    return res.render('signIn',{
        title: "Sign In"
    })
}

// render the signup page
export const signUp = (req,res) => {
    // if user is already logged in 
    // redirect to their respective dashboard
    if(req.isAuthenticated()){
        const user = req.user;
        // if admin
        if(user.role === 'Admin'){
            return res.redirect('/dashboard/admin');
        }
        // else 
        // employee
        return res.redirect('/dashboard/employee');
    }

    // if not logged in
    // render the sign up page
    return res.render('signUp',{
        title: "Sign Up"
    })
}


// for creating a new user in database
export const createAccount = async (req,res) => {
    try {
        // getting all user's data from req.body
        let { name, email, password, cnf_password, role } = req.body;
        // convert email to lowercase
        email = email.toLowerCase();

        // find whether user already exist in database with same email
        const foundUser = await User.findOne({email});

        // if user found 
        if(foundUser){
            // redirect to login page
            req.flash('error','User already exists');
            return res.redirect('/');
        }

        // if user not found

        // compare the password and confirm password
        // if both doesn't match
        if(password !== cnf_password ){
            // redirect back
            req.flash('error','Password does not match !!');
            return res.redirect('back');
        }

        // if password match
        // encrypt password before saving in database
        const hashPassword = await bcrypt.hash(password, 10);

        // create new user
        const user = await User.create({    
            name,
            email,
            role,
            password: hashPassword,
        })

        req.flash('success','New User created, Please login !!');
        // redirect user to login page
        return res.status(201).redirect('/');

    } catch (error) {
        // if error
        console.log(error);
    }
}


// create session
export const createSession = (req,res) => {
    const user = req.user;

    req.flash('success','Welcome, You are logged in');
    // render the admin page if logged in user is admin
    if(user.role === 'Admin'){
        return res.redirect('/dashboard/admin');
    }

    // else 
    // render employee page
    return res.redirect('/dashboard/employee');
}


// for signing out the logged in user
export const signout = async (req,res) => {
    
    // logout using passport
    req.logout(function(err) {
        if (err) { 
            return next(err) 
        }

        req.flash('success','You are logged out successfully !!');
        // redirect to signin page
        res.redirect('/');
    });
}