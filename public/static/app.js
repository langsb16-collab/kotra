// TechFinder Platform - Frontend JavaScript

const API_BASE = '';

// Utility: Get language from URL
function getLang() {
  const params = new URLSearchParams(window.location.search);
  return params.get('lang') || 'ko';
}

// Utility: API call wrapper
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
}

// Track analytics event
function trackEvent(eventType, eventData = {}) {
  const sessionId = sessionStorage.getItem('session_id') || generateSessionId();
  sessionStorage.setItem('session_id', sessionId);
  
  apiCall('/api/analytics', {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      event_type: eventType,
      event_data: eventData,
      language: getLang(),
    }),
  });
}

function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Image search functionality
async function performImageSearch(file) {
  const formData = new FormData();
  formData.append('image', file);
  
  // In production, upload to R2 or external storage first
  // For now, simulate with a placeholder
  const imageUrl = 'placeholder_image_url';
  
  const result = await apiCall('/api/search/image', {
    method: 'POST',
    body: JSON.stringify({
      image_url: imageUrl,
      session_id: sessionStorage.getItem('session_id'),
    }),
  });
  
  return result;
}

// Render company card
function renderCompanyCard(company, lang) {
  const name = company[`name_${lang}`] || company.name;
  const description = company[`description_${lang}`] || company.description || '';
  
  return `
    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <h3 class="text-xl font-bold mb-2 text-blue-600">${name}</h3>
      <p class="text-gray-600 mb-4 text-sm line-clamp-2">${description}</p>
      <div class="space-y-2 text-sm">
        <div><i class="fas fa-envelope text-gray-400 mr-2"></i>${company.email}</div>
        ${company.phone ? `<div><i class="fas fa-phone text-gray-400 mr-2"></i>${company.phone}</div>` : ''}
        ${company.website ? `<div><i class="fas fa-globe text-gray-400 mr-2"></i><a href="${company.website}" target="_blank" class="text-blue-500 hover:underline">${company.website}</a></div>` : ''}
        ${company.established_year ? `<div><i class="fas fa-calendar text-gray-400 mr-2"></i>${company.established_year}</div>` : ''}
        ${company.cert_count ? `<div><i class="fas fa-certificate text-gray-400 mr-2"></i>Certifications: ${company.cert_count}</div>` : ''}
        ${company.patent_count ? `<div><i class="fas fa-lightbulb text-gray-400 mr-2"></i>Patents: ${company.patent_count}</div>` : ''}
      </div>
      <div class="mt-4">
        <a href="/company/${company.id}?lang=${lang}" class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          View Details
        </a>
      </div>
    </div>
  `;
}

// Render listing card
function renderListingCard(listing, lang) {
  const title = listing[`title_${lang}`] || listing.title;
  const description = listing[`description_${lang}`] || listing.description || '';
  
  const typeLabels = {
    ko: { tech_sale: '기술 매각', equity_sale: '지분 매각', collaboration: '공동 개발', oem_odm: 'OEM/ODM' },
    en: { tech_sale: 'Tech Sale', equity_sale: 'Equity Sale', collaboration: 'Collaboration', oem_odm: 'OEM/ODM' },
  };
  
  const typeLabel = (typeLabels[lang] || typeLabels['ko'])[listing.listing_type];
  
  return `
    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <div class="flex justify-between items-start mb-3">
        <span class="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">${typeLabel}</span>
        <span class="text-gray-400 text-xs"><i class="fas fa-eye mr-1"></i>${listing.views || 0}</span>
      </div>
      <h3 class="text-lg font-bold mb-2">${title}</h3>
      <p class="text-gray-600 text-sm mb-3 line-clamp-3">${description}</p>
      <div class="space-y-1 text-sm text-gray-500 mb-4">
        ${listing.company_name ? `<div><i class="fas fa-building mr-2"></i>${listing.company_name}</div>` : ''}
        ${listing.price_range ? `<div><i class="fas fa-tag mr-2"></i>${listing.price_range}</div>` : ''}
        ${listing.location ? `<div><i class="fas fa-map-marker-alt mr-2"></i>${listing.location}</div>` : ''}
      </div>
      <a href="/listing/${listing.id}?lang=${lang}" class="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm">
        View Details
      </a>
    </div>
  `;
}

