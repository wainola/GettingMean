var request = require('request');
var apiOptions = {
  server: "http://localhost:3000"
};

if(process.env.NODE_ENV === 'production'){
  apiOptions.server = "https://dry-ocean-36724.herokuapp.com/";
};

var _isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var _formatDistance = function (distance) {
  var numDistance, unit;
  if (distance && _isNumeric(distance)) {
    if (distance > 1) {
      numDistance = parseFloat(distance).toFixed(1);
      unit = 'km';
    } else {
      numDistance = parseInt(distance * 1000,10);
      unit = 'm';
    }
    return numDistance + unit;
  } else {
    return "?";
  }
};

var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Oh dear. Looks like we can't find this page. Sorry.";
  } else if (status === 500) {
    title = "500, internal server error";
    content = "How embarrassing. There's a problem with our server.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};

var renderHomePage = function(req, res, responseBody){
  var message;
  if(!(responseBody instanceof Array)){
    message = 'API lookup error';
    responseBody = [];
  } else {
    if(!responseBody.length){
      message = 'No places found nearby';
    }
  }
  res.render('locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find a place to work with wifi near you!'
    },
    sidebar: 'Looking for wifi and seat? Loc8r helps you find places to work when out and about. Perhaps with coffe, cake or a pint? Let Loc8r help you find the place you\'re looking for.',
    locations: responseBody,
    message: message
  });
};

/* Obtener pagina principal*/
module.exports.homelist = function(req, res){
  var requestOptions, path;
  path = '/api/locations';
  requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {
      lng: -0.7992599,
      lat: 51.378091,
      maxDistance: 200000000000
    }
  };
  request(
    requestOptions,
    function(err, response, body){
      var i, data;
      data = body;
      if(response.statusCode === 200 && data.length){
        for(i=0; i<data.length; i++){
          data[i].distance = _formatDistance(data[i].distance);
        }
      }
      renderHomePage(req, res, data);
    }
  );
};
// funcion que renderiza los detalles de la pagina.
var renderDetailPage = function(req, res, locDetail){
  res.render('location-info', {
    title: locDetail.name,
    pageHeader: {title: locDetail.name},
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location: locDetail
  });
};
/* GET 'Location info' page */
module.exports.locationInfo = function(req, res){
  var requestOptions, path;
  path = '/api/locations/' + req.params.locationid; // obtiene el id de la locacion desde la URL y la adjunta.
  requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {}
  };
  request(
    requestOptions,
    function(err, response, body){
      var data = body;
      data.coords = {
        lng: body.coords[0],
        lat: body.coords[1]
      };
      renderDetailPage(req, res, data);
    }
  );
};

/* Obtener la pagina 'Add review'*/
module.exports.addReview = function(req, res){
  res.render('location-review-form', {title: 'Add review'});
};
