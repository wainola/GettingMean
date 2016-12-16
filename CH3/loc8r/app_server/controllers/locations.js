/* Obtener pagina principal*/
module.exports.homelist = function(req, res){
  res.render('locations-list', {
    title: 'Loc8r - find a placer to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near your!'
    }
  });
};
/* Obtener la pagina 'Location info'*/
module.exports.locationInfo = function(req, res){
  res.render('location-info', {title: 'Location Info'});
};

/* Obtener la pagina 'Add review'*/
module.exports.addReview = function(req, res){
  res.render('location-review-form', {title: 'Add review'});
};
