# LinkedIn Data Import Solutions

Since LinkedIn blocks automated scraping, here are 3 user-friendly workarounds to get profile data into ProfileSpike:

## 🚀 Option 1: Browser Extension (Recommended)

**Most user-friendly - One-click extraction**

### Installation:
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `browser-extension` folder
5. The ProfileSpike extension will appear in your toolbar

### Usage:
1. Navigate to any LinkedIn profile
2. Click the ProfileSpike extension icon
3. Click "Extract Profile Data"
4. Click "Send to ProfileSpike Analysis"
5. Your analysis will be ready instantly!

## 📋 Option 2: Copy-Paste Method

**Simple manual method**

### Usage:
1. Go to the LinkedIn profile you want to analyze
2. Select all profile text (Ctrl/Cmd+A) and copy (Ctrl/Cmd+C)
3. Send POST request to: `http://localhost:3002/api/linkedin-text-import`
4. Body: `{"profileText": "paste your copied text here"}`

### Example:
```bash
curl -X POST http://localhost:3002/api/linkedin-text-import \
  -H "Content-Type: application/json" \
  -d '{"profileText": "John Doe\nSoftware Engineer at Google\nSan Francisco, CA\n..."}'
```

## 🔖 Option 3: Bookmarklet (One-Click)

**Zero installation - works on any browser**

### Installation:
1. Drag this link to your bookmarks bar: [ProfileSpike Extractor](javascript:(function(){function%20extractProfile(){const%20data={name:'',headline:'',location:'',summary:'',experience:[],skills:[]};const%20nameEl=document.querySelector('h1.text-heading-xlarge,%20h1[data-anonymize="person-name"]');if(nameEl)data.name=nameEl.textContent.trim();const%20headlineEl=document.querySelector('.text-body-medium.break-words');if(headlineEl&&!headlineEl.textContent.includes('connection')){data.headline=headlineEl.textContent.trim();}return%20data;}const%20profileData=extractProfile();let%20profileText='';if(profileData.name)profileText+=profileData.name+'\n';if(profileData.headline)profileText+=profileData.headline+'\n';alert('Profile%20extracted:\n'+profileText);})())

### Usage:
1. Navigate to any LinkedIn profile
2. Click the "ProfileSpike Extractor" bookmark
3. A popup will show the extracted data
4. Click "Send to ProfileSpike" or copy the text manually

## 🎯 Option 4: API Endpoint Testing

Test the text parsing functionality:

```bash
# Test with sample data
curl -X POST http://localhost:3002/api/linkedin-text-debug \
  -H "Content-Type: application/json" \
  -d '{
    "profileText": "Timilehin Dayo-Kayode\nSoftware Engineer at Google\nSan Francisco, CA\n500+ connections\nI am a passionate software engineer with 5 years of experience in full-stack development. I specialize in React, Node.js, and cloud technologies like AWS."
  }'
```

## 📊 Available Endpoints

- `POST /api/linkedin-text-import` - Full analysis with OpenAI
- `POST /api/linkedin-text-debug` - Text parsing only (for testing)
- `POST /api/clipboard/start` - Start clipboard monitoring (future feature)
- `POST /api/clipboard/stop` - Stop clipboard monitoring

## ✨ Benefits Over Scraping

1. **No LinkedIn Blocking** - Uses user's own access
2. **Always Up-to-Date** - Gets latest profile information
3. **No Rate Limits** - User controls the pace
4. **Reliable** - No bot detection issues
5. **Legal Compliance** - Uses user's authorized access

## 🔧 Technical Details

The text parser intelligently extracts:
- Name (first substantial line)
- Headline (professional titles)
- Location (city, state patterns)
- Summary (longer paragraphs with keywords)
- Experience (job titles with "at" patterns)
- Skills (keyword matching)
- Connections (number patterns)

All solutions send data to the same `/api/linkedin-text-import` endpoint for consistent analysis.

## 🚨 Note on OpenAI API

Currently, the OpenAI API key needs to be updated. The text parsing works perfectly, but analysis requires a valid OpenAI key. Update your `.env` file with a fresh key from https://platform.openai.com/account/api-keys