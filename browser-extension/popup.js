let currentProfileData = null;

// DOM elements
const extractBtn = document.getElementById('extractBtn');
const sendBtn = document.getElementById('sendToProfileSpike');
const statusDiv = document.getElementById('status');
const previewDiv = document.getElementById('profilePreview');

// Extract profile data
extractBtn.addEventListener('click', async () => {
  showStatus('Extracting profile data...', 'info');
  extractBtn.disabled = true;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('linkedin.com/in/')) {
      showStatus('Please navigate to a LinkedIn profile page first', 'error');
      extractBtn.disabled = false;
      return;
    }

    const response = await chrome.tabs.sendMessage(tab.id, { 
      action: 'extractProfile' 
    });

    if (response && response.success) {
      currentProfileData = response.data;
      showStatus('Profile data extracted successfully!', 'success');
      showProfilePreview(currentProfileData);
      sendBtn.style.display = 'block';
    } else {
      showStatus('Failed to extract profile data', 'error');
    }
  } catch (error) {
    console.error('Extension error:', error);
    showStatus('Error: ' + error.message, 'error');
  }
  
  extractBtn.disabled = false;
});

// Send to ProfileSpike
sendBtn.addEventListener('click', async () => {
  if (!currentProfileData) {
    showStatus('No profile data to send', 'error');
    return;
  }

  showStatus('Sending to ProfileSpike...', 'info');
  sendBtn.disabled = true;

  try {
    // Convert to text format
    const profileText = formatProfileAsText(currentProfileData);
    
    const response = await fetch('http://localhost:3002/api/linkedin-text-import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileText: profileText,
        analysisId: 'extension-' + Date.now()
      })
    });

    const result = await response.json();
    
    if (result.success) {
      showStatus('Analysis completed! Check ProfileSpike dashboard.', 'success');
      
      // Store result for later reference
      chrome.storage.local.set({ 
        lastAnalysis: result,
        lastAnalysisTime: new Date().toISOString()
      });
    } else {
      showStatus('Analysis failed: ' + (result.error || 'Unknown error'), 'error');
    }
  } catch (error) {
    console.error('Send error:', error);
    showStatus('Error sending to ProfileSpike: ' + error.message, 'error');
  }

  sendBtn.disabled = false;
});

// Show status message
function showStatus(message, type) {
  statusDiv.className = `status ${type}`;
  statusDiv.textContent = message;
  statusDiv.style.display = 'block';
}

// Show profile preview
function showProfilePreview(data) {
  if (!data) return;
  
  previewDiv.innerHTML = `
    <div class="profile-preview">
      <strong>${data.name || 'Name not found'}</strong>
      ${data.headline || 'Headline not found'}<br>
      ${data.location || 'Location not found'}<br>
      ${data.connectionsCount || 'Connections not found'}
    </div>
  `;
}

// Format profile data as text
function formatProfileAsText(data) {
  let text = '';
  
  if (data.name) text += data.name + '\n';
  if (data.headline) text += data.headline + '\n';
  if (data.location) text += data.location + '\n';
  if (data.connectionsCount) text += data.connectionsCount + '\n';
  
  if (data.summary) {
    text += '\nAbout:\n' + data.summary + '\n';
  }
  
  if (data.experience && data.experience.length > 0) {
    text += '\nExperience:\n';
    data.experience.forEach(exp => {
      text += `${exp.title}${exp.company ? ' at ' + exp.company : ''}\n`;
      if (exp.duration) text += exp.duration + '\n';
    });
  }
  
  if (data.skills && data.skills.length > 0) {
    text += '\nSkills: ' + data.skills.join(', ') + '\n';
  }
  
  return text;
}

// Load any previously extracted data on popup open
chrome.storage.local.get(['lastExtractedProfile'], (result) => {
  if (result.lastExtractedProfile) {
    currentProfileData = result.lastExtractedProfile;
    showStatus('Previously extracted profile loaded', 'success');
    showProfilePreview(currentProfileData);
    sendBtn.style.display = 'block';
  }
});