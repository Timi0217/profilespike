// LinkedIn Profile Data Extractor
function extractLinkedInProfile() {
  const profileData = {
    url: window.location.href,
    name: '',
    headline: '',
    location: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    connectionsCount: '',
    extractedAt: new Date().toISOString()
  };

  try {
    // Extract name
    const nameSelectors = [
      'h1.text-heading-xlarge.inline.t-24.v-align-middle.break-words',
      'h1[data-anonymize="person-name"]',
      '.pv-text-details__left-panel h1'
    ];
    
    for (const selector of nameSelectors) {
      const nameEl = document.querySelector(selector);
      if (nameEl && nameEl.textContent.trim()) {
        profileData.name = nameEl.textContent.trim();
        break;
      }
    }

    // Extract headline
    const headlineSelectors = [
      '.text-body-medium.break-words',
      '.pv-text-details__left-panel .text-body-medium',
      '[data-anonymize="job-title"]'
    ];
    
    for (const selector of headlineSelectors) {
      const headlineEl = document.querySelector(selector);
      if (headlineEl && headlineEl.textContent.trim() && !headlineEl.textContent.includes('connection')) {
        profileData.headline = headlineEl.textContent.trim();
        break;
      }
    }

    // Extract location
    const locationSelectors = [
      '.text-body-small.inline.t-black--light.break-words',
      '.pv-text-details__left-panel .text-body-small'
    ];
    
    for (const selector of locationSelectors) {
      const locationEl = document.querySelector(selector);
      if (locationEl && locationEl.textContent.trim() && locationEl.textContent.includes(',')) {
        profileData.location = locationEl.textContent.trim();
        break;
      }
    }

    // Extract connections count
    const connectionEl = document.querySelector('.t-black--light.t-14, .text-body-small a[href*="connections"]');
    if (connectionEl) {
      profileData.connectionsCount = connectionEl.textContent.trim();
    }

    // Extract about/summary section
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      const summaryEl = aboutSection.parentElement.querySelector('.pv-shared-text-with-see-more .inline-show-more-text');
      if (summaryEl) {
        profileData.summary = summaryEl.textContent.trim();
      }
    }

    // Extract experience
    const experienceSection = document.querySelector('#experience');
    if (experienceSection) {
      const expItems = experienceSection.parentElement.querySelectorAll('.pvs-list__item--line-separated');
      expItems.forEach((item, index) => {
        if (index < 5) { // Limit to 5 experiences
          const titleEl = item.querySelector('.mr1.t-bold span[aria-hidden="true"]');
          const companyEl = item.querySelector('.t-14.t-normal span[aria-hidden="true"]');
          const durationEl = item.querySelector('.t-14.t-normal.t-black--light span[aria-hidden="true"]');
          
          if (titleEl) {
            profileData.experience.push({
              title: titleEl.textContent.trim(),
              company: companyEl ? companyEl.textContent.trim() : '',
              duration: durationEl ? durationEl.textContent.trim() : ''
            });
          }
        }
      });
    }

    // Extract skills
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
      const skillItems = skillsSection.parentElement.querySelectorAll('.mr1.t-bold span');
      skillItems.forEach((skill, index) => {
        if (index < 10 && skill.textContent.trim()) { // Limit to 10 skills
          profileData.skills.push(skill.textContent.trim());
        }
      });
    }

    return profileData;
  } catch (error) {
    console.error('Error extracting profile data:', error);
    return null;
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractProfile') {
    const profileData = extractLinkedInProfile();
    sendResponse({ success: true, data: profileData });
  }
  return true;
});

// Auto-extract and store in background
function autoExtract() {
  if (window.location.href.includes('linkedin.com/in/')) {
    setTimeout(() => {
      const profileData = extractLinkedInProfile();
      if (profileData && profileData.name !== '') {
        chrome.storage.local.set({ 
          lastExtractedProfile: profileData 
        });
        console.log('ProfileSpike: Profile data auto-extracted and stored');
      }
    }, 3000); // Wait 3 seconds for page to load
  }
}

// Run auto-extract when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoExtract);
} else {
  autoExtract();
}