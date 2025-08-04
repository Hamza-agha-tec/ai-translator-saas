import { useState, useEffect, useRef, createContext, useContext } from "react";

// ThemeContext for global theme state
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored ? stored : "light";
  });
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext);
}
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("fr");
  const { theme, setTheme } = useTheme();
  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
  ];

  // Debounce translation requests
  const debounceTimeout = 600;
  let debounceTimer;

  const translateText = async (inputText, from, to) => {
    if (!inputText.trim()) {
      setTranslation("");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/translate", {
        text: inputText,
        from,
        to,
      });
      setTranslation(res.data.translation);
    } catch (err) {
      console.error(err);
      setTranslation("Error: Failed to translate.");
    }
    setLoading(false);
  };

  // Use effect to trigger translation on input changes
  
  const timerRef = useRef();
  useEffect(() => {
    if (!text.trim()) {
      setTranslation("");
      setLoading(false);
      return;
    }
    setLoading(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      translateText(text, fromLang, toLang);
    }, debounceTimeout);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, fromLang, toLang]);

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background:
        theme === "dark"
          ? "radial-gradient(circle at 20% 20%, #18181b 0%, #0f172a 100%)"
          : "radial-gradient(circle at 20% 20%, #e0e7ff 0%, #f0fdfa 100%)",
      color: theme === "dark" ? "#e0e7ff" : undefined,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      overflow: "hidden",
      position: "relative",
      transition: "background 0.5s"
    }}>
      {/* Animated gradient circles for glassmorphism effect */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        width: 180,
        height: 180,
        background: "radial-gradient(circle, #6366f1 0%, #e0e7ff 80%)",
        opacity: 0.18,
        filter: "blur(24px)",
        borderRadius: "50%",
        zIndex: 0,
        animation: "float1 8s ease-in-out infinite alternate"
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "8%",
        width: 140,
        height: 140,
        background: "radial-gradient(circle, #06b6d4 0%, #f0fdfa 80%)",
        opacity: 0.15,
        filter: "blur(18px)",
        borderRadius: "50%",
        zIndex: 0,
        animation: "float2 7s ease-in-out infinite alternate"
      }} />
      {/* Main card */}
      <div style={{
        maxWidth: 1100,
        width: "95vw",
        minHeight: "80vh",
        margin: "2rem auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2.5rem 2rem 2rem 2rem",
        background:
          theme === "dark"
            ? "rgba(86, 86, 86, 0.92)"
            : "rgba(255,255,255,0.92)",
        borderRadius: "2rem",
        boxShadow:
          theme === "dark"
            ? "0 8px 32px 0 rgba(31, 38, 135, 0.32)"
            : "0 8px 32px 0 rgba(31, 38, 135, 0.16)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        position: "relative",
        zIndex: 1,
        border: theme === "dark" ? "1px solid #334155" : "1px solid #e0e7ff",
        color: theme === "dark" ? "#e0e7ff" : undefined,
        transition: "background 0.5s, color 0.5s"
      }}>
        {/* Theme toggle button */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            background: theme === "dark" ? "#334155" : "#e0e7ff",
            color: theme === "dark" ? "#e0e7ff" : "#374151",
            border: "none",
            borderRadius: "50%",
            width: 40,
            height: 40,
            boxShadow: "0 2px 8px 0 rgba(99, 102, 241, 0.08)",
            cursor: "pointer",
            fontSize: "1.3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3,
            transition: "background 0.5s, color 0.5s"
          }}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "🌙" : "🌞"}
        </button>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2rem"
        }}>
          <img src="/vite.svg" alt="Gemini Logo" style={{ width: 48, height: 48, marginRight: 16, filter: "drop-shadow(0 2px 8px #6366f1)" }} />
          <h1 style={{
            fontSize: "2.3rem",
            fontWeight: 900,
            background: "linear-gradient(90deg, #6366f1, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            letterSpacing: "-1px"
          }}>Gemini AI Translator</h1>
        </div>
        <div style={{
          display: "flex",
          gap: "1.5rem",
          marginBottom: "1.5rem",
          justifyContent: "center"
        }}>
          <div style={{ textAlign: "center" }}>
            <label htmlFor="fromLang" style={{ fontWeight: 700, color: "#6366f1", fontSize: "1.3rem" }}>From</label>
            <select
              id="fromLang"
              value={fromLang}
              onChange={(e) => setFromLang(e.target.value)}
              style={{
                marginLeft: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "0.75rem",
                border: "1px solid #c7d2fe",
                fontSize: "1rem",
                background: "#f0fdfa",
                color: "#374151",
                fontWeight: 500,
                boxShadow: "0 2px 8px 0 rgba(99, 102, 241, 0.05)"
              }}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          <div style={{ textAlign: "center" }}>
            <label htmlFor="toLang" style={{ fontWeight: 700, color: "#06b6d4", fontSize: "1.3rem" }}>To</label>
            <select
              id="toLang"
              value={toLang}
              onChange={(e) => setToLang(e.target.value)}
              style={{
                marginLeft: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "0.75rem",
                border: "1px solid #c7d2fe",
                fontSize: "1rem",
                background: "#e0e7ff",
                color: "#374151",
                fontWeight: 500,
                boxShadow: "0 2px 8px 0 rgba(6, 182, 212, 0.05)"
              }}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            width: "100%",
            alignItems: "stretch",
            marginTop: "2rem",
          }}
          className="responsive-row"
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label htmlFor="inputText" style={{
              fontWeight: 700,
              fontSize: "1.1rem",
              marginBottom: "0.5rem",
              color: theme === "dark" ? "#e0e7ff" : "#374151",
              padding: "0"
            }}>Text to Translate</label>
            <textarea
              id="inputText"
              rows={4}
              placeholder="Enter text to translate..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{
                width: "auto",
                minWidth: 0,
                marginBottom: 0,
                padding: "1.2rem 1rem",
                borderRadius: "1.2rem",
                border: theme === "dark" ? "1.5px solid #626c7aff" : "1.5px solid #c7d2fe",
                fontSize: "1.15rem",
                background: theme === "dark" ? "#4a4a53ff" : "#fff",
                boxShadow: theme === "dark"
                  ? "0 2px 8px 0 rgba(31, 38, 135, 0.12)"
                  : "0 2px 8px 0 rgba(99, 102, 241, 0.08)",
                resize: "vertical",
                fontWeight: 500,
                color: theme === "dark" ? "#e0e7ff" : "#374151",
                outline: "none",
                transition: "border 0.3s, box-shadow 0.3s"
              }}
              onFocus={e => e.target.style.border = theme === "dark" ? "1.5px solid #6366f1" : "1.5px solid #06b6d4"}
              onBlur={e => e.target.style.border = theme === "dark" ? "1.5px solid #334155" : "1.5px solid #c7d2fe"}
            />
            {loading && (
              <div style={{
                textAlign: "center",
                marginTop: "1rem",
                color: "#6366f1",
                fontWeight: 700,
                fontSize: "1.15rem",
                letterSpacing: "0.5px",
                animation: "fadeIn 0.8s"
              }}>
                <span style={{
                  display: "inline-block",
                  marginRight: 8,
                  verticalAlign: "middle"
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1.2s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="4" opacity="0.2" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
                Translating...
              </div>
            )}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label style={{
              fontWeight: 700,
              fontSize: "1.1rem",
              marginBottom: "0.5rem",
              color: theme === "dark" ? "#e0e7ff" : "#06b6d4"
            }}>Translation</label>
            <div style={{
              padding: "1.5rem 1rem",
              background: theme === "dark"
                ? "linear-gradient(90deg, #4b4b51ff 0%, #39485eff 100%)"
                : "linear-gradient(90deg, #e0e7ff 0%, #f0fdfa 100%)",
              borderRadius: "1.2rem",
              boxShadow: theme === "dark"
                ? "0 4px 16px 0 rgba(31, 38, 135, 0.18)"
                : "0 4px 16px 0 rgba(6, 182, 212, 0.10)",
              textAlign: "center",
              animation: "fadeIn 0.8s",
              minHeight: "120px",
             border: theme === "dark" ? "1.5px solid #626c7aff" : "1.5px solid #c7d2fe",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}>
              { translation ? (
                <p style={{
                  marginTop: "1rem",
                  fontSize: "1.18rem",
                  color: theme === "dark" ? "#e0e7ff" : "#374151",
                  fontWeight: 500,
                  wordBreak: "break-word",
                  lineHeight: 1.6,
                  fontWeight:"bold"
                }}>{translation}</p>
              ) : (
                <strong style={{
                  fontSize: "1.25rem",
                  color: theme === "dark" ? "#38bdf8" : "#06b6d4",
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                  marginBottom: "0.5rem",
                }}>Please set a text to</strong>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Keyframes for animation and responsive row/column */}
      <style>{`
        @keyframes float1 {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(30px) scale(1.08); }
        }
        @keyframes float2 {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-24px) scale(1.05); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .responsive-row {
          flex-direction: column;
        }
        @media (min-width: 900px) {
          .responsive-row {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
}

// Wrap App with ThemeProvider
function AppWithTheme() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default AppWithTheme;
