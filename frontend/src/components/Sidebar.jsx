import { NavLink } from 'react-router-dom';
import { Home, Briefcase, Users, FileText, CheckSquare } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-container">
                    <div className="logo-icon">⚖️</div>
                    <h2>Legal Tech</h2>
                </div>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                            <Home size={20} />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/cases">
                            <Briefcase size={20} />
                            <span>Cases</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/clients">
                            <Users size={20} />
                            <span>Clients</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/documents">
                            <FileText size={20} />
                            <span>Documents</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/tasks">
                            <CheckSquare size={20} />
                            <span>Tasks</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

        </aside>
    );
};

export default Sidebar;
