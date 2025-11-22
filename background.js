// Flow detection AI logic using TensorFlow.js concepts
class FlowDetector {
  constructor() {
    this.features = [];
    this.flowState = 'neutral';
    this.threshold = 0.7;
  }

  // Enhanced flow detection with mouse tracking
  async detectFlow(metrics) {
    const {
      tabSwitchFreq,
      typingCadence,
      timeOnTask,
      distractionScore,
      mouseMovementScore,
      keystrokeFrequency
    } = metrics;

    // Improved weighted scoring
    const focusScore = (
      (1 - tabSwitchFreq) * 0.25 +        // Lower tab switching = better
      typingCadence * 0.20 +               // Consistent typing = better
      keystrokeFrequency * 0.20 +          // More keystrokes = better
      timeOnTask * 0.15 +                  // Longer time = better
      (1 - mouseMovementScore) * 0.10 +    // Less erratic movement = better
      (1 - distractionScore) * 0.10        // Productive sites = better
    );

    if (focusScore > 0.75) {
      this.flowState = 'deep_flow';
    } else if (focusScore > 0.55) {
      this.flowState = 'focused';
    } else if (focusScore > 0.35) {
      this.flowState = 'neutral';
    } else {
      this.flowState = 'distracted';
    }

    return {
      state: this.flowState,
      score: focusScore,
      timestamp: Date.now(),
      metrics: metrics
    };
  }

  getFocusMessage(score) {
    if (score > 0.75) {
      return "Excellent focus! You're in deep flow! 🔥";
    } else if (score > 0.55) {
      return "Great focus! Keep up the good work! 🎯";
    } else if (score > 0.35) {
      return "Moderate focus. Try minimizing distractions. 💡";
    } else {
      return "Low focus detected. Time to refocus! ⚠️";
    }
  }
}

// Enhanced Session tracking with mouse movements
class SessionTracker {
  constructor() {
    this.sessions = [];
    this.currentSession = this.createSession();
    this.tabSwitches = 0;
    this.lastTabId = null;
    this.lastActivity = Date.now();
    this.keystrokes = [];
    this.mouseMovements = [];
    this.lastMouseTime = Date.now();
  }

  createSession() {
    return {
      start: Date.now(),
      tabSwitches: 0,
      keystrokes: 0,
      mouseMovements: 0,
      productiveTime: 0,
      distractedTime: 0,
      flowStates: []
    };
  }

  recordTabSwitch(tabId) {
    if (this.lastTabId !== null && this.lastTabId !== tabId) {
      this.tabSwitches++;
      this.currentSession.tabSwitches++;
    }
    this.lastTabId = tabId;
    this.lastActivity = Date.now();
  }

  recordKeystroke() {
    const now = Date.now();
    this.keystrokes.push(now);
    this.currentSession.keystrokes++;
    this.lastActivity = now;
    
    // Keep only last 100 keystrokes for better cadence calculation
    if (this.keystrokes.length > 100) {
      this.keystrokes.shift();
    }
  }

  recordMouseMovement() {
    const now = Date.now();
    this.mouseMovements.push(now);
    this.currentSession.mouseMovements++;
    this.lastMouseTime = now;
    
    // Keep only last 100 movements
    if (this.mouseMovements.length > 100) {
      this.mouseMovements.shift();
    }
  }

  getTypingCadence() {
    if (this.keystrokes.length < 2) return 0;
    
    const intervals = [];
    for (let i = 1; i < this.keystrokes.length; i++) {
      intervals.push(this.keystrokes[i] - this.keystrokes[i - 1]);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;
    
    // Lower variance = more consistent typing = better focus
    return Math.max(0, 1 - Math.min(variance / 100000, 1));
  }

  getKeystrokeFrequency() {
    if (this.keystrokes.length < 2) return 0;
    
    const now = Date.now();
    const recentKeystrokes = this.keystrokes.filter(time => now - time < 60000); // Last minute
    
    // Normalize: 30+ keystrokes per minute = max score
    return Math.min(recentKeystrokes.length / 30, 1);
  }

  getMouseMovementScore() {
    if (this.mouseMovements.length < 2) return 0;
    
    const now = Date.now();
    const recentMovements = this.mouseMovements.filter(time => now - time < 60000); // Last minute
    
    // High movement frequency = distracted (normalize to 100 movements/min)
    return Math.min(recentMovements.length / 100, 1);
  }

  getMetrics() {
    const now = Date.now();
    const sessionDuration = (now - this.currentSession.start) / 1000 / 60; // minutes
    
    return {
      tabSwitchFreq: Math.min(this.currentSession.tabSwitches / Math.max(sessionDuration, 1) / 10, 1),
      typingCadence: this.getTypingCadence(),
      keystrokeFrequency: this.getKeystrokeFrequency(),
      timeOnTask: Math.min(sessionDuration / 30, 1),
      mouseMovementScore: this.getMouseMovementScore(),
      distractionScore: 0 // calculated by site categorization
    };
  }

  reset() {
    this.currentSession = this.createSession();
    this.tabSwitches = 0;
    this.keystrokes = [];
    this.mouseMovements = [];
  }
}

class AnalyticsLogger {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.events = [];
    this.maxEvents = 10000;
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  log(eventType, data = {}) {
    const event = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      isoTime: new Date().toISOString(),
      eventType,
      data
    };

