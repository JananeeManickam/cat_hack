import { useState } from 'react';
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

export default function TaskSideNav({ onTaskComplete }) {
  const [collapsed, setCollapsed] = useState(false);
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
        {/* Voice link */}
        <li onClick={() => navigate('/voice')}>
          <FaMicrophone />
          {!collapsed && <span>Voice</span>}
        </li>
      </ul>
    </div>
  );
}