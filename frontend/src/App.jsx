// Joshua Pianto 9/4/2025

import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [clicks, setClicks] = useState(0);
  const [backendMessage, setBackendMessage] = useState("");
  const [counterColor, setCounterColor] = useState("#1e3a8a"); // default

  // watch for login/logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setClicks(userSnap.data().clicks || 0);
        } else {
          await setDoc(userRef, { clicks: 0 });
          setClicks(0);
        }
      } else {
        setClicks(0);
      }
    });

    return () => unsubscribe();
  }, []);

  // auth handlers
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  // click handler with random color
  const handleClick = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { clicks: clicks + 1 });
    setClicks(clicks + 1);

    // random color each click
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setCounterColor(randomColor);
  };

  // call backend /whoami
  const callBackend = async () => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(
        "https://miniapp-backend-466493083919.us-central1.run.app/whoami",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setBackendMessage(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(err);
      setBackendMessage("Error calling backend");
    }
  };

  // ---------------- UI ----------------
  return !user ? (
    /* ---------- Logged OUT (centered card + welcome image) ---------- */
    <div className="page center-page">
      <div className="card auth-card">
        {/* Welcome image + title */}
        <img src="/welcome.png" alt="Welcome" className="hero" />
        <h1>Welcome</h1>
        <p>Sign in or create an account to start tracking your clicks.</p>

        {/* Auth form */}
        <div className="form">
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="row" style={{ marginTop: 8 }}>
            <button className="btn primary" onClick={handleLogin}>
              Sign In
            </button>
            <button className="btn" onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    /* ---------- Logged IN (photo background + overlay card) ---------- */
    <div className="page authed-page">
      <div className="card click-card">
        <h2>Welcome back, {user.email}</h2>

        {/* counter with random color */}
        <div className="counter" style={{ color: counterColor }}>
          {clicks}
        </div>

        <div className="row">
          <button className="btn primary" onClick={handleClick}>
            Click Me!
          </button>
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
          <button className="btn" onClick={callBackend}>
            Call Backend
          </button>
        </div>

        {backendMessage && <pre>{backendMessage}</pre>}
      </div>
    </div>
  );
}

export default App;

