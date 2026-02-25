import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronRight, BookOpen, RotateCcw, Award, LogOut } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDcGf3RewwFxVzQmQWl3-LhasbJNNob5eU",
  authDomain: "bible-tracker-f7fa8.firebaseapp.com",
  databaseURL: "https://bible-tracker-f7fa8-default-rtdb.firebaseio.com",
  projectId: "bible-tracker-f7fa8",
  storageBucket: "bible-tracker-f7fa8.firebasestorage.app",
  messagingSenderId: "587610044890",
  appId: "1:587610044890:web:0df524416f2636c4ff28e3",
  measurementId: "G-R57HCKQ2HC"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const BIBLE_BOOKS = [
  { name: "Genesis", chapters: 50, testament: "OT" },
  { name: "Exodus", chapters: 40, testament: "OT" },
  { name: "Leviticus", chapters: 27, testament: "OT" },
  { name: "Numbers", chapters: 36, testament: "OT" },
  { name: "Deuteronomy", chapters: 34, testament: "OT" },
  { name: "Joshua", chapters: 24, testament: "OT" },
  { name: "Judges", chapters: 21, testament: "OT" },
  { name: "Ruth", chapters: 4, testament: "OT" },
  { name: "1 Samuel", chapters: 31, testament: "OT" },
  { name: "2 Samuel", chapters: 24, testament: "OT" },
  { name: "1 Kings", chapters: 22, testament: "OT" },
  { name: "2 Kings", chapters: 25, testament: "OT" },
  { name: "1 Chronicles", chapters: 29, testament: "OT" },
  { name: "2 Chronicles", chapters: 36, testament: "OT" },
  { name: "Ezra", chapters: 10, testament: "OT" },
  { name: "Nehemiah", chapters: 13, testament: "OT" },
  { name: "Esther", chapters: 10, testament: "OT" },
  { name: "Job", chapters: 42, testament: "OT" },
  { name: "Psalms", chapters: 150, testament: "OT" },
  { name: "Proverbs", chapters: 31, testament: "OT" },
  { name: "Ecclesiastes", chapters: 12, testament: "OT" },
  { name: "Song of Solomon", chapters: 8, testament: "OT" },
  { name: "Isaiah", chapters: 66, testament: "OT" },
  { name: "Jeremiah", chapters: 52, testament: "OT" },
  { name: "Lamentations", chapters: 5, testament: "OT" },
  { name: "Ezekiel", chapters: 48, testament: "OT" },
  { name: "Daniel", chapters: 12, testament: "OT" },
  { name: "Hosea", chapters: 14, testament: "OT" },
  { name: "Joel", chapters: 3, testament: "OT" },
  { name: "Amos", chapters: 9, testament: "OT" },
  { name: "Obadiah", chapters: 1, testament: "OT" },
  { name: "Jonah", chapters: 4, testament: "OT" },
  { name: "Micah", chapters: 7, testament: "OT" },
  { name: "Nahum", chapters: 3, testament: "OT" },
  { name: "Habakkuk", chapters: 3, testament: "OT" },
  { name: "Zephaniah", chapters: 3, testament: "OT" },
  { name: "Haggai", chapters: 2, testament: "OT" },
  { name: "Zechariah", chapters: 14, testament: "OT" },
  { name: "Malachi", chapters: 4, testament: "OT" },
  { name: "Matthew", chapters: 28, testament: "NT" },
  { name: "Mark", chapters: 16, testament: "NT" },
  { name: "Luke", chapters: 24, testament: "NT" },
  { name: "John", chapters: 21, testament: "NT" },
  { name: "Acts", chapters: 28, testament: "NT" },
  { name: "Romans", chapters: 16, testament: "NT" },
  { name: "1 Corinthians", chapters: 16, testament: "NT" },
  { name: "2 Corinthians", chapters: 13, testament: "NT" },
  { name: "Galatians", chapters: 6, testament: "NT" },
  { name: "Ephesians", chapters: 6, testament: "NT" },
  { name: "Philippians", chapters: 4, testament: "NT" },
  { name: "Colossians", chapters: 4, testament: "NT" },
  { name: "1 Thessalonians", chapters: 5, testament: "NT" },
  { name: "2 Thessalonians", chapters: 3, testament: "NT" },
  { name: "1 Timothy", chapters: 6, testament: "NT" },
  { name: "2 Timothy", chapters: 4, testament: "NT" },
  { name: "Titus", chapters: 3, testament: "NT" },
  { name: "Philemon", chapters: 1, testament: "NT" },
  { name: "Hebrews", chapters: 13, testament: "NT" },
  { name: "James", chapters: 5, testament: "NT" },
  { name: "1 Peter", chapters: 5, testament: "NT" },
  { name: "2 Peter", chapters: 3, testament: "NT" },
  { name: "1 John", chapters: 5, testament: "NT" },
  { name: "2 John", chapters: 1, testament: "NT" },
  { name: "3 John", chapters: 1, testament: "NT" },
  { name: "Jude", chapters: 1, testament: "NT" },
  { name: "Revelation", chapters: 22, testament: "NT" },
];

