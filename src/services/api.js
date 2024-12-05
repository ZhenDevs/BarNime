const API_BASE_URL = 'http://localhost:3001'; // sesuaikan dengan port server Anda

export const getTopAiring = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/top-airing`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top airing:', error);
    throw error;
  }
};

export const getRecentAnime = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recent-anime`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recent anime:', error);
    throw error;
  }
};

// Tambahkan fungsi berikut jika belum ada

export const getAnimeDetails = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/anime/${slug}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
};

export const searchAnime = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
};

export const getEpisodeStream = async (episodeSlug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/episode/${episodeSlug}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching episode stream:', error);
    throw error;
  }
};