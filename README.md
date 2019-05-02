# secure-express-routes

> Express middleware you can use to lock down all your routes by default

__Disclaimer:__ This package doesn't actually do anything to secure your routes. It just makes returning a `403` the default for every route in your application. What security you need will be specific to your scenario.

## Use case

`secure-express-routes` is for express applications that expose routes that need to be protected. Without it, your run the risk of accidentally exposing sensitive data or private functionality. For example:

```js
app.get('my-secret-things', checkIsAuthorized, checkPermissions, revealSecrets)
app.get('my-secure-things', checkIsAuthorized, revealSecrets)
```

In the above example, the `my-secure-things` route is not doing any permission checks, because someone forgot to add `checkPermissions` to the chain of middleware - an easy mistake to make!

When using `secure-express-routes`, your application will return a `403` unless you add some code to let the request through, thereby making your routes secure by default.

## Installation

```sh
$ npm install 
```

## Usage

```js
const express = require('express');
const secureExpressRoutes = require('secure-express-routes');

const app = express();
app.use(secureExpressRoutes({
  '/example-route': (req) => {
    return !req.user.looksSuspicious; // whatever authentication and authorization checks you need
  },
  '/public-route': () => true,
}));

app.get('/example-route', returnSecureThings);
app.get('/public-route', returnPublicThings);
```

## API

`secure-express-routes` is a simple express middleware. It takes two arguments:

### A hash of your application's routes and associated auth functions

With the structure: `{ [routePath]: authFunction }`.

Example:

```js
{
  '/example-route': (req, res) => {
    return !req.user.looksSuspicious && res.locals.allowedIPAddress; // whatever authentication and authorization checks you need
  },
  '/public-route': () => true,
}
```

Where `/example-route` and `public-route` both correspond to express routes in your application. The `authFunction` will be passed the express `req` and `res` object for inspection. If the function returns `true`, the middleware chain will be allowed to continue. In all other cases, the middleware chain will terminate and a `403` will be returned.

### A options object

Example:

```js
{ responseCode: 404 }
```

Option|Description|Default
---|---|---
`responseCode`|The HTTP response code to return by default|`403`
