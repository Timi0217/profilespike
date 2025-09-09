import { parseLinkedInText } from './linkedinScraper.js';
import { analyzeWithOpenAI } from './openaiService.js';

// Clipboard monitoring service for automatic LinkedIn profile detection
export class ClipboardMonitor {
  constructor() {
    this.lastClipboard = '';
    this.isMonitoring = false;
    this.onProfileDetected = null;
  }

  // Start monitoring clipboard for LinkedIn profile data
  startMonitoring(callback) {
    this.onProfileDetected = callback;
    this.isMonitoring = true;
    
    console.log('📋 Clipboard monitoring started - copy LinkedIn profile text to auto-analyze');
    
    // Check clipboard every 2 seconds
    this.intervalId = setInterval(() => {
      this.checkClipboard();
    }, 2000);
  }

  // Stop monitoring
  stopMonitoring() {
    this.isMonitoring = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    console.log('📋 Clipboard monitoring stopped');
  }

  // Check clipboard content
  async checkClipboard() {
    try {
      // For Node.js, we'll use a different approach
      // This is a simplified version - in production you'd use a proper clipboard library
      const clipboardContent = await this.getClipboardContent();
      
      if (clipboardContent && 
          clipboardContent !== this.lastClipboard && 
          this.looksLikeLinkedInProfile(clipboardContent)) {
        
        this.lastClipboard = clipboardContent;
        console.log('🔍 LinkedIn profile detected in clipboard');
        
        if (this.onProfileDetected) {
          this.onProfileDetected(clipboardContent);
        }
      }
    } catch (error) {
      // Silently handle clipboard access errors
    }
  }

  // Get clipboard content (platform-specific implementation needed)
  async getClipboardContent() {
    // This would need platform-specific implementation
    // For demo purposes, returning null
    // In production, you'd use libraries like 'clipboardy' or 'node-clipboard'
    return null;
  }

  // Check if text looks like a LinkedIn profile
  looksLikeLinkedInProfile(text) {
    if (!text || text.length < 50) return false;
    
    const indicators = [
      'linkedin.com',
      'connections',
      'experience',
      'skills',
      'education',
      'at ' // Common in job titles like "Engineer at Company"
    ];
    
    const lowerText = text.toLowerCase();
    const foundIndicators = indicators.filter(indicator => 
      lowerText.includes(indicator)
    ).length;
    
    return foundIndicators >= 2;
  }

  // Process detected LinkedIn profile
  async processProfile(profileText) {
    try {
      console.log('🔄 Processing auto-detected LinkedIn profile...');
      
      const profileData = parseLinkedInText(profileText);
      
      console.log('✅ Profile parsed:', {
        name: profileData.name,
        headline: profileData.headline
      });

      // Auto-analyze with OpenAI
      const analysis = await analyzeWithOpenAI(profileData, 'clipboard-auto');
      
      console.log('🎯 Auto-analysis completed');
      
      return {
        success: true,
        profileData,
        analysis,
        source: 'clipboard-auto'
      };
    } catch (error) {
      console.error('❌ Auto-processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Global clipboard monitor instance
let clipboardMonitor = null;

// API endpoints for clipboard monitoring
export function startClipboardMonitoring(callback) {
  if (!clipboardMonitor) {
    clipboardMonitor = new ClipboardMonitor();
  }
  
  clipboardMonitor.startMonitoring(async (profileText) => {
    const result = await clipboardMonitor.processProfile(profileText);
    if (callback) callback(result);
  });
  
  return clipboardMonitor;
}

export function stopClipboardMonitoring() {
  if (clipboardMonitor) {
    clipboardMonitor.stopMonitoring();
  }
}