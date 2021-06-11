const verifyToken = (request, response, next) => {

  // Take the token from the Authorization header
  const token = request.header('Authorization').replace('Bearer ', '');
  if (!token) {
    response.status(403).send({
      message: 'No token provided!',
    });
  }

  // Verify the token
  jwt.verify(token, config.secret, (error, decoded) => {
    if (error) {
      return response.status(401).send({
        status: 'error',
        message: error.message,
      });
    }

    // Append the parameters to the request object
    request.userId = decoded.id;
    request.tokenExp = decoded.exp;
    request.token = token;
    next();
  });
};

// **********************************************************************

// This is a NodeJs example. The logic can be replicated in any language or framework.

// 1. The server recieves a logout request
// 2. The verifyToken middleware checks and makes sure the token in the request object is valid
router.post('/logout', verifyToken, (request, response) => {

  // 3. take out the userId and toekn from the request
  const { userId, token } = request;

  // 4. use the get method provided by redis to check with the userId to see if the user exists in the blacklist
  redisClient.get(userId, (error, data) => {
    if (error) {
      response.send({ error });
    }

    // 5. if the user is on the blacklist, add the new token 
    // from the request object to the list of 
    // token under this user that has been invalidated.

    /*
    The blacklist is saved in the format => "userId": [token1, token2,...]
    
    redis doesn't accept obejcts, so you'd have to stringify it before adding 
    */
    if (data !== null) {
      const parsedData = JSON.parse(data);
      parsedData[userId].push(token);
      redisClient.setex(userId, 3600, JSON.stringify(parsedData));
      return response.send({
        status: 'success',
        message: 'Logout successful',
      });
    }

    // 6. if the user isn't on the blacklist yet, add the user the token 
    // and on subsequent requests to the logout route the user 
    // will be found and the token will be appended to the already existing list.
    const blacklistData = {
      [userId]: [token]
    };
    redisClient.setex(userId, 3600, JSON.stringify(blacklistData));
    return response.send({
      status: 'success',
      message: 'Logout successful',
    });
  });
});

// *********************************************************************

module.exports = (request, response, next) => {

  // 1. take out the userId and toekn from the request
  const { userId, token } = request;

  // 2. Check redis if the user exists 
  redisClient.get(userId, (error, data) => {
    if (error) {
      return response.status(400).send({ error });
    }
    // 3. if so, check if the token provided in the request has been blacklisted. If so, redirect or send a response else move on with the request.
    if (data !== null) {
      const parsedData = JSON.parse(data);
      if (parsedData[userId].includes(token)) {
        return response.send({
          message: 'You have to login!',
        });
      }
      return next();
    }
  });
};

// **************************************************************

// 1. The server receives a logout request
// 2. The verifyToken middleware checks 
// and makes sure the token in the request 
// object is valid and it appends it to the request object, 
// as well as the token expiration date

router.post('/logout', verifyToken, (request, response) => {

  // 3. take out the userId, token and tokenExp from the request
  const { userId, token, tokenExp } = request;

  /** 
  4. use the set method provided by Redis to insert the token

  Note: the format being used is to combine 'blacklist_' as a prefix to the token and use it as the key and a boolean, true, as the value. We also set the expiration time for the key in Redis to the same expiration time of the token itself as stated above
  **/
  redisClient.setex(`blacklist_${token}`, tokenExp, true);

  // return  the response
  return response.send({
    status: 'success',
    message: 'Logout successful',
  });
});


// *********************************************************************

module.exports = (request, response, next) => {

  // 1. take out the token from the request
  const { token } = request;

  // 2. Check Redis if the token exists. If so, redirect or send a response else move on with the request.
  redisClient.get(`blacklist_${token}`, (error, data) => {
    if (error) {
      return response.status(400).send({ error });
    }
    if (data !== null) {
      return response.send({
        message: 'You have to login!',
      });
    }
    // 3. If not, move on with the request.
    return next();
  });
};