import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { createCursor } from 'ghost-cursor';
import * as cheerio from 'cheerio';

// Use stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

// User agent rotation pool
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0'
];

// Random delay function
function randomDelay(min = 2000, max = 5000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Parse LinkedIn profile from copy-pasted text with improved structure recognition
export function parseLinkedInText(profileText) {
  try {
    console.log('📋 Parsing LinkedIn profile text with enhanced recognition...');
    
    const data = {
      url: 'text-import',
      name: 'Name not found',
      headline: 'Headline not found', 
      location: 'Location not found',
      summary: 'Summary not found',
      experience: [],
      education: [],
      skills: [],
      connectionsCount: 'Connections not found',
      posts: ['Profile imported from text'],
      pageTitle: 'LinkedIn Profile Import',
      htmlLength: profileText.length
    };

    const lines = profileText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Extract name (first meaningful line, usually the person's name repeated)
    const namePattern = /^[A-Za-z\s\-'\.]{3,50}$/;
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i];
      if (namePattern.test(line) && 
          !line.toLowerCase().includes('background') &&
          !line.toLowerCase().includes('image') &&
          !line.toLowerCase().includes('contact') &&
          !line.toLowerCase().includes('verification')) {
        data.name = line;
        break;
      }
    }

    // Extract headline (look for professional titles after name but before location)
    let nameIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === data.name) {
        nameIndex = i;
        break;
      }
    }
    
    // Look for headline in the lines following the name
    if (nameIndex > -1) {
      for (let i = nameIndex + 1; i < Math.min(nameIndex + 6, lines.length); i++) {
        const line = lines[i];
        
        // Skip common non-headline patterns
        if (line.toLowerCase().includes('add verification') ||
            line.toLowerCase().includes('contact info') ||
            line.toLowerCase() === data.name.toLowerCase() ||
            line.includes('followers') ||
            line.includes('connections')) {
          continue;
        }
        
        // Look for professional titles
        const titleKeywords = ['technologist', 'engineer', 'director', 'manager', 'founder', 'ceo', 'cto', 'developer', 'designer', 'analyst', 'consultant', 'specialist', 'lead', 'investor', 'producer'];
        if (line.length > 5 && line.length < 100 && 
            titleKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
          data.headline = line;
          break;
        }
      }
    }

    // Extract location (look for city, state, country patterns)
    const locationPatterns = [
      /^[A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Za-z\s]+$/, // City, State, Country
      /^[A-Za-z\s]+,\s*[A-Za-z\s]+$/ // City, State
    ];
    
    for (const line of lines) {
      if (locationPatterns.some(pattern => pattern.test(line)) && line.length < 100) {
        data.location = line;
        break;
      }
    }

    // Extract connections count
    for (const line of lines) {
      const connectionMatch = line.match(/(\d{1,3}(?:,\d{3})*[\+]?)\s*(followers?|connections?)/i);
      if (connectionMatch) {
        data.connectionsCount = connectionMatch[1] + ' ' + connectionMatch[2];
        // If we find followers, keep looking for connections
        if (connectionMatch[2].toLowerCase().includes('connection')) {
          break;
        }
      }
    }

    // Extract About/Summary section
    let aboutIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase() === 'about' || lines[i].toLowerCase() === 'aboutabout') {
        aboutIndex = i;
        break;
      }
    }
    
    if (aboutIndex > -1 && aboutIndex + 1 < lines.length) {
      // Get the next non-empty line after "About"
      for (let i = aboutIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.length > 10 && !line.toLowerCase().includes('featured') && 
            !line.toLowerCase().includes('experience')) {
          data.summary = line;
          break;
        }
      }
    }

    // Extract Experience section - Updated for LinkedIn's actual text structure
    console.log('🔍 Looking for experience section...');
    let experienceIndex = -1;
    
    // LinkedIn doesn't always have clear "Experience" headers in copy-paste text
    // Look for patterns that indicate work experience entries
    const experienceEntries = [];
    
    for (let i = 0; i < lines.length && experienceEntries.length < 20; i++) {
      const line = lines[i];
      const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
      const lineAfterNext = i + 2 < lines.length ? lines[i + 2] : '';
      
      // Stop if we hit education section
      if (line.toLowerCase().includes('education') || line.toLowerCase().includes('university')) {
        break;
      }
      
      // Look for job title patterns - titles that appear twice in a row often indicate LinkedIn structure
      // Example: "Creative Director" followed by "Creative Director" 
      const isJobTitle = line.length > 3 && line.length < 100 &&
          !line.includes('logo') &&
          !line.includes('·') &&
          !line.includes('Present') &&
          !line.match(/^\d{4}/) &&
          !line.match(/^[A-Z][a-z]{2,8}\s+\d{4}/) &&
          !line.toLowerCase().includes('brooklyn') &&
          !line.toLowerCase().includes('new york') &&
          !line.toLowerCase().includes('united states') &&
          !line.match(/^\$\d+/) &&
          !line.toLowerCase().includes('backed') &&
          !line.toLowerCase().includes('managed') &&
          !line.toLowerCase().includes('produced') &&
          !line.toLowerCase().includes('helping') &&
          !line.toLowerCase().includes('co-led') &&
          !line.toLowerCase().includes('venture') &&
          !line.toLowerCase().includes('studio');

      // Check if this looks like a job title (especially if duplicated)
      if (isJobTitle && (nextLine === line || 
          (line.includes('Director') || line.includes('Producer') || line.includes('Officer') || line.includes('Investor')))) {
        
        console.log('📝 Found potential job title:', line);
        const jobTitle = line;
        let company = 'Company not specified';
        let duration = 'Duration not specified';  
        let description = 'Description not available';
        
        // Look ahead for company, duration, and description
        for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
          const lookAheadLine = lines[j];
          
          // Skip duplicate title lines
          if (lookAheadLine === line) {
            continue;
          }
          
          // Company name - look for lines that are company names (often have "logo" after them)
          if (company === 'Company not specified' &&
              lookAheadLine.length > 1 && lookAheadLine.length < 50 &&
              !lookAheadLine.includes('·') &&
              !lookAheadLine.match(/^\d{4}/) &&
              !lookAheadLine.match(/^[A-Z][a-z]{2,8}\s+\d{4}/) &&
              !lookAheadLine.toLowerCase().includes('brooklyn') &&
              !lookAheadLine.toLowerCase().includes('new york') &&
              !lookAheadLine.toLowerCase().includes('united states') &&
              !lookAheadLine.startsWith('$') &&
              !lookAheadLine.toLowerCase().includes('helping') &&
              !lookAheadLine.toLowerCase().includes('produced') &&
              !lookAheadLine.toLowerCase().includes('managed') &&
              !lookAheadLine.toLowerCase().includes('co-led')) {
            
            // Check if next line contains "logo" (common LinkedIn pattern)
            const nextAfterLook = j + 1 < lines.length ? lines[j + 1] : '';
            const prevLine = j - 1 >= 0 ? lines[j - 1] : '';
            
            // More accurate company detection:
            // 1. Line followed by "logo"
            // 2. All caps/short company names (BK-XL, etc.)  
            // 3. Company names that appear right after duplicated job titles
            if (nextAfterLook.includes('logo') ||
                prevLine.includes('logo') ||
                lookAheadLine.match(/^[A-Z][A-Z\-]{1,10}$/) || // All caps like "BK-XL"
                (lookAheadLine.length < 20 && !lookAheadLine.includes(' ') && 
                 (lookAheadLine.includes('Studios') || lookAheadLine.includes('folq') || lookAheadLine.includes('-')))) {
              company = lookAheadLine.replace(/\s*logo\s*$/, '').trim();
              console.log('🏢 Found company:', company);
            }
          }
          
          // Duration pattern (contains · and time indicators)
          if (lookAheadLine.includes('·') && 
              (lookAheadLine.includes('mo') || lookAheadLine.includes('yr') || 
               lookAheadLine.includes('Present') || lookAheadLine.match(/\d{4}/))) {
            duration = lookAheadLine;
            console.log('📅 Found duration:', duration);
          }
          
          // Description - longer meaningful text
          if (description === 'Description not available' &&
              lookAheadLine.length > 25 && lookAheadLine.length < 500 &&
              !lookAheadLine.includes('logo') && 
              !lookAheadLine.includes('·') &&
              !lookAheadLine.match(/^\d{4}/) &&
              (lookAheadLine.toLowerCase().includes('helping') ||
               lookAheadLine.toLowerCase().includes('managed') ||
               lookAheadLine.toLowerCase().includes('produced') ||
               lookAheadLine.toLowerCase().includes('co-led') ||
               lookAheadLine.toLowerCase().includes('founded') ||
               lookAheadLine.toLowerCase().includes('venture') ||
               lookAheadLine.startsWith('$') ||
               lookAheadLine.length > 40)) {
            description = lookAheadLine;
            console.log('📄 Found description:', description.substring(0, 50) + '...');
          }
        }
        
        experienceEntries.push({
          title: jobTitle,
          company: company,
          duration: duration,
          description: description
        });
        
        console.log('✅ Added experience entry:', {title: jobTitle, company});
        
        // Skip ahead to avoid re-parsing
        i += 5;
      }
    }
    
    data.experience = experienceEntries;
    console.log(`📊 Found ${experienceEntries.length} experience entries`);

    // Extract Education section
    let educationIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase() === 'education' || 
          lines[i].toLowerCase() === 'educationeducation') {
        educationIndex = i;
        break;
      }
    }

    if (educationIndex > -1) {
      const educationEntries = [];
      
      for (let i = educationIndex + 1; i < lines.length && educationEntries.length < 5; i++) {
        const line = lines[i];
        
        // Stop at next major section
        if (line.toLowerCase() === 'skills' || line.toLowerCase() === 'volunteering' ||
            line.toLowerCase().includes('skillsskills')) {
          break;
        }
        
        // Look for university/school names
        if (line.includes('University') || line.includes('College') || line.includes('Institute') ||
            line.includes('School') && line.length > 5 && line.length < 100) {
          
          let degree = 'Degree not specified';
          let years = 'Years not specified';
          
          // Look for degree in next few lines
          for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
            const nextLine = lines[j];
            if (nextLine.length > 5 && nextLine.length < 100 && 
                (nextLine.includes('Economics') || nextLine.includes('Computer Science') ||
                 nextLine.includes('Engineering') || nextLine.includes('Business') ||
                 nextLine.includes('Bachelor') || nextLine.includes('Master') ||
                 nextLine.includes('PhD') || nextLine.includes('Degree'))) {
              degree = nextLine;
              break;
            }
          }
          
          educationEntries.push({
            school: line,
            degree: degree,
            years: years
          });
        }
      }
      
      data.education = educationEntries;
    }

    // Extract Skills section
    let skillsIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase() === 'skills' || 
          lines[i].toLowerCase() === 'skillsskills') {
        skillsIndex = i;
        break;
      }
    }

    if (skillsIndex > -1) {
      const foundSkills = [];
      
      for (let i = skillsIndex + 1; i < lines.length && foundSkills.length < 15; i++) {
        const line = lines[i];
        
        // Stop at next major section
        if (line.toLowerCase() === 'courses' || line.toLowerCase() === 'honors' ||
            line.toLowerCase() === 'languages' || line.toLowerCase().includes('coursescourses')) {
          break;
        }
        
        // Skip endorsement text and common non-skill lines
        if (line.length > 1 && line.length < 30 &&
            !line.includes('endorsement') && !line.includes('Endorsed by') &&
            !line.includes('skilled at this') && !line.match(/^\d+/) &&
            !line.includes('Show all')) {
          
          foundSkills.push(line);
        }
      }
      
      data.skills = foundSkills;
    }

    console.log('✅ Enhanced LinkedIn text parsing completed');
    return data;

  } catch (error) {
    console.error('Error parsing LinkedIn text:', error);
    throw new Error(`Failed to parse LinkedIn profile text: ${error.message}`);
  }
}