const C = {
  bg: "#0f1a12",
  cardBg: "#162a1c",
  cardBgAlt: "#1a3322",
  cardComplete: "#1c3528",
  accent: "#6fcf8a",
  accentDim: "#4aad6a",
  accentDark: "#2d7a4a",
  text: "#d9efe0",
  textMid: "#8db89e",
  textDim: "#4a7a5e",
  chapterUnread: "#162a1c",
  chapterRead1: "rgba(77,160,100,0.25)",
  chapterRead2: "rgba(77,160,100,0.45)",
  chapterRead3: "linear-gradient(135deg, #2d7a4a, #6fcf8a)",
  ntBadgeBg: "rgba(180,140,80,0.15)",
  ntBadgeText: "#d4a94a",
  otBadgeBg: "rgba(110,180,130,0.15)",
  otBadgeText: "#8db89e",
  borderAccent: "rgba(111,207,138,0.2)",
  borderDim: "rgba(111,207,138,0.08)",
  resetBg: "rgba(180,80,80,0.25)",
  resetBorder: "rgba(180,80,80,0.4)",
  resetText: "#d4a0a0",
};

const TOTAL_CHAPTERS = BIBLE_BOOKS.reduce((sum, b) => sum + b.chapters, 0);

function initData() {
  const data = {};
  BIBLE_BOOKS.forEach((book) => {
    data[book.name] = {};
    for (let i = 1; i <= book.chapters; i++) {
      data[book.name][i] = 0;
    }
  });
  return data;
}

