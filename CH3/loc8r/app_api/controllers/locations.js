var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

module.exports.locationsReadOne = function(req, res){
  Loc
    .findById(req.params.locationid)
    .exec(function(err, location){
      sendJsonResponse(res, 200, location);
    });
};
