import { useState } from 'react'

const DEFAULT_METADATA = [
  { id: 'editorialUnit', name: 'Editorial Unit', group: 'planning', type: 'select', options: ['Sport', 'Politik', 'Kultur', 'Wirtschaft'] },
  { id: 'owner', name: 'Owner', group: 'planning', type: 'text' },
  { id: 'note', name: 'Note', group: 'planning', type: 'text', maxLength: 600 },
  { id: 'ideaBacklog', name: 'Idea Backlog', group: 'planning', type: 'boolean' },
  { id: 'estimatedTime', name: 'Estimated Time', group: 'planning', type: 'date' },
  { id: 'sentToFront', name: 'Sent to Front', group: 'frontpage', type: 'boolean' },
  { id: 'frontMessage', name: 'Front Message', group: 'frontpage', type: 'text', maxLength: 1800 },
  { id: 'frontStatus', name: 'Front Status', group: 'frontpage', type: 'select', options: ['Undecided', 'Today', 'Planning', 'Rejected'] },
  { id: 'distributionDate', name: 'Distribution Date', group: 'frontpage', type: 'date' },
  { id: 'position', name: 'Position', group: 'frontpage', type: 'select', options: ['Top', 'Mix'] },
  { id: 'placed', name: 'Placed', group: 'frontpage', type: 'boolean' },
]

const STATUS_COLORS = {
  Today: 'bg-emerald-100 text-emerald-700',
  Planning: 'bg-blue-100 text-blue-700',
  Rejected: 'bg-red-100 text-red-700',
  Undecided: 'bg-gray-100 text-gray-500',
}

const TYPE_COLORS = {
  Article: 'bg-violet-100 text-violet-700',
  Pitch: 'bg-amber-100 text-amber-700',
}

const GROUP_COLORS = {
  planning: 'bg-emerald-100 text-emerald-700',
  frontpage: 'bg-teal-100 text-teal-700',
}

const LD_GREEN = '#3DCB8B'

function matchesFilter(doc, filterJson) {
  if (!filterJson || filterJson.trim() === '{}' || filterJson.trim() === '') return true
  try {
    const filter = JSON.parse(filterJson)
    return Object.entries(filter).every(([key, value]) => {
      const docValue = doc.metadata?.[key]
      if (typeof value === 'boolean') return !!docValue === value
      return String(docValue) === String(value)
    })
  } catch {
    return false
  }
}

function Badge({ label, colorClass }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  )
}

function MetadataValue({ field, value }) {
  if (field.type === 'boolean') {
    return value
      ? <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white text-xs" style={{backgroundColor: LD_GREEN}}>✓</span>
      : <span className="text-gray-300">–</span>
  }
  if (field.type === 'select' && value) {
    const colorClass = field.id === 'frontStatus' ? (STATUS_COLORS[value] || 'bg-gray-100 text-gray-500') : 'bg-gray-100 text-gray-600'
    return <Badge label={value} colorClass={colorClass} />
  }
  if (!value) return <span className="text-gray-300">–</span>
  return <span className="text-sm text-gray-600 truncate max-w-32">{value}</span>
}

