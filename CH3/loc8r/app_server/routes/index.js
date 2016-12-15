var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlOther = require('../controllers/others');

/* Locaciones de las paginas.*/
router.get('/', ctrlLocations.homelist);
router.get('/location', ctrlLocations.locationInfo);
router.get('/location/review/new', ctrlLocations.addReview);

/* Pagina otros */
router.get('/about', ctrlOther.about);

module.exports = router;
