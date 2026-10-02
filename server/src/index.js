const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const User = require('./models/User');
const seedDatabase = require('./seeds/seedData');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    // Check if initial seed is needed
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No user data detected. Running automatic initial seeding for demo readiness...');
      await seedDatabase(false);
    } else {
      console.log(`Database ready. Found existing data (${userCount} users).`);
    }

    const server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 OpsMind AI Server is running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔒 Mode: ${process.env.NODE_ENV || 'development'} | AI: ${process.env.AI_MODE || 'mock'}`);
      console.log(`======================================================\n`);
    });

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      console.error(`Unhandled Rejection: ${err.message}`);
    });

  } catch (error) {
    console.error(`Failed to start OpsMind AI Server: ${error.message}`);
    process.exit(1);
  }
}

startServer();
