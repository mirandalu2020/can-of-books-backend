'use strict';

//bring in jwt and jwks package
// jwt = JSON Web Token 
// jwks = JSON Web Key set

// install: npm i jsonwebtoken
// install: npm i jwks-rsa

const jwt = require ('jsonwebtoken');
const jwksClient = require ('jwks-rsa');



// =============== HELPER METHODS, pulled from the jsonwebtoken documentation =================== //
//                 https://www.npmjs.com/package/jsonwebtoken                                     //

// Define a client, this is a connection to YOUR auth0 account, using the URL given in your dashboard
const client = jwksClient({
  // JWKS_URI comes from your app on the auth0 dashboard
  jwksUri: process.env.JWKS_URI,
});

// Match the JWT's key to your Auth0 Account Key so we can validate it
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function verifyUser(req, errorFirstOrUserCallbackFunction) {
  try {
    // extract the token from the user's request
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    // from jsonwebtoken docs
    jwt.verify(token, getKey, {}, errorFirstOrUserCallbackFunction)
  } catch(error) {
    errorFirstOrUserCallbackFunction('not authorized');
  }
}

module.exports = verifyUser;