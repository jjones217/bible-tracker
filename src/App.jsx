
import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronRight, BookOpen, RotateCcw, Award } from "lucide-react";

const BIBLE_BOOKS = [
  // Old Testament
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
  // New Testament
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

function loadData() {
  try {
    const saved = localStorage.getItem("bible-reading-data");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return initData();
}

function saveData(data) {
  try {
    localStorage.setItem("bible-reading-data", JSON.stringify(data));
  } catch (e) {
    console.error("Save failed", e);
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

export default function BibleTracker() {
  const [data, setData] = useState(null);
  const [expandedBook, setExpandedBook] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const d = loadData();
    setData(d);
    setLoading(false);
  }, []);

  const updateChapter = useCallback(async (bookName, chapter, delta) => {
    setData((prev) => {
      const next = { ...prev, [bookName]: { ...prev[bookName] } };
      const current = next[bookName][chapter] || 0;
      next[bookName][chapter] = Math.max(0, current + delta);
      saveData(next);
      return next;
    });
  }, []);

  const resetAll = async () => {
    const fresh = initData();
    setData(fresh);
    await saveData(fresh);
    setShowReset(false);
  };

  if (loading || !data) {
    return (
      <div style={{ minHeight: "100vh", background: "#1a1410", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#c4a882", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", fontSize: 18, letterSpacing: 2 }}>
          Loading...
        </div>
      </div>
    );
  }

  const overall = getOverallStats(data);

  const filteredBooks = BIBLE_BOOKS.filter((book) => {
    const matchesFilter = filter === "All" || book.testament === filter;
    const matchesSearch = book.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1410",
      color: "#e8ddd0",
      fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative background texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse at 20% 50%, rgba(196,168,130,0.04) 0%, transparent 60%),
                     radial-gradient(ellipse at 80% 20%, rgba(139,109,75,0.06) 0%, transparent 50%),
                     radial-gradient(ellipse at 50% 80%, rgba(196,168,130,0.03) 0%, transparent 50%)`
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", padding: "24px 16px 40px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28, paddingTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 6 }}>
            <BookOpen size={22} color="#c4a882" />
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 400, letterSpacing: 3, color: "#c4a882", textTransform: "uppercase" }}>
              Scripture Tracker
            </h1>
          </div>
          <div style={{ width: 48, height: 1, background: "linear-gradient(90deg, transparent, #c4a882, transparent)", margin: "0 auto 4px" }} />
          <p style={{ margin: 0, fontSize: 13, color: "#8a7e6e", letterSpacing: 1 }}>Track your journey through God's Word</p>
        </div>

        {/* Overall Progress Card */}
        <div style={{
          background: "linear-gradient(135deg, #2a2118 0%, #231c15 100%)",
          borderRadius: 14,
          padding: "20px 22px",
          marginBottom: 20,
          border: "1px solid rgba(196,168,130,0.15)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 12, color: "#8a7e6e", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Overall Progress</div>
              <div style={{ fontSize: 32, fontWeight: 400, color: "#c4a882", lineHeight: 1.1 }}>
                {overall.totalRead}<span style={{ fontSize: 15, color: "#6b5f4e", fontWeight: 400 }}> / {TOTAL_CHAPTERS}</span>
              </div>
              <div style={{ fontSize: 12, color: "#6b5f4e", marginTop: 2 }}>chapters completed</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#8a7e6e", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Times Read</div>
              <div style={{ fontSize: 24, color: "#d4b896", display: "flex", alignItems: "center", gap: 6 }}>
                <RotateCcw size={14} color="#8a7e6e" /> {overall.totalReads}
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ background: "#1a1410", borderRadius: 6, height: 8, overflow: "hidden", position: "relative" }}>
            <div style={{
              height: "100%",
              width: `${overall.pct}%`,
              background: "linear-gradient(90deg, #8b6d4b, #c4a882)",
              borderRadius: 6,
              transition: "width 0.5s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "#6b5f4e" }}>{overall.pct.toFixed(1)}% of the Bible</span>
            <span style={{ fontSize: 11, color: "#6b5f4e" }}>{66 - BIBLE_BOOKS.filter(b => getBookStats(data, b.name, b.chapters).read === b.chapters).length} books remaining</span>
          </div>
        </div>

        {/* Books Completed Section */}
        {(() => {
          const completedBooks = BIBLE_BOOKS.filter(b => getBookStats(data, b.name, b.chapters).read === b.chapters);
          return (
            <div style={{
              background: "linear-gradient(135deg, #2a2118 0%, #231c15 100%)",
              borderRadius: 14,
              marginBottom: 20,
              border: "1px solid rgba(196,168,130,0.15)",
              overflow: "hidden",
            }}>
              {/* Toggleable Header */}
              <div
                onClick={() => setShowCompleted(!showCompleted)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 22px", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Award size={18} color="#c4a882" />
                  <span style={{ fontSize: 14, color: "#c4a882", letterSpacing: 1 }}>Books Completed</span>
                  <span style={{
                    fontSize: 11,
                    background: completedBooks.length > 0 ? "rgba(196,168,130,0.2)" : "rgba(138,126,110,0.15)",
                    color: completedBooks.length > 0 ? "#c4a882" : "#6b5f4e",
                    padding: "2px 8px",
                    borderRadius: 10,
                  }}>{completedBooks.length} / 66</span>
                </div>
                {showCompleted ? <ChevronDown size={16} color="#8a7e6e" /> : <ChevronRight size={16} color="#8a7e6e" />}
              </div>

              {/* Expanded List */}
              {showCompleted && (
                <div style={{ borderTop: "1px solid rgba(196,168,130,0.1)", padding: "14px 22px 18px" }}>
                  {completedBooks.length === 0 ? (
                    <p style={{ margin: 0, fontSize: 13, color: "#6b5f4e", fontStyle: "italic" }}>
                      No books completed yet. Keep reading!
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {completedBooks.map((book) => {
                        const stats = getBookStats(data, book.name, book.chapters);
                        return (
                          <div key={book.name} style={{
                            background: "rgba(139,109,75,0.15)",
                            border: "1px solid rgba(196,168,130,0.25)",
                            borderRadius: 20,
                            padding: "5px 12px",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}>
                            <div style={{
                              width: 14, height: 14, borderRadius: "50%",
                              background: "linear-gradient(135deg, #8b6d4b, #c4a882)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 8, color: "#1a1410", fontWeight: 700,
                            }}>✓</div>
                            <span style={{ fontSize: 13, color: "#d4c8b8" }}>{book.name}</span>
                            {stats.totalReads > book.chapters && (
                              <span style={{ fontSize: 10, color: "#8a7e6e", display: "flex", alignItems: "center", gap: 2 }}>
                                <RotateCcw size={8} color="#8a7e6e" />{Math.floor(stats.totalReads / book.chapters)}×
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
          );
        })()}

        {/* Controls */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          {["All", "OT", "NT"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? "rgba(196,168,130,0.18)" : "transparent",
              border: filter === f ? "1px solid rgba(196,168,130,0.4)" : "1px solid rgba(196,168,130,0.12)",
              color: filter === f ? "#c4a882" : "#6b5f4e",
              borderRadius: 20,
              padding: "5px 14px",
              fontSize: 12,
              letterSpacing: 1,
              cursor: "pointer",
              transition: "all 0.2s",
            }}>
              {f === "OT" ? "Old Testament" : f === "NT" ? "New Testament" : f}
            </button>
          ))}
          <div style={{ flex: 1, minWidth: 140 }}>
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(42,33,24,0.6)",
                border: "1px solid rgba(196,168,130,0.12)",
                borderRadius: 20,
                padding: "5px 14px",
                fontSize: 12,
                color: "#e8ddd0",
                outline: "none",
                boxSizing: "border-box",
                letterSpacing: 0.5,
              }}
            />
          </div>
          <button onClick={() => setShowReset(true)} style={{
            background: "transparent",
            border: "1px solid rgba(196,168,130,0.12)",
            color: "#6b5f4e",
            borderRadius: 20,
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 4,
            transition: "all 0.2s",
          }}>
            <RotateCcw size={11} /> Reset
          </button>
        </div>

        {/* Reset Confirmation Modal */}
        {showReset && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={() => setShowReset(false)}>
            <div style={{
              background: "#2a2118", border: "1px solid rgba(196,168,130,0.2)", borderRadius: 14,
              padding: 28, maxWidth: 340, width: "90%", textAlign: "center"
            }} onClick={(e) => e.stopPropagation()}>
              <Award size={28} color="#c4a882" style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 16, color: "#c4a882", marginBottom: 8, fontWeight: 400 }}>Reset All Progress?</div>
              <div style={{ fontSize: 13, color: "#8a7e6e", marginBottom: 18 }}>This will clear all your reading history. This action cannot be undone.</div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={() => setShowReset(false)} style={{
                  background: "transparent", border: "1px solid rgba(196,168,130,0.25)", color: "#8a7e6e",
                  borderRadius: 8, padding: "7px 20px", cursor: "pointer", fontSize: 13
                }}>Cancel</button>
                <button onClick={resetAll} style={{
                  background: "rgba(180,80,80,0.25)", border: "1px solid rgba(180,80,80,0.4)", color: "#d4a0a0",
                  borderRadius: 8, padding: "7px 20px", cursor: "pointer", fontSize: 13
                }}>Reset</button>
              </div>
            </div>
          </div>
        )}

        {/* Book List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filteredBooks.map((book, idx) => {
            const stats = getBookStats(data, book.name, book.chapters);
            const isExpanded = expandedBook === book.name;
            const isComplete = stats.read === book.chapters;

            return (
              <div key={book.name} style={{
                background: isComplete ? "linear-gradient(135deg, #2a2520 0%, #231c18 100%)" : "linear-gradient(135deg, #231c15 0%, #1e1812 100%)",
                borderRadius: 10,
                border: isComplete ? "1px solid rgba(196,168,130,0.25)" : "1px solid rgba(196,168,130,0.08)",
                overflow: "hidden",
                transition: "border-color 0.3s",
              }}>
                {/* Book Row */}
                <div
                  onClick={() => setExpandedBook(isExpanded ? null : book.name)}
                  style={{
                    display: "flex", alignItems: "center", padding: "11px 14px", cursor: "pointer", gap: 10,
                  }}
                >
                  <div style={{ width: 20, display: "flex", justifyContent: "center" }}>
                    {isComplete ? (
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%",
                        background: "linear-gradient(135deg, #8b6d4b, #c4a882)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, color: "#1a1410", fontWeight: 700
                      }}>✓</div>
                    ) : (
                      isExpanded ? <ChevronDown size={16} color="#8a7e6e" /> : <ChevronRight size={16} color="#6b5f4e" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, color: isComplete ? "#c4a882" : "#d4c8b8", letterSpacing: 0.3 }}>{book.name}</span>
                      <span style={{
                        fontSize: 9, color: book.testament === "NT" ? "#7a9bb5" : "#8a7e6e",
                        background: book.testament === "NT" ? "rgba(122,155,181,0.15)" : "rgba(138,126,110,0.15)",
                        padding: "1px 6px", borderRadius: 8, letterSpacing: 0.8
                      }}>{book.testament}</span>
                      {stats.totalReads > stats.read && (
                        <span style={{ fontSize: 9, color: "#8a7e6e", display: "flex", alignItems: "center", gap: 2 }}>
                          <RotateCcw size={8} color="#8a7e6e" />{stats.totalReads}x
                        </span>
                      )}
                    </div>
                    {/* Mini progress bar */}
                    <div style={{ marginTop: 5, height: 3, background: "#1a1410", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${stats.pct}%`,
                        background: isComplete ? "linear-gradient(90deg, #8b6d4b, #c4a882)" : "linear-gradient(90deg, #6b5f4e, #8a7e6e)",
                        borderRadius: 2, transition: "width 0.4s ease",
                      }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#6b5f4e", whiteSpace: "nowrap" }}>
                    {stats.read}/{book.chapters}
                  </div>
                </div>

                {/* Chapter Grid */}
                {isExpanded && (
                  <div style={{ padding: "0 14px 14px", borderTop: "1px solid rgba(196,168,130,0.08)" }}>
                    <div style={{ paddingTop: 12, display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(44px, 1fr))`, gap: 5 }}>
                      {Array.from({ length: book.chapters }, (_, i) => i + 1).map((ch) => {
                        const count = data[book.name]?.[ch] || 0;
                        const isRead = count > 0;
                        return (
                          <div key={ch} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <button
                              onClick={() => updateChapter(book.name, ch, 1)}
                              style={{
                                width: 42, height: 38, borderRadius: 7,
                                background: isRead
                                  ? (count >= 3 ? "linear-gradient(135deg, #8b6d4b, #c4a882)" : count >= 2 ? "rgba(139,109,75,0.45)" : "rgba(139,109,75,0.25)")
                                  : "rgba(42,33,24,0.7)",
                                border: isRead ? "1px solid rgba(196,168,130,0.3)" : "1px solid rgba(196,168,130,0.1)",
                                color: isRead ? "#c4a882" : "#5a5045",
                                fontSize: 12,
                                cursor: "pointer",
                                transition: "all 0.2s",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                position: "relative",
                              }}
                            >
                              {ch}
                            </button>
                            {/* Re-read count and decrement */}
                            <div style={{ display: "flex", alignItems: "center", gap: 2, height: 14 }}>
                              {count > 0 && (
                                <>
                                  <button
                                    onClick={() => updateChapter(book.name, ch, -1)}
                                    style={{
                                      background: "none", border: "none", color: "#5a5045",
                                      cursor: "pointer", fontSize: 9, padding: "0 2px", lineHeight: 1,
                                    }}
                                  >−</button>
                                  <span style={{ fontSize: 9, color: count >= 2 ? "#8a7e6e" : "#5a5045" }}>{count}×</span>
                                </>
                              )}
                            </div>
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

        {/* Footer legend */}
        <div style={{ marginTop: 24, padding: "14px 18px", background: "rgba(42,33,24,0.4)", borderRadius: 10, border: "1px solid rgba(196,168,130,0.08)" }}>
          <div style={{ fontSize: 11, color: "#6b5f4e", marginBottom: 8, letterSpacing: 0.8, textTransform: "uppercase" }}>Legend</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { color: "rgba(42,33,24,0.7)", label: "Not read", border: "1px solid rgba(196,168,130,0.1)" },
              { color: "rgba(139,109,75,0.25)", label: "Read 1×", border: "1px solid rgba(196,168,130,0.3)" },
              { color: "rgba(139,109,75,0.45)", label: "Read 2×", border: "1px solid rgba(196,168,130,0.3)" },
              { color: "linear-gradient(135deg, #8b6d4b, #c4a882)", label: "Read 3×+", border: "1px solid rgba(196,168,130,0.3)" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: item.color, border: item.border }} />
                <span style={{ fontSize: 11, color: "#8a7e6e" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
