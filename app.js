const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');

//Load User Model
require('./models/User');
require('./models/Story');

//Passport Config
require('./config/passport')(passport);

//Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

//Load Keys
const keys = require('./config/keys');

//Handlebars Helpers
const{
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon 
} = require('./helpers/hps.js');

//Mongoose Conneect
mongoose.connect(keys.mongoURI,{
  useMongoClient:true
}).then(()=>console.log('Mongo DB connected..')).catch(err=>console.log(err));
mongoose.Promise = global.Promise;

const app = express();

//Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Method Override Middleware
app.use(methodOverride('_method'));

//Middleware handlebars
app.engine('handlebars',exphbs({
  helpers:{
    truncate:truncate,
    stripTags:stripTags,
    formatDate:formatDate,
    select:select,
    editIcon:editIcon
  },
  defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(session({
  secret:'secret',
  resave:false,
  saveUninitialized:false
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global vars
app.use((req,res,next)=>{
  res.locals.user = req.user || null;
  next();
});

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Use Routes
app.use('/auth',auth);
app.use('/',index);
app.use('/stories',stories);

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
