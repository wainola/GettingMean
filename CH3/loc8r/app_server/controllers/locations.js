/* Obtener pagina principal*/
module.exports.homelist = function(req, res){
  res.render('locations-list', {title: 'Home'});
};
/* Obtener la pagina 'Location info'*/
module.exports.locationInfo = function(req, res){
  res.render('location-info', {title: 'Location Info'});
};

/* Obtener la pagina 'Add review'*/
module.exports.addReview = function(req, res){
  res.render('index', {title: 'Add review'});
};
