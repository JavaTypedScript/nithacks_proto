# 🧠 Flow Monitor - Chrome Extension

AI-powered flow state detection and distraction blocker for Chrome.

## Features

✨ **AI Flow Detection**
- Lightweight TensorFlow.js-inspired flow detection algorithm
- Monitors tab switching frequency, typing cadence, and time on task
- Real-time flow state classification (Deep Flow, Focused, Neutral, Distracted)

📊 **Beautiful Dashboard**
- Live flow state visualization with charts
- Session statistics (tab switches, keystrokes, session time)
- Focus score tracking over time

🚫 **Smart Site Blocking**
- Blocks distracting websites (social media, streaming, etc.)
- Customizable blocked sites list
- Motivational blocked page with stats
- "Allow Once" feature for temporary access

🔄 **Background Monitoring**
- Always-on service worker tracks user behavior
- No performance impact on browsing
- Persistent data storage across sessions

## Installation

1. Download all files to a folder
2. Create placeholder icon files (or use any 16x16, 48x48, 128x128 PNG images):
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (top right)
5. Click "Load unpacked"
6. Select the folder containing the extension files

## Files Structure

```
flow-monitor/
├── manifest.json          # Extension configuration
├── background.js          # AI logic & monitoring
├── content.js            # Keystroke tracking
├── popup.html            # Dashboard UI
├── popup.js              # Dashboard logic & charts
├── blocked.html          # Blocked site page
├── icon16.png           # Extension icon (16x16)
├── icon48.png           # Extension icon (48x48)
└── icon128.png          # Extension icon (128x128)
```

## How It Works

### Flow Detection Algorithm

The extension uses a lightweight machine learning-inspired approach:

1. **Feature Extraction**:
   - Tab switch frequency (lower = better focus)
   - Typing cadence consistency (more consistent = better focus)
   - Time on task (longer = better focus)
   - Distraction score (based on website category)

2. **Flow State Classification**:
   - **Deep Flow** (75%+): Sustained focus, minimal distractions
   - **Focused** (50-75%): Good concentration, some interruptions
   - **Neutral** (30-50%): Mixed focus and distraction
   - **Distracted** (<30%): High distraction, poor focus

3. **Continuous Monitoring**:
   - Updates every 30 seconds
   - Stores flow history for visualization
   - Tracks session statistics

## Demo Tips

Perfect for showing judges:

1. **Initial State**: Open extension → shows "Neutral" state
2. **Demonstrate Blocking**: Try visiting YouTube/Facebook → see block page
3. **Show Flow Detection**: Type actively in a productive site (GitHub, Docs) → flow state improves
4. **Tab Switching**: Switch tabs frequently → flow state decreases
5. **Dashboard**: View real-time charts and statistics
6. **Customization**: Add/remove blocked sites, toggle blocking on/off

## Default Blocked Sites

- facebook.com, instagram.com, twitter.com, x.com
- reddit.com, tiktok.com, youtube.com, netflix.com
- twitch.tv, pinterest.com, snapchat.com, linkedin.com

## Customization

- **Add Sites**: Type domain in popup → click "Add"
- **Remove Sites**: Click "Remove" next to any site
- **Toggle Blocking**: Use the switch in popup
- **Reset Stats**: Click "Reset Today's Stats"

## Technical Details

- **No external dependencies** (pure JavaScript)
- **Lightweight**: Minimal memory footprint
- **Privacy-focused**: All data stored locally
- **No API calls**: Completely offline
- **Manifest V3**: Latest Chrome extension standard

## Perfect for Students

- Monitors study sessions automatically
- Blocks social media during focus time
- Tracks productivity patterns
- Gamifies focus with flow states
- No installation friction (load unpacked)

## License

MIT License - Feel free to modify and distribute!