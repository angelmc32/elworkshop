require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

// cors package to allow cross-origin resource sharing (CORS) between front-end and back-end
const cors         = require('cors');

const cloudDB      = process.env.DB;
mongoose
  .connect(cloudDB, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// cors package config to allow requests from the url's in the origin array
app.use(
  cors({
    origin: ['https://elworkshop.herokuapp.com', 'http://localhost:3001', 'http://elworkshop.herokuapp.com']
  })
);

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// Routes declaration and setup
const authRoutes = require('./routes/auth-routes');
const jobRoutes = require('./routes/job-routes');

app.use('/api', authRoutes);
app.use('/api/jobs', jobRoutes);


module.exports = app;
