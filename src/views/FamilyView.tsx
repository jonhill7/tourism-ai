import { useRef, useState } from 'react'
import { useAppState, addKid, updateKid, removeKid, exportJson, importJson } from '../lib/store'
import { ageOf, fmtMonth, graduationDate } from '../lib/age'

export default function FamilyView() {
  const state = useAppState()
  const [name, setName] = useState('')
  const [birth, setBirth] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const add = () => {
    if (!name.trim() || !/^\d{4}-\d{2}$/.test(birth)) {
      setMessage('A name and a birth month (like 2012-07) are both needed.')
      return
    }
    addKid(name.trim(), birth)
    setName('')
    setBirth('')
    setMessage(null)
  }

  const doExport = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quest-tree-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const doImport = async (file: File) => {
    const text = await file.text()
    const error = importJson(text)
    setMessage(error ?? 'Backup restored.')
  }

  return (
    <div className="family">
      <header className="page-head">
        <h1>👨‍👩‍👧‍👦 Family</h1>
        <p className="lead">
          One shared tree, each kid at their own place in it. Everything lives in this browser only —
          export a backup to keep it safe or move it to another device.
        </p>
      </header>

      <section>
        <h2 className="section-title">Kids</h2>
        {state.kids.length === 0 && <p className="muted">No kids yet — add your crew below.</p>}
        <div className="kid-list">
          {state.kids.map((k) => (
            <div className="kid-row" key={k.id}>
              <input
                className="kid-name-input"
                value={k.name}
                onChange={(e) => updateKid(k.id, { name: e.target.value })}
                aria-label="Kid name"
              />
              <label className="kid-field">
                born
                <input
                  type="month"
                  value={k.birthdate}
                  onChange={(e) => updateKid(k.id, { birthdate: e.target.value })}
                />
              </label>
              <span className="muted">age {ageOf(k)}</span>
              <label className="kid-field">
                adulthood date
                <input
                  type="month"
                  value={k.adulthoodDate ?? ''}
                  placeholder="declare it"
                  onChange={(e) => updateKid(k.id, { adulthoodDate: e.target.value || undefined })}
                />
              </label>
              <span className="muted small">
                {k.adulthoodDate
                  ? `declared: ${fmtMonth(new Date(k.adulthoodDate + '-15'))}`
                  : `graduation ≈ ${fmtMonth(graduationDate(k))}`}
              </span>
              <button
                className="ghost-btn danger"
                onClick={() => {
                  if (confirm(`Remove ${k.name} and all their progress? This can't be undone.`))
                    removeKid(k.id)
                }}
              >
                remove
              </button>
            </div>
          ))}
        </div>
        <div className="kid-add">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <input type="month" value={birth} onChange={(e) => setBirth(e.target.value)} />
          <button className="primary-btn" onClick={add}>
            add kid
          </button>
        </div>
        {message && <p className="form-message">{message}</p>}
      </section>

      <section>
        <h2 className="section-title">Backup & sharing</h2>
        <p className="muted">
          The export includes kids, progress, granted unlocks, and your emancipation-age edits. Another
          family importing your file gets your customizations too — that's how the tree travels.
        </p>
        <div className="backup-buttons">
          <button className="primary-btn" onClick={doExport}>
            ⬇ export backup
          </button>
          <button className="ghost-btn" onClick={() => fileRef.current?.click()}>
            ⬆ import backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void doImport(f)
              e.target.value = ''
            }}
          />
        </div>
      </section>
    </div>
  )
}
