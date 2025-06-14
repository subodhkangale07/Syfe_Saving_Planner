// API utility functions for exchange rate fetching

const API_BASE_URL = 'https://v6.exchangerate-api.com/v6';

export const fetchExchangeRate = async (apiKey) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${apiKey}/latest/USD`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.result === 'error') {
      throw new Error(data['error-type'] || 'API Error');
    }
    
    // Return USD to INR exchange rate
    return data.conversion_rates.INR;
    
  } catch (error) {
    console.error('Exchange rate fetch error:', error);
    
    // Return fallback exchange rate if API fails
    if (error.message.includes('429')) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.message.includes('403')) {
      throw new Error('Invalid API key or access denied');
    } else if (error.message.includes('404')) {
      throw new Error('API endpoint not found');
    } else {
      throw new Error('Unable to fetch exchange rate');
    }
  }
};

// Alternative API endpoints (backup options)
export const fetchExchangeRateBackup = async () => {
  try {
    // Using a free API as backup (limited requests)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.rates.INR;
    
  } catch (error) {
    console.error('Backup exchange rate fetch error:', error);
    // Return a reasonable fallback rate
    return 83.5;
  }
};

// Cache management utilities
export const getCachedExchangeRate = () => {
  try {
    const cachedRate = localStorage.getItem('exchangeRate');
    const cachedTimestamp = localStorage.getItem('lastUpdated');
    
    if (cachedRate && cachedTimestamp) {
      const cacheAge = Date.now() - new Date(cachedTimestamp).getTime();
      // Cache is valid for 1 hour (3600000 ms)
      if (cacheAge < 3600000) {
        return {
          rate: parseFloat(cachedRate),
          timestamp: new Date(cachedTimestamp),
          fromCache: true
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error reading cached exchange rate:', error);
    return null;
  }
};

export const setCachedExchangeRate = (rate) => {
  try {
    const timestamp = new Date().toISOString();
    localStorage.setItem('exchangeRate', rate.toString());
    localStorage.setItem('lastUpdated', timestamp);
  } catch (error) {
    console.error('Error caching exchange rate:', error);
  }
};