export async function scrapeLinkedInProfile(linkedinUrl) {
  let browser = null;
  
  try {
    // Get session cookie dynamically after dotenv is loaded
    const sessionCookie = process.env.LINKEDIN_SESSION_COOKIE || null;
    console.log('🔍 Session cookie check:', sessionCookie ? `Found (${sessionCookie.substring(0, 20)}...)` : 'Not found');
    console.log('🚀 Launching browser with minimal footprint...');
    browser = await puppeteer.launch({
      headless: 'new', // Try new headless mode
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--window-size=1366,768', // Smaller window
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      ],
      defaultViewport: { width: 1366, height: 768 },
      ignoreDefaultArgs: ['--enable-automation']
    });

    const page = await browser.newPage();
    
    // Set viewport to common desktop size with random variation
    const viewport = {
      width: 1920 + Math.floor(Math.random() * 100),
      height: 1080 + Math.floor(Math.random() * 100)
    };
    await page.setViewport(viewport);
    
    // Use random user agent from pool
    const randomUserAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    await page.setUserAgent(randomUserAgent);
    console.log('🎭 Using User Agent:', randomUserAgent.substring(0, 50) + '...');
    
    // Create ghost cursor for human-like mouse movements
    const cursor = createCursor(page);
    
    // Advanced webdriver property removal and other detection evasion
    await page.evaluateOnNewDocument(() => {
      // Remove webdriver property
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
      
      // Remove automation indicators
      delete navigator.__proto__.webdriver;
      
      // Override plugins and languages to appear more human
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
      
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
      
      // Mock chrome runtime
      window.chrome = {
        runtime: {},
      };
    });
    
    // Set extra headers to appear more human
    await page.setExtraHTTPHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    });
    
    // Set LinkedIn session cookie if available
    if (sessionCookie) {
      console.log('✅ Setting LinkedIn session cookie for authenticated access...');
      await page.setCookie({
        name: 'li_at',
        value: sessionCookie,
        domain: '.linkedin.com',
        path: '/',
        httpOnly: true,
        secure: true
      });
    } else {
      console.log('⚠️  No LinkedIn session cookie - accessing as guest (limited data)');
    }
    
    // Add random delay before navigation to simulate human behavior
    const initialDelay = randomDelay(1000, 3000);
    console.log(`⏳ Initial delay: ${initialDelay}ms`);
    await page.waitForTimeout(initialDelay);
    
    console.log('🌐 Navigating directly to LinkedIn profile...');
    
    // Skip homepage, go directly to profile with additional stealth measures
    try {
      await page.goto(linkedinUrl, { 
        waitUntil: 'domcontentloaded', // Less strict waiting
        timeout: 45000 
      });
    } catch (error) {
      // If direct navigation fails, try with different wait strategy
      console.log('🔄 Retrying with different navigation strategy...');
      await page.goto(linkedinUrl, { 
        waitUntil: 'load',
        timeout: 45000 
      });
    }

    // Small delay after navigation
    await page.waitForTimeout(randomDelay(1000, 2000));

    // Debug: Check what page we actually got
    const currentUrl = page.url();
    const title = await page.title();
    console.log('🔍 After navigation - URL:', currentUrl);
    console.log('🔍 After navigation - Title:', title);

    // Check if we hit a challenge or different page
    if (title.includes('Challenge') || title.includes('Security') || currentUrl.includes('challenge')) {
      console.log('❌ LinkedIn security challenge detected');
      return {
        error: 'LinkedIn security challenge',
        message: 'LinkedIn detected automated access and requires manual verification',
        url: currentUrl,
        title: title
      };
    }

    // Wait for the main content to load
    try {
      await page.waitForSelector('main', { timeout: 10000 });
    } catch (error) {
      console.log('⚠️  Main selector not found, trying alternative selectors...');
      // Try alternative selectors
      const selectors = ['#main-content', '.application-outlet', 'body'];
      for (const selector of selectors) {
        try {
          await page.waitForSelector(selector, { timeout: 2000 });
          console.log(`✅ Found alternative selector: ${selector}`);
          break;
        } catch (e) {
          console.log(`❌ Selector ${selector} not found`);
        }
      }
    }
    
    // Human-like scrolling and content loading
    console.log('📜 Scrolling through profile to load all content...');
    
    // Use cursor to perform human-like scrolling
    await humanLikeScroll(page, cursor);
    
    // Random delay between scroll and content expansion
    await page.waitForTimeout(randomDelay(2000, 4000));
    
    // Expand content using human-like clicking
    await humanLikeExpandContent(page, cursor);
    
    // Final delay for dynamic content to load
    const finalDelay = randomDelay(3000, 5000);
    console.log(`⏳ Final content load delay: ${finalDelay}ms`);
    await page.waitForTimeout(finalDelay);

    // Get the page content after expansion
    const content = await page.content();
    const $ = cheerio.load(content);

    // Debug: Check if we got the right page
    const pageTitle = $('title').text();
    console.log('Page title:', pageTitle);
    
    // Debug: Check main content areas
    const mainContent = $('main').length;
    const h1Tags = $('h1').length;
    console.log('Main elements found:', { mainContent, h1Tags });
    
    // Debug: Check for sign-in requirement
    if (title.toLowerCase().includes('sign in') || content.includes('Join now')) {
      console.log('⚠️  LinkedIn requires sign-in - profile might be private or we hit rate limit');
    }

    // Extract profile data
    const profileData = {
      url: linkedinUrl,
      name: extractName($),
      headline: extractHeadline($),
      location: extractLocation($),
      summary: extractSummary($),
      experience: extractExperience($),
      education: extractEducation($),
      skills: extractSkills($),
      connectionsCount: extractConnections($),
      posts: extractRecentPosts($),
      pageTitle: title, // Add for debugging
      htmlLength: content.length // Add for debugging
    };

    console.log('Profile data extracted:', {
      name: profileData.name,
      headline: profileData.headline,
      experienceCount: profileData.experience?.length || 0,
      skillsCount: profileData.skills?.length || 0
    });

    return profileData;

  } catch (error) {
    console.error('LinkedIn scraping error:', error);
    throw new Error(`Failed to scrape LinkedIn profile: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function extractName($) {
  // Try multiple selectors for LinkedIn name (based on working scrapers)
  const nameSelectors = [
    'h1.text-heading-xlarge.inline.t-24.v-align-middle.break-words',
    'h1.text-heading-xlarge',
    '.pv-text-details__left-panel h1',
    '.pv-top-card--list li:first-child',
    'h1[data-generated-suggestion-target]',
    '.text-heading-xlarge',
    '.pv-top-card .pv-top-card__name',
    '.pv-text-details__left-panel .text-heading-xlarge',
    '.ph5.pb5 h1',
    '.pv-text-details__left-panel-v2 h1',
    'h1'
  ];
  
  for (const selector of nameSelectors) {
    const name = $(selector).first().text().trim();
    if (name && name !== '' && !name.toLowerCase().includes('linkedin')) {
      return name;
    }
  }
  
  return 'Name not found';
}

function extractHeadline($) {
  // Extract from page title if available (like "Timilehin Dayo-Kayode - BK-XL | LinkedIn")
  const pageTitle = $('title').text();
  if (pageTitle && pageTitle.includes(' - ') && pageTitle.includes(' | LinkedIn')) {
    const titleParts = pageTitle.split(' | LinkedIn')[0].split(' - ');
    if (titleParts.length > 1) {
      return titleParts.slice(1).join(' - ').trim(); // Everything after the name
    }
  }

  // Try multiple selectors for LinkedIn headline (enhanced based on working scrapers)
  const headlineSelectors = [
    '.text-body-medium.break-words',
    '.pv-text-details__left-panel .text-body-medium',
    '.pv-text-details__left-panel-v2 .text-body-medium',
    '.pv-top-card--list li:nth-child(2)',
    '.pv-top-card .pv-top-card__headline',
    '.text-body-medium',
    '[data-generated-suggestion-target] + .text-body-medium',
    '.top-card-layout__headline',
    '.profile-topcard__summary-info-headline',
    '.pv-text-details__left-panel .break-words',
    '.ph5.pb5 .text-body-medium',
    '.mt2.text-body-medium.break-words'
  ];
  
  for (const selector of headlineSelectors) {
    const headline = $(selector).first().text().trim();
    if (headline && headline !== '' && headline !== pageTitle) {
      return headline;
    }
  }
  
  return 'Headline not found';
}

function extractLocation($) {
  // Try multiple selectors for location (enhanced)
  const locationSelectors = [
    '.text-body-small.inline.t-black--light.break-words',
    '.pv-text-details__left-panel .text-body-small',
    '.pv-text-details__left-panel-v2 .text-body-small',
    '.pv-top-card .pv-top-card__location',
    '.text-body-small.t-black--light',
    '.pv-top-card--list .text-body-small',
    '.pv-text-details__left-panel .text-body-small.t-black--light',
    '.ph5.pb5 .text-body-small',
    '.mt1.text-body-small.t-black--light'
  ];
  
  for (const selector of locationSelectors) {
    const location = $(selector).first().text().trim();
    if (location && location !== '' && !location.toLowerCase().includes('connection')) {
      return location;
    }
  }
  
  return 'Location not found';
}

function extractSummary($) {
  // Try multiple selectors for summary/about section
  const summarySelectors = [
    '#about + div .pv-shared-text-with-see-more .inline-show-more-text',
    '#about ~ div .pv-shared-text-with-see-more .inline-show-more-text',
    '.pv-about__summary-text .inline-show-more-text',
    '.pv-about-section .pv-about__summary-text',
    '.summary-section .pv-oc-about-section__summary-text',
    '.pv-shared-text-with-see-more .break-words',
    '[data-section="summary"] .pv-shared-text-with-see-more .inline-show-more-text'
  ];
  
  for (const selector of summarySelectors) {
    const summary = $(selector).first().text().trim();
    if (summary && summary !== '') {
      return summary;
    }
  }
  
  return 'Summary not found';
}

function extractExperience($) {
  const experiences = [];
  
  // Try multiple selectors for experience section
  const experienceContainerSelectors = [
    '#experience + div .pvs-list__item--line-separated',
    '#experience ~ div .pvs-list__item--line-separated',
    '[data-section="experience"] .pvs-list__item--line-separated',
    '.experience-section .pvs-list__item--line-separated',
    '.pv-profile-section.experience .pv-entity__summary-info'
  ];
  
  for (const containerSelector of experienceContainerSelectors) {
    $(containerSelector).each((i, elem) => {
      const $elem = $(elem);
      
      // Try multiple selectors for job title
      const titleSelectors = [
        '.mr1.t-bold span[aria-hidden="true"]',
        '.pv-entity__summary-info h3 span',
        '.t-16.t-black.t-bold span',
        '.pvs-entity__caption-wrapper .t-16.t-black.t-bold'
      ];
      
      // Try multiple selectors for company
      const companySelectors = [
        '.t-14.t-normal span[aria-hidden="true"]:first',
        '.pv-entity__secondary-title',
        '.t-14.t-black--light.pv-entity__secondary-title',
        '.pvs-entity__caption-wrapper .t-14.t-normal'
      ];
      
      // Try multiple selectors for duration
      const durationSelectors = [
        '.t-14.t-normal.t-black--light span[aria-hidden="true"]',
        '.pv-entity__date-range span',
        '.t-12.t-black--light.t-normal',
        '.pvs-entity__caption-wrapper .t-14.t-black--light'
      ];
      
      let title = '';
      let company = '';
      let duration = '';
      
      for (const selector of titleSelectors) {
        title = $elem.find(selector).first().text().trim();
        if (title) break;
      }
      
      for (const selector of companySelectors) {
        company = $elem.find(selector).first().text().trim();
        if (company) break;
      }
      
      for (const selector of durationSelectors) {
        duration = $elem.find(selector).first().text().trim();
        if (duration) break;
      }
      
      const description = $elem.find('.pv-shared-text-with-see-more .inline-show-more-text').text().trim();
      
      if (title || company) {
        experiences.push({
          title: title || 'Title not found',
          company: company || 'Company not found', 
          duration: duration || 'Duration not found',
          description: description || 'No description'
        });
      }
    });
    
    if (experiences.length > 0) break; // Stop if we found experiences
  }
  
  return experiences;
}

function extractEducation($) {
  const education = [];
  
  $('#education').parent().find('.pvs-list__item--line-separated').each((i, elem) => {
    const $elem = $(elem);
    const school = $elem.find('.mr1.t-bold span[aria-hidden="true"]').first().text().trim();
    const degree = $elem.find('.t-14.t-normal span[aria-hidden="true"]').first().text().trim();
    const years = $elem.find('.t-14.t-normal.t-black--light span[aria-hidden="true"]').first().text().trim();
    
    if (school || degree) {
      education.push({
        school: school || 'School not found',
        degree: degree || 'Degree not found',
        years: years || 'Years not found'
      });
    }
  });
  
  return education;
}

function extractSkills($) {
  const skills = [];
  
  $('#skills').parent().find('.pvs-list__item--line-separated .mr1.t-bold span').each((i, elem) => {
    const skill = $(elem).text().trim();
    if (skill) {
      skills.push(skill);
    }
  });
  
  return skills;
}

function extractConnections($) {
  return $('.t-black--light.t-14').text().trim() || 'Connections not found';
}

function extractRecentPosts($) {
  // This would require additional navigation to the activity section
  return ['Recent posts data would require additional scraping'];
}

// Helper function to auto-scroll through the page to load all content
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight || totalHeight > 10000) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

// Helper function to expand "Show more" content
async function expandContent(page) {
  try {
    // Common "Show more" button selectors
    const showMoreSelectors = [
      'button[aria-label="Show more"]',
      'button[data-control-name="about_show_more"]',
      'button[data-control-name="experience_show_more"]',
      '.inline-show-more-text__button',
      '.pv-shared-text-with-see-more button',
      '.show-more-less-text__button'
    ];
    
    for (const selector of showMoreSelectors) {
      try {
        const buttons = await page.$$(selector);
        for (const button of buttons) {
          await button.click();
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait between clicks
        }
      } catch (error) {
        // Continue if selector doesn't exist
        console.log(`Selector ${selector} not found or unable to click`);
      }
    }
  } catch (error) {
    console.log('Error expanding content:', error.message);
  }
}

// Human-like scrolling function using ghost cursor
async function humanLikeScroll(page, cursor) {
  try {
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    let currentPosition = 0;
    const scrollStep = 200 + Math.floor(Math.random() * 100); // Random scroll step
    
    while (currentPosition < scrollHeight - 1000) {
      // Scroll to random position within next step
      const nextPosition = currentPosition + scrollStep + Math.floor(Math.random() * 50);
      await page.evaluate((pos) => {
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }, nextPosition);
      
      currentPosition = nextPosition;
      
      // Random delay between scrolls
      await page.waitForTimeout(randomDelay(500, 1500));
      
      // Sometimes move cursor randomly
      if (Math.random() < 0.3) {
        const x = 200 + Math.floor(Math.random() * 800);
        const y = 200 + Math.floor(Math.random() * 400);
        await cursor.move(x, y);
        await page.waitForTimeout(randomDelay(100, 300));
      }
    }
    
    console.log('🎯 Human-like scrolling completed');
  } catch (error) {
    console.log('⚠️  Error in human-like scrolling:', error.message);
    // Fallback to original scrolling
    await autoScroll(page);
  }
}

// Human-like content expansion with ghost cursor
async function humanLikeExpandContent(page, cursor) {
  try {
    const showMoreSelectors = [
      'button[aria-expanded="false"][data-control-name*="show_more"]',
      'button[aria-expanded="false"]:contains("Show more")',
      'button[aria-expanded="false"]:contains("see more")',
      '.inline-show-more-text__button',
      '.show-more-less-html__button--more'
    ];
    
    for (const selector of showMoreSelectors) {
      const elements = await page.$$(selector);
      
      for (let i = 0; i < Math.min(elements.length, 3); i++) { // Limit to 3 expansions per selector
        try {
          const element = elements[i];
          const box = await element.boundingBox();
          
          if (box) {
            // Move cursor to element with slight randomness
            const x = box.x + box.width / 2 + (Math.random() - 0.5) * 10;
            const y = box.y + box.height / 2 + (Math.random() - 0.5) * 10;
            
            await cursor.move(x, y);
            await page.waitForTimeout(randomDelay(300, 800));
            
            // Human-like click
            await cursor.click();
            console.log('🖱️  Clicked "Show more" button');
            
            // Wait for content to expand
            await page.waitForTimeout(randomDelay(1000, 2000));
          }
        } catch (e) {
          // Continue with other elements if one fails
          continue;
        }
      }
    }
    
    console.log('📖 Content expansion completed');
  } catch (error) {
    console.log('⚠️  Error in content expansion:', error.message);
    // Fallback to original expansion
    await expandContent(page);
  }
}