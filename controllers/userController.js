var Twitter = require('node-twitter-api');
var twitter;
var _requestSecret;
var model = require('../models/Models.js');
var config = require('../config.js');


module.exports = {
  login: function(req, res){
    debugger;
    var last_search = req.session.last_search;
    var fullUrl =config[config.environment]['twitterCallback']+last_search;
    twitter = new Twitter({
      consumerKey: process.env.twitter_apikey,
      consumerSecret: process.env.twitter_apisecret,
      callback: fullUrl}); 

    twitter.getRequestToken(function(err, requestToken, requestSecret) {
      debugger;
      if (err) {
        res.status(500).send(err); 
      }  else {
        _requestSecret = requestSecret; res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
      }
    });
  },

  accessToken: function(req, res){
    var requestToken = req.query.oauth_token,
        verifier = req.query.oauth_verifier,
        last_search=req.query.last_search;
    req.session.last_search=last_search;

    twitter.getAccessToken(requestToken, _requestSecret, verifier, function(err, accessToken, accessSecret) {
      if (err) { res.status(500).send(err); }   
      else{
        twitter.verifyCredentials(accessToken, accessSecret, function(err, user) {
          if (err){
            res.render('home/error', {error:err}); 
          } else {
            req.session.userId=user.id;
            req.session.userName=user.screen_name
            createUser(req.session.userId, req.session.userName, function(err,data){
              if (err){render('home/error',{error:err})}
              else{
                res.redirect('/events/lastSearch');
              }             
            })
          }
        })
      }
    });
  },


  goToThisEvent: function(req,res){
    if(!req.session || !req.session.userId){
      res.redirect('/user/login')
    } else {
      var barId = req.query.barId;
      goingBar(req.session.userId, barId, function(err,going){
        if(err){render('home/error',{error:err})}
        else{
          req.session.imGoing=going;
          res.redirect('/events/lastSearch');
        } 
      });
    }
  }
}


function goingBar(user,bar, callback){
  model.bargoingsModel.findOne({user:user, yelps_id:bar}, function(err, data){
    if(err){return callback(err)}
    if(!data){
      var going = new model.bargoingsModel({
        yelps_id: bar,
        user: user
      }).save(function(err){ 
        if (err){ return callback(err)}
      });
      return callback();
    }
    else{
      deleteData(user,bar, function(err){
        if(err){return callback(err)}
        else{
          return callback();
        }
      });
    }
  });
}

function deleteData(user,bar,callback){
  model.bargoingsModel.remove({user:user, yelps_id:bar}, function(err){
    if(err){ return callback(err)}
  });
  return callback();
};  


function createUser(userid,username, callback){
  model.userModel.findOne({twitter_id:userid}, function(err,data){
    if (err){ return callback(err)}
    if (!data){
      var user = new model.userModel({
        twitter_id:userid,
        userName:username
      }).save(function(err){
        if(err){callback(err)}
      });
    }
    return callback();
  })
}
