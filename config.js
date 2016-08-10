var config ={}

config.development = {
  twitterCallback:'http://127.0.0.1:3000/user/logged-redirect/?last_search='
};

config.production = {
  twitterCallback:'https://agile-badlands-34442.herokuapp.com/user/logged-redirect/?last_search='
};

config.environment = 'development';
module.exports=config;

