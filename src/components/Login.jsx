import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SEED_USERS, ROLE_NAMES } from '../utils/constants';

export default function Login() {
  const { login, registerRequest, requestPasswordReset } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('doctor');

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotConfirmPass, setForgotConfirmPass] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = login(email, password);
    if (!ok) toast('Identifiants incorrects', 'error');
  };

  const fill = (e, p) => {
    setEmail(e);
    setPassword(p);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      toast('Veuillez remplir tous les champs', 'error');
      return;
    }
    const result = registerRequest(regName.trim(), regEmail.trim(), regPassword.trim(), regRole);
    if (result.ok) {
      toast("Demande envoyée à l'administrateur");
      setShowRegister(false);
      setRegName(''); setRegEmail(''); setRegPassword(''); setRegRole('doctor');
    } else {
      toast(result.error, 'error');
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast('Veuillez entrer votre email', 'error');
      return;
    }
    if (!forgotNewPass.trim()) {
      toast('Veuillez entrer un nouveau mot de passe', 'error');
      return;
    }
    if (forgotNewPass !== forgotConfirmPass) {
      toast('Les mots de passe ne correspondent pas', 'error');
      return;
    }
    const result = requestPasswordReset(forgotEmail.trim(), forgotNewPass.trim());
    if (result.ok) {
      toast('Demande de réinitialisation envoyée à l\'administrateur');
      setShowForgot(false);
      setForgotEmail(''); setForgotNewPass(''); setForgotConfirmPass('');
    } else {
      toast(result.error, 'error');
    }
  };

  const demoUsers = SEED_USERS.filter(u => u.role !== 'admin');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-sky-600 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <i className="fa-solid fa-flask text-3xl text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">LabConnect</h1>
            <p className="text-sky-100 mt-1 text-sm">Gestion des Analyses Sanguines</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Adresse e-mail</label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all" placeholder="ex: doctor@labconnect.fr" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all" placeholder="••••••••" />
              </div>
            </div>

            <div className="flex justify-end mb-6">
              <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-sky-600 hover:text-sky-700 font-medium">Mot de passe oublié ?</button>
            </div>

            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-sky-500/30 active:scale-[0.98] transform">Se connecter</button>

            <div className="mt-4 text-center">
              <button type="button" onClick={() => setShowRegister(true)} className="text-sm text-sky-600 hover:text-sky-700 font-medium"><i className="fa-solid fa-user-plus mr-1" />Créer un compte</button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-500 text-center mb-3">Comptes de démonstration</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {demoUsers.map(u => (
                  <button type="button" key={u.id} onClick={() => fill(u.email, u.password)} className="bg-slate-50 p-2 rounded-lg text-center hover:bg-sky-50 transition-colors">
                    <i className={`fa-solid fa-${u.role === 'doctor' ? 'user-doctor' : u.role === 'nurse' ? 'user-nurse' : u.role === 'agent' ? 'truck-fast' : 'microscope'} text-sky-600 mb-1 block`} />
                    <span className="font-medium">{ROLE_NAMES[u.role]}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>

      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto py-10">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Créer un compte</h3>
              <button onClick={() => setShowRegister(false)} className="text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"><i className="fa-solid fa-xmark text-lg" /></button>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Nom complet</label><input type="text" value={regName} onChange={e => setRegName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Votre nom" required /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Email</label><input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="ex: nom@labconnect.fr" required /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Rôle</label><select value={regRole} onChange={e => setRegRole(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"><option value="doctor">Médecin</option><option value="nurse">Infirmier(e)</option><option value="agent">Agent de livraison</option><option value="lab">Personnel de laboratoire</option></select></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label><input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="••••••••" required /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowRegister(false)} className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Annuler</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 font-medium transition-colors shadow-lg shadow-sky-500/25">Envoyer la demande</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Mot de passe oublié</h3>
              <button onClick={() => setShowForgot(false)} className="text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"><i className="fa-solid fa-xmark text-lg" /></button>
            </div>
            <form onSubmit={handleForgot} className="space-y-4">
              <p className="text-sm text-slate-600">Entrez votre email et le nouveau mot de passe souhaité. Un administrateur validera votre demande.</p>
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Email</label><input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="votre@email.fr" required /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Nouveau mot de passe</label><input type="password" value={forgotNewPass} onChange={e => setForgotNewPass(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="••••••••" required /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Confirmer le mot de passe</label><input type="password" value={forgotConfirmPass} onChange={e => setForgotConfirmPass(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="••••••••" required /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForgot(false)} className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Annuler</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 font-medium transition-colors shadow-lg shadow-sky-500/25">Envoyer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
