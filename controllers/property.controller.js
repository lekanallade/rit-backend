// controllers/property.controller.js
const Property = require('../models/property.model');
const User = require('../models/user.model');

// Create property
// controllers/property.controller.js
exports.createProperty = async (req, res) => {
  try {
    const {
      country, stateOrCounty, city, detailedLocation,
      propertyOwnerId, tenantId,
      rentCost, rentPaymentDate, lastPaymentDate,
      status, payment
    } = req.body;

    // Required fields check
    if (!country || !stateOrCounty || !city || !propertyOwnerId || !rentCost || !rentPaymentDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Handle uploaded files (images)
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.originalname); // Or store file.path if using diskStorage
    }

    const property = await Property.create({
      country, stateOrCounty, city, detailedLocation,
      propertyOwnerId, tenantId,
      rentCost, rentPaymentDate, lastPaymentDate,
      status, payment,
      images
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      include: [
        { model: User, as: 'propertyOwner', attributes: ['id', 'firstname', 'givenname'] },
        { model: User, as: 'tenant', attributes: ['id', 'firstname', 'givenname'] }
      ]
    });

    if (!properties || properties.length === 0) {
      return res.status(404).json({ message: 'No property found' });
    }

    return res.json(properties);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Get single property
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, {
      include: [
        { model: User, as: 'propertyOwner', attributes: ['id', 'firstname', 'givenname'] },
        { model: User, as: 'tenant', attributes: ['id', 'firstname', 'givenname'] }
      ]
    });
    if (!property) return res.status(404).json({ error: 'Property not found' });
    return res.json(property);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update property
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    await property.update(req.body);
    return res.json(property);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Delete property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    await property.destroy();
    return res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Assign tenant
exports.assignTenant = async (req, res) => {
  try {
    const { tenantId } = req.body;
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    await property.update({
      tenantId,
      status: 'RENTED',
      payment: 'UNPAID',
      communityPayment: 'UNPAID'
    });

    return res.json(property);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Free property
exports.freeProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    await property.update({
      tenantId: null,
      status: 'FREE',
      payment: 'UNPAID',
      communityPayment: 'UNPAID'
    });

    return res.json(property);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Tenant pays landlord
exports.markAsPaid = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    if (property.status !== 'RENTED') {
      return res.status(400).json({ error: 'Cannot pay rent for a free property' });
    }

    await property.update({
      payment: 'PAID',
      rentPaymentDate: new Date()
    });

    return res.json(property);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Landlord pays community manager
exports.markCommunityPaymentAsPaid = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    if (property.status !== 'RENTED') {
      return res.status(400).json({ error: 'Community payment only applies if property is rented' });
    }

    await property.update({
      communityPayment: 'PAID',
      communityPaymentDate: new Date()
    });

    return res.json(property);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
