const pathToRegExp = require('path-to-regexp');

function secureExpressRoutes (pathsWithAuthFunctions, options = {}) {
  const { responseCode } = options;
  return function (req, res, next) {
    const paths = Object.keys(pathsWithAuthFunctions);
    for (var i = 0; i < paths.length; i++) {
      const path = paths[i];
      if (!pathToRegExp(path).test(req.path)) {
        continue;
      }
      const ok = pathsWithAuthFunctions[path](req, res);
      if (ok) {
        return next();
      };
    }
    res.status(responseCode || 403);
    res.end();
  }
}

module.exports = secureExpressRoutes;
