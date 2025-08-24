import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * GET /youtube — Get video recommendations for a topic
 * Example: /youtube?topic=Quadratic Equations
 */
router.get('/', requireAuth, async (req, res) => {
  console.log('=== YouTube Route Hit ===');
  console.log('Request received at:', new Date().toISOString());
  console.log('Request headers:', req.headers);
  console.log('Request query:', req.query);
  console.log('User ID:', req.user.userId);

  const { topic } = req.query;

  if (!topic) {
    return res.status(400).json({ error: 'Missing topic parameter' });
  }

  try {
    const YT_API_KEY = process.env.YT_API_KEY;
    
    console.log('=== YouTube API Request ===');
    console.log('Topic received:', topic);
    console.log('API Key present:', !!YT_API_KEY);
    console.log('API Key length:', YT_API_KEY ? YT_API_KEY.length : 0);
    console.log('API Key starts with:', YT_API_KEY ? YT_API_KEY.substring(0, 10) : 'N/A');

    if (!YT_API_KEY) {
      console.error('YouTube API key not configured in environment variables');
      return res.status(500).json({ error: 'YouTube API key not set in environment' });
    }

    const url = `https://www.googleapis.com/youtube/v3/search` +
      `?part=snippet&q=${encodeURIComponent(topic)}` +
      `&type=video&maxResults=10&key=${YT_API_KEY}`;

    console.log('Making request to YouTube API...');
    console.log('URL (without key):', `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(topic)}&type=video&maxResults=10&key=...`);

    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('YouTube API response not ok:', response.status, response.statusText);
      return res.status(500).json({ error: `YouTube API error: ${response.status}` });
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('YouTube API returned error:', data.error);
      return res.status(500).json({ error: `YouTube API error: ${data.error.message || 'Unknown error'}` });
    }

    if (!data.items) {
      console.error('YouTube API response missing items:', data);
      return res.status(500).json({ error: 'Failed to fetch videos from YouTube API' });
    }

    const videos = data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      contentDetails:{
        duration:"PT4M",
      }
    }));

    console.log(`Successfully fetched ${videos.length} videos for topic: ${topic}`);
    res.status(200).json({ videos });
  } catch (error) {
    console.error('=== YouTube API Error ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);
    res.status(500).json({ error: 'Error fetching videos from YouTube API' });
  }
});

export default router;
