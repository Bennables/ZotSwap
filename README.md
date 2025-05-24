# ZotSwap

A Tinder-like application that helps UCI students connect and trade skills — whether it's tutoring, lifting, graphic design, or anything else you'd love to swap.

---

## Prerequisites

Before you can run the project, ensure the following are installed:

- **Node.js** (LATEST version recommended)
- **npm** (comes with Node.js)
- **Expo Go** (Download from App Store or Google Play for mobile demoing)

---

## Project Structure

The project consists of a single codebase using React Native and Firebase:

- **`zotswap/`**: React Native app with Expo and Firebase integration

---

## Setup Instructions

Navigate to the project directory:

cd ZotSwap


### Cloning the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/Jollibuilders/ZotSwap.git

### App Setup
1. Install dependencies:

```bash
npm install

2. Start the development server:

```bash
npx expo start

3. Open the app on your device:
Scan the QR code using Expo Go (iOS or Android)
Or run on a simulator (iOS/Android) via Expo Dev Tools

### Environment Variables Setup
Create the .env file:

At the root of the zotswap/ directory, create a .env file. This file will store your Firebase API keys and other secrets.

### Example:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
Add .env to .gitignore:

Prevent sensitive information from being pushed to GitHub by adding this to your .gitignore:

# Ignore environment variables file
.env
TOOLS AND TECHNOLOGIES

###Frontend:
   React Native
   Expo
   Tailwind CSS (via NativeWind)

###Backend / Services:
   Firebase Authentication
   Firebase Firestore 
   Firebase Storage 
