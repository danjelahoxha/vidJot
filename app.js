const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');

//handle bars middleware
const app = express();

//get routes 
const  ideas = require("./routes/ideas");
const  users = require("./routes/users");
//passport local

require('./config/passport')(passport);

// override with the X-HTTP-Method-Override header in the request
mongoose.Promise = global.Promise;
app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
  app.use(passport.session());
  
app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});


//connecton to database 
mongoose.connect("mongodb://localhost/vidjot-dev", {
    useNewUrlParser: true
})
    .then(() => console.log("connected succesfully to database"))
    .catch(error => console.log(error));
    
const port =  process.env.PORT || 5000;
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.get("/", (req, res) => {
    const t = "Welcome";
    res.render("index", {
        title: t
    });
});
app.get("/about", (req, res) => {
    const t = "about us";
    res.render("about", {
        title: t
    });
});



app.use("/ideas",ideas);
app.use("/users",users);

app.listen(port, () => {
});