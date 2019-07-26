var http = require ('http');          // For serving a basic web page.
var mongoose = require ("mongoose");  //connecting node n mongodb
var express = require('express');

var app = express();

//creating view template
app.set('view engine', 'ejs');

var bodyParser = require("body-parser")  //pass values - to use req.body

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true}));

//store the created database
var uristring ='mongodb://localhost/banglore_schools';

// Makes connection asynchronously.  Mongoose will queue up database
mongoose.Promise = global.Promise;
mongoose.connect(uristring, {useNewUrlParser:true}, function (err, res) {
    if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
    console.log ('Succeeded connected to: ' + uristring);
    }
})


//creating schema
var SchoolSchema = new mongoose.Schema({

    block : String,
    cluster : String,
    schoolid : Number,
    schoolname : String,
    category : String,
    gender : String,
    medium_of_inst : String,
    address : String,
    area : String,
    pincode :Number,
    landmark : String,
    busroutes: String

});

//creating model of the schema
var school = mongoose.model('school', SchoolSchema);

//displaying no of rows
school.countDocuments(function (err, count) {
    if (err) console.error(err);
    console.log('Total Rows: ' + count);
})
 
//inital page
app.get('/', function(req, res){   
    mongoose.model('school').find({}).exec(function(err, result) {
      if(err) res.json(err);
      else res.render('index', {docs:result});
    })
  });
 app.listen(3000, function(){
     console.log('our server is live at port 3000');
 });

//search query for school name
app.post('/search', function (req, res) {

  /*var query = { $or: [{schoolname : {$regex: req.body.schoolnames,$options: 'i'}},
    {address: {$regex: req.body.adds, $options: 'i'}},
    {area : {$regex: req.body.areas, $options: 'i'}},
    {pincode : {$regex: req.body.pins, $options: 'i'}},
    {landmark : {$regex: req.body.lands, $options: 'i'}}]}
  mongoose.model('school').find({query}).exec(function(err, result)*/
  mongoose.model('school').find({'schoolname': req.body.schoolnames}).exec(function(err, result)
   { 
    // handle result
    if(result==''){
      res.send('No such Record!!');
    }
    else{
      res.render('index', {docs:result});
    };
  })
}) ;  

//sort query for schoolname, medium_of_inst and pincode
app.post('/sort', function (req, res) {
  var col = req.body.column;
  mongoose.model('school').find({}).sort([[col,'asc']]).exec(function(err, result) { 
   
    
    // handle result
    if(result==''){
      res.send('No such Record!!');
    }
    else{
      res.render('index', {docs:result});
    };
  })
}) ;  

//filter query for gender
app.post('/filter', function (req, res) {
  var gend = req.body.genders;
  
  mongoose.model('school').find({}).where({'gender':gend}).exec(function(err, result) { 
    // handle result
    if(result==''){
      res.send('No such Record!!');
    }
    else{
      res.render('index', {docs:result});
    };
  })
}) ;  


/*

// using mongoose display on console only

 //search
 school.find({'schoolname': 'abc'}).exec(function(err, result) { 
   console.log('');
   console.log('SEARCH');
   if (!err) {
   // handle result
   if(result==''){
     console.log('No such Record!!');
   }
   else{
   console.log('Record Found!!');
   console.log(result);
 }
 } else {
   // error handling
   console.log(err); 
  }
 });

 //filtering
 school.find({},{schoolname:1, category:1, medium_of_inst:1}).where({'medium_of_inst': 'urdu'}).countDocuments(function (err, count) {
   console.log('');
   console.log('FILTER');
   if (!err) {
   // handle result
   console.log('no. of rows of medium of inst urdu :');
   console.log(count);

 } else {
   // error handling
   console.log(err); 
  }
 });

 //sort
 school.find().sort([['medium_of_inst', 'asc']]).limit(3).exec(function(err, result) { 
   console.log('');
   console.log('SORT');
 if (!err) {
// handle result
 console.log(result);
 } else {
 // error handling
 console.log(err); 
 }
 });

//displaying all records on console
 school.find({}).limit(2).exec(function(err, result) {
   console.log('RECORDS');
     if (!err) {
       // handle result
       console.log(result);
     } else {
       // error handling
       console.log(err);
     };
   });
*/
