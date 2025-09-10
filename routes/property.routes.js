// const express = require('express');
// const router = express.Router();
// const propertyController = require('../controllers/property.controller');

// router.post(
//   '/create',
//   upload.fields([
//     { name: 'profilePicture', maxCount: 1 },
//     { name: 'idDocument', maxCount: 1 }
//   ]),
//   propertyController.createProperty
// );
// router.post('/create', propertyController.createProperty);
// router.get('/', propertyController.getAllProperties);
// router.get('/:id', propertyController.getPropertyById);
// router.put('/:id', propertyController.updateProperty);
// router.delete('/:id', propertyController.deleteProperty);

// module.exports = router;
// routes/property.routes.js

const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');
const upload = require('../middlewares/middleware.upload');

// Updated route with file upload middleware
router.post(
  '/',
  upload.array('images', 3), // Accept up to 3 images
  propertyController.createProperty
);

router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);
router.put('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

module.exports = router;