import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class PineconeService {
  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.indexName = process.env.PINECONE_INDEX_NAME || 'fastgen-chats';
    this.index = null;
  }

  async initialize() {
    try {
      // Get or create index
      const indexList = await this.pinecone.listIndexes();
      const indexExists = indexList.indexes?.some(index => index.name === this.indexName);

      if (!indexExists) {
        console.log(`Creating Pinecone index: ${this.indexName}`);
        await this.pinecone.createIndex({
          name: this.indexName,
          dimension: 1536, // OpenAI embedding dimension
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'aws',
              region: 'us-east-1'
            }
          }
        });
        
        // Wait for index to be ready
        await this.waitForIndexReady();
      }

      this.index = this.pinecone.index(this.indexName);
      console.log('Pinecone service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Pinecone:', error);
      throw error;
    }
  }

  async waitForIndexReady() {
    const maxRetries = 30;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        const indexDescription = await this.pinecone.describeIndex(this.indexName);
        if (indexDescription.status?.ready) {
          console.log('Pinecone index is ready');
          return;
        }
        console.log(`Waiting for index to be ready... (${retries + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        retries++;
      } catch (error) {
        console.error('Error checking index status:', error);
        retries++;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    throw new Error('Pinecone index failed to become ready within timeout');
  }

  async generateEmbedding(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  async upsertMessage(userId, chatId, messageId, content, sender, metadata = {}) {
    try {
      if (!this.index) {
        throw new Error('Pinecone index not initialized');
      }

      const embedding = await this.generateEmbedding(content);
      
      const vectorId = `${userId}_${chatId}_${messageId}`;
      
      await this.index.upsert([{
        id: vectorId,
        values: embedding,
        metadata: {
          userId: userId.toString(),
          chatId: chatId.toString(),
          messageId: messageId.toString(),
          content: content.substring(0, 1000), // Limit metadata size
          sender,
          timestamp: new Date().toISOString(),
          ...metadata
        }
      }]);

      console.log(`Upserted message vector: ${vectorId}`);
    } catch (error) {
      console.error('Error upserting message to Pinecone:', error);
      throw error;
    }
  }

  async searchSimilarMessages(userId, query, limit = 10, excludeChatId = null) {
    try {
      if (!this.index) {
        throw new Error('Pinecone index not initialized');
      }

      const queryEmbedding = await this.generateEmbedding(query);
      
      const searchRequest = {
        vector: queryEmbedding,
        topK: limit,
        includeMetadata: true,
        filter: {
          userId: { $eq: userId.toString() }
        }
      };

      // Exclude current chat if specified
      if (excludeChatId) {
        searchRequest.filter.chatId = { $ne: excludeChatId.toString() };
      }

      const searchResponse = await this.index.query(searchRequest);
      
      return searchResponse.matches?.map(match => ({
        id: match.id,
        score: match.score,
        content: match.metadata.content,
        sender: match.metadata.sender,
        chatId: match.metadata.chatId,
        messageId: match.metadata.messageId,
        timestamp: match.metadata.timestamp
      })) || [];
    } catch (error) {
      console.error('Error searching similar messages:', error);
      return [];
    }
  }

  async deleteChatVectors(userId, chatId) {
    try {
      if (!this.index) {
        throw new Error('Pinecone index not initialized');
      }

      // Delete all vectors for a specific chat
      await this.index.deleteMany({
        filter: {
          userId: { $eq: userId.toString() },
          chatId: { $eq: chatId.toString() }
        }
      });

      console.log(`Deleted vectors for chat: ${chatId}`);
    } catch (error) {
      console.error('Error deleting chat vectors:', error);
      throw error;
    }
  }

  async deleteUserVectors(userId) {
    try {
      if (!this.index) {
        throw new Error('Pinecone index not initialized');
      }

      // Delete all vectors for a user
      await this.index.deleteMany({
        filter: {
          userId: { $eq: userId.toString() }
        }
      });

      console.log(`Deleted vectors for user: ${userId}`);
    } catch (error) {
      console.error('Error deleting user vectors:', error);
      throw error;
    }
  }

  async getIndexStats() {
    try {
      if (!this.index) {
        throw new Error('Pinecone index not initialized');
      }

      const stats = await this.index.describeIndexStats();
      return stats;
    } catch (error) {
      console.error('Error getting index stats:', error);
      throw error;
    }
  }
}

// Create singleton instance
const pineconeService = new PineconeService();

export default pineconeService;
