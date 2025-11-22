// Content script - tracks user interactions
let lastKeystroke = 0;
let lastMouseMove = 0;
const keystrokeThrottle = 500; // ms
const mouseMoveThrottle = 1000; // ms

// Track keystrokes
document.addEventListener('keydown', () => {
  const now = Date.now();
  if (now - lastKeystroke > keystrokeThrottle) {
    chrome.runtime.sendMessage({ type: 'keystroke' });
    lastKeystroke = now;
  }
}, true);

// Track mouse movements
document.addEventListener('mousemove', () => {
  const now = Date.now();
  if (now - lastMouseMove > mouseMoveThrottle) {
    chrome.runtime.sendMessage({ type: 'mouseMovement' });
    lastMouseMove = now;
  }
}, true);