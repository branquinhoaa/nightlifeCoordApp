var Yelp=require('../yelpAPI.js');

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
        res.render('night-events/index', {bars: bars});
      }
    });
  }
}

//post metod
//uso da api do yelp
/*
    rememberLastSearch: function(req,res){
        //nao acredito q precise de bd pra isso, pode ser guardado em locals
    }
}*/