    this.events.push(event);
    if (this.events.length > this.maxEvents) this.events.shift();
    this.persistEvent(event);
  }

  persistEvent(event) {
    chrome.storage.local.get(['analyticsLog'], (result) => {
      const log = result.analyticsLog || [];
      log.push(event);
      if (log.length > 5000) log.splice(0, log.length - 5000);
      chrome.storage.local.set({ analyticsLog: log });
    });
  }

  async getAllEvents() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['analyticsLog'], (result) => {
        resolve(result.analyticsLog || []);
      });
    });
  }

  getEventTypeCounts() {
    const counts = {};
    this.events.forEach(event => {
      counts[event.eventType] = (counts[event.eventType] || 0) + 1;
    });
    return counts;
  }

  getStatistics() {
    const duration = Date.now() - this.startTime;
    const durationMinutes = duration / 60000;
    return {
      sessionId: this.sessionId,
      sessionDuration: duration,
      totalEvents: this.events.length,
      eventTypes: this.getEventTypeCounts(),
      eventsPerMinute: durationMinutes > 0 ? (this.events.length / durationMinutes).toFixed(2) : 0
    };
  }

  async exportToJSON() {
    const events = await this.getAllEvents();
    return JSON.stringify({
      exportTime: new Date().toISOString(),
      sessionId: this.sessionId,
      sessionDuration: Date.now() - this.startTime,
      totalEvents: events.length,
      events
    }, null, 2);
  }

  async exportToCSV() {
    const events = await this.getAllEvents();
    if (events.length === 0) return 'No data to export';

    const headers = ['Timestamp', 'ISO Time', 'Session ID', 'Event Type', 'Data'];
    const rows = events.map(e => [
      e.timestamp,
      e.isoTime,
      e.sessionId,
      e.eventType,
      JSON.stringify(e.data)
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }

  async downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });
  }
}

// Distraction site checker
const distractingSites = [
  'facebook.com', 'instagram.com', 'twitter.com', 'x.com',
  'reddit.com', 'tiktok.com', 'youtube.com', 'netflix.com',
  'twitch.tv', 'pinterest.com', 'snapchat.com', 'linkedin.com'
];

const productiveSites = [
  'github.com', 'stackoverflow.com', 'docs.google.com',
  'notion.so', 'coursera.org', 'udemy.com', 'leetcode.com'
];

function categorizeUrl(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    
    if (distractingSites.some(site => hostname.includes(site))) {
      return 'distracting';
    }
    if (productiveSites.some(site => hostname.includes(site))) {
      return 'productive';
    }
    return 'neutral';
  } catch {
    return 'neutral';
  }
}

// Initialize
const flowDetector = new FlowDetector();
const sessionTracker = new SessionTracker();
const analytics = new AnalyticsLogger();
let blockedSites = [];
let isBlockingEnabled = true;

// Load settings
chrome.storage.local.get(['blockedSites', 'isBlockingEnabled'], (result) => {
  blockedSites = result.blockedSites || distractingSites;
  isBlockingEnabled = result.isBlockingEnabled !== false;
});

// Track tab switches
chrome.tabs.onActivated.addListener((activeInfo) => {
  sessionTracker.recordTabSwitch(activeInfo.tabId);
  updateFlowState();
  
  analytics.log('tab_activated', {
    tabId: activeInfo.tabId,
    windowId: activeInfo.windowId
  });
  
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab) {
      analytics.log('tab_details', {
        tabId: tab.id,
        url: tab.url,
        title: tab.title
      });
    }
  });
});

