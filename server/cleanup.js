import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Debate from './models/Debate.js';

dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        
        const result = await Debate.updateMany(
            { status: 'active' }, 
            { $set: { status: 'finished', endedAt: new Date() } }
        );
        console.log(`Successfully closed ${result.modifiedCount} stuck debates.`);
        
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

run();
