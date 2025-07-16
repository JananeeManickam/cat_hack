import UploadForm from '../components/UploadForm'
import '../styles/Dashboard.css'
import Sidebar from '../components/Sidebar'

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Welcome to your Dashboard</h1>
        <UploadForm />
      </div>
    </div>
  )
}
