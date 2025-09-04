# Mini Web App – Firebase + React + Cloud Run by Joshua Pianto 

A tiny full-stack project that demonstrates:  
- **Frontend** with React (Vite)  
- **Auth** with Firebase Authentication (email/password)  
- **Tracking** per-user click counts in Firestore  
- **Usage display** so each user sees their own stats  
- **Backend** with Node.js/Express deployed to Cloud Run  
- **Hosting** with Firebase Hosting for the frontend  

---

## 🚀 Live URLs  
- **Frontend (React on Firebase Hosting)**: [https://web-app-dd054.web.app](https://web-app-dd054.web.app)  
- **Backend (Cloud Run)**: [https://miniapp-backend-466493083919.us-central1.run.app](https://miniapp-backend-466493083919.us-central1.run.app)  

---

## 🛠️ Tech Stack  
- **Frontend**: React (Vite), Firebase SDK  
- **Auth**: Firebase Authentication (email/password)  
- **Database**: Firestore (per-user docs)  
- **Backend**: Node.js + Express + firebase-admin  
- **Hosting**:  
  - Frontend → Firebase Hosting  
  - Backend → Google Cloud Run  

---

## 📂 Project Structure  
```
frontend/   → React app
backend/    → Express API
firebase.json → Hosting config
```

---

## ⚙️ Setup Instructions  

### 1. Clone the repo  
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Frontend Setup  
```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/` and add your Firebase config:  

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

## 🌐 Deployment Steps  

### Backend → Cloud Run  
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/miniapp-backend
gcloud run deploy miniapp-backend \
  --image gcr.io/PROJECT_ID/miniapp-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Frontend → Firebase Hosting  
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

---

## 🔒 Security Notes  
- **Auth**: Email/password via Firebase Authentication  
- **Firestore Rules**: Each user can only read/write their own doc at `/users/{uid}`  

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

- **Backend**: `/whoami` verifies Firebase ID tokens with firebase-admin  
- **CORS**: Enabled for simplicity (in production, restrict to Hosting domain)  

---


