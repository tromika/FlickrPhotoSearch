
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var CONFIG = require('config').Flickr;






//Flickrapi Setup
var Flickr = require("flickrapi"),
    flickrOptions = {
      key: CONFIG.key,
      secret: CONFIG.secret,
      user_id: CONFIG.user_id,
      access_token: CONFIG.access_token,
      access_token_secret: CONFIG.access_token_secret
    };
    
   
  


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



app.get('/', routes.index);

//API
app.get('/api/:search', function(req, res) {
      try{  
        if(req.params.search){
              var photosres = [];
              Flickr.authenticate(flickrOptions, function(error, flickr) {
              flickr.photos.search({
              text:req.params.search,
              page: 1,
              per_page: 20
              }, function(err, result) {
                for(var photo in result["photos"]["photo"]){
                    //http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
                    //Maybe can be filtered by ispublic but it returns it really?
                    var photolink = "http://farm"+result["photos"]["photo"][photo]["farm"]+".staticflickr.com/"+result["photos"]["photo"][photo]["server"]+"/"+result["photos"]["photo"][photo]["id"]+"_"+result["photos"]["photo"][photo]["secret"]+"_m.jpg";
                    photosres.push({ "photo" : photolink});
                    }
                res.json(photosres); //Return photos json
    
                });
          
              
                });
           
        } else {res.status(404).send('Not found');} //meaningless handling
      } catch(err){res.status(500).send('Internal server error');} //Dummy Error handling


     

});
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
   
});
 module.exports = app;