import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUpload,
  FaFolderOpen,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight, 
  FaComments
} from 'react-icons/fa';
import '../styles/Sidebar.css';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/logout');
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </div>

      <ul className="nav-links">
        <li onClick={() => navigate('/dashboard')}><FaUpload /> {!collapsed && 'Tasks'}</li>
        {/* <li onClick={() => navigate('/my_files')}><FaFolderOpen /> {!collapsed && 'My Files'}</li> */}
        {/* <li onClick={() => navigate('/chatbot')}><FaComments /> {!collapsed && 'Chatbot'}</li> */}
      </ul>

      <ul className="logout-link">
        <li onClick={handleLogout}><FaSignOutAlt /> {!collapsed && 'Logout'}</li>
      </ul>
    </div>
  );
}
