# Mini Web App – Firebase + React + Cloud Run

A tiny full-stack project by Joshua Pianto that demonstrates:
- **Frontend**: React (Vite)
- **Auth**: Firebase Authentication (email/password)
- **Tracking**: per-user click counts in Firestore
- **Usage display**: each user sees their own stats
- **Backend**: Node.js/Express deployed to Cloud Run
- **Hosting**: Firebase Hosting for the frontend

---

## Live URLs
- **Frontend (React on Firebase Hosting)**: https://web-app-dd054.web.app
- **Backend (Cloud Run API)**: https://miniapp-backend-466493083919.us-central1.run.app/whoami

## Tech Stack
- **Frontend**: React (Vite), Firebase SDK
- **Authentication**: Firebase Auth (email/password)
- **Database**: Firestore (per-user docs)
- **Backend**: Node.js + Express + firebase-admin
- **Hosting**:
  - Frontend → Firebase Hosting
  - Backend → Google Cloud Run

## Project Structure
```
frontend/    → React app
backend/     → Express API
firebase.json → Firebase Hosting config
```

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/Jpianto/Web-App-Using-Firebase-and-Cloud.git
cd Web-App-Using-Firebase-and-Cloud
```
### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/` with your Firebase config:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
VITE_API_BASE_URL=https://miniapp-backend-466493083919.us-central1.run.app
```

Run locally:

```bash
npm run dev
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Run locally:

```bash
npm run dev
```

---

## Deployment Steps

### Backend → Cloud Run

```bash
gcloud builds submit --tag gcr.io/web-app-dd054/miniapp-backend
gcloud run deploy miniapp-backend   --image gcr.io/web-app-dd054/miniapp-backend   --platform managed   --region us-central1   --allow-unauthenticated
```

### Frontend → Firebase Hosting

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

---

## Security Notes

- **Authentication**: Firebase email/password.
- **Firestore Rules**: Users can only access their own doc at `/users/{uid}`.

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```
- **Backend Security**:
  - `/whoami` verifies Firebase ID tokens using firebase-admin.
  - Requests without valid tokens are rejected.

- **CORS**: Configured to only allow requests from:
  - http://localhost:5173 (local dev)
  - https://web-app-dd054.web.app (live site)
  ## ✨ Extra Features

- Added background images for login and click pages for a cleaner look.
- Welcome banner image on login page to improve user experience.
- Randomized color effect on click counter for visual feedback.
