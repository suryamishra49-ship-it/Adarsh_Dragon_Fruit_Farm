import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent }: NavbarProps) {
  const navigate = useNavigate();
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar" style={transparent ? { background: 'transparent', borderBottom: 'none', boxShadow: 'none' } : {}}>
      <Link to="/" className="nav-logo">
        Adarsh <span>Dragon Fruit Farm</span>
      </Link>
      <div className="nav-links">
        <Link to="/guide" className="nav-link hide-mobile">Guide</Link>
        <Link to="/scanner" className="nav-link hide-mobile">Lens Scanner</Link>
        <Link to="/marketplace" className="nav-link hide-mobile">Marketplace</Link>
        {user ? (
          <>
            <Link
              to={user.role === 'OWNER' ? '/admin' : '/dashboard'}
              className="nav-link hide-mobile"
            >
              Dashboard
            </Link>
            <Link to="/history" className="nav-link hide-mobile">History</Link>
            <button
              onClick={handleLogout}
              className="btn btn-pink"
              style={{ padding: '9px 20px', fontSize: '0.87rem' }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-green" style={{ padding: '9px 20px', fontSize: '0.87rem' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
