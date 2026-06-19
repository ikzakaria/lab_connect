import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { TESTS_LIST } from '../../utils/constants';

export default function NewRequestModal({ onClose }) {
  const { addRequest } = useData();
  const { user } = useAuth();
  const toast = useToast();
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientSex, setPatientSex] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('Toutes');

  const categories = useMemo(() => ['Toutes', ...new Set(TESTS_LIST.map(t => t.category))], []);

  const filteredTests = useMemo(() => {
    return TESTS_LIST.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === 'Toutes' || t.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [search, filterCategory]);

  const toggleTest = (id) => {
    setSelectedTests(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const submit = () => {
    if (!patientName.trim()) { toast('Veuillez entrer le nom du patient', 'error'); return; }
    if (selectedTests.length === 0) { toast('Veuillez sélectionner au moins un test', 'error'); return; }
    const id = addRequest(patientName.trim(), parseInt(patientAge) || null, patientSex, selectedTests, user.id, user.name);
    toast(`Demande ${id} créée`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto py-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 p-5 animate-[fadeIn_0.2s_ease-out]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Nouvelle Demande</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"><i className="fa-solid fa-xmark text-lg" /></button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Nom du patient</label>
            <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm" placeholder="Nom et prénom" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Âge</label>
            <input type="number" min="0" max="120" value={patientAge} onChange={e => setPatientAge(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm" placeholder="45" />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-600 mb-1">Sexe</label>
          <select value={patientSex} onChange={e => setPatientSex(e.target.value)} className="w-full sm:w-40 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-sm">
            <option value="">--</option><option value="M">Masculin</option><option value="F">Féminin</option>
          </select>
        </div>

        <div className="mb-2">
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <span className="text-xs font-medium text-slate-600 pt-1">Tests ({selectedTests.length})</span>
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <i className="fa-solid fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Rechercher..." />
              </div>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[280px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-1.5 w-8"></th>
                  <th className="px-3 py-1.5 font-semibold text-slate-700">Catégorie</th>
                  <th className="px-3 py-1.5 font-semibold text-slate-700">Test</th>
                  <th className="px-3 py-1.5 font-semibold text-slate-700">Réf.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTests.length === 0 && <tr><td colSpan={4} className="px-3 py-6 text-center text-slate-400">Aucun test</td></tr>}
                {filteredTests.map(test => (
                  <tr key={test.id} onClick={() => toggleTest(test.id)} className={`cursor-pointer transition-colors hover:bg-sky-50 ${selectedTests.includes(test.id) ? 'bg-sky-50' : ''}`}>
                    <td className="px-3 py-1.5"><input type="checkbox" checked={selectedTests.includes(test.id)} onChange={() => toggleTest(test.id)} className="w-3.5 h-3.5 text-sky-600 rounded border-slate-300 focus:ring-sky-500 pointer-events-none" /></td>
                    <td className="px-3 py-1.5"><span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">{test.category}</span></td>
                    <td className="px-3 py-1.5 font-medium text-slate-900">{test.name}</td>
                    <td className="px-3 py-1.5 text-slate-500">{test.ref || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3 pt-3 border-t border-slate-100">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors text-sm">Annuler</button>
          <button onClick={submit} className="flex-1 px-4 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 font-medium transition-colors shadow-lg shadow-sky-500/25 text-sm">Créer ({selectedTests.length})</button>
        </div>
      </div>
    </div>
  );
}
