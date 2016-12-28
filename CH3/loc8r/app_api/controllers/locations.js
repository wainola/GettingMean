var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

module.exports.locationsReadOne = function(req, res){
  sendJsonResponse(res, 200, {"status": "success"});
};
