import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import AuthForm from './pages/Login'
import Logout from './pages/Logout'
import MyFiles from './pages/MyFiles'
import EditFile from './components/EditFile'
import ChatbotPage from './components/ChatbotLayout'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/my_files" element={<MyFiles />} />
        <Route path="/edit/:fileId" element={<EditFile />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Routes>
    </Router>
  )
}

export default App
