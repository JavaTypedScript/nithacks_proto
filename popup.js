// Popup UI logic with Chart.js-like visualization

// Simple chart drawing
class MiniChart {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.data = [];
  }

  draw(dataPoints) {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (dataPoints.length < 2) return;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Prepare data
    const maxPoints = 60; // Last 60 data points
    const points = dataPoints.slice(-maxPoints);
    const stepX = width / (points.length - 1);

    // Draw area
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(0, height);

    points.forEach((point, i) => {
      const x = i * stepX;
      const y = height - (point.score * height);
      if (i === 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    points.forEach((point, i) => {
      const x = i * stepX;
      const y = height - (point.score * height);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw dots
    ctx.fillStyle = '#fff';
    points.forEach((point, i) => {
      const x = i * stepX;
      const y = height - (point.score * height);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

// Initialize chart
const canvas = document.getElementById('flowChart');
canvas.width = 410;
canvas.height = 150;
const chart = new MiniChart(canvas);

// Flow state icons and colors
const flowStateConfig = {
  'deep_flow': { icon: '🔥', label: 'Deep Flow', color: '#10b981' },
  'focused': { icon: '🎯', label: 'Focused', color: '#3b82f6' },
  'neutral': { icon: '😐', label: 'Neutral', color: '#f59e0b' },
  'distracted': { icon: '😵', label: 'Distracted', color: '#ef4444' }
};

// Update UI
async function updateUI() {
  chrome.runtime.sendMessage({ type: 'getState' }, (response) => {
    if (!response) return;

    const { flowState, session, blockedSites, isBlockingEnabled, latestScore, focusMessage } = response;

    // Update flow status
    const config = flowStateConfig[flowState] || flowStateConfig['neutral'];
    document.getElementById('flowIcon').textContent = config.icon;
    document.getElementById('flowState').textContent = config.label;
    
    // Get latest flow score
    chrome.storage.local.get(['flowHistory'], (result) => {
      const history = result.flowHistory || [];
      const currentScore = latestScore || (history.length > 0 ? history[history.length - 1].score : 0);
      
      document.getElementById('flowScore').textContent = 
        `Focus Score: ${Math.round(currentScore * 100)}%`;
      
      // Update focus message with styling
      const messageEl = document.getElementById('focusMessage');
      messageEl.textContent = focusMessage || 'Starting session...';
      
      // Remove all classes
      messageEl.classList.remove('low', 'medium', 'high');
      
      // Add appropriate class based on score
      if (currentScore < 0.35) {
        messageEl.classList.add('low');
      } else if (currentScore < 0.55) {
        messageEl.classList.add('medium');
      } else {
        messageEl.classList.add('high');
      }
      
      // Update chart
      if (history.length > 0) {
        chart.draw(history);
      }
    });

    // Update stats
    document.getElementById('tabSwitches').textContent = session.tabSwitches;
    document.getElementById('keystrokes').textContent = session.keystrokes;
    
    const sessionMinutes = Math.floor((Date.now() - session.start) / 1000 / 60);
    document.getElementById('sessionTime').textContent = `${sessionMinutes}m`;
    
    // Calculate average focus score
    const avgScore = session.flowStates.length > 0
      ? session.flowStates.reduce((sum, s) => sum + s.score, 0) / session.flowStates.length
      : 0;
    document.getElementById('focusScore').textContent = `${Math.round(avgScore * 100)}%`;

    // Update blocking toggle
    const toggle = document.getElementById('blockingToggle');
    if (isBlockingEnabled) {
      toggle.classList.add('active');
    } else {
      toggle.classList.remove('active');
    }

    // Update blocked sites list
    renderBlockedSites(blockedSites);
  });

  // Update analytics
  chrome.runtime.sendMessage({ type: 'getAnalyticsStats' }, (stats) => {
    if (stats) {
      document.getElementById('totalEvents').textContent = stats.totalEvents;
      
      const durationMin = Math.floor(stats.sessionDuration / 60000);
      document.getElementById('sessionDuration').textContent = `${durationMin}m`;
      
      document.getElementById('eventsPerMin').textContent = stats.eventsPerMinute;
    }
  });
}

function renderBlockedSites(sites) {
  const list = document.getElementById('siteList');
  list.innerHTML = '';
  
  sites.forEach(site => {
    const item = document.createElement('div');
    item.className = 'site-item';
    item.innerHTML = `
      <span>${site}</span>
      <button class="remove-btn" data-site="${site}">Remove</button>
    `;
    list.appendChild(item);
  });

  // Add event listeners for remove buttons
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const site = btn.dataset.site;
      const newSites = sites.filter(s => s !== site);
      chrome.runtime.sendMessage({
        type: 'updateSettings',
        blockedSites: newSites
      }, () => updateUI());
    });
  });
}

// Event listeners
document.getElementById('blockingToggle').addEventListener('click', function() {
  this.classList.toggle('active');
  const isEnabled = this.classList.contains('active');
  chrome.runtime.sendMessage({
    type: 'updateSettings',
    isBlockingEnabled: isEnabled
  });
});

document.getElementById('addSite').addEventListener('click', () => {
  const input = document.getElementById('newSite');
  const site = input.value.trim();
  
  if (site) {
    chrome.runtime.sendMessage({ type: 'getState' }, (response) => {
      if (response && response.blockedSites) {
        const newSites = [...response.blockedSites, site];
        chrome.runtime.sendMessage({
          type: 'updateSettings',
          blockedSites: newSites
        }, () => {
          input.value = '';
          updateUI();
        });
      }
    });
  }
});

document.getElementById('newSite').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('addSite').click();
  }
});

document.getElementById('resetStats').addEventListener('click', () => {
  if (confirm('Reset all statistics for today?')) {
    chrome.runtime.sendMessage({ type: 'resetStats' }, () => {
      updateUI();
    });
  }
});

document.getElementById('exportJSON').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'exportAnalyticsJSON' }, (response) => {
    if (response && response.success) {
      // Show success feedback
      const btn = document.getElementById('exportJSON');
      const originalText = btn.textContent;
      btn.textContent = '✓ Exported!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    }
  });
});

document.getElementById('exportCSV').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'exportAnalyticsCSV' }, (response) => {
    if (response && response.success) {
      // Show success feedback
      const btn = document.getElementById('exportCSV');
      const originalText = btn.textContent;
      btn.textContent = '✓ Exported!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    }
  });
});

document.getElementById('viewDashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
});

// Update UI immediately and every 1 second for fast responsiveness
updateUI();
setInterval(updateUI, 1000);