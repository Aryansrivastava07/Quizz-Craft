const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('Testing MongoDB connection...');
        console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found in .env' : 'NOT FOUND in .env');
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connection successful!');
        
        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📊 Database has ${collections.length} collections`);
        
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        
        if (error.message.includes('IP')) {
            console.log('\n💡 Solution: Add your IP address to MongoDB Atlas whitelist:');
            console.log('1. Go to https://cloud.mongodb.com');
            console.log('2. Navigate to Network Access');
            console.log('3. Click "Add IP Address"');
            console.log('4. Choose "Add Current IP Address" or use 0.0.0.0/0 for all IPs');
        }
        
        if (error.message.includes('authentication')) {
            console.log('\n💡 Solution: Check your MongoDB credentials in .env file');
        }
        
        process.exit(1);
    }
}

testConnection();
