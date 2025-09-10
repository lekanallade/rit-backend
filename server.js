const app = require('./app');
const sequelize = require('./config/database');

const PORT = 3000;

/**
 *  Use this when you want to recreate the database
 */

sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Unable to connect:', err));


// sequelize.sync({ force: true }) // ⚠️ DROPS existing table
//   .then(() => {
//     console.log("Database tables recreated!");
//     app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
//   })
//   .catch(err => console.error("DB recreation failed:", err));



sequelize.sync({ alter: true }) // Sync models with DB
  .then(() => {
    console.log('Database connected & synced');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('DB connection failed:', err));
