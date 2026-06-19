import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ProfileModal({ onClose }) {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user?.name || '');
  const [photo, setPhoto] = useState(user?.photo || null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Veuillez sélectionner une image', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast('Le nom ne peut pas être vide', 'error');
      return;
    }
    updateUser({ name: name.trim(), photo });
    toast('Profil mis à jour');
    onClose();
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-[fadeIn_0.2s_ease-out]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">Mon Profil</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-50 flex items-center justify-center">
              {photo ? (
                <img src={photo} alt="Photo de profil" className="w-full h-full object-cover" />
              ) : (
                <i className="fa-solid fa-user text-slate-300 text-4xl" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-sky-600 hover:bg-sky-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
              title="Changer la photo"
            >
              <i className="fa-solid fa-camera text-xs" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {photo && (
            <button
              onClick={handleRemovePhoto}
              className="mt-2 text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
            >
              <i className="fa-solid fa-trash mr-1" />Supprimer la photo
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nom complet</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-2">Adresse e-mail</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1">L'email ne peut pas être modifié</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-2">Rôle</label>
            <input
              type="text"
              value={user?.role || ''}
              disabled
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed capitalize"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={onClose} className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">
            Annuler
          </button>
          <button onClick={handleSave} className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 font-medium transition-colors shadow-lg shadow-sky-500/25">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
