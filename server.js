const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Enable CORS untuk semua request
app.use(cors());

// Endpoint proxy untuk menghandle request
app.get('/api/proxy', async (req, res) => {
  try {
    const { url } = req.query;
    
    // Tambahkan headers untuk menghindari blocking
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://otakudesu.lol',
        'Origin': 'https://otakudesu.lol'
      }
    });

    // Kirim response HTML ke client
    res.send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).send(error.message);
  }
});

// Port untuk server
const PORT = process.env.PORT || 3001;

// Start server
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});