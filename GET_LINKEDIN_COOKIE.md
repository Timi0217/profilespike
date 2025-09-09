# How to Get Fresh LinkedIn Session Cookie

## Steps:
1. **Log into LinkedIn** in your browser (chrome/safari)
2. **Open Developer Tools** (F12 or Right-click → Inspect)
3. **Go to Application/Storage tab**
4. **Find Cookies** → click on `https://www.linkedin.com`
5. **Copy the `li_at` cookie value**
6. **Update your .env file**:
   ```
   LINKEDIN_SESSION_COOKIE=your_new_cookie_here
   ```

## Alternative - Get from Network Tab:
1. Visit LinkedIn profile page
2. Open Developer Tools → Network tab
3. Refresh page
4. Click on the main request to linkedin.com
5. Copy the `Cookie` header value containing `li_at=...`

Your current cookie starts with: `AQEDARlcIrkCHrfOAAAB...`
If this is old (>30 days), it needs updating.