/* Obtener pagina principal*/
module.exports.homelist = function(req, res){
  res.render('index', {title: 'Home'});
};
/* Obtener la pagina 'Location info'*/
module.exports.locationInfo = function(req, res){
  res.render('index', {title: 'Location Info'});
};

/* Obtener la pagina 'Add review'*/
module.exports.addReview = function(req, res){
  res.render('index', {title: 'Add review'});
};
