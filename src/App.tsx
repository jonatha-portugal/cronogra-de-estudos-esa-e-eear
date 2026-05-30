import React, { useState, useEffect } from 'react';
import { syllabusData } from './data/syllabus';
import Dashboard from './components/Dashboard';
import SubjectView from './components/SubjectView';
import AdminPanel from './components/AdminPanel';
import ResourcesView from './components/ResourcesView';
import SimuladosView from './components/SimuladosView';
import StudyTrackerView from './components/StudyTrackerView';
import { Menu, X, ShieldCheck, Sun, Moon, Lock, LogOut, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('resumo');
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<{email: string} | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [simulados, setSimulados] = useState<any[]>([]);
  const [metas, setMetas] = useState<any[]>([]);
  const [avisos, setAvisos] = useState<string[]>([]);

  useEffect(() => {
    const fetchAvisos = () => {
      fetch('/api/avisos')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.avisos) setAvisos(data.avisos);
        })
        .catch(console.error);
    };
    fetchAvisos();
    
    const theme = localStorage.getItem('eearEsaTheme');
    if (theme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    }
    const storedUserStr = localStorage.getItem('eearEsaCurrentUser');
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        if (storedUser?.email) {
          fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: storedUser.email })
          })
          .then(res => res.json().then(data => ({ ok: res.ok, data })))
          .then(({ ok, data }) => {
            if (ok && data.success) {
              setCurrentUser(data.user);
            } else {
              localStorage.removeItem('eearEsaCurrentUser');
              setCurrentUser(null);
            }
          })
          .catch(() => {
            // on network error allow offline access if they were logged in
            setCurrentUser(storedUser);
          })
          .finally(() => {
             setIsVerifying(false);
          });
          return;
        }
      } catch (e) {
        // ignore error
      }
    }
    setIsVerifying(false);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setUserProgress({});
      return;
    }

    const userKey = `eearEsaProgress_${currentUser.email}`;
    const stored = localStorage.getItem(userKey);
    const legacyStored = localStorage.getItem('eearEsaProgress');
    
    if (stored) {
      try { setUserProgress(JSON.parse(stored)); } catch (e) { }
    } else if (legacyStored) {
      try {
        const parsed = JSON.parse(legacyStored);
        setUserProgress(parsed);
        localStorage.setItem(userKey, legacyStored);
        localStorage.removeItem('eearEsaProgress');
      } catch (e) { }
    } else {
      setUserProgress({});
    }

    const syncProgress = () => {
      if (currentUser?.email) {
        const userKey = `eearEsaProgress_${currentUser.email}`;
        fetch('/api/user/progress', {
          headers: { 'x-user-email': currentUser.email }
        })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.progress) {
            if (data.simulados) {
              setSimulados(data.simulados);
            }
            if (data.metas) {
              setMetas(data.metas);
            }
            setUserProgress(prev => {
              const merged = { ...prev, ...data.progress };
              localStorage.setItem(userKey, JSON.stringify(merged));
              
              const hasLocalData = Object.keys(prev).length > 0;
              const hasServerData = Object.keys(data.progress).length > 0;
              
              if (hasLocalData && !hasServerData) {
                fetch('/api/user/progress', {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    'x-user-email': currentUser.email
                  },
                  body: JSON.stringify({ progress: merged })
                }).catch(console.error);
              }
              
              // Only update state if something actually changed to avoid re-renders
              if (JSON.stringify(prev) !== JSON.stringify(merged)) {
                return merged;
              }
              return prev;
            });
          }
        })
        .catch(console.error);
      }
    };
    
    syncProgress();
    
    let stream: EventSource | null = null;
    if (currentUser?.email && currentUser.email !== 'jonathaportugal14@gmail.com') {
      stream = new EventSource(`/api/auth/stream?email=${encodeURIComponent(currentUser.email)}`);
      stream.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (!data.success && data.reason !== 'error') {
            handleLogout();
          }
        } catch (e) {}
      };
    }
    
    const interval = setInterval(() => {
      syncProgress();
    }, 15000);

    const handleFocus = () => {
      syncProgress();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      if (stream) stream.close();
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [currentUser]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('dark');
        localStorage.setItem('eearEsaTheme', 'dark');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('eearEsaTheme', 'light');
      }
      return next;
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eearEsaCurrentUser');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (!emailInput) {
      setAuthError('Preencha seu email.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        setAuthError(data.error || 'Erro ao autenticar.');
        return;
      }

      setCurrentUser(data.user);
      localStorage.setItem('eearEsaCurrentUser', JSON.stringify(data.user));
    } catch(err) {
      setAuthError('Erro na conexão com o servidor.');
    }
  };

  const toggleProgress = (topicId: string, checked: boolean) => {
    setUserProgress((prev) => {
      const next = { ...prev, [topicId]: checked };
      if (currentUser?.email) {
        localStorage.setItem(`eearEsaProgress_${currentUser.email}`, JSON.stringify(next));
      }
      
      // Save backend if logged in
      if (currentUser?.email) {
        fetch('/api/user/progress', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-email': currentUser.email
          },
          body: JSON.stringify({ progress: next })
        }).catch(console.error);
      }
      
      return next;
    });
  };

  const handleAddSimulado = (simData: any) => {
    const nextList = [...simulados, simData];
    setSimulados(nextList);
    if (currentUser?.email) {
      fetch('/api/user/simulados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-email': currentUser.email },
        body: JSON.stringify({ simulados: nextList })
      }).catch(console.error);
    }
  };

  const handleRemoveSimulado = (id: string) => {
    const nextList = simulados.filter(s => s.id !== id);
    setSimulados(nextList);
    if (currentUser?.email) {
      fetch('/api/user/simulados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-email': currentUser.email },
        body: JSON.stringify({ simulados: nextList })
      }).catch(console.error);
    }
  };

  const updateMetas = (nextList: any[]) => {
    setMetas(nextList);
    if (currentUser?.email) {
      fetch('/api/user/metas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-email': currentUser.email },
        body: JSON.stringify({ metas: nextList })
      }).catch(console.error);
    }
  };

  const baseNavItems = [
    { id: 'resumo', icon: '📊', name: 'Resumo do Edital' },
    { id: 'simulados', icon: '🎯', name: 'Simulados & Metas' },
    { id: 'cronometro', icon: '⏱️', name: 'Tracker de Estudos' },
    { id: 'recursos', icon: '📚', name: 'Materiais & PDFs' },
    ...Object.values(syllabusData).map(subj => ({
      id: subj.id,
      icon: subj.icon,
      name: subj.title
    }))
  ];

  const isAdminUser = currentUser?.email.toLowerCase() === 'jonathaportugal14@gmail.com';
  
  const navItems = isAdminUser 
    ? [...baseNavItems, { id: 'admin', icon: <ShieldAlert className="w-5 h-5 text-red-500" />, name: 'Admin - Acessos' }]
    : baseNavItems;

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 selection:bg-militar-500 selection:text-white transition-colors duration-300">
        <div className="w-16 h-16 bg-militar-600 rounded-2xl flex items-center justify-center text-white shadow-lg animate-pulse mb-4">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-medium animate-pulse">Verificando acesso...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-militar-500 selection:text-white transition-colors duration-300">
        <div className="absolute top-4 right-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-militar-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <ShieldCheck className="w-10 h-10" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Acesso Restrito
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Área de estudos unificada EEAR & ESA
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-200 dark:border-slate-700">
            <form className="space-y-6" onSubmit={handleAuth}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Autorizado
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-militar-500 focus:border-militar-500 sm:text-sm dark:bg-slate-900 dark:text-white transition-colors"
                    placeholder="Seu email de acesso"
                  />
                </div>
                {authError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{authError}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-militar-600 hover:bg-militar-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-militar-500 transition-colors"
                >
                  Entrar na Plataforma
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 h-screen flex overflow-hidden font-sans selection:bg-militar-500 selection:text-white transition-colors duration-300">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-10 shadow-[2px_0_15px_-3px_rgba(0,0,0,0.03)] hidden md:flex shrink-0 transition-colors duration-300">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-militar-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">Edital Militar</h1>
              <p className="text-[11px] text-militar-600 dark:text-militar-400 mt-1 font-bold tracking-widest uppercase">EEAR & ESA</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
          {navItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-militar-50 dark:bg-militar-500/10 text-militar-800 dark:text-militar-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className={`text-[22px] transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-4">
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-sm">
             <div className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
               {currentUser?.email}
             </div>
             <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors ml-2" title="Sair da conta">
                <LogOut className="w-4 h-4" />
             </button>
          </div>
          <button onClick={toggleDarkMode} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {isDarkMode ? <><Sun className="w-4 h-4" /> Modo Claro</> : <><Moon className="w-4 h-4" /> Modo Escuro</>}
          </button>
        </div>
      </aside>

      {/* Mobile Header & Nav Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-20 flex items-center justify-between px-4 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-militar-600 rounded-lg flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Edital Militar</h1>
            <p className="text-[9px] text-militar-600 dark:text-militar-400 font-bold uppercase tracking-widest">EEAR & ESA</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleDarkMode} className="p-2 text-slate-600 dark:text-slate-400 focus:outline-none bg-slate-50 dark:bg-slate-800 rounded-lg active:scale-95 transition-transform">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-600 dark:text-slate-400 focus:outline-none bg-slate-50 dark:bg-slate-800 rounded-lg active:scale-95 transition-transform">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-2xl flex flex-col transition-colors duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 tracking-tight">Menu Principal</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/50 rounded-full text-slate-600 dark:text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 pb-20">
                {navItems.map(item => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setTimeout(() => setMobileMenuOpen(false), 150);
                      }}
                      className={`w-full text-left px-5 py-4 rounded-xl flex items-center gap-4 transition-colors font-medium ${
                        isActive
                          ? 'bg-militar-50 dark:bg-militar-500/10 text-militar-800 dark:text-militar-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                 <span className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate px-2">{currentUser?.email}</span>
                 <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full w-full pt-16 md:pt-0 overflow-y-auto bg-slate-50/50 dark:bg-slate-950 relative scroll-smooth overflow-x-hidden transition-colors duration-300">
        <div className="max-w-[1000px] mx-auto w-full p-5 md:p-10 lg:p-12 pb-24">
          <AnimatePresence mode="popLayout">
            {currentView === 'resumo' ? (
              <motion.div
                key="resumo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Dashboard 
                  userProgress={userProgress} 
                  currentUser={currentUser}
                  onNavigate={setCurrentView}
                  avisos={avisos}
                />
              </motion.div>
            ) : currentView === 'simulados' ? (
              <motion.div
                key="simulados"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <SimuladosView
                  simulados={simulados}
                  onAddSimulado={handleAddSimulado}
                  onRemoveSimulado={handleRemoveSimulado}
                  metas={metas}
                  onUpdateMetas={updateMetas}
                />
              </motion.div>
            ) : currentView === 'recursos' ? (
              <motion.div
                key="recursos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <ResourcesView />
              </motion.div>
            ) : currentView === 'cronometro' ? (
              <motion.div
                key="cronometro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <StudyTrackerView />
              </motion.div>
            ) : currentView === 'admin' ? (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <AdminPanel currentUserEmail={currentUser.email} />
              </motion.div>
            ) : (
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <SubjectView
                  subjectId={currentView}
                  userProgress={userProgress}
                  toggleProgress={toggleProgress}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
