import { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

export default function PatientEditModal({ request, onClose }) {
  const { updateRequest } = useData();
  const toast = useToast();
  const [name, setName] = useState(request?.patientName || '');
  const [photoPreview, setPhotoPreview] = useState(request?.patientPhoto || null);
  const fileInputRef = useRef(null);

  if (!request) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) { toast('Le nom ne peut pas être vide', 'error'); return; }
    updateRequest(request.id, { patientName: name.trim(), patientPhoto: photoPreview });
    toast('Profil mis à jour');
    onClose();
  };

  const getInitials = (n) => n?.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || '?';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 animate-[fadeIn_0.2s_ease-out]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Modifier le profil</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-4">
          <div onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-slate-300 hover:border-sky-400 transition-colors flex items-center justify-center bg-slate-50 relative group">
            {photoPreview ? (
              <img src={photoPreview} alt="Patient" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-slate-400">{getInitials(name)}</span>
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <i className="fa-solid fa-camera text-white text-xl" />
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          <p className="text-xs text-slate-500 mt-2">Cliquez pour ajouter/modifier la photo</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Nom du patient</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" autoFocus />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Annuler</button>
          <button onClick={handleSave} className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 font-medium transition-colors shadow-lg shadow-sky-500/25">Enregistrer</button>
        </div>
      </div>
    </div>
  );
}
