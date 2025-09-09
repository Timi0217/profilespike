// ProfileSpike LinkedIn Extractor Bookmarklet
// To use: Drag this to bookmarks bar, then click on any LinkedIn profile
javascript:(function(){
  
  // Create extraction function
  function extractProfile() {
    const data = {
      name: '',
      headline: '',
      location: '',
      summary: '',
      experience: [],
      skills: []
    };

    // Extract name
    const nameEl = document.querySelector('h1.text-heading-xlarge, h1[data-anonymize="person-name"]');
    if (nameEl) data.name = nameEl.textContent.trim();

    // Extract headline
    const headlineEl = document.querySelector('.text-body-medium.break-words');
    if (headlineEl && !headlineEl.textContent.includes('connection')) {
      data.headline = headlineEl.textContent.trim();
    }

    // Extract location
    const locationEl = document.querySelector('.text-body-small.inline.t-black--light.break-words');
    if (locationEl && locationEl.textContent.includes(',')) {
      data.location = locationEl.textContent.trim();
    }

    // Extract about section
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      const summaryEl = aboutSection.parentElement.querySelector('.inline-show-more-text');
      if (summaryEl) data.summary = summaryEl.textContent.trim();
    }

    // Extract experience
    const expSection = document.querySelector('#experience');
    if (expSection) {
      const expItems = expSection.parentElement.querySelectorAll('.pvs-list__item--line-separated');
      expItems.forEach((item, i) => {
        if (i < 3) {
          const titleEl = item.querySelector('.mr1.t-bold span[aria-hidden="true"]');
          const companyEl = item.querySelector('.t-14.t-normal span[aria-hidden="true"]');
          if (titleEl) {
            data.experience.push({
              title: titleEl.textContent.trim(),
              company: companyEl ? companyEl.textContent.trim() : ''
            });
          }
        }
      });
    }

    return data;
  }

  // Extract profile data
  const profileData = extractProfile();
  
  // Format as text
  let profileText = '';
  if (profileData.name) profileText += profileData.name + '\n';
  if (profileData.headline) profileText += profileData.headline + '\n';
  if (profileData.location) profileText += profileData.location + '\n';
  if (profileData.summary) profileText += '\n' + profileData.summary + '\n';
  
  if (profileData.experience.length > 0) {
    profileText += '\nExperience:\n';
    profileData.experience.forEach(exp => {
      profileText += exp.title + (exp.company ? ' at ' + exp.company : '') + '\n';
    });
  }

  // Create modal to show extracted data
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 10000;
    width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  modal.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <h3 style="margin: 0; color: #0073b1;">🚀 ProfileSpike Extractor</h3>
      <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
    </div>
    <textarea id="extractedText" style="width: 100%; height: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; font-family: monospace;" readonly>${profileText}</textarea>
    <div style="margin-top: 15px; display: flex; gap: 10px;">
      <button onclick="navigator.clipboard.writeText(document.getElementById('extractedText').value); alert('Copied to clipboard!')" style="background: #0073b1; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; flex: 1;">
        📋 Copy to Clipboard
      </button>
      <button onclick="sendToProfileSpike()" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; flex: 1;">
        📊 Send to ProfileSpike
      </button>
    </div>
    <div style="font-size: 12px; color: #666; margin-top: 10px; text-align: center;">
      Copy this text and paste it into ProfileSpike for analysis
    </div>
  `;

  // Add send function
  window.sendToProfileSpike = function() {
    const textArea = document.getElementById('extractedText');
    fetch('http://localhost:3002/api/linkedin-text-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileText: textArea.value,
        analysisId: 'bookmarklet-' + Date.now()
      })
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        alert('✅ Profile sent to ProfileSpike successfully!');
        modal.remove();
      } else {
        alert('❌ Error: ' + (result.error || 'Unknown error'));
      }
    })
    .catch(error => {
      alert('❌ Connection error: ' + error.message);
    });
  };

  document.body.appendChild(modal);
})();