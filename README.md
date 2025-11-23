# ShadeHub | The Underground Network

A "Dark Web" aesthetic social platform built with vanilla HTML/CSS/JS and Firebase. Designed for static hosting on GitHub Pages.

## 🚀 Deployment Instructions

### 1. GitHub Pages Hosting
1.  **Create a Repository**: Create a new public repository on GitHub.
2.  **Upload Files**: Push all files in this folder to the `main` branch.
3.  **Enable Pages**:
    - Go to **Settings** > **Pages**.
    - Under **Source**, select `main` branch and `/ (root)` folder.
    - Click **Save**.
4.  **Access**: Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

### 2. Firebase Configuration (CRITICAL)
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project.
3.  **Enable Authentication**:
    - Go to **Build** > **Authentication** > **Sign-in method**.
    - Enable **Email/Password**, **Anonymous**, and **Google**.
4.  **Enable Firestore**:
    - Go to **Build** > **Firestore Database**.
    - Create database (start in **Test Mode** for now, or use rules below).
5.  **Enable Storage** (Optional):
    - Go to **Build** > **Storage**.
    - Create a bucket.
6.  **Get Config**:
    - Go to **Project Settings** (gear icon).
    - Scroll to **Your apps** > **Web app**.
    - Copy the `firebaseConfig` object.
7.  **Update Code**:
    - Open `js/firebase.js`.
    - Replace the placeholder `firebaseConfig` with your actual config.
    - Commit and push the changes.

### 3. Security Rules
To secure your app, copy the contents of `firestore.rules` and `storage.rules` to the **Rules** tab in the Firebase Console for Firestore and Storage respectively.

## 📂 Folder Structure
```
/
├── index.html          # Main Feed
├── post.html           # Single Post View
├── profile.html        # User Profile
├── admin.html          # Admin Dashboard
├── firestore.rules     # DB Security Rules
├── storage.rules       # Storage Security Rules
├── css/
│   └── styles.css      # Global Styles
└── js/
    ├── app.js          # Main Entry Point
    ├── firebase.js     # Firebase Config
    ├── auth.js         # Authentication
    ├── posts.js        # Post Logic
    ├── comments.js     # Comment Logic
    └── ui.js           # UI Utilities
```

## 🛠 Features
- **Dark Web Aesthetic**: Matrix rain, glitch effects, neon styling.
- **Real-time Feed**: Posts appear instantly without refreshing.
- **Authentication**: Login via Email, Google, or stay Anonymous.
- **Comments**: Threaded discussions.
- **Responsive**: Works on mobile and desktop.

## ⚠️ Troubleshooting
- **404 Errors**: Ensure all file paths in `href` and `src` are relative (e.g., `js/app.js`, not `/js/app.js`).
- **Firebase Errors**: Check the browser console (F12). Ensure you added your GitHub Pages domain to **Authorized Domains** in Firebase Auth settings.