function FilterHelpPanel({ metadataDefinitions }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-2">
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Verfügbare Felder anzeigen
      </button>
      {open && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-3 py-2 text-gray-400 font-medium">ID</th>
                <th className="text-left px-3 py-2 text-gray-400 font-medium">Typ</th>
                <th className="text-left px-3 py-2 text-gray-400 font-medium">Werte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {metadataDefinitions.map(field => (
                <tr key={field.id} className="hover:bg-gray-50">
                  <td className="px-3 py-1.5"><code className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded font-mono">{field.id}</code></td>
                  <td className="px-3 py-1.5 text-gray-400">{field.type}</td>
                  <td className="px-3 py-1.5">
                    {field.type === 'boolean' && <span className="text-gray-400">true / false</span>}
                    {field.type === 'select' && <span className="text-gray-500">{field.options.join(', ')}</span>}
                    {field.type === 'date' && <span className="text-gray-400">YYYY-MM-DD</span>}
                    {field.type === 'text' && <span className="text-gray-400">Freitext</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function MetadataField({ field, value, onChange }) {
  if (field.type === 'boolean') {
    return (
      <label className="flex items-center gap-2 cursor-pointer group">
        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${value ? 'border-transparent' : 'border-gray-300 group-hover:border-gray-500'}`}
          style={value ? {backgroundColor: LD_GREEN} : {}}>
          {value && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
        <input type="checkbox" checked={!!value} onChange={e => onChange(field.id, e.target.checked)} className="sr-only" />
        <span className="text-sm text-gray-600">{field.name}</span>
      </label>
    )
  }
  if (field.type === 'select') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">{field.name}</label>
        <select value={value || ''} onChange={e => onChange(field.id, e.target.value)} className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2">
          <option value="">– wählen –</option>
          {field.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    )
  }
  if (field.type === 'date') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">{field.name}</label>
        <input type="date" value={value || ''} onChange={e => onChange(field.id, e.target.value)} className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2" />
      </div>
    )
  }
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">{field.name}</label>
      <input type="text" value={value || ''} maxLength={field.maxLength} onChange={e => onChange(field.id, e.target.value)} className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2" />
    </div>
  )
}

function EditDocumentModal({ doc, metadataDefinitions, onSave, onClose }) {
  const [title, setTitle] = useState(doc.title)
  const [type, setType] = useState(doc.type)
  const [values, setValues] = useState({ ...doc.metadata })

  const handleChange = (id, val) => setValues(v => ({ ...v, [id]: val }))
  const handleSave = () => {
    if (!title.trim()) return alert('Titel fehlt')
    onSave(doc.id, { title, type, metadata: values })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Dokument bearbeiten</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Titel</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Typ</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2">
                <option>Article</option>
                <option>Pitch</option>
              </select>
            </div>
          </div>
          {['planning', 'frontpage'].map(group => (
            <div key={group} className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{group}</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="grid grid-cols-1 gap-3">
                {metadataDefinitions.filter(f => f.group === group).map(f => (
                  <MetadataField key={f.id} field={f} value={values[f.id]} onChange={handleChange} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Abbrechen</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm rounded-lg text-white font-medium" style={{backgroundColor: LD_GREEN}}>Speichern</button>
        </div>
      </div>
    </div>
  )
}

function DocumentModal({ metadataDefinitions, onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('Article')
  const [values, setValues] = useState({})

  const handleChange = (id, val) => setValues(v => ({ ...v, [id]: val }))
  const handleSave = () => {
    if (!title.trim()) return alert('Titel fehlt')
    onSave({ title, type, metadata: values })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Neues Dokument</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Titel</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2" placeholder="Artikel-Titel" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Typ</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2">
                <option>Article</option>
                <option>Pitch</option>
              </select>
            </div>
          </div>
          {['planning', 'frontpage'].map(group => (
            <div key={group} className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{group}</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="grid grid-cols-1 gap-3">
                {metadataDefinitions.filter(f => f.group === group).map(f => (
                  <MetadataField key={f.id} field={f} value={values[f.id]} onChange={handleChange} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Abbrechen</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm rounded-lg text-white font-medium" style={{backgroundColor: LD_GREEN}}>Speichern</button>
        </div>
      </div>
    </div>
  )
}

function DocumentCard({ doc, metadataDefinitions, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [values, setValues] = useState(doc.metadata)

  const handleChange = (id, val) => {
    const updated = { ...values, [id]: val }
    setValues(updated)
    onUpdate(doc.id, { metadata: updated })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <Badge label={doc.type} colorClass={TYPE_COLORS[doc.type] || 'bg-gray-100 text-gray-600'} />
          <span className="font-medium text-sm text-gray-900 truncate">{doc.title}</span>
          {doc.metadata?.frontStatus && <Badge label={doc.metadata.frontStatus} colorClass={STATUS_COLORS[doc.metadata.frontStatus] || 'bg-gray-100 text-gray-500'} />}
          {doc.metadata?.editorialUnit && <span className="text-xs text-gray-400">{doc.metadata.editorialUnit}</span>}
        </div>
        <div className="flex items-center gap-1 ml-3 shrink-0">
          <button onClick={() => setExpanded(e => !e)} className="px-2.5 py-1 text-xs rounded-md text-gray-500 hover:bg-gray-100">{expanded ? 'Schliessen' : 'Bearbeiten'}</button>
          <button onClick={() => onDelete(doc.id)} className="px-2.5 py-1 text-xs rounded-md text-red-400 hover:bg-red-50">Löschen</button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4">
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-400 mb-1">Typ</label>
            <select value={doc.type} onChange={e => onUpdate(doc.id, { type: e.target.value })} className="border border-gray-200 rounded-md px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2">
              <option>Article</option>
              <option>Pitch</option>
            </select>
          </div>
          {['planning', 'frontpage'].map(group => (
            <div key={group} className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{group}</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {metadataDefinitions.filter(f => f.group === group).map(f => (
                  <MetadataField key={f.id} field={f} value={values[f.id]} onChange={handleChange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── DashboardCard ────────────────────────────────────────────────────────────
function DashboardCard({ dashboard, documents, metadataDefinitions, onUpdate, onDelete, onUpdateDocument }) {
  const [editingFilter, setEditingFilter] = useState(false)
  const [editingColumns, setEditingColumns] = useState(false)
  const [filterDraft, setFilterDraft] = useState(dashboard.filterJson || '{}')
  const [filterError, setFilterError] = useState(false)
  const [editingDoc, setEditingDoc] = useState(null)
  const [showAll, setShowAll] = useState(false)

  const PREVIEW_COUNT = 4
  const visibleColumns = dashboard.visibleColumns || ['editorialUnit', 'owner', 'frontStatus']
  const matchingDocs = documents.filter(doc => matchesFilter(doc, dashboard.filterJson))
  const displayedDocs = showAll ? matchingDocs : matchingDocs.slice(0, PREVIEW_COUNT)
  const hiddenCount = matchingDocs.length - PREVIEW_COUNT
  const columns = metadataDefinitions.filter(f => visibleColumns.includes(f.id))

  const toggleColumn = (id) => {
    const updated = visibleColumns.includes(id)
      ? visibleColumns.filter(c => c !== id)
      : [...visibleColumns, id]
    onUpdate(dashboard.id, { visibleColumns: updated })
  }

  const saveFilter = () => {
    try {
      JSON.parse(filterDraft)
      onUpdate(dashboard.id, { filterJson: filterDraft })
      setFilterError(false)
      setEditingFilter(false)
    } catch {
      setFilterError(true)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {editingDoc && (
        <EditDocumentModal
          doc={editingDoc}
          metadataDefinitions={metadataDefinitions}
          onSave={(id, changes) => { onUpdateDocument(id, changes); setEditingDoc(null) }}
          onClose={() => setEditingDoc(null)}
        />
      )}

      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <input type="text" value={dashboard.name} onChange={e => onUpdate(dashboard.id, { name: e.target.value })} className="font-semibold text-sm text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-gray-600 outline-none transition-colors" />
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-gray-400">Rolle:</span>
              <input type="text" value={dashboard.role} onChange={e => onUpdate(dashboard.id, { role: e.target.value })} className="text-xs text-gray-500 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-gray-500 outline-none w-32 transition-colors" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-bold" style={{backgroundColor: LD_GREEN}}>{matchingDocs.length}</span>
            <span className="text-xs text-gray-400">Dokument{matchingDocs.length !== 1 ? 'e' : ''}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => { setEditingColumns(c => !c); setEditingFilter(false) }} className="px-2.5 py-1 text-xs rounded-md transition-colors" style={editingColumns ? {backgroundColor: LD_GREEN, color: 'white'} : {color: '#6b7280'}}>Spalten</button>
          <button onClick={() => { setEditingFilter(f => !f); setEditingColumns(false) }} className="px-2.5 py-1 text-xs rounded-md transition-colors" style={editingFilter ? {backgroundColor: LD_GREEN, color: 'white'} : {color: '#6b7280'}}>Filter</button>
          <button onClick={() => onDelete(dashboard.id)} className="px-2.5 py-1 text-xs rounded-md text-red-400 hover:bg-red-50">Löschen</button>
        </div>
      </div>

      {editingColumns && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2">Sichtbare Spalten</p>
          <div className="flex flex-wrap gap-2">
            {metadataDefinitions.map(field => {
              const active = visibleColumns.includes(field.id)
              return (
                <button key={field.id} onClick={() => toggleColumn(field.id)} className="px-2.5 py-1 text-xs rounded-lg border transition-colors" style={active ? {backgroundColor: LD_GREEN, color: 'white', borderColor: LD_GREEN} : {backgroundColor: 'white', color: '#6b7280', borderColor: '#e5e7eb'}}>
                  {field.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {editingFilter && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-xs text-gray-500 mb-2">
            Filter als JSON – Beispiel: <code className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-xs">{`{"frontStatus":"Today","sentToFront":true}`}</code>
          </p>
          <textarea value={filterDraft} onChange={e => { setFilterDraft(e.target.value); setFilterError(false) }} rows={3} className={`w-full font-mono text-xs border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${filterError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`} />
          {filterError && <p className="text-xs text-red-500 mt-1">Ungültiges JSON</p>}
          <FilterHelpPanel metadataDefinitions={metadataDefinitions} />
          <button onClick={saveFilter} className="mt-3 px-3 py-1.5 text-xs text-white rounded-lg font-medium" style={{backgroundColor: LD_GREEN}}>Übernehmen</button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Titel</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Typ</th>
              {columns.map(col => (
                <th key={col.id} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{col.name}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {matchingDocs.length === 0 && (
              <tr><td colSpan={2 + columns.length} className="px-4 py-8 text-center text-xs text-gray-300">Keine Dokumente entsprechen dem Filter.</td></tr>
            )}
            {displayedDocs.map(doc => (
              <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <button onClick={() => setEditingDoc(doc)} className="font-medium text-gray-900 hover:underline text-left transition-colors" onMouseEnter={e => e.target.style.color = LD_GREEN} onMouseLeave={e => e.target.style.color = 'inherit'}>
                    {doc.title}
                  </button>
                </td>
                <td className="px-4 py-2.5"><Badge label={doc.type} colorClass={TYPE_COLORS[doc.type] || 'bg-gray-100 text-gray-600'} /></td>
                {columns.map(col => (
                  <td key={col.id} className="px-4 py-2.5 whitespace-nowrap">
                    <MetadataValue field={col} value={doc.metadata?.[col.id]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {matchingDocs.length > PREVIEW_COUNT && (
        <div className="border-t border-gray-100">
          <button
            onClick={() => setShowAll(s => !s)}
            className="w-full px-4 py-2.5 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <svg className={`w-3.5 h-3.5 transition-transform ${showAll ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showAll ? 'Weniger anzeigen' : `${hiddenCount} weitere Dokumente anzeigen`}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Metadata Editor ──────────────────────────────────────────────────────────
function MetadataEditor({ metadataDefinitions, onChange }) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(null)
  const [newOptionInput, setNewOptionInput] = useState('')

  const startEdit = (field) => {
    setEditingId(field.id)
    setDraft({ ...field, options: field.options ? [...field.options] : [] })
    setNewOptionInput('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft(null)
  }

  const saveEdit = () => {
    onChange(metadataDefinitions.map(f => f.id === editingId ? { ...draft } : f))
    setEditingId(null)
    setDraft(null)
  }

  const deleteField = (id) => {
    if (!confirm('Metadatum löschen? Bestehende Dokumente behalten den Wert, er wird aber nicht mehr angezeigt.')) return
    onChange(metadataDefinitions.filter(f => f.id !== id))
  }

  const addNew = () => {
    const id = `field_${Date.now()}`
    const newField = { id, name: 'Neues Feld', group: 'planning', type: 'text' }
    onChange([...metadataDefinitions, newField])
    startEdit(newField)
  }

  const addOption = () => {
    const val = newOptionInput.trim()
    if (!val || draft.options.includes(val)) return
    setDraft(d => ({ ...d, options: [...d.options, val] }))
    setNewOptionInput('')
  }

  const removeOption = (opt) => setDraft(d => ({ ...d, options: d.options.filter(o => o !== opt) }))

  const groups = ['planning', 'frontpage']

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Metadaten</h2>
        <button onClick={addNew} className="px-3 py-1.5 text-sm text-white rounded-lg font-medium flex items-center gap-1.5" style={{backgroundColor: LD_GREEN}}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          Metadatum anlegen
        </button>
      </div>

      {groups.map(group => (
        <div key={group} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{group}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {metadataDefinitions.filter(f => f.group === group).length === 0 && (
              <p className="px-4 py-4 text-xs text-gray-300 italic">Keine Felder in dieser Gruppe.</p>
            )}
            {metadataDefinitions.filter(f => f.group === group).map((field, idx, arr) => (
              <div key={field.id} className={idx < arr.length - 1 ? 'border-b border-gray-100' : ''}>
                {/* Anzeigezeile */}
                {editingId !== field.id && (
                  <div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-medium text-sm text-gray-800">{field.name}</span>
                      <code className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-xs font-mono">{field.id}</code>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{field.type}</span>
                      {field.type === 'select' && field.options?.length > 0 && (
                        <span className="text-xs text-gray-400 truncate max-w-48">{field.options.join(', ')}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-3">
                      <button onClick={() => startEdit(field)} className="px-2.5 py-1 text-xs rounded-md text-gray-500 hover:bg-gray-100">Bearbeiten</button>
                      <button onClick={() => deleteField(field.id)} className="px-2.5 py-1 text-xs rounded-md text-red-400 hover:bg-red-50">Löschen</button>
                    </div>
                  </div>
                )}

                {/* Edit-Panel */}
                {editingId === field.id && draft && (
                  <div className="px-4 py-4 bg-gray-50 border-l-2" style={{borderLeftColor: LD_GREEN}}>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Name</label>
                        <input
                          type="text"
                          value={draft.name}
                          onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                          className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Typ</label>
                        <select
                          value={draft.type}
                          onChange={e => setDraft(d => ({ ...d, type: e.target.value, options: e.target.value === 'select' ? (d.options || []) : [] }))}
                          className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2"
                        >
                          <option value="text">text</option>
                          <option value="boolean">boolean</option>
                          <option value="select">select</option>
                          <option value="date">date</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-400 mb-1">Gruppe</label>
                      <div className="flex gap-2">
                        {['planning', 'frontpage'].map(g => (
                          <button
                            key={g}
                            onClick={() => setDraft(d => ({ ...d, group: g }))}
                            className="px-3 py-1 text-xs rounded-lg border transition-colors"
                            style={draft.group === g
                              ? {backgroundColor: LD_GREEN, color: 'white', borderColor: LD_GREEN}
                              : {backgroundColor: 'white', color: '#6b7280', borderColor: '#e5e7eb'}
                            }
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    {draft.type === 'select' && (
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-400 mb-2">Optionen</label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {draft.options.map(opt => (
                            <span key={opt} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                              {opt}
                              <button onClick={() => removeOption(opt)} className="text-gray-400 hover:text-red-500">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </span>
                          ))}
                          {draft.options.length === 0 && <span className="text-xs text-gray-300 italic">Noch keine Optionen</span>}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newOptionInput}
                            onChange={e => setNewOptionInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addOption()}
                            placeholder="Option hinzufügen…"
                            className="flex-1 border border-gray-200 rounded-md px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2"
                          />
                          <button onClick={addOption} className="px-3 py-1.5 text-xs rounded-md text-white font-medium" style={{backgroundColor: LD_GREEN}}>
                            Hinzufügen
                          </button>
                        </div>
                      </div>
                    )}

                    {draft.type === 'text' && (
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-400 mb-1">Max. Zeichen (optional)</label>
                        <input
                          type="number"
                          value={draft.maxLength || ''}
                          onChange={e => setDraft(d => ({ ...d, maxLength: e.target.value ? parseInt(e.target.value) : undefined }))}
                          className="w-32 border border-gray-200 rounded-md px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2"
                          placeholder="z.B. 600"
                        />
                      </div>
                    )}

                    <div className="flex gap-2 mt-1">
                      <button onClick={saveEdit} className="px-3 py-1.5 text-xs rounded-lg text-white font-medium" style={{backgroundColor: LD_GREEN}}>Speichern</button>
                      <button onClick={cancelEdit} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100">Abbrechen</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Filter-Beispiele */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filter-Beispiele</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 gap-2">
          {metadataDefinitions.filter(f => f.type === 'select' || f.type === 'boolean').slice(0, 5).map(field => (
            <div key={field.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">{field.name}</span>
              <code className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-mono shrink-0">
                {field.type === 'boolean'
                  ? `{"${field.id}": true}`
                  : `{"${field.id}": "${field.options?.[0] || 'Wert'}"}`
                }
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Multiselect Dropdown ─────────────────────────────────────────────────────
function MultiSelectDropdown({ documents, selectedIds, onChange }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = documents.filter(d => d.title.toLowerCase().includes(search.toLowerCase()))
  const selectedDocs = documents.filter(d => selectedIds.includes(d.id))

  const toggle = (id) => {
    onChange(selectedIds.includes(id)
      ? selectedIds.filter(s => s !== id)
      : [...selectedIds, id]
    )
  }

  const clearAll = () => onChange([])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-left hover:border-gray-300 transition-colors"
      >
        <span className="text-gray-600 truncate">
          {selectedIds.length === 0
            ? 'Artikel auswählen…'
            : `${selectedIds.length} Artikel ausgewählt`}
        </span>
        <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Suchen…"
              className="w-full text-sm outline-none bg-transparent text-gray-700 placeholder-gray-300"
            />
          </div>
          <div className="max-h-56 overflow-y-auto divide-y divide-gray-50">
            {filtered.length === 0 && <p className="px-3 py-3 text-xs text-gray-300">Keine Treffer</p>}
            {filtered.map(doc => {
              const active = selectedIds.includes(doc.id)
              return (
                <button
                  key={doc.id}
                  onClick={() => toggle(doc.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                    style={active ? {backgroundColor: LD_GREEN, borderColor: LD_GREEN} : {borderColor: '#d1d5db'}}>
                    {active && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-sm text-gray-700 truncate">{doc.title}</span>
                  {doc.metadata?.editorialUnit && <span className="text-xs text-gray-400 shrink-0">{doc.metadata.editorialUnit}</span>}
                </button>
              )
            })}
          </div>
          {selectedIds.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs text-gray-400">{selectedIds.length} ausgewählt</span>
              <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-600">Alle entfernen</button>
            </div>
          )}
        </div>
      )}

      {/* Selected pills */}
      {selectedDocs.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedDocs.map(doc => (
            <span key={doc.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{backgroundColor: LD_GREEN}}>
              {doc.title}
              <button onClick={() => toggle(doc.id)} className="hover:opacity-70">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Simulation View ──────────────────────────────────────────────────────────
// ─── Simulation View ──────────────────────────────────────────────────────────
function SimulationView({ documents, dashboards }) {
  const [selectedIds, setSelectedIds] = useState([])

  if (dashboards.length === 0 || documents.length === 0) {
    return (
      <div className="text-center py-16 text-gray-300">
        <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
        </svg>
        <p className="text-sm">Mindestens ein Dokument und ein Dashboard erforderlich.</p>
      </div>
    )
  }

  const truncate = (str, n = 25) => str.length > n ? str.slice(0, n).trimEnd() + '…' : str
  const selectedDocs = documents.filter(d => selectedIds.includes(d.id))
  const hasSelection = selectedIds.length > 0

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Simulation</h2>
      </div>

      <div className="mb-6 max-w-xl">
        <MultiSelectDropdown documents={documents} selectedIds={selectedIds} onChange={setSelectedIds} />
      </div>

      <div className="flex flex-col gap-0 rounded-xl overflow-hidden border border-gray-200">
        {dashboards.map((dashboard, idx) => {
          const allMatchingDocs = documents.filter(doc => matchesFilter(doc, dashboard.filterJson))
          const docsToShow = hasSelection
            ? selectedDocs.filter(doc => matchesFilter(doc, dashboard.filterJson))
            : allMatchingDocs
          const isLast = idx === dashboards.length - 1

          return (
            <div key={dashboard.id} className={`flex items-stretch ${!isLast ? 'border-b border-gray-200' : ''}`}>
              {/* Lane Label */}
              <div className="w-48 shrink-0 px-4 py-4 bg-gray-50 border-r border-gray-200 flex flex-col justify-center">
                <div className="text-sm font-semibold text-gray-800">{dashboard.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{dashboard.role}</div>
                <div className="text-xs mt-1.5" style={{color: LD_GREEN}}>
                  {allMatchingDocs.length} Dokument{allMatchingDocs.length !== 1 ? 'e' : ''}
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 px-4 py-3 bg-white flex flex-wrap gap-2 items-center min-h-14">
                {docsToShow.length === 0 && (
                  <span className="text-xs text-gray-300 italic">
                    {hasSelection ? 'Kein ausgewählter Artikel hier' : 'Keine Dokumente'}
                  </span>
                )}
                {docsToShow.map(doc => (
                  <div
                    key={doc.id}
                    title={doc.title}
                    className="px-2.5 py-1 rounded-lg border text-xs font-medium transition-all"
                    style={hasSelection ? {
                      backgroundColor: LD_GREEN,
                      color: 'white',
                      borderColor: LD_GREEN,
                      boxShadow: '0 2px 8px rgba(61,203,139,0.25)',
                    } : {
                      backgroundColor: 'white',
                      color: '#6b7280',
                      borderColor: '#e5e7eb',
                    }}
                  >
                    {truncate(doc.title)}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {hasSelection && (
        <p className="text-xs text-gray-400 mt-3">
          Nur ausgewählte Artikel werden angezeigt · Hover über eine Karte für den vollen Titel
        </p>
      )}
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [metadataDefinitions, setMetadataDefinitions] = useState(DEFAULT_METADATA)
  const [documents, setDocuments] = useState([])
  const [dashboards, setDashboards] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('documents')
  const [clientName, setClientName] = useState('')
  const [editingClient, setEditingClient] = useState(false)

  const addDocument = (doc) => setDocuments(d => [...d, { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...doc }])
  const updateDocument = (id, changes) => setDocuments(d => d.map(doc => doc.id === id ? { ...doc, ...changes } : doc))
  const deleteDocument = (id) => setDocuments(d => d.filter(doc => doc.id !== id))

  const addDashboard = () => setDashboards(d => [...d, {
    id: crypto.randomUUID(),
    name: 'Neues Dashboard',
    role: 'Rolle',
    filterJson: '{}',
    visibleColumns: ['editorialUnit', 'owner', 'frontStatus'],
  }])
  const updateDashboard = (id, changes) => setDashboards(d => d.map(db => db.id === id ? { ...db, ...changes } : db))
  const deleteDashboard = (id) => setDashboards(d => d.filter(db => db.id !== id))

  const exportState = () => {
    const slug = clientName.trim()
      ? clientName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : 'export'
    const blob = new Blob([JSON.stringify({ clientName, metadataDefinitions, documents, dashboards }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `livingdocs-simulator-${slug}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importState = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.documents) setDocuments(data.documents)
        if (data.dashboards) setDashboards(data.dashboards)
        if (data.metadataDefinitions) setMetadataDefinitions(data.metadataDefinitions)
        if (data.clientName) setClientName(data.clientName)
      } catch { alert('Ungültiges JSON') }
    }
    reader.readAsText(file)
  }

  const tabs = [
    { key: 'documents', label: 'Dokumente', count: documents.length },
    { key: 'dashboards', label: 'Dashboards', count: dashboards.length },
    { key: 'simulation', label: 'Simulation', count: null },
    { key: 'metadata', label: 'Metadaten', count: null },
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {showModal && <DocumentModal metadataDefinitions={metadataDefinitions} onSave={addDocument} onClose={() => setShowModal(false)} />}

      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Livingdocs" className="w-7 h-7 rounded-full" />
          <div>
            <div className="font-semibold text-sm text-gray-900 leading-tight">Livingdocs</div>
            <div className="text-xs text-gray-400 leading-tight">Editorial Workflow Simulator</div>
          </div>
          <div className="ml-4 pl-4 border-l border-gray-200">
            {editingClient ? (
              <input autoFocus type="text" value={clientName} onChange={e => setClientName(e.target.value)} onBlur={() => setEditingClient(false)} onKeyDown={e => e.key === 'Enter' && setEditingClient(false)} placeholder="Kundenname" className="text-sm border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent w-40" />
            ) : (
              <button onClick={() => setEditingClient(true)} className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
                {clientName || <span className="text-gray-300">Kunde hinzufügen</span>}
                <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" /></svg>
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportState} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">Export JSON</button>
          <label className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium cursor-pointer">
            Import JSON
            <input type="file" accept=".json" onChange={importState} className="hidden" />
          </label>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === tab.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                  style={activeTab === tab.key ? {backgroundColor: LD_GREEN, color: 'white'} : {backgroundColor: '#e5e7eb', color: '#6b7280'}}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'documents' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Dokumente</h2>
              <button onClick={() => setShowModal(true)} className="px-3 py-1.5 text-sm text-white rounded-lg font-medium flex items-center gap-1.5" style={{backgroundColor: LD_GREEN}}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Dokument erstellen
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {documents.length === 0 && (
                <div className="text-center py-16 text-gray-300">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <p className="text-sm">Noch keine Dokumente</p>
                </div>
              )}
              {documents.map(doc => (
                <DocumentCard key={doc.id} doc={doc} metadataDefinitions={metadataDefinitions} onUpdate={updateDocument} onDelete={deleteDocument} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'dashboards' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Dashboards</h2>
              <button onClick={addDashboard} className="px-3 py-1.5 text-sm text-white rounded-lg font-medium flex items-center gap-1.5" style={{backgroundColor: LD_GREEN}}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Dashboard erstellen
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {dashboards.length === 0 && (
                <div className="text-center py-16 text-gray-300">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
                  <p className="text-sm">Noch keine Dashboards</p>
                </div>
              )}
              {dashboards.map(db => (
                <DashboardCard key={db.id} dashboard={db} documents={documents} metadataDefinitions={metadataDefinitions} onUpdate={updateDashboard} onDelete={deleteDashboard} onUpdateDocument={updateDocument} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'simulation' && (
          <SimulationView documents={documents} dashboards={dashboards} />
        )}

        {activeTab === 'metadata' && <MetadataEditor metadataDefinitions={metadataDefinitions} onChange={setMetadataDefinitions} />}
      </div>
    </div>
  )
}