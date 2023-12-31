const { constants } = require("../constant");

const errorHandler = (err, req, res, next) => {
    
  const statusCode = res.statusCode ? res.statusCode : 500;
  console.log("error has occured -", res.statusCode);
  switch (statusCode) {
    // case constants.DUPLICATE_ERROR:
    //   res.json({
    //     title: "Duplicate key error",
    //     message: err.message,
    //     stackTrace: err.stack,
    //   });
    //   break;
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Validation Faild",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.SERVER_ERROR:
      res.json({
        title: "SERVER ERROR",
        message: err.message,
        stackTrace: err.stack,
      });
    default:
      console.log("No error, All Good!");
      break;
  }
};

module.exports = errorHandler;