// Initialize page based on current path
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const lang = getLang();
  
  // Track page view
  trackEvent('page_view', { path, lang });
  
  // Initialize specific page functionality
  if (path === '/search') {
    initSearchPage(lang);
  } else if (path === '/marketplace') {
    initMarketplacePage(lang);
  } else if (path === '/company') {
    initCompanyPage(lang);
  } else if (path === '/admin') {
    initAdminPage(lang);
  }
});

// Initialize search page
async function initSearchPage(lang) {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const resultsDiv = document.getElementById('results');
  const loadingDiv = document.getElementById('loading');
  
  if (!uploadArea || !fileInput) return;
  
  uploadArea.addEventListener('click', () => fileInput.click());
  
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('border-blue-500', 'bg-blue-50');
  });
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('border-blue-500', 'bg-blue-50');
  });
  
  uploadArea.addEventListener('drop', async (e) => {
    e.preventDefault();
    uploadArea.classList.remove('border-blue-500', 'bg-blue-50');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleImageUpload(files[0], lang);
    }
  });
  
  fileInput.addEventListener('change', async (e) => {
    if (e.target.files.length > 0) {
      await handleImageUpload(e.target.files[0], lang);
    }
  });
}

async function handleImageUpload(file, lang) {
  const resultsDiv = document.getElementById('results');
  const loadingDiv = document.getElementById('loading');
  
  if (!resultsDiv || !loadingDiv) return;
  
  loadingDiv.classList.remove('hidden');
  resultsDiv.innerHTML = '';
  
  trackEvent('image_upload', { filename: file.name, size: file.size });
  
  try {
    const result = await performImageSearch(file);
    
    loadingDiv.classList.add('hidden');
    
    if (result.success && result.data.matches) {
      const matches = result.data.matches;
      
      if (matches.length === 0) {
        resultsDiv.innerHTML = '<p class="text-center text-gray-500">No matching companies found.</p>';
      } else {
        resultsDiv.innerHTML = `
          <h3 class="text-2xl font-bold mb-6">Search Results (${matches.length} matches)</h3>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${matches.map(company => renderCompanyCard(company, lang)).join('')}
          </div>
        `;
        
        trackEvent('search_results', { count: matches.length });
      }
    } else {
      resultsDiv.innerHTML = '<p class="text-center text-red-500">Search failed. Please try again.</p>';
    }
  } catch (error) {
    loadingDiv.classList.add('hidden');
    resultsDiv.innerHTML = '<p class="text-center text-red-500">An error occurred. Please try again.</p>';
  }
}

// Initialize marketplace page
async function initMarketplacePage(lang) {
  const listingsDiv = document.getElementById('listings');
  if (!listingsDiv) return;
  
  const type = new URLSearchParams(window.location.search).get('type') || '';
  
  const result = await apiCall(`/api/listings?type=${type}&status=active`);
  
  if (result.success && result.data) {
    const listings = result.data;
    
    if (listings.length === 0) {
      listingsDiv.innerHTML = '<p class="text-center text-gray-500">No listings available.</p>';
    } else {
      listingsDiv.innerHTML = `
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${listings.map(listing => renderListingCard(listing, lang)).join('')}
        </div>
      `;
    }
  }
}

// Initialize company registration page
function initCompanyPage(lang) {
  const form = document.getElementById('company-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const result = await apiCall('/api/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (result.success) {
      alert('Company registered successfully! Awaiting approval.');
      form.reset();
      trackEvent('company_registration', { company_name: data.name });
    } else {
      alert('Registration failed: ' + result.error);
    }
  });
}

// Initialize admin page
async function initAdminPage(lang) {
  const statsDiv = document.getElementById('admin-stats');
  if (!statsDiv) return;
  
  const result = await apiCall('/api/admin/analytics');
  
  if (result.success && result.data) {
    const stats = result.data.stats;
    statsDiv.innerHTML = `
      <div class="grid md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h4 class="text-gray-500 text-sm mb-2">Total Companies</h4>
          <p class="text-3xl font-bold text-blue-600">${stats.total_companies || 0}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h4 class="text-gray-500 text-sm mb-2">Total Technologies</h4>
          <p class="text-3xl font-bold text-green-600">${stats.total_technologies || 0}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h4 class="text-gray-500 text-sm mb-2">Total Matches</h4>
          <p class="text-3xl font-bold text-purple-600">${stats.total_matches || 0}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h4 class="text-gray-500 text-sm mb-2">Pending Approvals</h4>
          <p class="text-3xl font-bold text-orange-600">${stats.pending_companies || 0}</p>
        </div>
      </div>
    `;
  }
}