async function loadData(userId) {
  try {
    const dataRef = ref(database, "users/" + userId + "/reading");
    const snapshot = await get(dataRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
  } catch (e) {
    console.error("Load failed:", e);
  }
  return initData();
}

async function loadChapterTimestamps(userId) {
  try {
    const timestampsRef = ref(database, "users/" + userId + "/chapterTimestamps");
    const snapshot = await get(timestampsRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
  } catch (e) {
    console.error("Load timestamps failed:", e);
  }
  return {};
}

async function saveData(userId, data) {
  try {
    const dataRef = ref(database, "users/" + userId + "/reading");
    await set(dataRef, data);
  } catch (e) {
    console.error("Save failed:", e);
  }
}

async function saveChapterTimestamp(userId, bookName, chapter) {
  try {
    const timestampsRef = ref(database, "users/" + userId + "/chapterTimestamps");
    const timestamp = new Date().toISOString();
    const allTimestamps = await loadChapterTimestamps(userId);
    if (!allTimestamps[bookName]) {
      allTimestamps[bookName] = {};
    }
    allTimestamps[bookName][chapter] = timestamp;
    await set(timestampsRef, allTimestamps);
    return timestamp;
  } catch (e) {
    console.error("Save timestamp failed:", e);
  }
}

function getBookStats(data, bookName, totalChapters) {
  let read = 0, totalReads = 0;
  for (let i = 1; i <= totalChapters; i++) {
    const count = data[bookName]?.[i] || 0;
    if (count > 0) read++;
    totalReads += count;
  }
  return { read, totalReads, pct: totalChapters > 0 ? (read / totalChapters) * 100 : 0 };
}

function getOverallStats(data) {
  let totalRead = 0, totalReads = 0;
  BIBLE_BOOKS.forEach((book) => {
    const s = getBookStats(data, book.name, book.chapters);
    totalRead += s.read;
    totalReads += s.totalReads;
  });
  return { totalRead, totalReads, pct: (totalRead / TOTAL_CHAPTERS) * 100 };
}

function formatTimestamp(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return diffMins + "m ago";
  if (diffHours < 24) return diffHours + "h ago";
  if (diffDays < 7) return diffDays + "d ago";
  
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function SignInScreen() {
  const [signingIn, setSigningIn] = useState(false);
  
  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Sign-in error:", error);
      setSigningIn(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 20% 50%, rgba(111,207,138,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(45,122,74,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(111,207,138,0.03) 0%, transparent 50%)"
      }} />
      
      <div style={{
        position: "relative",
        zIndex: 1,
        textAlign: "center",
        background: "linear-gradient(135deg, " + C.cardBg + " 0%, " + C.cardBgAlt + " 100%)",
        padding: "48px 40px",
        borderRadius: 16,
        border: "1px solid " + C.borderAccent,
        maxWidth: 400,
        margin: "0 16px",
      }}>
        <BookOpen size={48} color={C.accent} style={{ marginBottom: 16 }} />
        <h1 style={{ 
          margin: "0 0 8px", 
          fontSize: 28, 
          fontWeight: 400, 
          letterSpacing: 3, 
          color: C.accent, 
          textTransform: "uppercase" 
        }}>
          Scripture Tracker
        </h1>
        <p style={{ margin: "0 0 32px", fontSize: 14, color: C.textMid, letterSpacing: 0.5 }}>
          Track your journey through God&apos;s Word
        </p>
        
        <button
          onClick={handleSignIn}
          disabled={signingIn}
          style={{
            width: "100%",
            background: signingIn ? "rgba(111,207,138,0.1)" : "linear-gradient(135deg, " + C.accentDark + ", " + C.accent + ")",
            border: "1px solid " + C.accent,
            color: signingIn ? C.textDim : C.bg,
            padding: "14px 24px",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 500,
            cursor: signingIn ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "all 0.2s",
            fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
          }}
        >
          {signingIn ? "Signing in..." : "Sign in with Google"}
        </button>
        
        <p style={{ margin: "24px 0 0", fontSize: 12, color: C.textDim }}>
          Your reading progress will sync across all your devices
        </p>
      </div>
    </div>
  );
}

export default function BibleTracker() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [data, setData] = useState(null);
  const [chapterTimestamps, setChapterTimestamps] = useState({});
  const [expandedBook, setExpandedBook] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      
      if (currentUser) {
        Promise.all([
          loadData(currentUser.uid), 
          loadChapterTimestamps(currentUser.uid)
        ]).then(([d, ts]) => { 
          setData(d); 
          setChapterTimestamps(ts);
          setLoading(false); 
        });
      }
    });
    
    return () => unsubscribe();
  }, []);

  const updateChapter = useCallback((bookName, chapter, delta) => {
    if (!user) return;
    
    setData((prev) => {
      const next = { ...prev, [bookName]: { ...prev[bookName] } };
      const current = next[bookName][chapter] || 0;
      next[bookName][chapter] = Math.max(0, current + delta);
      saveData(user.uid, next);
      
      if (delta > 0) {
        saveChapterTimestamp(user.uid, bookName, chapter).then(timestamp => {
          setChapterTimestamps(prev => ({
            ...prev,
            [bookName]: { ...(prev[bookName] || {}), [chapter]: timestamp }
          }));
        });
      }
      
      return next;
    });
  }, [user]);

  const resetAll = async () => {
    if (!user) return;
    
    const fresh = initData();
    setData(fresh);
    await saveData(user.uid, fresh);
    setChapterTimestamps({});
    await set(ref(database, "users/" + user.uid + "/chapterTimestamps"), {});
    setShowReset(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: C.accent, fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", fontSize: 18, letterSpacing: 2 }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <SignInScreen />;
  }

  if (loading || !data) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: C.accent, fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", fontSize: 18, letterSpacing: 2 }}>
          Loading your data...
        </div>
      </div>
    );
  }

  const overall = getOverallStats(data);
  const completedBooks = BIBLE_BOOKS.filter(b => getBookStats(data, b.name, b.chapters).read === b.chapters);

  const filteredBooks = BIBLE_BOOKS.filter((book) => {
    const matchesFilter = filter === "All" || book.testament === filter;
    const matchesSearch = book.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 20% 50%, rgba(111,207,138,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(45,122,74,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(111,207,138,0.03) 0%, transparent 50%)"
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", padding: "24px 16px 40px" }}>

        <div style={{ textAlign: "center", marginBottom: 28, paddingTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 6 }}>
            <BookOpen size={22} color={C.accent} />
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 400, letterSpacing: 3, color: C.accent, textTransform: "uppercase" }}>
              Scripture Tracker
            </h1>
          </div>
          <div style={{ width: 48, height: 1, background: "linear-gradient(90deg, transparent, " + C.accent + ", transparent)", margin: "0 auto 4px" }} />
          <p style={{ margin: 0, fontSize: 13, color: C.textMid, letterSpacing: 1 }}>Track your journey through God&apos;s Word</p>
          
          <div style={{ 
            marginTop: 16, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: 10,
            padding: "8px 16px",
            background: "rgba(22,42,28,0.4)",
            borderRadius: 20,
            border: "1px solid " + C.borderDim,
            maxWidth: "fit-content",
            margin: "16px auto 0",
          }}>
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt={user.displayName || "User"} 
                style={{ width: 24, height: 24, borderRadius: "50%" }}
              />
            )}
            <span style={{ fontSize: 13, color: C.textMid }}>{user.displayName || user.email}</span>
            <button
              onClick={handleSignOut}
              style={{
                background: "transparent",
                border: "none",
                color: C.textDim,
                cursor: "pointer",
                padding: 4,
                display: "flex",
                alignItems: "center",
              }}
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        <div style={{
          background: "linear-gradient(135deg, " + C.cardBg + " 0%, " + C.cardBgAlt + " 100%)",
          borderRadius: 14, padding: "20px 22px", marginBottom: 20,
          border: "1px solid " + C.borderAccent,
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 12, color: C.textMid, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Overall Progress</div>
              <div style={{ fontSize: 32, fontWeight: 400, color: C.accent, lineHeight: 1.1 }}>
                {overall.totalRead}<span style={{ fontSize: 15, color: C.textDim, fontWeight: 400 }}> / {TOTAL_CHAPTERS}</span>
              </div>
              <div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>chapters completed</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: C.textMid, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Times Read</div>
              <div style={{ fontSize: 24, color: C.accentDim, display: "flex", alignItems: "center", gap: 6 }}>
                <RotateCcw size={14} color={C.textMid} /> {overall.totalReads}
              </div>
            </div>
          </div>
          <div style={{ background: C.bg, borderRadius: 6, height: 8, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: overall.pct + "%",
              background: "linear-gradient(90deg, " + C.accentDark + ", " + C.accent + ")",
              borderRadius: 6, transition: "width 0.5s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: C.textDim }}>{overall.pct.toFixed(1)}% of the Bible</span>
            <span style={{ fontSize: 11, color: C.textDim }}>{66 - completedBooks.length} books remaining</span>
          </div>
        </div>

        <div style={{
          background: "linear-gradient(135deg, " + C.cardBg + " 0%, " + C.cardBgAlt + " 100%)",
          borderRadius: 14, marginBottom: 20,
          border: "1px solid " + C.borderAccent, overflow: "hidden",
        }}>
          <div onClick={() => setShowCompleted(!showCompleted)}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 22px", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Award size={18} color={C.accent} />
              <span style={{ fontSize: 14, color: C.accent, letterSpacing: 1 }}>Books Completed</span>
              <span style={{
                fontSize: 11,
                background: completedBooks.length > 0 ? "rgba(111,207,138,0.2)" : "rgba(110,180,130,0.1)",
                color: completedBooks.length > 0 ? C.accent : C.textDim,
                padding: "2px 8px", borderRadius: 10,
              }}>{completedBooks.length} / 66</span>
            </div>
            {showCompleted ? <ChevronDown size={16} color={C.textMid} /> : <ChevronRight size={16} color={C.textMid} />}
          </div>
          {showCompleted && (
            <div style={{ borderTop: "1px solid " + C.borderDim, padding: "14px 22px 18px" }}>
              {completedBooks.length === 0 ? (
                <p style={{ margin: 0, fontSize: 13, color: C.textDim, fontStyle: "italic" }}>No books completed yet. Keep reading!</p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {completedBooks.map((book) => {
                    const stats = getBookStats(data, book.name, book.chapters);
                    return (
                      <div key={book.name} style={{
                        background: "rgba(45,122,74,0.2)", border: "1px solid " + C.borderAccent,
                        borderRadius: 20, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6,
                      }}>
                        <div style={{
                          width: 14, height: 14, borderRadius: "50%",
                          background: "linear-gradient(135deg, " + C.accentDark + ", " + C.accent + ")",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 8, color: C.bg, fontWeight: 700,
                        }}>✓</div>
                        <span style={{ fontSize: 13, color: C.text }}>{book.name}</span>
                        {stats.totalReads > book.chapters && (
                          <span style={{ fontSize: 10, color: C.textMid, display: "flex", alignItems: "center", gap: 2 }}>
                            <RotateCcw size={8} color={C.textMid} />{Math.floor(stats.totalReads / book.chapters)}×
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          {["All", "OT", "NT"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? "rgba(111,207,138,0.15)" : "transparent",
              border: filter === f ? "1px solid rgba(111,207,138,0.4)" : "1px solid " + C.borderDim,
              color: filter === f ? C.accent : C.textDim,
              borderRadius: 20, padding: "5px 14px", fontSize: 12, letterSpacing: 1,
              cursor: "pointer", transition: "all 0.2s",
            }}>
              {f === "OT" ? "Old Testament" : f === "NT" ? "New Testament" : f}
            </button>
          ))}
          <div style={{ flex: 1, minWidth: 140 }}>
            <input type="text" placeholder="Search books..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%", background: "rgba(22,42,28,0.6)",
                border: "1px solid " + C.borderDim, borderRadius: 20,
                padding: "5px 14px", fontSize: 12, color: C.text,
                outline: "none", boxSizing: "border-box", letterSpacing: 0.5,
              }}
            />
          </div>
          <button onClick={() => setShowReset(true)} style={{
            background: "transparent", border: "1px solid " + C.borderDim,
            color: C.textDim, borderRadius: 20, padding: "5px 10px",
            cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4,
          }}>
            <RotateCcw size={11} /> Reset
          </button>
        </div>

        {showReset && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={() => setShowReset(false)}>
            <div style={{
              background: C.cardBg, border: "1px solid " + C.borderAccent, borderRadius: 14,
              padding: 28, maxWidth: 340, width: "90%", textAlign: "center"
            }} onClick={(e) => e.stopPropagation()}>
              <Award size={28} color={C.accent} style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 16, color: C.accent, marginBottom: 8, fontWeight: 400 }}>Reset All Progress?</div>
              <div style={{ fontSize: 13, color: C.textMid, marginBottom: 18 }}>This will clear all your reading history. This action cannot be undone.</div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={() => setShowReset(false)} style={{
                  background: "transparent", border: "1px solid " + C.borderAccent, color: C.textMid,
                  borderRadius: 8, padding: "7px 20px", cursor: "pointer", fontSize: 13
                }}>Cancel</button>
                <button onClick={resetAll} style={{
                  background: C.resetBg, border: "1px solid " + C.resetBorder, color: C.resetText,
                  borderRadius: 8, padding: "7px 20px", cursor: "pointer", fontSize: 13
                }}>Reset</button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filteredBooks.map((book) => {
            const stats = getBookStats(data, book.name, book.chapters);
            const isExpanded = expandedBook === book.name;
            const isComplete = stats.read === book.chapters;
            
            return (
              <div key={book.name} style={{
                background: isComplete
                  ? "linear-gradient(135deg, " + C.cardComplete + " 0%, " + C.cardBgAlt + " 100%)"
                  : "linear-gradient(135deg, " + C.cardBg + " 0%, #142418 100%)",
                borderRadius: 10,
                border: isComplete ? "1px solid " + C.borderAccent : "1px solid " + C.borderDim,
                overflow: "hidden", transition: "border-color 0.3s",
              }}>
                <div onClick={() => setExpandedBook(isExpanded ? null : book.name)}
                  style={{ display: "flex", alignItems: "center", padding: "11px 14px", cursor: "pointer", gap: 10 }}>
                  <div style={{ width: 20, display: "flex", justifyContent: "center" }}>
                    {isComplete ? (
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%",
                        background: "linear-gradient(135deg, " + C.accentDark + ", " + C.accent + ")",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, color: C.bg, fontWeight: 700
                      }}>✓</div>
                    ) : (
                      isExpanded ? <ChevronDown size={16} color={C.textMid} /> : <ChevronRight size={16} color={C.textDim} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 14, color: isComplete ? C.accent : C.text, letterSpacing: 0.3 }}>{book.name}</span>
                      <span style={{
                        fontSize: 9,
                        color: book.testament === "NT" ? C.ntBadgeText : C.otBadgeText,
                        background: book.testament === "NT" ? C.ntBadgeBg : C.otBadgeBg,
                        padding: "1px 6px", borderRadius: 8, letterSpacing: 0.8
                      }}>{book.testament}</span>
                      {stats.totalReads > stats.read && (
                        <span style={{ fontSize: 9, color: C.textMid, display: "flex", alignItems: "center", gap: 2 }}>
                          <RotateCcw size={8} color={C.textMid} />{stats.totalReads}x
                        </span>
                      )}
                    </div>
                    <div style={{ height: 3, background: C.bg, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: stats.pct + "%",
                        background: isComplete
                          ? "linear-gradient(90deg, " + C.accentDark + ", " + C.accent + ")"
                          : "linear-gradient(90deg, " + C.textDim + ", " + C.textMid + ")",
                        borderRadius: 2, transition: "width 0.4s ease",
                      }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim, whiteSpace: "nowrap" }}>{stats.read}/{book.chapters}</div>
                </div>

                {isExpanded && (
                  <div style={{ padding: "0 14px 14px", borderTop: "1px solid " + C.borderDim }}>
                    <div style={{ paddingTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                      {Array.from({ length: book.chapters }, (_, i) => i + 1).map((ch) => {
                        const count = data[book.name]?.[ch] || 0;
                        const isRead = count > 0;
                        const chapterTimestamp = chapterTimestamps[book.name]?.[ch];
                        
                        return (
                          <div key={ch} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ 
                              width: 50, 
                              fontSize: 13, 
                              color: isRead ? C.accent : C.textDim,
                              fontWeight: isRead ? 500 : 400,
                            }}>
                              Ch {ch}
                            </div>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                              <button onClick={() => updateChapter(book.name, ch, 1)} style={{
                                width: "100%",
                                height: 36,
                                borderRadius: 7,
                                background: isRead
                                  ? (count >= 3 ? C.chapterRead3 : count >= 2 ? C.chapterRead2 : C.chapterRead1)
                                  : C.chapterUnread,
                                border: isRead ? "1px solid rgba(111,207,138,0.3)" : "1px solid rgba(111,207,138,0.1)",
                                color: isRead ? C.accent : C.textDim,
                                fontSize: 12,
                                cursor: "pointer",
                                transition: "all 0.2s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 500,
                              }}>
                                {count === 0 ? "Mark Read" : "Read " + count + "×"}
                              </button>
                              {chapterTimestamp && (
                                <div style={{ fontSize: 9, color: C.textDim, textAlign: "center" }}>
                                  {formatTimestamp(chapterTimestamp)}
                                </div>
                              )}
                            </div>
                            {count > 0 && (
                              <button onClick={() => updateChapter(book.name, ch, -1)} style={{
                                width: 36,
                                height: 36,
                                borderRadius: 7,
                                background: "rgba(180,80,80,0.15)",
                                border: "1px solid rgba(180,80,80,0.3)",
                                color: C.resetText,
                                cursor: "pointer",
                                fontSize: 16,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}>−</button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 24, padding: "14px 18px", background: "rgba(22,42,28,0.4)", borderRadius: 10, border: "1px solid " + C.borderDim }}>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, letterSpacing: 0.8, textTransform: "uppercase" }}>Legend</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { color: C.chapterUnread, label: "Not read", border: "1px solid rgba(111,207,138,0.1)" },
              { color: C.chapterRead1, label: "Read 1×", border: "1px solid rgba(111,207,138,0.3)" },
              { color: C.chapterRead2, label: "Read 2×", border: "1px solid rgba(111,207,138,0.3)" },
              { color: C.chapterRead3, label: "Read 3×+", border: "1px solid rgba(111,207,138,0.3)" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: item.color, border: item.border }} />
                <span style={{ fontSize: 11, color: C.textMid }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
