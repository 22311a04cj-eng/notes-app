export default function NoteCard({ note, onDelete, onEdit, onPin }) {
  return (
    <div style={{ ...styles.card, background: note.color || '#ffffff' }}>
      <div style={styles.topRow}>
        <h3 style={styles.title}>{note.title}</h3>
        <button
          style={{ ...styles.pinBtn, color: note.isPinned ? '#f59e0b' : '#aaa' }}
          onClick={() => onPin(note._id)}
          title={note.isPinned ? 'Unpin' : 'Pin'}
        >
          📌
        </button>
      </div>

      {note.isPinned && (
        <span style={styles.pinnedBadge}>📌 Pinned</span>
      )}

      <p style={styles.content}>
        {note.content?.slice(0, 100)}{note.content?.length > 100 ? '...' : ''}
      </p>

      <div style={styles.tagRow}>
        {note.tags?.map(tag => (
          <span key={tag} style={styles.tag}>#{tag}</span>
        ))}
      </div>

      <div style={styles.footer}>
        <span style={styles.date}>
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
        <div style={styles.actions}>
          <button style={styles.editBtn} onClick={() => onEdit(note)}>✏️ Edit</button>
          <button style={styles.deleteBtn} onClick={() => onDelete(note._id)}>🗑️ Delete</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    borderRadius: '12px', padding: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex', flexDirection: 'column', gap: '8px',
    wordBreak: 'break-word',
    overflow: 'hidden'
  },
  topRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', gap: '8px'
  },
  title: {
    margin: 0, fontSize: '17px', color: '#1f2937', fontWeight: 'bold',
    wordBreak: 'break-word',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    flex: 1
  },
  pinBtn: {
    background: 'none', border: 'none', fontSize: '18px',
    cursor: 'pointer', flexShrink: 0
  },
  pinnedBadge: {
    fontSize: '11px', background: '#fef3c7', color: '#92400e',
    padding: '2px 8px', borderRadius: '20px', width: 'fit-content'
  },
  content: {
    fontSize: '14px', color: '#4b5563', margin: 0,
    wordBreak: 'break-word',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  tag: {
    background: '#e0e7ff', color: '#4338ca',
    padding: '2px 10px', borderRadius: '20px', fontSize: '12px',
    whiteSpace: 'nowrap'
  },
  footer: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginTop: '8px'
  },
  date: { fontSize: '12px', color: '#9ca3af' },
  actions: { display: 'flex', gap: '8px' },
  editBtn: {
    padding: '6px 12px', background: '#e0e7ff', color: '#4338ca',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
  },
  deleteBtn: {
    padding: '6px 12px', background: '#fee2e2', color: '#dc2626',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
  }
}