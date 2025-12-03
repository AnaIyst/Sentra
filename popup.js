// API keys are loaded from config.js
const API_KEY = CONFIG.SENTRA_API_KEY;
const API_BASE = CONFIG.SENTRA_API_BASE;
const VPN_API_KEY = CONFIG.VPN_API_KEY;
const VPN_API_BASE = CONFIG.VPN_API_BASE;

// DOM elements
const ipInput = document.getElementById('ipInput');
const domainInput = document.getElementById('domainInput');
const hashInput = document.getElementById('hashInput');
const ipSubmit = document.getElementById('ipSubmit');
const domainSubmit = document.getElementById('domainSubmit');
const hashSubmit = document.getElementById('hashSubmit');
const ipResults = document.getElementById('ipResults');
const domainResults = document.getElementById('domainResults');
const hashResults = document.getElementById('hashResults');

// Section elements
const ipSection = document.getElementById('ipSection');
const domainSection = document.getElementById('domainSection');
const hashSection = document.getElementById('hashSection');

// Type buttons
const ipBtn = document.getElementById('ipBtn');
const domainBtn = document.getElementById('domainBtn');
const hashBtn = document.getElementById('hashBtn');

// Function to show a specific section and hide others
function showSection(type) {
  // Hide all sections
  ipSection.style.display = 'none';
  domainSection.style.display = 'none';
  hashSection.style.display = 'none';
  
  // Remove active class from all buttons
  ipBtn.classList.remove('active');
  domainBtn.classList.remove('active');
  hashBtn.classList.remove('active');
  
  // Show selected section and activate button
  if (type === 'ip') {
    ipSection.style.display = 'block';
    ipBtn.classList.add('active');
  } else if (type === 'domain') {
    domainSection.style.display = 'block';
    domainBtn.classList.add('active');
  } else if (type === 'hash') {
    hashSection.style.display = 'block';
    hashBtn.classList.add('active');
  }
}

// Add click handlers for type buttons
ipBtn.addEventListener('click', () => showSection('ip'));
domainBtn.addEventListener('click', () => showSection('domain'));
hashBtn.addEventListener('click', () => showSection('hash'));

