var Yelp=require('../yelpAPI.js');
var model=require('../models/Models.js');

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
      location: location,
    }, function(err,data){
      if(err){
        res.render('home/error',{error: err});
      } else {
        var bars = data['businesses'];
        model.bargoingsModel.countUsergoings(function(err, bargoingData){
          if (err){ res.render('home/error',{error: err});}
          else {
            for (var i in bars){
              var userGoing =bargoingData.find(function(userGoing){
                return (bars[i]['id']==userGoing['_id']);
              })
              bars[i].usersGoing= userGoing ? userGoing.count : 0
            }
            res.render('night-events/index', {bars: bars});
          }
        })
      }
    })
  }
};
