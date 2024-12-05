const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const cors = require('cors');

const app = express();
const BASE_URL = 'https://otakudesu.cloud';

// Enable CORS
app.use(cors());

// Helper function for scraping
const scrapeData = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error('Error scraping data:', error.message);
    throw error;
  }
};

// API Endpoints
app.get('/api/top-airing', async (req, res) => {
  try {
    const html = await scrapeData(`${BASE_URL}/ongoing-anime/`);
    const $ = cheerio.load(html);
    const results = [];

    $('.venz > ul > li').each((i, el) => {
      try {
        const title = $(el).find('h2.jdlflm').text().trim();
        const episode = $(el).find('div.epz').text().trim();
        const date = $(el).find('div.newnime').text().trim();
        const thumbnail = $(el).find('img').attr('src');
        const url = $(el).find('a').attr('href');
        const slug = url ? url.split('/anime/')[1]?.replace('/', '') : '';

        if (title && slug) {
          results.push({
            title,
            episode,
            date,
            thumbnail,
            slug
          });
        }
      } catch (err) {
        console.error('Error processing top airing item:', err);
      }
    });

    res.json(results);
  } catch (error) {
    console.error('Error fetching top airing:', error);
    res.status(500).json({ 
      error: 'Failed to fetch top airing anime',
      details: error.message 
    });
  }
});

app.get('/api/recent-anime', async (req, res) => {
  try {
    const html = await scrapeData(`${BASE_URL}/complete-anime/`);
    const $ = cheerio.load(html);
    const results = [];

    $('.venz > ul > li').each((i, el) => {
      try {
        const title = $(el).find('h2.jdlflm').text().trim();
        const episode = $(el).find('div.epz').text().trim();
        const date = $(el).find('div.newnime').text().trim();
        const thumbnail = $(el).find('img').attr('src');
        const url = $(el).find('a').attr('href');
        const slug = url ? url.split('/anime/')[1]?.replace('/', '') : '';

        if (title && slug) {
          results.push({
            title,
            episode,
            date,
            thumbnail,
            slug
          });
        }
      } catch (err) {
        console.error('Error processing recent anime item:', err);
      }
    });

    res.json(results);
  } catch (error) {
    console.error('Error fetching recent anime:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recent anime',
      details: error.message 
    });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    console.log('Searching for:', q);
    const searchUrl = `${BASE_URL}/?s=${encodeURIComponent(q)}&post_type=anime`;
    console.log('Search URL:', searchUrl);

    const html = await scrapeData(searchUrl);
    const $ = cheerio.load(html);
    const results = [];

    $('.chivsrc li').each((i, el) => {
      try {
        const title = $(el).find('h2 a').text().trim();
        const thumbnail = $(el).find('img').attr('src');
        const url = $(el).find('h2 a').attr('href');
        const slug = url ? url.split('/anime/')[1]?.replace('/', '') : '';
        
        const infoElements = $(el).find('.set');
        const type = infoElements.eq(0).text().trim();
        const status = infoElements.eq(1).text().trim();
        const rating = infoElements.eq(2).text().trim();

        if (title && slug) {
          results.push({
            title,
            thumbnail,
            slug,
            type: type || 'Unknown',
            status: status || 'Unknown',
            rating: rating || 'N/A'
          });
        }
      } catch (err) {
        console.error('Error processing search result item:', err);
      }
    });

    console.log('Found results:', results.length);
    console.log('First result:', results[0]);

    res.json(results);
  } catch (error) {
    console.error('Error searching anime:', error);
    res.status(500).json({ 
      error: 'Failed to search anime',
      details: error.message,
      searchTerm: req.query.q,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/anime/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const animeUrl = `${BASE_URL}/anime/${slug}`;
    console.log('Fetching anime details from:', animeUrl);

    const html = await scrapeData(animeUrl);
    const $ = cheerio.load(html);

    const title = $('h1.entry-title').text().trim();
    const thumbnail = $('.fotoanime img').attr('src');
    const synopsis = $('.sinopc').text().trim();

    const info = {};
    $('.infozingle p').each((i, el) => {
      const text = $(el).text().trim();
      const [key, value] = text.split(':').map(item => item.trim());
      if (key && value) {
        info[key.toLowerCase().replace(/ /g, '_')] = value;
      }
    });

    const episodes = [];
    $('#venkonten .venser .episodelist ul li').each((i, el) => {
      const episodeTitle = $(el).find('a').text().trim();
      const episodeUrl = $(el).find('a').attr('href');
      const episodeSlug = episodeUrl ? episodeUrl.split('/episode/')[1]?.replace('/', '') : '';
      
      if (episodeTitle && episodeSlug) {
        episodes.push({
          title: episodeTitle,
          slug: episodeSlug
        });
      }
    });

    const animeDetails = {
      title,
      thumbnail,
      synopsis,
      ...info,
      episodes
    };

    res.json(animeDetails);
  } catch (error) {
    console.error('Error fetching anime details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch anime details',
      details: error.message,
      slug: req.params.slug
    });
  }
});

app.get('/api/episode/:episodeSlug', async (req, res) => {
  try {
    const { episodeSlug } = req.params;
    const episodeUrl = `${BASE_URL}/episode/${episodeSlug}`;
    console.log('Fetching episode stream from:', episodeUrl);

    const html = await scrapeData(episodeUrl);
    const $ = cheerio.load(html);

    const title = $('.venutama h1').text().trim();
    const streamUrl = $('.responsive-embed-stream iframe').first().attr('src');
    
    if (!streamUrl) {
      throw new Error('Stream URL not found');
    }

    const downloadLinks = [];
    $('.download ul li').each((i, el) => {
      const quality = $(el).find('strong').text().trim();
      const url = $(el).find('a').attr('href');
      if (quality && url) {
        downloadLinks.push({ quality, url });
      }
    });

    const streamData = {
      title,
      streamUrl,
      downloadLinks,
      episodeSlug
    };

    console.log('Stream data:', streamData);
    res.json(streamData);
  } catch (error) {
    console.error('Error fetching episode stream:', error);
    res.status(500).json({ 
      error: 'Failed to fetch episode stream',
      details: error.message,
      episodeSlug: req.params.episodeSlug
    });
  }
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../build')));

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});