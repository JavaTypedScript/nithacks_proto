// Dashboard JavaScript - External file to avoid CSP issues

const flowStateConfig = {
  'deep_flow': { icon: '🔥', label: 'Deep Flow', color: '#10b981' },
  'focused': { icon: '🎯', label: 'Focused', color: '#3b82f6' },
  'neutral': { icon: '😐', label: 'Neutral', color: '#f59e0b' },
  'distracted': { icon: '😵', label: 'Distracted', color: '#ef4444' }
};

function updateDashboard() {
  // Get current state
  chrome.runtime.sendMessage({ type: 'getState' }, (response) => {
    if (!response) return;

    const { flowState, session, latestScore, focusMessage } = response;
    const config = flowStateConfig[flowState] || flowStateConfig['neutral'];

    // Update current flow state
    document.getElementById('currentFlowIcon').textContent = config.icon;
    document.getElementById('currentFlowState').textContent = config.label;
    document.getElementById('currentFlowMessage').textContent = focusMessage || 'Analyzing...';
    
    const scorePercent = Math.round((latestScore || 0) * 100);
    document.getElementById('flowProgress').style.width = scorePercent + '%';

    // Update session stats
    document.getElementById('dashTabSwitches').textContent = session.tabSwitches || 0;
    document.getElementById('dashKeystrokes').textContent = session.keystrokes || 0;
    document.getElementById('dashMouseMovements').textContent = session.mouseMovements || 0;
    
    const sessionMinutes = Math.floor((Date.now() - session.start) / 1000 / 60);
    document.getElementById('dashSessionTime').textContent = `${sessionMinutes}m`;

    // Calculate average focus score
    const avgScore = session.flowStates.length > 0
      ? session.flowStates.reduce((sum, s) => sum + s.score, 0) / session.flowStates.length
      : 0;
    const avgPercent = Math.round(avgScore * 100);
    document.getElementById('avgFocusScore').textContent = `${avgPercent}%`;
    document.getElementById('avgFocusProgress').style.width = avgPercent + '%';
    
    let description = 'Needs improvement';
    if (avgScore > 0.75) description = 'Excellent focus!';
    else if (avgScore > 0.55) description = 'Good focus';
    else if (avgScore > 0.35) description = 'Moderate focus';
    document.getElementById('focusScoreDescription').textContent = description;

    // Update flow timeline
    chrome.storage.local.get(['flowHistory'], (result) => {
      const history = result.flowHistory || [];
      const timeline = document.getElementById('flowTimeline');
      timeline.innerHTML = '';

      history.slice(-200).forEach((flow, index) => {
        const block = document.createElement('div');
        block.className = `flow-block ${flow.state}`;
        block.title = `${flowStateConfig[flow.state].label}: ${Math.round(flow.score * 100)}%`;
        timeline.appendChild(block);
      });
    });
  });

  // Get analytics stats
  chrome.runtime.sendMessage({ type: 'getAnalyticsStats' }, (stats) => {
    if (stats) {
      document.getElementById('dashTotalEvents').textContent = stats.totalEvents;
      
      const durationMin = Math.floor(stats.sessionDuration / 60000);
      document.getElementById('dashSessionDuration').textContent = `${durationMin}m`;
      
      document.getElementById('dashEventsPerMin').textContent = stats.eventsPerMinute;
    }
  });

  // Get recent events
  chrome.runtime.sendMessage({ type: 'getAnalyticsData' }, (data) => {
    if (data && data.events) {
      const eventLog = document.getElementById('recentEvents');
      eventLog.innerHTML = '';

      const recentEvents = data.events.slice(-20).reverse();
      
      if (recentEvents.length === 0) {
        eventLog.innerHTML = '<p style="opacity: 0.7;">No events logged yet.</p>';
        return;
      }

      recentEvents.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-item';
        
        const time = new Date(event.timestamp).toLocaleTimeString();
        const dataStr = JSON.stringify(event.data, null, 2);
        
        eventDiv.innerHTML = `
          <div class="event-time">${time}</div>
          <div class="event-type">Type: ${event.eventType}</div>
          <div class="event-data">${dataStr}</div>
        `;
        
        eventLog.appendChild(eventDiv);
      });
    }
  });
}

function exportJSON() {
  chrome.runtime.sendMessage({ type: 'exportAnalyticsJSON' }, (response) => {
    if (response && response.success) {
      alert('JSON report downloaded successfully!');
    }
  });
}

function exportCSV() {
  chrome.runtime.sendMessage({ type: 'exportAnalyticsCSV' }, (response) => {
    if (response && response.success) {
      alert('CSV report downloaded successfully!');
    }
  });
}

function refreshDashboard() {
  updateDashboard();
}

function clearData() {
  if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
    chrome.runtime.sendMessage({ type: 'clearAnalytics' }, () => {
      chrome.runtime.sendMessage({ type: 'resetStats' }, () => {
        updateDashboard();
        alert('All data cleared successfully!');
      });
    });
  }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  // Set up button event listeners
  document.querySelector('button[onclick="exportJSON()"]').onclick = exportJSON;
  document.querySelector('button[onclick="exportCSV()"]').onclick = exportCSV;
  document.querySelector('button[onclick="refreshDashboard()"]').onclick = refreshDashboard;
  document.querySelector('button[onclick="clearData()"]').onclick = clearData;
  
  // Update dashboard immediately and every 2 seconds
  updateDashboard();
  setInterval(updateDashboard, 2000);
});