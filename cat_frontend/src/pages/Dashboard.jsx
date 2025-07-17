// import UploadForm from '../components/UploadForm'
// import '../styles/Dashboard.css'
// import Sidebar from '../components/Sidebar'

// export default function Dashboard() {
//   return (
//     <div className="dashboard">
//       <Sidebar />
//       <div className="dashboard-content">
//         <h1>Welcome to your Dashboard</h1>
//         <UploadForm />
//       </div>
//     </div>
//   )
// }
import UploadForm from '../components/UploadForm'
import '../styles/Dashboard.css'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate();
  const taskCards = [
    {
      id: 1,
      taskName: "Task1",
      timing: "09:00 AM - 11:00 AM",
      machineId: "M001",
      status: "completed"
    },
    {
      id: 2,
      taskName: "Task2", 
      timing: "11:30 AM - 01:30 PM",
      machineId: "M002",
      status: "ongoing"
    },
    {
      id: 3,
      taskName: "Task3",
      timing: "02:00 PM - 04:00 PM", 
      machineId: "M003",
      status: "done"
    }
  ];

  const handleOngoingCardClick = () => {
    // Navigate to task detail page
    navigate('/task-detail');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ongoing':
        return '#FFCD00'; // Yellow for active
      case 'completed':
      case 'done':
        return '#666'; // Gray for inactive
      default:
        return '#666';
    }
  };

  const getCardClass = (status) => {
    return `task-card ${status === 'ongoing' ? 'active' : 'inactive'}`;
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Welcome to your Dashboard</h1>
        
        <div className="task-cards-container">
          {taskCards.map((task) => (
            <div
              key={task.id}
              className={getCardClass(task.status)}
              onClick={task.status === 'ongoing' ? handleOngoingCardClick : undefined}
              style={{ borderColor: getStatusColor(task.status) }}
            >
              <div className="task-header">
                <h3>{task.taskName}</h3>
                <span 
                  className={`status-badge ${task.status}`}
                  style={{ 
                    backgroundColor: getStatusColor(task.status),
                    color: task.status === 'ongoing' ? '#000' : '#fff'
                  }}
                >
                  {task.status.toUpperCase()}
                </span>
              </div>
              
              <div className="task-details">
                <div className="task-info">
                  <strong>Task Timing:</strong>
                  <span>{task.timing}</span>
                </div>
                
                <div className="task-info">
                  <strong>Machine ID:</strong>
                  <span>{task.machineId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}