import { useState } from 'react';
import { generateLabReport } from '../../utils/pdfGenerator';
import { useAuth } from '../../context/AuthContext';
export default function ReportModal({ request, onSubmit, onClose }) {
  const { user } = useAuth();
  if (!request) return null;
  const handleGenerate = () => { const url = generateLabReport(request, user.name, user.lab); onSubmit(request.id, url); };
  const handleFileUpload = (e) => { const f = e.target.files?.[0]; if (!f) return; const url = URL.createObjectURL(f); onSubmit(request.id, url); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto py-10">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 animate-[fadeIn_0.2s_ease-out]">
        <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-slate-900">Rapport d'Analyse</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"><i className="fa-solid fa-xmark text-lg" /></button></div>
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-start"><div><p className="text-sm text-slate-500">Patient</p><p className="font-semibold text-slate-900">{request.patientName}</p></div><div className="text-right"><p className="text-sm text-slate-500">N° Demande</p><p className="font-mono font-semibold text-slate-900">{request.id}</p></div></div>
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-2">Télécharger un PDF existant</label><input type="file" accept=".pdf" onChange={handleFileUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 file:cursor-pointer file:transition-colors" /></div>
          <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">ou</span></div></div>
          <button onClick={handleGenerate} className="w-full py-3 border-2 border-dashed border-sky-300 rounded-xl text-sky-700 font-medium hover:bg-sky-50 hover:border-sky-400 transition-all"><i className="fa-solid fa-wand-magic-sparkles mr-2" />Générer un rapport automatique</button>
        </div>
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100"><button onClick={onClose} className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Annuler</button></div>
      </div>
    </div>
  );
}
