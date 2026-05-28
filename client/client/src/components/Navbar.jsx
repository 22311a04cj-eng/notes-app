import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ user }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>📝 NoteSpace</h2>
      <div style={styles.right}>
        <span style={styles.username}>👤 {user?.name}</span>
        <button style={styles.btn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 30px', background: '#4f46e5', color: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
  },
  logo: { margin: 0, fontSize: '22px' },
  right: { display: 'flex', alignItems: 'center', gap: '16px' },
  username: { fontSize: '14px' },
  btn: {
    padding: '8px 16px', background: '#fff', color: '#4f46e5',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
  }
}