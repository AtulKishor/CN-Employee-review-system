import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
// for encrypting password
import bcrypt from 'bcryptjs';
// user model for database
import User from '../models/User.model.js';

passport.use(new LocalStrategy(
    // reading username as email
    {
        usernameField:'email'
    },
    // callback function
    async (email, password, done) => {
        // finding user with email inside the database
        const user = await User.findOne({ email });
        // if user found
        if(user){
            // compare user's password with password in database
            const found = await bcrypt.compare(password, user.password);        
            // if password doesn't match
            if (!found) {
                // return with message
                return done(null, false, { message: 'Password is incorrect.' });
            }
            // if password matches continue
            return done(null, user);
        }
        // if user not found
        else{
            // return with message
            return done(null, false, { message: 'User is not found.' });
        }
    }
));

// storing the user information in the session
passport.serializeUser((user, done) => done(null, user.id));

// retrieving user information from the session
passport.deserializeUser(async (id, done) => {
    // find user
    const user = await User.findById(id);
    // if no user found
    if (!user) {
        return done(new Error('User not found'));
    }
    // if found 
    return done(null, user); // Retrieve the user based on the stored ID    
});

// check whether the user is authenticated or not
passport.checkAuthentication =  (req,res,next) => {
    // check if user is signed in or not
    // if user is signed in then pass the request to the next function / action in controller
    if(req.isAuthenticated()){
        return next();
    }

    // if user is not signed in 
    return res.redirect('/');
}

// sending user data to local for view
passport.setAuthenticatedUser = function(req,res,next){
    // check if user is signed in or not
    // if user is signed in then sending current signed in user's data (req.user) to locals for views (res.local.user)
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }

    return next();
}


// checking whether the logged in user is admin or not
passport.isAdmin = function(req,res,next){
    if(req.user.role === 'Admin'){
        return next();
    }
    return res.redirect('back');
}


// checking whether the logged in user is an employee
passport.isEmployee = function(req,res,next){
    if(req.user.role === 'Employee'){
        return next();
    }
    return res.redirect('back');
}

export default passport;
