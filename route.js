var SearchController = require('./controllers/searchController.js');
var HomeController = require('./controllers/homeController.js');
var UserController = require('./controllers/userController.js');
//var filter= require('./filters/filter.js');

module.exports = function (app){
  //filter
  // app.use(filter.verifyCurrentUser);

  // home
  app.get('/', HomeController.index);

  //event  routes
  app.post('/events/search',SearchController.getSearch);
  app.get('/events/lastSearch', SearchController.last_search);

  //user events

  app.post ('/user/going', UserController.goToThisEvent);
  app.get('/user/login', UserController.login);
  app.get('/user/logged-redirect', UserController.accessToken);
};