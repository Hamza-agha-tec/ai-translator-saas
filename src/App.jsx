import { useState, useEffect, useRef, createContext, useContext } from "react";
import { GoogleGenAI } from "@google/genai";

// Create the Theme Context
const ThemeContext = createContext();

// Theme Provider
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored || "light";
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

// Theme hook
function useTheme() {
  return useContext(ThemeContext);
}

// Gemini AI instance
const ai = new GoogleGenAI({
  apiKey: "AIzaSyBmuzqdiDo-WngHbEjRXizP51zr6NeWr6I", // <-- replace this
});

function App() {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("fr");
  const { theme, setTheme } = useTheme();
  const timerRef = useRef(null);

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

  // Gemini API: translation function
  const translateText = async (inputText, from, to) => {
    if (!inputText.trim()) {
      setTranslation("");
      return;
    }
    setLoading(true);
    try {
      const result = await ai.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          {
            role: "user",
            parts: `Translate the following text from ${from} to ${to}:\n"${inputText}".\nOnly give the translated text with no explanation.`,
          },
        ],
      });

      // Get text content
      const translatedText = result?.response?.text();
      setTranslation(translatedText || "No translation found.");
    } catch (error) {
      console.error("Translation Error:", error);
      setTranslation("Error: Failed to translate.");
    }
    setLoading(false);
  };

  // Debounce input
  useEffect(() => {
    if (!text.trim()) {
      setTranslation("");
      setLoading(false);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      translateText(text, fromLang, toLang);
    }, 600);

    return () => clearTimeout(timerRef.current);
  }, [text, fromLang, toLang]);

  return (
    <div
      style={{
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
        transition: "background 0.5s",
      }}
    >
      {/* Gradient Bubbles */}
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
        animation: "float2 7s ease-in-out infinite alternate"
      }} />

      {/* Main Card */}
      <div
        style={{
          maxWidth: 1000,
          width: "95vw",
          minHeight: "80vh",
          padding: "2rem",
          background:
            theme === "dark" ? "rgba(86,86,86,0.92)" : "rgba(255,255,255,0.92)",
          borderRadius: "2rem",
          boxShadow:
            theme === "dark"
              ? "0 8px 32px rgba(31,38,135,0.32)"
              : "0 8px 32px rgba(31,38,135,0.16)",
          backdropFilter: "blur(12px)",
          border: theme === "dark" ? "1px solid #334155" : "1px solid #e0e7ff",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          zIndex: 2,
        }}
      >
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{
            alignSelf: "flex-end",
            background: theme === "dark" ? "#334155" : "#e0e7ff",
            color: theme === "dark" ? "#e0e7ff" : "#374151",
            border: "none",
            borderRadius: "50%",
            width: 40,
            height: 40,
            cursor: "pointer",
            fontSize: "1.2rem",
          }}
        >
          {theme === "dark" ? "🌙" : "🌞"}
        </button>

        {/* Language Selectors */}
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
          <div>
            <label>From</label>
            <select value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>To</label>
            <select value={toLang} onChange={(e) => setToLang(e.target.value)}>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Input Text */}
        <textarea
          rows="4"
          placeholder="Enter text to translate..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            padding: "1rem",
            borderRadius: "1rem",
            border: theme === "dark" ? "1.5px solid #626c7a" : "1.5px solid #c7d2fe",
            background: theme === "dark" ? "#4a4a53" : "#fff",
            color: theme === "dark" ? "#e0e7ff" : "#374151",
            fontSize: "1rem",
            resize: "vertical",
          }}
        />

        {/* Output */}
        <div
          style={{
            minHeight: "120px",
            background:
              theme === "dark"
                ? "linear-gradient(90deg, #4b4b51 0%, #39485e 100%)"
                : "linear-gradient(90deg, #e0e7ff 0%, #f0fdfa 100%)",
            padding: "1rem",
            borderRadius: "1rem",
            fontSize: "1.15rem",
            color: theme === "dark" ? "#e0e7ff" : "#374151",
            fontWeight: 500,
          }}
        >
          {loading ? (
            <p>Translating...</p>
          ) : translation ? (
            <p>{translation}</p>
          ) : (
            <p style={{ color: theme === "dark" ? "#38bdf8" : "#06b6d4" }}>
              Please enter text to translate.
            </p>
          )}
        </div>
      </div>

      {/* Inline CSS */}
      <style>{`
        @keyframes float1 {
          0% { transform: translateY(0); }
          100% { transform: translateY(30px); }
        }
        @keyframes float2 {
          0% { transform: translateY(0); }
          100% { transform: translateY(-24px); }
        }
      `}</style>
    </div>
  );
}

// Exported with ThemeProvider
function AppWithTheme() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default AppWithTheme;
