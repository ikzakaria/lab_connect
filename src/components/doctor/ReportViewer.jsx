export default function ReportViewer({ reportUrl, patientName, requestId, onClose }) {
  if (!reportUrl) return null;
  const handleDownload = () => { const a = document.createElement('a'); a.href = reportUrl; a.download = `Rapport_${requestId}_${patientName?.replace(/\s+/g,'_')}.pdf`; a.click(); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto py-10">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden flex flex-col max-h-[90vh] animate-[fadeIn_0.2s_ease-out]">
        <div className="bg-sky-600 p-4 flex justify-between items-center shrink-0">
          <h3 className="text-white font-bold"><i className="fa-solid fa-file-medical mr-2" />Rapport d'Analyse</h3>
          <div className="flex gap-2">
            <button onClick={handleDownload} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors"><i className="fa-solid fa-download mr-1" />Télécharger</button>
            <button onClick={onClose} className="text-white/80 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"><i className="fa-solid fa-xmark" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-slate-100 p-4"><iframe src={reportUrl} className="w-full h-full min-h-[600px] bg-white rounded-lg shadow-sm" title="Rapport PDF" /></div>
      </div>
    </div>
  );
}
