const   express = require("express"),
        flash = require("connect-flash"),
        mongoose = require("mongoose"),
        session = require("express-session"),
        app = express();

const port = process.env.PORT;
const log = console.log;

        //DB CONFIG
        const db = require('./config/keys').mongoURI;
        mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true});

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
        app.use('/', require('./routes/index'));
        app.use('/', require('./routes/users'));

app.listen(port || 2021, () => log("server started on port 2021"))
