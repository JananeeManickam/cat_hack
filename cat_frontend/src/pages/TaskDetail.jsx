import { useNavigate } from 'react-router-dom'
import TaskSideNav from '../components/TaskSideNav'
import '../styles/TaskDetail.css'

export default function TaskDetail() {
  const navigate = useNavigate();

  // Sample task data - you can pass this as props or fetch from state/API
  const taskData = {
    taskName: "Task2",
    timing: "11:30 AM - 01:30 PM",
    machineId: "M002",
    status: "ongoing",
    description: "Machine maintenance and calibration process",
    startTime: "11:30 AM",
    estimatedCompletion: "01:30 PM",
    priority: "High",
    assignedTo: "John Doe"
  };

  const handleTaskComplete = () => {
    // Here you can add logic to update task status in your backend
    console.log("Task marked as completed");
    // Navigate back to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="task-detail-page">
      <TaskSideNav onTaskComplete={handleTaskComplete} />
      <div className="task-detail-content">
        <div className="task-header">
          <h1>{taskData.taskName}</h1>
          <span className="status-badge ongoing">
            {taskData.status.toUpperCase()}
          </span>
        </div>
        <div className="task-detail-content">


  {/* New Cards */}
    <div className="task-info-grid">
      <a 
        href="../public/reports/report.pdf" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="info-card clickable-card"
      >
        <h3>Report Generated</h3>

      </a>

      <div className="info-card">
        <h3>Pre-Activity Checks</h3>
        <p>Checklist completed. Operator confirmed readiness.</p>
      </div>
    </div>

    {/* Task Actions */}
    <div className="task-actions">
      <button 
        className="btn-secondary"
        onClick={() => navigate('/dashboard')}
      >
        Back to Dashboard
      </button>
      <button 
        className="btn-primary"
        onClick={handleTaskComplete}
      >
        Mark as Complete
      </button>
    </div>
  </div>




      </div>
    </div>
  )
}