var Yelp=require('../yelpAPI.js');

var options ={
    consumer_key: process.env.YELPS_CONSUMERKEY,
    consumer_secret: process.env.YELPS_CONSUMERSEC,
    token: process.env.YELPS_TOKEN,
    token_secret: process.env.YELPS_TOKENSEC,
};


var yelp = new Yelp(options);

module.exports = {

    searchEvents: function(req, res){         
        var loc = req.body.location;
        yelp.search({
            term: 'bars',
            location: loc,
        }, function(err,data){
            var bars = data['businesses']; 
            res.render('night-events/index', {bars: bars});
            //console.log(data['businesses'])
            //res.json(bars)
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