// Track navigation
chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId === 0) {
    const category = categorizeUrl(details.url);
    
    analytics.log('navigation_completed', {
      tabId: details.tabId,
      url: details.url,
      category
    });
    
    if (isBlockingEnabled && category === 'distracting') {
      const hostname = new URL(details.url).hostname;
      if (blockedSites.some(site => hostname.includes(site))) {
        analytics.log('site_blocked', {
          site: hostname,
          tabId: details.tabId
        });
        
        chrome.tabs.update(details.tabId, {
          url: chrome.runtime.getURL('blocked.html') + '?site=' + encodeURIComponent(hostname)
        });
      }
    }
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  analytics.log('message_received', {
    type: message.type,
    from: sender.tab ? 'content_script' : 'popup',
    tabId: sender.tab?.id
  });

  if (message.type === 'keystroke') {
    sessionTracker.recordKeystroke();
    updateFlowState();
    analytics.log('keystroke', {
      tabId: sender.tab?.id,
      url: sender.tab?.url
    });
  } else if (message.type === 'mouseMovement') {
    sessionTracker.recordMouseMovement();
    updateFlowState();
  } else if (message.type === 'getState') {
    chrome.storage.local.get(['flowHistory'], (result) => {
      const history = result.flowHistory || [];
      const latestFlow = history.length > 0 ? history[history.length - 1] : null;
      
      sendResponse({
        flowState: flowDetector.flowState,
        session: sessionTracker.currentSession,
        blockedSites,
        isBlockingEnabled,
        latestScore: latestFlow ? latestFlow.score : 0,
        focusMessage: latestFlow ? flowDetector.getFocusMessage(latestFlow.score) : 'Starting session...'
      });
    });
    return true;
  } else if (message.type === 'updateSettings') {
    const oldBlocking = isBlockingEnabled;
    const oldSites = [...blockedSites];
    
    if (message.blockedSites !== undefined) {
      blockedSites = message.blockedSites;
      chrome.storage.local.set({ blockedSites });
    }
    if (message.isBlockingEnabled !== undefined) {
      isBlockingEnabled = message.isBlockingEnabled;
      chrome.storage.local.set({ isBlockingEnabled });
    }
    
    analytics.log('settings_changed', {
      blockingChanged: oldBlocking !== isBlockingEnabled,
      newBlockingState: isBlockingEnabled,
      sitesChanged: JSON.stringify(oldSites) !== JSON.stringify(blockedSites)
    });
    
    sendResponse({ success: true });
  } else if (message.type === 'resetStats') {
    sessionTracker.reset();
    chrome.storage.local.set({ flowHistory: [] }, () => {
      analytics.log('stats_reset', {});
      sendResponse({ success: true });
    });
    return true;
  } else if (message.type === 'getAnalyticsStats') {
    sendResponse(analytics.getStatistics());
  } else if (message.type === 'getAnalyticsData') {
    analytics.getAllEvents().then(events => {
      sendResponse({
        events,
        eventTypes: analytics.getEventTypeCounts(),
        statistics: analytics.getStatistics()
      });
    });
    return true;
  } else if (message.type === 'exportAnalyticsJSON') {
    analytics.exportToJSON().then(json => {
      const filename = `flow-monitor-analytics-${Date.now()}.json`;
      analytics.downloadFile(json, filename, 'application/json');
      sendResponse({ success: true });
    });
    return true;
  } else if (message.type === 'exportAnalyticsCSV') {
    analytics.exportToCSV().then(csv => {
      const filename = `flow-monitor-analytics-${Date.now()}.csv`;
      analytics.downloadFile(csv, filename, 'text/csv');
      sendResponse({ success: true });
    });
    return true;
  } else if (message.type === 'clearAnalytics') {
    analytics.events = [];
    chrome.storage.local.set({ analyticsLog: [] });
    analytics.log('analytics_cleared', {});
    sendResponse({ success: true });
  }
  
  return true;
});

// Periodic flow state update
async function updateFlowState() {
  const metrics = sessionTracker.getMetrics();
  
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]) {
    const category = categorizeUrl(tabs[0].url);
    metrics.distractionScore = category === 'distracting' ? 0.8 : category === 'neutral' ? 0.4 : 0.1;
  }
  
  const oldState = flowDetector.flowState;
  const flowResult = await flowDetector.detectFlow(metrics);
  sessionTracker.currentSession.flowStates.push(flowResult);
  
  if (oldState !== flowResult.state) {
    analytics.log('flow_state_changed', {
      oldState,
      newState: flowResult.state,
      score: flowResult.score,
      metrics
    });
  }
  
  chrome.storage.local.get(['flowHistory'], (result) => {
    const history = result.flowHistory || [];
    history.push(flowResult);
    
    if (history.length > 1000) {
      history.splice(0, history.length - 1000);
    }
    
    chrome.storage.local.set({ flowHistory: history });
  });
}

// Update every 10 seconds for faster responsiveness
chrome.alarms.create('flowUpdate', { periodInMinutes: 0.167 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'flowUpdate') {
    updateFlowState();
  }
});

// Periodic analytics summary
setInterval(() => {
  analytics.log('periodic_summary', {
    statistics: analytics.getStatistics(),
    currentFlowState: flowDetector.flowState,
    sessionStats: {
      tabSwitches: sessionTracker.currentSession.tabSwitches,
      keystrokes: sessionTracker.currentSession.keystrokes,
      mouseMovements: sessionTracker.currentSession.mouseMovements
    }
  });
}, 5 * 60 * 1000);

// Lifecycle logging
chrome.runtime.onInstalled.addListener((details) => {
  analytics.log('extension_installed', {
    reason: details.reason,
    previousVersion: details.previousVersion
  });
});

chrome.runtime.onStartup.addListener(() => {
  analytics.log('extension_startup', {});
});

// Error tracking
self.addEventListener('error', (event) => {
  analytics.log('error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

console.log('Analytics logger initialized. Session ID:', analytics.sessionId);
console.log('Flow Monitor extension loaded');