var Twitter = require('node-twitter-api');
var fullUrl = 'http://127.0.0.1:3000/user/logged-redirect'
var twitter = new Twitter({
 consumerKey: process.env.twitter_apikey,
 consumerSecret: process.env.twitter_apisecret,
 callback: fullUrl}); 
var _requestSecret;

module.exports = {
 login: function(req, res){
  twitter.getRequestToken(function(err, requestToken, requestSecret) {
   debugger;
   if (err) {
    res.status(500).send(err); 
   }  else {
    _requestSecret = requestSecret;
    res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
   }
  });
 },

 accessToken: function(req, res){
  var requestToken = req.query.oauth_token,
      verifier = req.query.oauth_verifier;

  twitter.getAccessToken(requestToken, _requestSecret, verifier, function(err, accessToken, accessSecret) {
   if (err) { res.status(500).send(err); }   
   else{
    twitter.verifyCredentials(accessToken, accessSecret, function(err, user) {
     if (err){
      res.status(500).send(err); 
     } else {
      res.render('night-events/index');
     }
    });
   };
  });
 },

 goToThisEvent: function(req,res){
  if(!req.session || !req.session.user){
   res.redirect('/user/login')
  }
 },

 leaveThisEvent : function(req,res){

 }
}
