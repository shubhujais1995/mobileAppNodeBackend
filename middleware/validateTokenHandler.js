const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
        let token;
        let authHeader = req.headers.Authorization || req.headers.authorization;
        
        if(authHeader && (authHeader.startsWith("Bearer") || authHeader.startsWith("bearer"))) {
            token = authHeader.split(" ")[1];
            
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if(err) {
                    // res.status(401);
                    // throw new Error("User is not authorized");
                    const response = createResponse("error", "All fields are mandatory", null);
                    res.status(401).json(response);
                }
                
                req.user = decoded.user;
                req.token = token;
                next();
            });
        }

        if(!token) {
            // res.status(401);
            // throw new error("User is not authorized or token is missing")
            const response = createResponse("error", "User is not authorized or token is missing", null);
            res.status(401).json(response);
        }

});

const createResponse = (status, message, data) => {
    return {
      status,
      message,
      data,
    };
  };
module.exports = validateToken;