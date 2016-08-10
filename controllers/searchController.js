var Yelp=require('../yelpAPI.js');
var model=require('../models/Models.js');
var flash=require('../utilities/flash.js').flash;

var options ={
  consumer_key: process.env.YELPS_CONSUMERKEY,
  consumer_secret: process.env.YELPS_CONSUMERSEC,
  token: process.env.YELPS_TOKEN,
  token_secret: process.env.YELPS_TOKENSEC,
};
var yelp = new Yelp(options);

module.exports = {
  getSearch: function(req, res){         
    var loc = req.body.location;
    req.session.last_search=loc;
    res.redirect('/events/lastSearch');
  },

  last_search: function(req,res){
    var location = req.session.last_search;
    yelp.search({
      term: 'bars',
      location: location
    }, function(err,data){
      if(err){
        flash(req, 'danger', 'Error!', 'An error occurred in your search, try again.');
        res.render('home/error',{error: err});
      } 
      if(!data){
        flash(req, 'danger', 'Error!', 'Place not found.');
        res.redirect('/');
      }else{
        var myId=req.session.userId; 
        var bars = data['businesses'];
        model.bargoingsModel.countUsergoings(function(err, bargoingData){
          find(myId, function(err, barsImGoing){
            if (err){ res.render('home/error',{error: err});}
            else {
              for (var i in bars){
                var userGoing =bargoingData.find(function(userGoing){
                  return (bars[i]['id']==userGoing['_id']);
                });
                bars[i].usersGoing= userGoing ? userGoing.count : 0;
                bars[i].imGoing = (barsImGoing.indexOf(bars[i].id)!==-1);
              }
              res.render('night-events/index', {bars: bars});     
            }
          })     
        })   
      }  
    })     
  }
}


function find (myId, callback){
  var barsImGoing=[]; 
  model.bargoingsModel.find({user:myId}, function(err, myBars){ 
    if (err){return callback(err)}
    if(myBars){ 
      for(var i in myBars){
        barsImGoing[i]=myBars[i].yelps_id;
      }
    }
    return callback(null, barsImGoing)
  })  
} 

