import 'dotenv/config';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';

const testPinecone = async () => {
  console.log('=== Pinecone Connection Test ===');
  
  // Check environment variables
  console.log('Environment Variables:');
  console.log(`PINECONE_API_KEY: ${process.env.PINECONE_API_KEY ? 'Present' : 'Missing'}`);
  console.log(`PINECONE_INDEX_NAME: ${process.env.PINECONE_INDEX_NAME || 'fastgen-chats'}`);
  console.log(`GEMINI_KEYS: ${process.env.GEMINI_KEYS ? 'Present' : 'Missing'}`);
  
  if (!process.env.PINECONE_API_KEY) {
    console.error('❌ PINECONE_API_KEY is missing!');
    return;
  }
  
  if (!process.env.GEMINI_KEYS) {
    console.error('❌ GEMINI_KEYS is missing!');
    return;
  }
  
  try {
    // Initialize Pinecone
    console.log('\n🔗 Connecting to Pinecone...');
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    // List existing indexes
    console.log('📋 Listing existing indexes...');
    const indexList = await pinecone.listIndexes();
    console.log('Available indexes:', indexList.indexes?.map(i => i.name) || 'None');
    
    const indexName = process.env.PINECONE_INDEX_NAME || 'fastgen-chats';
    const indexExists = indexList.indexes?.some(index => index.name === indexName);
    
    if (!indexExists) {
      console.log(`\n🏗️ Creating index: ${indexName}`);
      const createResult = await pinecone.createIndex({
        name: indexName,
        dimension: 1536, // OpenAI embedding dimension
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      console.log('✅ Index creation initiated:', createResult);
      
      // Wait for index to be ready
      console.log('⏳ Waiting for index to be ready...');
      let retries = 0;
      const maxRetries = 30;
      
      while (retries < maxRetries) {
        try {
          const index = pinecone.index(indexName);
          const stats = await index.describeIndexStats();
          console.log('✅ Index is ready!');
          console.log('Index stats:', stats);
          break;
        } catch (error) {
          if (error.message.includes('not ready') || error.message.includes('not found')) {
            retries++;
            console.log(`⏳ Waiting... (${retries}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          } else {
            throw error;
          }
        }
      }
      
      if (retries >= maxRetries) {
        console.error('❌ Index creation timeout');
        return;
      }
    } else {
      console.log(`✅ Index ${indexName} already exists`);
      
      // Test existing index
      const index = pinecone.index(indexName);
      const stats = await index.describeIndexStats();
      console.log('Index stats:', stats);
    }
    
    // Test embedding generation
    console.log('\n🧠 Testing Gemini embedding generation...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEYS.split(',')[0].trim());
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are an embedding generator. Convert the following text into a 1536-dimensional vector representation.

Text: "This is a test message for embedding generation"

IMPORTANT: Return ONLY a JSON array of exactly 1536 numbers between -1 and 1. No explanations, no text, just the array.

Example format: [0.1, -0.2, 0.3, 0.4, ...] (exactly 1536 numbers)

Return the embedding vector now:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const embeddingText = response.text();
    
    // Extract JSON array from response (in case there's extra text)
    const jsonMatch = embeddingText.match(/\[[\d\.,\s-]+\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON array found in response');
    }
    
    const testEmbedding = JSON.parse(jsonMatch[0]);
    
    // Ensure it's exactly 1536 dimensions, pad or truncate if needed
    if (testEmbedding.length !== 1536) {
      console.log(`Adjusting embedding dimension from ${testEmbedding.length} to 1536`);
      if (testEmbedding.length < 1536) {
        // Pad with zeros
        while (testEmbedding.length < 1536) {
          testEmbedding.push(0);
        }
      } else {
        // Truncate
        testEmbedding.length = 1536;
      }
    }
    
    console.log('✅ Embedding generated successfully');
    console.log(`Embedding dimension: ${testEmbedding.length}`);
    
    // Test vector upsert
    console.log('\n📤 Testing vector upsert...');
    const index = pinecone.index(indexName);
    console.log('Index reference:', !!index);
    const testVector = {
      id: 'test-vector-' + Date.now(),
      values: testEmbedding,
      metadata: {
        userId: 'test-user',
        chatId: 'test-chat',
        sender: 'user',
        content: 'This is a test message',
        timestamp: new Date().toISOString(),
      }
    };
    
    await index.upsert([testVector]);
    console.log('✅ Vector upserted successfully');
    
    // Test vector query
    console.log('\n🔍 Testing vector query...');
    const queryResponse = await index.query({
      vector: testEmbedding,
      topK: 1,
      filter: { userId: 'test-user' },
      includeMetadata: true,
    });
    
    console.log('✅ Vector query successful');
    console.log('Query results:', queryResponse.matches?.length || 0, 'matches');
    
    // Clean up test vector
    console.log('\n🧹 Cleaning up test vector...');
    await index.deleteMany({
      filter: { userId: { $eq: 'test-user' } }
    });
    console.log('✅ Test vector cleaned up');
    
    console.log('\n🎉 All Pinecone tests passed!');
    
  } catch (error) {
    console.error('❌ Pinecone test failed:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      stack: error.stack
    });
  }
};

testPinecone().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test crashed:', error);
  process.exit(1);
});
