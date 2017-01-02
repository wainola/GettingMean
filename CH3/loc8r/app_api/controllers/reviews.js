var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.reviewsReadOne = function(req, res){
  console.log('Getting single review');
  if(req.params && req.params.locationid && req.params.reviewid){
    Loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec(
        function(err, location){
          console.log(location);
          var response, review;
          if(!location){
            sendJsonResponse(res, 404, {
              "message": "locationid not found"
            });
            return;
          } else if (err){
            sendJsonResponse(res, 400, err);
            return;
          }
          if(location.reviews && location.reviews.length > 0){
            review = location.reviews.id(req.params.reviewid);
            if(!review){
              sendJsonResponse(res, 404, {
                "message": "review not found"
              });
            } else {
              response = {
                location: {
                  name: location.name,
                  id: req.params.locationid
                },
                review: review
              };
              sendJsonResponse(res, 200, response);
            }
          } else {
            sendJsonResponse(res, 404, {
              "message": "No reviews found"
            });
          }
        }
      );
  }else{
    sendJsonResponse(res, 404, {
      "message": "Not found, locationid and reviewid are both required"
    });
  }
};

module.exports.reviewsCreate = function(req, res){
  var locationid = req.params.locationid;
  if(locationid){
    Loc
      .findById(locationid)
      .select('reviews')
      .exec(
        function(err, location){
          if(err){
            sendJsonResponse(res, 400, err);
          } else {
            doAddReview(req, res, location);
          }
        }
      );
  } else {
    sendJsonResponse(res, 404, {
      "message" : "Not found, locationid required"
    });
  }
};

module.exports.reviewsUpdateOne = function(req, res){
  if(!req.params.locationid || req.params.reviewid){
    sendJsonResponse(res, 404, {
      "message": "Not found, locationid and reviewid are both required"
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec(
      function(err, location){
        var thisReview;
        if(!location){
          sendJsonResponse(res, 404, {
            "message": "locationid not found"
          });
          return;
        } else if(err){
          sendJsonResponse(res, 400, err);
          return;
        }
        if (location.reviews && location.reviews.length > 0){
          if(!thisReview){
            sendJsonResponse(res, 404, {
              "message": "reviewid not found"
            });
          } else {
            thisReview.author = req.body.author;
            thisReview.rating = req.body.rating;
            thisReview.reviewText = req.body.reviewTex;
            location.save(function(err, location){
              if(err){
                sendJsonResponse(res, 404, err);
              } else {
                updateAverageRating(location._id);
                sendJsonResponse(res, 200, thisReview);
              }
            });
          }
        } else {
          sendJsonResponse(res, 404, {
            "message": "No review to update"
          });
        }
      }
    );
};
