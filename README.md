Precious Metals App
React Native CLI · GoldAPI · Dark Mode UI

Overview

A React Native CLI mobile app that displays live prices of precious metals (Gold, Silver, Platinum, Palladium) using goldapi.io.
Built with a clean fintech UI, independent data fetching per metal, and smooth navigation between screens.

✨ Features
📊 Live metal prices (Gold, Silver, Platinum, Palladium)
🔄 Auto refresh every 30 seconds
⚡ Independent loading per metal (no global loader)
❌ Error handling with retry option
🎨 Premium dark mode UI
🧭 Navigation (Home → Details screen

📈 Detailed data:
Current price
Open price
Previous close
High / Low
Ask / Bid
⏱ Real-time timestamp updates
📱 Smooth animations & interactions

🛠 Tech Stack
React Native CLI
React Navigation v6
GoldAPI (REST API)
Axios / Fetch
React Hooks (useState, useEffect)
Animated API

📂 Folder Structure
src/
 ├── components/
 ├── screens/
 ├── services/
 ├── hooks/
 └── navigation/
🔌 API Used

Base URL: 
https://www.goldapi.io/api/:symbol/USD

Metals:
Gold → XA
Silver → XAG
Platinum → XPT
Palladium → XPD

importnent NOTE:

⚙️ Setup & Run
1. Install dependencies
npm install
2. Start Metro
npx react-native start
3. Run on Android
npx react-native run-android
🔑 API Key

Update API key in:

src/services/metalApi.js

⚠️ Note: API key is exposed for demo purposes only.
In production, it should be secured via backend.

📱 Screens

Home Screen → Metal cards with live prices
Details Screen → Full price breakdown

✅ Assignment Highlights
✔ React Native CLI implementation
✔ Navigation setup
✔ Live API integration
✔ Independent loading states
✔ Error handling & retry
✔ Clean UI & structured code

👨‍💻 Author
Boddu Shiva Sai(full-stack and react native develper- 1 year experience)
