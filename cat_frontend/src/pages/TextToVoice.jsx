import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  FaCheck,
  FaArrowLeft,
  FaClipboardList,
  FaTools,
  FaChevronLeft,
  FaChevronRight,
  FaMicrophone
} from 'react-icons/fa';
import '../styles/TaskSideNav.css';

function TaskSideNav({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  return (
    <div className={`task-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="task-toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </div>
      <ul className="task-nav-links">
        <li onClick={() => navigate('/dashboard')}>
          <FaArrowLeft />
          {!collapsed && <span>Back to Dashboard</span>}
        </li>
        <li onClick={() => navigate('/task-detail')}>
          <FaClipboardList />
          {!collapsed && <span>Task Details</span>}
        </li>
        <li onClick={() => navigate('/tools')}>
          <FaTools />
          {!collapsed && <span>Tools</span>}
        </li>
        <li onClick={() => navigate('/catmachineterrainsystem')}>
          <FaCheck />
          {!collapsed && <span>Simulation</span>}
        </li>
        <li onClick={() => navigate('/voice')}>
          <FaMicrophone />
          {!collapsed && <span>Voice</span>}
        </li>
      </ul>
    </div>
  );
}

const SpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [backendResult, setBackendResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser does not support Speech Recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
    };

    recognition.onerror = (event) => {
      setTranscript("Error: " + event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    setIsRecording(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // This function sends transcript to /generate endpoint
  const sendToBackend = async () => {
    if (!transcript.trim()) {
      alert("Transcript is empty!");
      return;
    }
    setLoading(true);
    setBackendResult(null);
    try {
      // Change URL if your backend is hosted elsewhere
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript })
      });
      const result = await response.json();
      setBackendResult(result);
    } catch (error) {
      setBackendResult({ success: false, message: error.message });
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", minHeight: '100vh'  }}>
      <TaskSideNav collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ maxWidth: 500, margin: "auto", padding: 24, flex: 1 }}>
        <h2>Speech to Text</h2>
        <button
          onClick={isRecording ? stopListening : startListening}
          style={{
            background: isRecording ? "red" : "green",
            color: "white",
            fontSize: 20,
            padding: "10px 30px",
            border: "none",
            borderRadius: 8,
            marginRight: 16,
          }}
        >
          {isRecording ? "Stop" : "Start Listening"}
        </button>

        <button
          onClick={sendToBackend}
          disabled={!transcript || loading}
          style={{
            background: loading ? "#ccc" : "#FFCD00",
            color: "#222",
            fontWeight: 700,
            fontSize: 20,
            padding: "10px 30px",
            border: "none",
            borderRadius: 8,
            cursor: (!transcript || loading) ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Processing..." : "Send to Backend"}
        </button>

        <div style={{ margin: "24px 0", fontSize: 20, minHeight: 30 }}>
          {isRecording && <b style={{ color: "red" }}>Listening...</b>}
          {transcript && (
            <div>
              <b>Transcript:</b> <span>{transcript}</span>
            </div>
          )}
        </div>

        {backendResult && (
          <div style={{
            background: backendResult.success ? "#e5ffe5" : "#ffe5e5",
            color: backendResult.success ? "#159a54" : "red",
            border: `1px solid ${backendResult.success ? "#159a54" : "red"}`,
            marginTop: 24,
            padding: 16,
            borderRadius: 8
          }}>
            {backendResult.success
              ? (
                <div>
                  <b>Backend Success:</b> {backendResult.message}
                  {backendResult.audio_url &&
                    <div>
                      <audio controls src={backendResult.audio_url} />
                      <div>
                        <a href={backendResult.audio_url} download>
                          Download Audio
                        </a>
                      </div>
                    </div>
                  }
                </div>
              )
              : (
                <div>
                  <b>Backend Error:</b> {backendResult.message}
                </div>
              )
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechToText;