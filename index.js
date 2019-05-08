const pathToRegExp = require('path-to-regexp');

function secureExpressRoutes (pathsWithAuthFunctions, options = {}) {
  const { responseCode } = options;
  const paths = Object.keys(pathsWithAuthFunctions);
  const pathsWithRegExps = paths.reduce((hash, path) => {
    hash[path] = pathToRegExp(path);
    return hash;
  }, {});
  return async function (req, res, next) {
    for (var i = 0; i < paths.length; i++) {
      const path = paths[i];
      if (!pathsWithRegExps[path].test(req.path)) {
        continue;
      }
      const ok = await pathsWithAuthFunctions[path](req, res);
      if (ok) {
        return next();
      }
    }
    res.status(responseCode || 403);
    res.end();
  }
}

module.exports = secureExpressRoutes;
