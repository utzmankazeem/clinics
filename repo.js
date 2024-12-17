import express from "express"
import flash from "connect-flash"
import session from "express-session"
import connectDB from "./config/keys.js"
import index from "./routes/index.js"
import users from "./routes/users.js"
const  app = express();

const PORT = 2021
const log = console.log;

//DB CONFIG
connectDB();

//middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


        //EXPRESS-SESSION MIDDLEWARE
        app.use(session({
                secret: 'secret',
                saveUninitialized: true,
                resave: true
        }));

        // CONNECT FLASH
        app.use(flash());

        //GLOBAL VARS
        app.use((req, res, next) => {
                res.locals.message = req.flash('message');
                res.locals.error_msg = req.flash('error_msg');
                // res.locals.error = req.flash('error);
                next();
        });

///////////////Targeting Users and Index routes///////////////////////
        app.use('/', index);
        app.use('/', users);

app.listen(process.env.PORT|| PORT, () => log(`server started on http://localhost:${PORT}`))
