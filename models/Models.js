var mongoose=require('mongoose');
var url = process.env.MONGOLAB_URI;
var db = mongoose.connection;
mongoose.connect(url);

db.on('error', function(){
  console.log('There was an error connecting to the database');
});

db.once('open', function() {
  console.log('Successfully connected to database');
});

// User Model

var users = new mongoose.Schema({
  twitter_id: String,
  userName: String
});

// bargoing Model
var bargoings = new mongoose.Schema({
  yelps_id : String,
  user : String
});


var bargoingsModel = mongoose.model('bargoings', bargoings);
var userModel = mongoose.model('users', users);

module.exports={
  bargoingsModel : bargoingsModel,
  userModel: userModel
};

/*
bargoing.statics.countUsergoings = function (barId, callback){
  return this.aggregate([
    {$group: { _id : '$yelps_id', count : {$sum : 1}}}], 
                        function(err, data){
    if (err){ callback(err)}
    else{
      callback(null,data);
    }
  });
};*/