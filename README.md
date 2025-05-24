<<<<<<< HEAD
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
=======
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
<<<<<<< HEAD
>>>>>>> db4fa91d04ddc30ceb46b91f4273d6a53902bcab
=======

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
>>>>>>> 5f94cadae617a4f39251643a0a67d1836ded75fc
