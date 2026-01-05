import { useState } from 'react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', 
      top: '50%',
      left: '50%', 
      transform: 'translate(-50%, -50%)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      outline: '1px solid #000',
      zIndex: 9999
    }}>
      <div style={{ background: '#ffffff', padding: 20, borderRadius: 10, minWidth: 300 }}>
        <p style={{background: '#f8fafc'}}><strong>{message}</strong></p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button onClick={() => { setOpen(false); onCancel?.(); }}>Cancel</button>
          <button
            onClick={() => { setOpen(false); onConfirm(); }}
            style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6 }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
