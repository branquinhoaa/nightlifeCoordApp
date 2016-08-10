var querystring = require('querystring');
var oAuth = require('oauth');
var OAuth = oAuth.OAuth;

const baseUrl = 'http://api.yelp.com/v2/';

var Yelp = function(opts) {
    this.oauthToken = opts.token;
    this.oauthTokenSecret = opts.token_secret;
    this.oauth = new OAuth(
      null,
      null,
      opts.consumer_key,
      opts.consumer_secret,
      opts.version || '1.0',
      null,
      'HMAC-SHA1'
    );
  }

  Yelp.prototype.get = function (resource, params, cb) {
    const promise = new Promise((resolve, reject) => {
      const debug = params.debug;
      delete params.debug;

      this.oauth.get(
        baseUrl + resource + '?' + querystring.stringify(params),
        this.oauthToken,
        this.oauthTokenSecret,
        (err, _data, response) => {
          if (err) return reject(err);
          const data = JSON.parse(_data);
          if (debug) return resolve([ data, response ]);
          resolve(data);
        }
      );
    });
    if (typeof cb === 'function') {
      promise
        .then((res) => cb(null, res))
        .catch(cb);
      return null;
    }
    return promise;
  }

  Yelp.prototype.search = function(params, callback) {
    return this.get('search', params, callback);
  }

  Yelp.prototype.business = function(id, callback) {
    return this.get('business/' + id, undefined, callback);
  }

  Yelp.prototype.phoneSearch=function(params, callback) {
    return this.get('phone_search', params, callback);
  }
module.exports=Yelp;