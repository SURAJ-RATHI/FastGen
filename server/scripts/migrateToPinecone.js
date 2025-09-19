import 'dotenv/config';
import mongoose from 'mongoose';
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import pineconeService from '../services/pineconeService.js';
import connectDB from '../config/database.js';

async function migrateToPinecone() {
  try {
    console.log('Starting Pinecone migration...');
    
    // Connect to database
    await connectDB();
    
    // Initialize Pinecone
    await pineconeService.initialize();
    
    // Get all messages with their chat information
    const messages = await Message.find()
      .populate('chat', 'user title')
      .sort({ createdAt: 1 });
    
    console.log(`Found ${messages.length} messages to migrate`);
    
    let migrated = 0;
    let errors = 0;
    
    for (const message of messages) {
      try {
        if (message.chat && message.chat.user) {
          await pineconeService.upsertMessage(
            message.chat.user,
            message.chat._id,
            message._id,
            message.content,
            message.sender,
            { 
              chatTitle: message.chat.title,
              migratedAt: new Date().toISOString()
            }
          );
          migrated++;
          
          if (migrated % 100 === 0) {
            console.log(`Migrated ${migrated} messages...`);
          }
        }
      } catch (error) {
        console.error(`Error migrating message ${message._id}:`, error);
        errors++;
      }
    }
    
    console.log(`Migration completed!`);
    console.log(`Successfully migrated: ${migrated} messages`);
    console.log(`Errors: ${errors} messages`);
    
    // Get index stats
    const stats = await pineconeService.getIndexStats();
    console.log('Pinecone index stats:', stats);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateToPinecone();
}

export default migrateToPinecone;
