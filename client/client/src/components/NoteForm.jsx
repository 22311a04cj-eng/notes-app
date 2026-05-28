import { useState, useEffect } from 'react'

export default function NoteForm({ onSubmit, editNote, onCancel }) {
  const [form, setForm] = useState({
    title: '', content: '', tags: '', color: '#ffffff'
  })

  useEffect(() => {
    if (editNote) {
      setForm({
        title: editNote.title,
        content: editNote.content,
        tags: editNote.tags ? editNote.tags.join(', ') : '',
        color: editNote.color || '#ffffff'
      })
    }
  }, [editNote])

  const handleSubmit = () => {
    if (!form.title.trim()) return alert('Title is required!')

    let tagsArray = []
    if (form.tags && form.tags.trim() !== '') {
      tagsArray = form.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '')
    }

    console.log('Tags being sent:', tagsArray)

    onSubmit({ ...form, tags: tagsArray })
    setForm({ title: '', content: '', tags: '', color: '#ffffff' })
  }

  const colors = ['#ffffff', '#fef9c3', '#dcfce7', '#dbeafe', '#fce7f3', '#ede9fe']

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>{editNote ? '✏️ Edit Note' : '➕ New Note'}</h3>

      <input
        style={styles.input}
        placeholder="Title *"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        style={styles.textarea}
        placeholder="Content..."
        value={form.content}
        onChange={e => setForm({ ...form, content: e.target.value })}
      />
      <input
        style={styles.input}
        placeholder="Tags (comma separated) e.g. work, urgent, ideas"
        value={form.tags}
        onChange={e => setForm({ ...form, tags: e.target.value })}
      />

      {/* Tags Preview */}
      {form.tags && (
        <div style={styles.tagPreviewRow}>
          {form.tags.split(',').map((t, i) => t.trim() && (
            <span key={i} style={styles.tagPreview}>#{t.trim()}</span>
          ))}
        </div>
      )}

      <div style={styles.colorRow}>
        <span style={styles.colorLabel}>Card Color:</span>
        {colors.map(c => (
          <div
            key={c}
            onClick={() => setForm({ ...form, color: c })}
            style={{
              ...styles.colorCircle,
              background: c,
              border: form.color === c ? '3px solid #4f46e5' : '2px solid #ccc'
            }}
          />
        ))}
      </div>

      <div style={styles.btnRow}>
        <button style={styles.submitBtn} onClick={handleSubmit}>
          {editNote ? 'Update Note' : 'Add Note'}
        </button>
        {onCancel && (
          <button style={styles.cancelBtn} onClick={onCancel}>Cancel</button>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: '#fff', padding: '24px', borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '30px'
  },
  heading: { marginTop: 0, color: '#4f46e5' },
  input: {
    width: '100%', padding: '10px', marginBottom: '12px',
    borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '14px', boxSizing: 'border-box'
  },
  textarea: {
    width: '100%', padding: '10px', marginBottom: '12px',
    borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '14px', minHeight: '100px', resize: 'vertical',
    boxSizing: 'border-box'
  },
  tagPreviewRow: {
    display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px'
  },
  tagPreview: {
    background: '#e0e7ff', color: '#4338ca',
    padding: '2px 10px', borderRadius: '20px', fontSize: '12px'
  },
  colorRow: {
    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px'
  },
  colorLabel: { fontSize: '14px', color: '#555' },
  colorCircle: {
    width: '26px', height: '26px', borderRadius: '50%', cursor: 'pointer'
  },
  btnRow: { display: 'flex', gap: '12px' },
  submitBtn: {
    padding: '10px 24px', background: '#4f46e5', color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
  },
  cancelBtn: {
    padding: '10px 24px', background: '#e5e7eb', color: '#333',
    border: 'none', borderRadius: '8px', cursor: 'pointer'
  }
}