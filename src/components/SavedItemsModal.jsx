import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import markets from '../data/markets.json';
import produceData from '../data/produce.json';
import { imgPath } from '../utils/markets.js';
import { useBookmarks } from '../hooks/useBookmarks.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { useMarketModal } from '../hooks/useMarketModal.jsx';
import { useProduceDetailModal } from '../hooks/useProduceDetailModal.jsx';
import Icon from './Icon.jsx';
import SupportModal from './SupportModal.jsx';

/* Content preserved from the former standalone Saved Items page —
   notes, export and removal all keep working inside the modal. */
function exportBookmarks(bookmarks) {
  const lines = ['FreshFind Saved Items', `Exported: ${new Date().toLocaleString()}`, ''];
  bookmarks.forEach((b) => {
    lines.push('━━━━━━━━━━━━━━━━━━━━');
    lines.push(`Name: ${b.name}`);
    lines.push(`Type: ${b.type === 'market' ? 'Farmers Market' : 'Produce Item'}`);
    if (b.location) lines.push(`Location: ${b.location}`);
    if (b.category) lines.push(`Category: ${b.category}`);
    lines.push(`Note: ${b.note || '(No note)'}`);
    lines.push(`Saved: ${new Date(b.savedAt).toLocaleString()}`);
    lines.push('');
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `freshfind-bookmarks-${Date.now()}.txt`;
  a.click();
}

function NoteEditor({ bookmark, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  if (editing) {
    return (
      <div className="d-flex align-items-center gap-2 mt-1">
        <input
          className="form-control form-control-sm"
          aria-label={`Note for ${bookmark.name}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button
          className="icon-btn p-1"
          aria-label={`Save note for ${bookmark.name}`}
          onClick={() => {
            onSave(draft);
            setEditing(false);
          }}
        >
          <Icon name="save" size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center gap-2 mt-1">
      <p className="small text-muted fst-italic mb-0 flex-grow-1 note-text">
        {bookmark.note || 'Add a personal note...'}
      </p>
      <button
        className="icon-btn p-1"
        aria-label={`Edit note for ${bookmark.name}`}
        onClick={() => {
          setDraft(bookmark.note || '');
          setEditing(true);
        }}
      >
        <Icon name="edit" size={14} />
      </button>
    </div>
  );
}

export default function SavedItemsModal({ open, onClose }) {
  const navigate = useNavigate();
  const { openMarket } = useMarketModal();
  const { openProduce } = useProduceDetailModal();
  const { bookmarks, removeBookmark, setNote } = useBookmarks();
  const showToast = useToast();

  const savedMarkets = bookmarks.filter((b) => b.type === 'market');
  const savedProduce = bookmarks.filter((b) => b.type === 'produce');

  const saveNote = (id) => (note) => {
    setNote(id, note);
    showToast('Note saved for this session. 📝');
  };

  // opening another modal or a different section — close this one first
  const closeThen = (fn) => {
    onClose();
    setTimeout(fn, 80);
  };

  return (
    <SupportModal
      open={open}
      onClose={onClose}
      wide
      icon="heart"
      title="Saved Items"
      intro={`${bookmarks.length} item${bookmarks.length !== 1 ? 's' : ''} saved — stored in your browser's local storage.`}
    >
      {bookmarks.length > 0 && (
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn-green"
            onClick={() => { exportBookmarks(bookmarks); showToast('Bookmarks exported successfully! 📥'); }}
          >
            <Icon name="download" size={16} /> Export Bookmarks
          </button>
        </div>
      )}

      {bookmarks.length === 0 ? (
        <div className="ff-card p-5 text-center">
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-4"
            style={{ width: 64, height: 64, background: '#f9eef1', color: '#c98a99' }}
          >
            <Icon name="heart" size={28} />
          </div>
          <h3 className="h5">No saved items yet</h3>
          <p className="text-muted small">
            Start exploring farmers' markets and produce items and save your favourites here for quick access.
          </p>
          <button className="btn-green me-2" onClick={() => closeThen(() => navigate('/markets'))}>
            <Icon name="store" size={16} /> Browse Markets
          </button>
          <button className="btn-outline-green" onClick={() => closeThen(() => navigate('/#produce'))}>
            <Icon name="carrot" size={16} /> Explore Produce
          </button>
        </div>
      ) : (
        <>
          {savedMarkets.length > 0 && (
            <>
              <h3 className="h6 mb-3"><Icon name="pin" size={16} /> Saved Markets ({savedMarkets.length})</h3>
              {savedMarkets.map((b) => {
                const m = markets.find((x) => `market-${x.id}` === b.id);
                return (
                  <div key={b.id} className="ff-card p-3 mb-3 d-flex gap-3">
                    {m && (
                      <img src={imgPath(m.image)} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12 }} />
                    )}
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <h4 className="h6 mb-1">{b.name}</h4>
                        <div>
                          {m && (
                            <button className="btn-green py-1 px-2 me-1" style={{ fontSize: 12 }} onClick={() => closeThen(() => openMarket(m.id))}>
                              View
                            </button>
                          )}
                          <button className="icon-btn" aria-label={`Remove ${b.name}`} onClick={() => removeBookmark(b.id)}>
                            <Icon name="trash" size={16} />
                          </button>
                        </div>
                      </div>
                      {b.location && (
                        <p className="small text-muted mb-1"><Icon name="pin" size={12} /> {b.location}</p>
                      )}
                      <NoteEditor bookmark={b} onSave={saveNote(b.id)} />
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {savedProduce.length > 0 && (
            <>
              <h3 className="h6 mb-3 mt-2"><Icon name="tag" size={16} /> Saved Produce ({savedProduce.length})</h3>
              {savedProduce.map((b) => {
                const p = produceData.find((x) => `produce-${x.id}` === b.id);
                return (
                  <div key={b.id} className="ff-card p-3 mb-3 d-flex gap-3">
                    <div className="p-thumb" style={{ width: 80, height: 80, borderRadius: 12, fontSize: '2rem' }}>
                      {p ? p.emoji : '🌿'}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <h4 className="h6 mb-1">{b.name}</h4>
                        <div>
                          {p && (
                            <button className="btn-green py-1 px-2 me-1" style={{ fontSize: 12 }} onClick={() => closeThen(() => openProduce(p.id))}>
                              View
                            </button>
                          )}
                          <button className="icon-btn" aria-label={`Remove ${b.name}`} onClick={() => removeBookmark(b.id)}>
                            <Icon name="trash" size={16} />
                          </button>
                        </div>
                      </div>
                      {b.category && <p className="small text-muted">{b.category}</p>}
                      <NoteEditor bookmark={b} onSave={saveNote(b.id)} />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </>
      )}
    </SupportModal>
  );
}
