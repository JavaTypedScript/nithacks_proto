// Blocked page JavaScript - External file to avoid CSP issues

const motivationalQuotes = [
  '"The secret of getting ahead is getting started." - Mark Twain',
  '"Focus is not about saying yes, it\'s about saying no." - Steve Jobs',
  '"Concentration is the secret of strength." - Ralph Waldo Emerson',
  '"The successful warrior is the average man, with laser-like focus." - Bruce Lee',
  '"Where focus goes, energy flows." - Tony Robbins'
];

function updateStats() {
  chrome.runtime.sendMessage({ type: 'getState' }, (response) => {
    if (response && response.session) {
      // Update tab switches with current session data
      document.getElementById('tabSwitches').textContent = response.session.tabSwitches || 0;
      
      // Calculate session time from session start
      const sessionMinutes = Math.floor((Date.now() - response.session.start) / 1000 / 60);
      document.getElementById('sessionTime').textContent = `${sessionMinutes}m`;
      
      // Get latest focus score
      const latestScore = response.latestScore || 0;
      document.getElementById('flowScore').textContent = `${Math.round(latestScore * 100)}%`;
    }
  });
}

function allowOnce() {
  // Temporarily disable blocking
  chrome.runtime.sendMessage({
    type: 'updateSettings',
    isBlockingEnabled: false
  }, () => {
    // Re-enable after 10 minutes
    setTimeout(() => {
      chrome.runtime.sendMessage({
        type: 'updateSettings',
        isBlockingEnabled: true
      });
    }, 10 * 60 * 1000);
    
    window.history.back();
  });
}

function goBack() {
  window.close();
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // Get blocked site from URL
  const params = new URLSearchParams(window.location.search);
  const site = params.get('site');
  if (site) {
    document.getElementById('siteName').textContent = site;
  }

  // Show random quote
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  document.getElementById('motivation').textContent = randomQuote;

  // Set up button event listeners
  document.getElementById('backToWork').onclick = goBack;
  document.getElementById('allowOnce').onclick = allowOnce;

  // Update stats immediately and every 2 seconds
  updateStats();
  setInterval(updateStats, 2000);
});