import { useNavigate } from 'react-router-dom';
import { logout as clearAuth } from '../api/authAPI';
import { Button } from './Form';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return <Button variant="primary" type="button" className="black-btn set-btn" onClick={handleLogout}>Log Out</Button>
}
