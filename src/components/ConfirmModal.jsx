export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  if (!onConfirm) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-[fadeIn_0.2s_ease-out]">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3"><i className="fa-solid fa-triangle-exclamation text-amber-600 text-xl" /></div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-slate-600 mt-2">{message}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Annuler</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 font-medium transition-colors shadow-lg shadow-sky-500/25">Confirmer</button>
        </div>
      </div>
    </div>
  );
}
