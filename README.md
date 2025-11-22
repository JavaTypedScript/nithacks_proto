# 🧠 Flow Monitor v2.0 - Chrome Extension

AI-powered flow state detection and distraction blocker with comprehensive analytics dashboard.

## 🆕 What's New in v2.0

### Major Improvements:
- ✅ **Fixed Stats Reset**: Stats now properly reset when you click "Reset Stats" - no more persistent data on blocked pages
- 🎯 **Enhanced Focus Detection**: More accurate focus percentage using:
  - Mouse movement tracking (high movement = distracted)
  - Keystroke frequency (more typing = focused)
  - Tab switching patterns (frequent switches = distracted)
  - Improved typing cadence analysis
- 💬 **Smart Focus Messages**: Real-time contextual messages based on your focus level
- ⚡ **Faster Updates**: Dashboard updates every 1 second for immediate feedback
- 📊 **Full Analytics Dashboard**: New comprehensive dashboard with visual charts and insights
- 📥 **Report Downloads**: Export your analytics as JSON or CSV files

## Features

### ✨ **Enhanced AI Flow Detection**
- Multi-factor flow state analysis:
  - Tab switching frequency (25% weight)
  - Typing cadence consistency (20% weight)
  - Keystroke frequency (20% weight)
  - Time on task (15% weight)
  - Mouse movement patterns (10% weight)
  - Site categorization (10% weight)
- Real-time flow state classification (Deep Flow, Focused, Neutral, Distracted)
- Contextual focus messages with color-coded alerts

### 📊 **Comprehensive Analytics Dashboard**
- Visual flow state timeline with 200+ data points
- Real-time session statistics
- Event logging and tracking
- Detailed activity log
- Export reports as JSON or CSV
- Session performance metrics

### 🚫 **Smart Site Blocking**
- Blocks distracting websites (social media, streaming, etc.)
- Customizable blocked sites list
- Motivational blocked page with real-time stats
- "Allow Once" feature for temporary access (10 minutes)

### 🎨 **Beautiful UI**
- Modern gradient design
- Real-time visualizations
- Focus score tracking with progress bars
- Color-coded focus messages
- Smooth animations and transitions

## Installation

1. Download all files to a folder:
   - background.js
   - content.js
   - popup.html
   - popup.js
   - blocked.html
   - dashboard.html
   - manifest.json

2. Create an `icons` folder and add placeholder icon files (or use any PNG images):
   - `icons/icon16.png` (16x16)
   - `icons/icon48.png` (48x48)
   - `icons/icon128.png` (128x128)

3. Open Chrome and go to `chrome://extensions/`

4. Enable "Developer mode" (top right toggle)

5. Click "Load unpacked"

6. Select the folder containing the extension files

## Files Structure

```
flow-monitor/
├── manifest.json          ✅ Updated with new resources
├── background.js          ✅ Already working
├── content.js            ✅ Already working
├── popup.html            ✅ Already working
├── popup.js              ✅ Fixed "Add Site" functionality
├── blocked.html          ✅ Removed inline scripts
├── blocked.js            ✅ NEW - External scripts
├── dashboard.html        ✅ Removed inline scripts
├── dashboard.js          ✅ NEW - External scripts
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## How It Works

### Enhanced Flow Detection Algorithm

The extension uses a sophisticated multi-factor approach:

1. **Feature Extraction**:
   - **Tab switch frequency** (25%): Lower = better focus
   - **Typing cadence** (20%): More consistent = better focus
   - **Keystroke frequency** (20%): More keystrokes = more engaged
   - **Time on task** (15%): Longer sessions = deeper focus
   - **Mouse movement** (10%): Less erratic movement = better focus
   - **Site category** (10%): Productive sites = better focus

2. **Flow State Classification**:
   - **Deep Flow** (75%+): "Excellent focus! You're in deep flow! 🔥"
   - **Focused** (55-75%): "Great focus! Keep up the good work! 🎯"
   - **Neutral** (35-55%): "Moderate focus. Try minimizing distractions. 💡"
   - **Distracted** (<35%): "Low focus detected. Time to refocus! ⚠️"

3. **Real-Time Monitoring**:
   - Updates every 10 seconds for accurate tracking
   - UI updates every 1 second for immediate feedback
   - Stores last 1000 flow state entries
   - Tracks up to 5000 analytics events

### Focus Score Calculation

The focus percentage is calculated using:
- ✅ More keystrokes = Higher score
- ❌ High tab switching = Lower score
- ❌ Erratic mouse movements = Lower score
- ✅ Consistent typing rhythm = Higher score
- ✅ Time spent on productive sites = Higher score

## Using the Extension

### Main Popup
1. Click the extension icon to view current state
2. See real-time focus score and session stats
3. View flow state timeline chart
4. Toggle site blocking on/off
5. Add/remove blocked sites
6. Export analytics reports

### Full Dashboard
1. Click "View Dashboard" button in popup
2. Opens comprehensive analytics page
3. View detailed flow timeline (200+ points)
4. See complete session statistics
5. Review recent activity log
6. Download JSON or CSV reports

### Blocked Page
- Shows when you visit a blocked site
- Displays current focus score
- Shows tab switches and session time
- "Back to Work" returns to previous page
- "Allow Once" temporarily disables blocking (10 min)

## Default Blocked Sites

- Social Media: facebook.com, instagram.com, twitter.com, x.com
- Entertainment: reddit.com, tiktok.com, youtube.com, netflix.com
- Streaming: twitch.tv
- Other: pinterest.com, snapchat.com, linkedin.com

## Customization

### Add Sites
Type domain in popup → click "Add"

### Remove Sites
Click "Remove" next to any site

### Toggle Blocking
Use the switch in popup or temporarily allow with "Allow Once"

### Reset Stats
Click "Reset Stats" to clear all session data and start fresh

### Export Data
Click "Export JSON" or "Export CSV" to download your analytics

## Analytics Features

### What's Tracked
- Tab activations and switches
- Navigation events
- Keystroke patterns
- Mouse movements
- Flow state changes
- Site blocking events
- Settings changes

### Reports Include
- Session ID and duration
- Total events logged
- Event type breakdown
- Timestamped activity log
- Flow state history
- Performance metrics

## Technical Details

- **No external dependencies** (pure JavaScript)
- **Lightweight**: Minimal memory footprint (~5MB)
- **Privacy-focused**: All data stored locally
- **No API calls**: Completely offline
- **Manifest V3**: Latest Chrome extension standard
- **Real-time updates**: 1-second UI refresh rate

## Perfect for Students & Professionals

- 📚 Monitor study sessions automatically
- 🚫 Block social media during focus time
- 📈 Track productivity patterns over time
- 🎮 Gamifies focus with flow states
- 📊 Analyze detailed performance reports
- ⚡ Get instant feedback on focus level
- 💯 Improve concentration habits

## Troubleshooting

### Stats not resetting?
- The extension now properly resets all session data
- Click "Reset Stats" to clear everything
- Refresh blocked pages to see updated stats

### Focus percentage seems wrong?
- Make sure you're actively typing (not just reading)
- Avoid excessive tab switching
- Minimize mouse movements
- Stay on productive sites

### Dashboard not showing data?
- Give it a few minutes to collect data
- Make sure you're browsing with the extension enabled
- Check that site blocking is active

## Updates & Support

Report issues or suggest features by providing feedback!

## License

MIT License - Feel free to modify and distribute!

---

**Version 2.0** | Built with ❤️ for productivity enthusiasts
