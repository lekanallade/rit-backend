// cronJobs/resetPayments.js
const cron = require('node-cron');
const PaymentLog = require('../models/paymentLog.model');
const Property = require('../models/property.model');
const moment = require('moment');

// Run at midnight on the 1st of each month
cron.schedule('0 0 1 * *', async () => {
  console.log('🔄 Creating new UNPAID logs for the new month...');

  try {
    const billingMonth = moment().format('YYYY-MM');

    // Fetch all properties
    const properties = await Property.findAll();

    for (const property of properties) {
      await PaymentLog.create({
        propertyId: property.id,
        fromUserId: property.tenantId,      // tenant pays rent
        toUserId: property.propertyOwnerId, // owner receives rent
        type: 'RENT',
        amount: property.rentCost,
        status: 'UNPAID',
        billingMonth
      });

      // Also create community fee if needed
      await PaymentLog.create({
        propertyId: property.id,
        fromUserId: property.propertyOwnerId, // owner pays community
        toUserId: 1, // 👈 replace with actual community manager userId
        type: 'COMMUNITY_FEE',
        amount: 100, // example fixed fee
        status: 'UNPAID',
        billingMonth
      });
    }

    // Reset property payment field to UNPAID
    await Property.update({ payment: 'UNPAID' }, { where: {} });

    console.log(`✅ New UNPAID logs created for billing month ${billingMonth}`);
  } catch (error) {
    console.error('❌ Error creating monthly logs:', error.message);
  }
});
