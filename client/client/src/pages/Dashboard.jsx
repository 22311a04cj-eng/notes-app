import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import NoteCard from '../components/NoteCard'
import NoteForm from '../components/NoteForm'

export default function Dashboard() {
  const { token, user } = useAuth()
  const [notes, setNotes] = useState([])
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editNote, setEditNote] = useState(null)

  const headers = { Authorization: `Bearer ${token}` }

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notes', { headers })
      setNotes(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => { fetchNotes() }, [])

  const handleAdd = async (form) => {
    try {
      await axios.post('http://localhost:5000/api/notes', form, { headers })
      fetchNotes()
      setShowForm(false)
    } catch (err) { console.log(err) }
  }

  const handleUpdate = async (form) => {
    try {
      await axios.put(`http://localhost:5000/api/notes/${editNote._id}`, form, { headers })
      fetchNotes()
      setEditNote(null)
    } catch (err) { console.log(err) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, { headers })
      fetchNotes()
    } catch (err) { console.log(err) }
  }

  const handlePin = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/notes/${id}/pin`, {}, { headers })
      fetchNotes()
    } catch (err) { console.log(err) }
  }

  // Get all unique tags
  const allTags = ['all', ...new Set(notes.flatMap(n => n.tags || []))]

  // Filter notes by search and tag
  const filteredNotes = notes
    .filter(n => selectedTag === 'all' || (n.tags || []).includes(selectedTag))
    .filter(n =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
    )

  const pinnedNotes = filteredNotes.filter(n => n.isPinned)
  const otherNotes = filteredNotes.filter(n => !n.isPinned)

  return (
    <div style={styles.page}>
      <Navbar user={user} />

      <div style={styles.container}>
        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <span style={styles.statNum}>{notes.length}</span>
            <span style={styles.statLabel}>Total Notes</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNum}>{pinnedNotes.length}</span>
            <span style={styles.statLabel}>Pinned</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNum}>
              {new Set(notes.flatMap(n => n.tags || [])).size}
            </span>
            <span style={styles.statLabel}>Tags Used</span>
          </div>
        </div>

        {/* Search Bar */}
        <input
          style={styles.search}
          placeholder="🔍 Search notes by title or content..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* Tag Filter Chips */}
        <div style={styles.tagRow}>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              style={{
                ...styles.tagChip,
                background: selectedTag === tag ? '#4f46e5' : '#e0e7ff',
                color: selectedTag === tag ? '#fff' : '#4338ca'
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* New Note Button */}
        <div style={styles.newBtnRow}>
          <button style={styles.newBtn} onClick={() => { setShowForm(!showForm); setEditNote(null) }}>
            {showForm ? '✕ Close' : '+ New Note'}
          </button>
        </div>

        {/* Note Form */}
        {showForm && !editNote && (
          <NoteForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        )}
        {editNote && (
          <NoteForm
            editNote={editNote}
            onSubmit={handleUpdate}
            onCancel={() => setEditNote(null)}
          />
        )}

        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <>
            <h3 style={styles.sectionTitle}>📌 PINNED</h3>
            <div style={styles.grid}>
              {pinnedNotes.map(note => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onDelete={handleDelete}
                  onEdit={(n) => { setEditNote(n); setShowForm(false) }}
                  onPin={handlePin}
                />
              ))}
            </div>
          </>
        )}

        {/* Other Notes */}
        {otherNotes.length > 0 && (
          <>
            <h3 style={styles.sectionTitle}>OTHER NOTES</h3>
            <div style={styles.grid}>
              {otherNotes.map(note => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onDelete={handleDelete}
                  onEdit={(n) => { setEditNote(n); setShowForm(false) }}
                  onPin={handlePin}
                />
              ))}
            </div>
          </>
        )}

        {filteredNotes.length === 0 && (
          <p style={styles.empty}>No notes found. Create your first note! 📝</p>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#f0f2f5' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' },
  statsRow: { display: 'flex', gap: '20px', marginBottom: '24px' },
  stat: {
    background: '#fff', padding: '16px 24px', borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex',
    flexDirection: 'column', alignItems: 'center', minWidth: '100px'
  },
  statNum: { fontSize: '28px', fontWeight: 'bold', color: '#4f46e5' },
  statLabel: { fontSize: '13px', color: '#6b7280' },
  search: {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1px solid #ddd', fontSize: '15px',
    marginBottom: '16px', boxSizing: 'border-box'
  },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' },
  tagChip: {
    padding: '6px 16px', borderRadius: '20px', border: 'none',
    cursor: 'pointer', fontSize: '13px', fontWeight: '500'
  },
  newBtnRow: { display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' },
  newBtn: {
    padding: '10px 24px', background: '#4f46e5', color: '#fff',
    border: 'none', borderRadius: '10px', cursor: 'pointer',
    fontSize: '15px', fontWeight: 'bold'
  },
  sectionTitle: { color: '#6b7280', fontSize: '13px', letterSpacing: '1px', marginBottom: '12px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px', marginBottom: '30px'
  },
  empty: { textAlign: 'center', color: '#9ca3af', fontSize: '16px', marginTop: '60px' }
}