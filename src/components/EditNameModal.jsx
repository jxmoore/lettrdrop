import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from './Modal';
import Btn from './Btn';
import { checkDisplayNameAvailable, updateProfile } from '../services/auth';
import { setProfile } from '../store/slices/profileSlice';

/**
 * Edit display name modal — overlays the Profile page.
 * Props:
 *   onClose  — called on cancel or after successful save
 */
export default function EditNameModal({ onClose }) {
  const dispatch = useDispatch();
  const userId = useSelector((s) => s.session.userId);
  const currentName = useSelector((s) => s.profile.displayName);

  const [name, setName] = useState(currentName || '');
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null); // null | true | false
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const debounce = useRef(null);

  // Debounced availability check
  useEffect(() => {
    const trimmed = name.trim();

    // Same as current name — no need to check
    if (trimmed === currentName) {
      setAvailable(null);
      setChecking(false);
      return;
    }

    if (trimmed.length < 2) {
      setAvailable(null);
      setChecking(false);
      return;
    }

    setChecking(true);
    setAvailable(null);

    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      try {
        const ok = await checkDisplayNameAvailable(trimmed);
        setAvailable(ok);
      } catch {
        setAvailable(null);
      }
      setChecking(false);
    }, 400);

    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [name, currentName]);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) return;
    if (trimmed === currentName) { onClose(); return; }
    if (available !== true) return;

    setSaving(true);
    setError('');
    try {
      await updateProfile(userId, { display_name: trimmed });
      dispatch(setProfile({
        displayName: trimmed,
        avatarInitial: trimmed[0].toUpperCase(),
      }));
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update name');
      setSaving(false);
    }
  };

  const canSave = name.trim().length >= 2
    && name.trim() !== currentName
    && available === true
    && !saving;

  return (
    <Modal>
      <div className="card-title" style={{ fontSize: 24 }}>Edit display name</div>

      <input
        className="field"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Display name"
        maxLength={24}
        autoFocus
      />

      {checking && (
        <div className="avail" style={{ color: '#80bba8' }}>
          Checking...
        </div>
      )}
      {!checking && available === true && (
        <div className="avail ok">
          ✓ &nbsp;That name is available
        </div>
      )}
      {!checking && available === false && (
        <div className="avail no">
          ✕ &nbsp;That name is taken
        </div>
      )}
      {error && (
        <div className="avail no">{error}</div>
      )}

      <Btn variant="primary" wide lg onClick={handleSave} disabled={!canSave}>
        {saving ? 'Saving...' : 'Save'}
      </Btn>
      <Btn variant="ghost" wide onClick={onClose}>
        Cancel
      </Btn>
      <div className="card-sub" style={{ textAlign: 'center', fontSize: 12 }}>
        Display names must be unique.
      </div>
    </Modal>
  );
}
