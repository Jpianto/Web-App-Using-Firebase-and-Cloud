import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getIdToken,  // ✅ new import
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clicks, setClicks] = useState(0);
  const [backendMessage, setBackendMessage] = useState(""); // ✅ new state

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, "users", u.uid);
        await setDoc(docRef, { clickCount: 0 }, { merge: true });
        const snap = await getDoc(docRef);
        setClicks(snap.exists() ? snap.data().clickCount : 0);
      } else {
        setClicks(0);
      }
    });
    return () => unsub();
  }, []);

  const handleSignUp = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleClick = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    try {
      await updateDoc(docRef, { clickCount: increment(1) });
      setClicks((c) => c + 1);
    } catch (err) {
      console.error("Firestore update failed:", err);
    }
  };

  // ✅ Call backend
  const callBackend = async () => {
    if (!user) return;
    try {
      const token = await getIdToken(user);
      const res = await fetch(`${API_BASE}/whoami`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Backend says:", data);
      setBackendMessage(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Error calling backend:", err);
      setBackendMessage("Failed to reach backend");
    }
  };

  return (
    <div>
      {!user ? (
        <div>
          <input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      ) : (
        <div>
          <p>Welcome {user.email}</p>
          <p>Click count: {clicks}</p>
          <button onClick={handleClick}>Click me</button>
          <button onClick={handleLogout}>Logout</button>

          <hr />
          <button onClick={callBackend}>Call Backend</button>
          {backendMessage && <pre>{backendMessage}</pre>}
        </div>
      )}
    </div>
  );
}
