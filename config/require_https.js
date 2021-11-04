'use strict';

// ---[ HTTPS Redirect ]------------------------
exports.ensureSecure = function ensureSecure(req, res, next){
  if(req.headers["x-forwarded-proto"] === "https"){
    // OK, continue
    return next();
  };
  res.redirect('https://'+req.hostname+req.url); // handle port numbers if you need non defaults
};