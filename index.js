import express from 'express';
import connectDB from './config/mongoose.js';
import passportConfig from './config/passport_local.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import expressLayouts from 'express-ejs-layouts';

// flash messages package and middleware
import flash from 'connect-flash';
import {setFlash} from './config/flash.middleware.js';

// store the session in mongostore
import MongoStore from 'connect-mongo';

// routers
import adminRoutes from './routes/admin.js';
import employeeRoutes from './routes/employee.js';
import userRoutes from './routes/user.js';

const PORT = process.env.PORT || 3000;
const app = express();

// ============ set up middlewares ============

// for reading url data
app.use(express.urlencoded({
    extended:true // for json too
})); 

// for static files folder
app.use(express.static('public'));

// for parsing the cookies
app.use(cookieParser());

// using layouts
app.use(expressLayouts);
// extracting stylesheets and scripts for individual pages
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

// setting view engine as ejs and defining its path
app.set('view engine','ejs');
app.set('views','./views');

// Use express-session for session management
app.use(session({
    secret: process.env.SECRET_KEY, // Replace with your own secret key
    resave: false, // don't save session cookie if not changed
    saveUninitialized: false, // don't save empty cookie
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Session duration in milliseconds (1 day)
      secure: false, // Set this to false to allow the session over HTTP
    },
    // store the session in database
    store: MongoStore.create({
      mongoUrl:process.env.MONGODB_URL
    })
  }));
  
// =========== setup connect-flash and passport ===========
app.use(flash());
app.use(setFlash);

// initialize passport
app.use(passportConfig.initialize());
// passport sessions
app.use(passportConfig.session());

// store the logged in user's data in locals variable
app.use(passportConfig.setAuthenticatedUser);

// ========= setup routes ===========
app.use('/', userRoutes);
app.use('/dashboard/admin', passportConfig.checkAuthentication, passportConfig.isAdmin, adminRoutes);
app.use('/dashboard/employee', passportConfig.checkAuthentication, passportConfig.isEmployee, employeeRoutes);

app.listen(PORT,() => {
  console.log(`Server is running on port: ${PORT}`);
  connectDB();
});