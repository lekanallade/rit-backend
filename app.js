

const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes');
const propertyRoutes = require('./routes/property.routes');
const authRoutes = require('./routes/auth.routes')
const paymentsRoutes = require('./routes/paymentLog.routes')
require('./cronjobs/cronjobs.resetPayments'); // ⬅️ runs the scheduled job


app.use(express.json()); // Parse JSON requests
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentsRoutes);

module.exports = app;