// Helper function to make API requests
async function fetchSentraData(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'x-apikey': API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Helper function to fetch VPN API data
async function fetchVPNApiData(ip) {
  try {
    const response = await fetch(`${VPN_API_BASE}/${ip}?key=${VPN_API_KEY}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Helper function to parse vCard data from WHOIS entities
function parseVCard(vcardArray) {
  const vcard = {};
  
  if (!Array.isArray(vcardArray)) return vcard;
  
  vcardArray.forEach(item => {
    if (item.name && item.values && item.values.length > 0) {
      if (item.name === 'fn') {
        vcard.name = item.values[0];
      } else if (item.name === 'email') {
        vcard.email = item.values[0];
      } else if (item.name === 'tel') {
        vcard.phone = item.values[0].replace('tel:', '');
      } else if (item.name === 'adr') {
        // Address format: [post office box, extended address, street, city, state, postal code, country]
        const adr = item.values;
        const addressParts = [];
        if (adr[2]) addressParts.push(adr[2]); // street
        if (adr[3]) addressParts.push(adr[3]); // city
        if (adr[4]) addressParts.push(adr[4]); // state
        if (adr[5]) addressParts.push(adr[5]); // postal code
        if (adr.length > 0 && addressParts.length > 0) {
          vcard.address = addressParts.join(', ');
        }
        if (item.parameters && item.parameters.cc && item.parameters.cc[0]) {
          vcard.country = item.parameters.cc[0];
        }
      }
    }
  });
  
  return vcard;
}

// Helper function to display Contact Information (from entities)
function displayContactInfo(attributes) {
  if (!attributes.entities || !Array.isArray(attributes.entities) || attributes.entities.length === 0) {
    return '';
  }
  
  let html = '<div style="margin-top: 15px; padding: 15px; background: rgba(4, 6, 9, 0.6); border-radius: 12px; border: 1px solid var(--border-color);">';
  html += '<h4 style="margin-bottom: 15px; font-size: 14px; color: var(--text-primary); font-weight: 600;">Contact Information:</h4>';
  
  attributes.entities.forEach((entity, index) => {
    if (entity.vcard_array && Array.isArray(entity.vcard_array)) {
      const vcard = parseVCard(entity.vcard_array);
      
      if (Object.keys(vcard).length > 0) {
        html += '<div style="margin-bottom: 15px; padding: 12px; background: rgba(4, 6, 9, 0.4); border-radius: 8px; border-left: 3px solid var(--accent);">';
        
        if (vcard.name) {
          html += `<div class="summary-item" style="margin-bottom: 8px;"><strong>Name:</strong> ${vcard.name}</div>`;
        }
        if (vcard.email) {
          html += `<div class="summary-item" style="margin-bottom: 8px;"><strong>Email:</strong> ${vcard.email}</div>`;
        }
        if (vcard.phone) {
          html += `<div class="summary-item" style="margin-bottom: 8px;"><strong>Phone:</strong> ${vcard.phone}</div>`;
        }
        if (vcard.address) {
          html += `<div class="summary-item" style="margin-bottom: 8px;"><strong>Address:</strong> ${vcard.address}</div>`;
        }
        if (vcard.country) {
          html += `<div class="summary-item"><strong>Country:</strong> ${vcard.country}</div>`;
        }
        
        html += '</div>';
      }
    }
  });
  
  html += '</div>';
  return html;
}

// Helper function to parse and display WHOIS information
function displayWhoisInfo(attributes) {
  if (!attributes.whois) {
    return '';
  }
  
  // Parse the whois string into key-value pairs
  const whoisLines = attributes.whois.split('\n');
  const whoisData = {};
  
  whoisLines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      if (key && value) {
        whoisData[key] = value;
      }
    }
  });
  
  if (Object.keys(whoisData).length === 0) {
    return '';
  }
  
  let html = '<div style="margin-top: 15px; padding: 15px; background: rgba(4, 6, 9, 0.6); border-radius: 12px; border: 1px solid var(--border-color);">';
  html += '<h4 style="margin-bottom: 15px; font-size: 14px; color: var(--text-primary); font-weight: 600;">WHOIS Information:</h4>';
  
  // Group related fields
  const sections = {
    'Domain': ['Domain name', 'Domain registrar id', 'Domain registrar url'],
    'Dates': ['Create date', 'Update date', 'Expiry date', 'Query time'],
    'Registrant': Object.keys(whoisData).filter(k => k.toLowerCase().startsWith('registrant')),
    'Administrative': Object.keys(whoisData).filter(k => k.toLowerCase().startsWith('administrative')),
    'Technical': Object.keys(whoisData).filter(k => k.toLowerCase().startsWith('technical')),
    'Name Servers': Object.keys(whoisData).filter(k => k.toLowerCase().includes('name server'))
  };
  
  // Display grouped sections
  Object.keys(sections).forEach(sectionName => {
    const fields = sections[sectionName];
    if (fields.length > 0) {
      html += '<div style="margin-bottom: 12px; padding: 10px; background: rgba(4, 6, 9, 0.4); border-radius: 8px;">';
      html += `<div style="font-size: 12px; font-weight: 600; color: var(--accent); margin-bottom: 8px;">${sectionName}:</div>`;
      
      fields.forEach(field => {
        if (whoisData[field]) {
          html += `<div class="summary-item" style="font-size: 12px; margin: 4px 0;"><strong>${field}:</strong> ${whoisData[field]}</div>`;
        }
      });
      
      html += '</div>';
    }
  });
  
  // Display any remaining fields
  const displayedFields = new Set();
  Object.values(sections).forEach(fields => fields.forEach(f => displayedFields.add(f)));
  const remainingFields = Object.keys(whoisData).filter(k => !displayedFields.has(k));
  
  if (remainingFields.length > 0) {
    html += '<div style="margin-bottom: 12px; padding: 10px; background: rgba(4, 6, 9, 0.4); border-radius: 8px;">';
    remainingFields.forEach(field => {
      html += `<div class="summary-item" style="font-size: 12px; margin: 4px 0;"><strong>${field}:</strong> ${whoisData[field]}</div>`;
    });
    html += '</div>';
  }
  
  html += '</div>';
  return html;
}

// Helper function to display results
function displayResults(resultsDiv, data, type) {
  resultsDiv.innerHTML = '';
  resultsDiv.classList.add('show');

  // For IP addresses, allow display even if Sentra data is missing but VPN data exists
  if (type === 'ip' && data.vpnData && (!data.data || !data.data.attributes)) {
    // Show VPN data only
    const vpn = data.vpnData;
    let html = '<h3>IP Address Information</h3>';
    
    // Security Information
    if (vpn.security) {
      html += '<div style="margin-top: 15px; padding: 15px; background: rgba(4, 6, 9, 0.6); border-radius: 12px; border: 1px solid var(--border-color);">';
      html += '<h4 style="margin-bottom: 10px; font-size: 14px; color: var(--text-primary); font-weight: 600;">Security Information:</h4>';
      html += `<div class="summary-item"><strong>VPN:</strong> <span style="color: ${vpn.security.vpn ? '#ff6b6b' : '#a5ff3f'};">${vpn.security.vpn ? 'Yes' : 'No'}</span></div>`;
      html += `<div class="summary-item"><strong>Proxy:</strong> <span style="color: ${vpn.security.proxy ? '#ff6b6b' : '#a5ff3f'};">${vpn.security.proxy ? 'Yes' : 'No'}</span></div>`;
      html += `<div class="summary-item"><strong>Tor:</strong> <span style="color: ${vpn.security.tor ? '#ff6b6b' : '#a5ff3f'};">${vpn.security.tor ? 'Yes' : 'No'}</span></div>`;
      html += `<div class="summary-item"><strong>Relay:</strong> <span style="color: ${vpn.security.relay ? '#ff6b6b' : '#a5ff3f'};">${vpn.security.relay ? 'Yes' : 'No'}</span></div>`;
      html += '</div>';
    }
    
    // Location Information
    if (vpn.location) {
      html += '<div style="margin-top: 15px; padding: 15px; background: rgba(4, 6, 9, 0.6); border-radius: 12px; border: 1px solid var(--border-color);">';
      html += '<h4 style="margin-bottom: 10px; font-size: 14px; color: var(--text-primary); font-weight: 600;">Location Information:</h4>';
      if (vpn.location.city) html += `<div class="summary-item"><strong>City:</strong> ${vpn.location.city}</div>`;
      if (vpn.location.region) html += `<div class="summary-item"><strong>Region:</strong> ${vpn.location.region}${vpn.location.region_code ? ' (' + vpn.location.region_code + ')' : ''}</div>`;
      if (vpn.location.country) html += `<div class="summary-item"><strong>Country:</strong> ${vpn.location.country}${vpn.location.country_code ? ' (' + vpn.location.country_code + ')' : ''}</div>`;
      if (vpn.location.continent) html += `<div class="summary-item"><strong>Continent:</strong> ${vpn.location.continent}${vpn.location.continent_code ? ' (' + vpn.location.continent_code + ')' : ''}</div>`;
      if (vpn.location.latitude && vpn.location.longitude) {
        html += `<div class="summary-item"><strong>Coordinates:</strong> ${vpn.location.latitude}, ${vpn.location.longitude}</div>`;
      }
      if (vpn.location.time_zone) html += `<div class="summary-item"><strong>Time Zone:</strong> ${vpn.location.time_zone}</div>`;
      if (vpn.location.is_in_european_union !== undefined) {
        html += `<div class="summary-item"><strong>EU Member:</strong> ${vpn.location.is_in_european_union ? 'Yes' : 'No'}</div>`;
      }
      html += '</div>';
    }
    
    // Network Information
    if (vpn.network) {
      html += '<div style="margin-top: 15px; padding: 15px; background: rgba(4, 6, 9, 0.6); border-radius: 12px; border: 1px solid var(--border-color);">';
      html += '<h4 style="margin-bottom: 10px; font-size: 14px; color: var(--text-primary); font-weight: 600;">Network Information:</h4>';
      if (vpn.network.network) html += `<div class="summary-item"><strong>Network:</strong> ${vpn.network.network}</div>`;
      if (vpn.network.autonomous_system_number) {
        html += `<div class="summary-item"><strong>ASN:</strong> ${vpn.network.autonomous_system_number}</div>`;
      }
      if (vpn.network.autonomous_system_organization) {
        html += `<div class="summary-item"><strong>AS Organization:</strong> ${vpn.network.autonomous_system_organization}</div>`;
      }
      html += '</div>';
    }
    
    resultsDiv.innerHTML = html;
    return;
  }

  if (!data || !data.data || !data.data.attributes) {
    resultsDiv.innerHTML = '<div class="error">No data available</div>';
    return;
  }

  const attributes = data.data.attributes;
  let html = '<h3>Scan Results</h3>';

  // Summary statistics
  if (attributes.last_analysis_stats) {
    const stats = attributes.last_analysis_stats;
    html += '<div class="summary">';
    html += '<div class="summary-item"><strong>Total Scans:</strong> ' + 
            (stats.harmless + stats.malicious + stats.suspicious + stats.undetected) + '</div>';
    html += '<div class="summary-item"><strong style="color: #a5ff3f;">Harmless:</strong> ' + (stats.harmless || 0) + '</div>';
    html += '<div class="summary-item"><strong style="color: #ff6b6b;">Malicious:</strong> ' + (stats.malicious || 0) + '</div>';
    html += '<div class="summary-item"><strong style="color: #ffd166;">Suspicious:</strong> ' + (stats.suspicious || 0) + '</div>';
    html += '<div class="summary-item"><strong style="color: #7c8299;">Undetected:</strong> ' + (stats.undetected || 0) + '</div>';
    html += '</div>';
  }

  // Engine results
  if (attributes.last_analysis_results) {
    html += '<div class="engine-list">';
    html += '<h4 style="margin: 10px 0 5px 0; font-size: 14px;">Engine Results:</h4>';
    
    const engines = attributes.last_analysis_results;
    for (const [engineName, result] of Object.entries(engines)) {
      const category = result.category || 'undetected';
      const resultText = result.result || 'unrated';
      const categoryClass = category.toLowerCase();
      
      html += `<div class="engine-item ${categoryClass}">`;
      html += `<strong>${engineName}:</strong> ${resultText} (${category})`;
      html += '</div>';
    }
    
    html += '</div>';
  }

  // Additional info based on type
  if (type === 'domain') {
    // DNS Records - now it's an array of objects with type, value, ttl
    const dnsRecords = attributes.last_dns_records;
    
    if (dnsRecords && Array.isArray(dnsRecords) && dnsRecords.length > 0) {
      html += '<div style="margin-top: 15px; padding: 15px; background: rgba(4, 6, 9, 0.6); border-radius: 12px; border: 1px solid var(--border-color);">';
      html += '<h4 style="margin-bottom: 10px; font-size: 14px; color: var(--text-primary); font-weight: 600;">DNS Records:</h4>';
      
      // Group records by type for better display
      const recordsByType = {};
      dnsRecords.forEach(record => {
        if (record && record.type && record.value) {
          const type = record.type.toUpperCase();
          if (!recordsByType[type]) {
            recordsByType[type] = [];
          }
          recordsByType[type].push(record);
        }
      });
      
      // Display records grouped by type
      const displayOrder = ['A', 'AAAA', 'MX', 'NS', 'CNAME', 'TXT', 'SOA', 'SRV', 'PTR'];
      let hasRecords = false;
      
      displayOrder.forEach(recordType => {
        if (recordsByType[recordType] && recordsByType[recordType].length > 0) {
          hasRecords = true;
          recordsByType[recordType].forEach(record => {
            let recordDisplay = `${recordType}: ${record.value}`;
            if (record.priority !== undefined) {
              recordDisplay += ` (Priority: ${record.priority})`;
            }
            if (record.ttl) {
              recordDisplay += ` [TTL: ${record.ttl}]`;
            }
            html += `<div style="font-size: 12px; margin: 5px 0; color: var(--text-secondary);">${recordDisplay}</div>`;
          });
        }
      });
      
      // Display any other record types not in the display order
      Object.keys(recordsByType).forEach(recordType => {
        if (!displayOrder.includes(recordType)) {
          hasRecords = true;
          recordsByType[recordType].forEach(record => {
            let recordDisplay = `${recordType}: ${record.value}`;
            if (record.ttl) {
              recordDisplay += ` [TTL: ${record.ttl}]`;
            }
            html += `<div style="font-size: 12px; margin: 5px 0; color: var(--text-secondary);">${recordDisplay}</div>`;
          });
        }
      });
      
      if (!hasRecords) {
        html += '<div style="font-size: 12px; color: var(--text-muted); font-style: italic;">No DNS records available</div>';
      }
      
      html += '</div>';
    } else {
      // Show DNS section even if empty, but with a message
      html += '<div style="margin-top: 15px; padding: 15px; background: rgba(4, 6, 9, 0.6); border-radius: 12px; border: 1px solid var(--border-color);">';
      html += '<h4 style="margin-bottom: 10px; font-size: 14px; color: var(--text-primary); font-weight: 600;">DNS Records:</h4>';
      html += '<div style="font-size: 12px; color: var(--text-muted); font-style: italic;">No DNS records available</div>';
      html += '</div>';
    }
    
    // Contact Information (from entities)
    html += displayContactInfo(attributes);
    
    // WHOIS Information (from whois string)
    html += displayWhoisInfo(attributes);
  }

  // VPN API data display for IP addresses (when both Sentra and VPN data available)
  if (type === 'ip' && data.vpnData) {
    const vpn = data.vpnData;
    
    // Security Information
    if (vpn.security) {
      html += '<div style="margin-top: 15px; padding: 15px; background: rgba(4, 6, 9, 0.6); border-radius: 12px; border: 1px solid var(--border-color);">';
      html += '<h4 style="margin-bottom: 10px; font-size: 14px; color: var(--text-primary); font-weight: 600;">Security Information:</h4>';
      html += `<div class="summary-item"><strong>VPN:</strong> <span style="color: ${vpn.security.vpn ? '#ff6b6b' : '#a5ff3f'};">${vpn.security.vpn ? 'Yes' : 'No'}</span></div>`;
      html += `<div class="summary-item"><strong>Proxy:</strong> <span style="color: ${vpn.security.proxy ? '#ff6b6b' : '#a5ff3f'};">${vpn.security.proxy ? 'Yes' : 'No'}</span></div>`;
      html += `<div class="summary-item"><strong>Tor:</strong> <span style="color: ${vpn.security.tor ? '#ff6b6b' : '#a5ff3f'};">${vpn.security.tor ? 'Yes' : 'No'}</span></div>`;
      html += `<div class="summary-item"><strong>Relay:</strong> <span style="color: ${vpn.security.relay ? '#ff6b6b' : '#a5ff3f'};">${vpn.security.relay ? 'Yes' : 'No'}</span></div>`;
      html += '</div>';
    }
    
    // Location Information
    if (vpn.location) {
      html += '<div style="margin-top: 15px; padding: 15px; background: rgba(4, 6, 9, 0.6); border-radius: 12px; border: 1px solid var(--border-color);">';
      html += '<h4 style="margin-bottom: 10px; font-size: 14px; color: var(--text-primary); font-weight: 600;">Location Information:</h4>';
      if (vpn.location.city) html += `<div class="summary-item"><strong>City:</strong> ${vpn.location.city}</div>`;
      if (vpn.location.region) html += `<div class="summary-item"><strong>Region:</strong> ${vpn.location.region}${vpn.location.region_code ? ' (' + vpn.location.region_code + ')' : ''}</div>`;
      if (vpn.location.country) html += `<div class="summary-item"><strong>Country:</strong> ${vpn.location.country}${vpn.location.country_code ? ' (' + vpn.location.country_code + ')' : ''}</div>`;
      if (vpn.location.continent) html += `<div class="summary-item"><strong>Continent:</strong> ${vpn.location.continent}${vpn.location.continent_code ? ' (' + vpn.location.continent_code + ')' : ''}</div>`;
      if (vpn.location.latitude && vpn.location.longitude) {
        html += `<div class="summary-item"><strong>Coordinates:</strong> ${vpn.location.latitude}, ${vpn.location.longitude}</div>`;
      }
      if (vpn.location.time_zone) html += `<div class="summary-item"><strong>Time Zone:</strong> ${vpn.location.time_zone}</div>`;
      if (vpn.location.is_in_european_union !== undefined) {
        html += `<div class="summary-item"><strong>EU Member:</strong> ${vpn.location.is_in_european_union ? 'Yes' : 'No'}</div>`;
      }
      html += '</div>';
    }
    
    // Network Information
    if (vpn.network) {
      html += '<div style="margin-top: 15px; padding: 15px; background: rgba(4, 6, 9, 0.6); border-radius: 12px; border: 1px solid var(--border-color);">';
      html += '<h4 style="margin-bottom: 10px; font-size: 14px; color: var(--text-primary); font-weight: 600;">Network Information:</h4>';
      if (vpn.network.network) html += `<div class="summary-item"><strong>Network:</strong> ${vpn.network.network}</div>`;
      if (vpn.network.autonomous_system_number) {
        html += `<div class="summary-item"><strong>ASN:</strong> ${vpn.network.autonomous_system_number}</div>`;
      }
      if (vpn.network.autonomous_system_organization) {
        html += `<div class="summary-item"><strong>AS Organization:</strong> ${vpn.network.autonomous_system_organization}</div>`;
      }
      html += '</div>';
    }
  }
  
  // Fallback to VirusTotal location data if VPN API data not available
  if (type === 'ip' && attributes.country && !data.vpnData) {
    html += '<div style="margin-top: 15px; padding: 15px; background: rgba(4, 6, 9, 0.6); border-radius: 12px; border: 1px solid var(--border-color);">';
    html += `<div class="summary-item"><strong>Country:</strong> ${attributes.country}</div>`;
    if (attributes.asn) {
      html += `<div class="summary-item"><strong>ASN:</strong> ${attributes.asn}</div>`;
    }
    html += '</div>';
  }

  resultsDiv.innerHTML = html;
}

// Helper function to show loading state
function showLoading(resultsDiv) {
  resultsDiv.innerHTML = '<div class="loading">Loading...</div>';
  resultsDiv.classList.add('show');
}

// Helper function to show error
function showError(resultsDiv, message) {
  resultsDiv.innerHTML = `<div class="error">Error: ${message}</div>`;
  resultsDiv.classList.add('show');
}

// IP Address search
ipSubmit.addEventListener('click', async () => {
  const ip = ipInput.value.trim();
  if (!ip) {
    showError(ipResults, 'Please enter an IP address');
    return;
  }

  showLoading(ipResults);
  try {
    // Fetch both Sentra (VirusTotal) and VPN API data in parallel
    const [sentraData, vpnData] = await Promise.allSettled([
      fetchSentraData(`/ip_addresses/${encodeURIComponent(ip)}`),
      fetchVPNApiData(ip)
    ]);
    
    // Combine the data
    const combinedData = {
      ...(sentraData.status === 'fulfilled' ? sentraData.value : { data: null }),
      vpnData: vpnData.status === 'fulfilled' ? vpnData.value : null
    };
    
    // If Sentra data failed, show VPN data only if available
    if (sentraData.status === 'rejected' && vpnData.status === 'fulfilled') {
      // Create a minimal structure for display
      combinedData.data = {
        attributes: {
          last_analysis_stats: null,
          last_analysis_results: null
        }
      };
    }
    
    displayResults(ipResults, combinedData, 'ip');
  } catch (error) {
    showError(ipResults, error.message);
  }
});

ipInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    ipSubmit.click();
  }
});

// Domain search
domainSubmit.addEventListener('click', async () => {
  const domain = domainInput.value.trim();
  if (!domain) {
    showError(domainResults, 'Please enter a domain');
    return;
  }

  showLoading(domainResults);
  try {
    const data = await fetchSentraData(`/domains/${encodeURIComponent(domain)}`);
    displayResults(domainResults, data, 'domain');
  } catch (error) {
    showError(domainResults, error.message);
  }
});

domainInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    domainSubmit.click();
  }
});

// Hash search
hashSubmit.addEventListener('click', async () => {
  const hash = hashInput.value.trim();
  if (!hash) {
    showError(hashResults, 'Please enter a file hash');
    return;
  }

  showLoading(hashResults);
  try {
    const data = await fetchSentraData(`/files/${encodeURIComponent(hash)}`);
    displayResults(hashResults, data, 'hash');
  } catch (error) {
    showError(hashResults, error.message);
  }
});

hashInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    hashSubmit.click();
  }
});

// Initialize on popup open
document.addEventListener('DOMContentLoaded', () => {
  // Extension ready
});

