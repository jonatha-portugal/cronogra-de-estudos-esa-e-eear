import React, { useMemo, useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { syllabusData } from '../data/syllabus';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle, Target, ArrowRight, Search, X, Flag, AlertCircle, Medal, Timer } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardProps {
  userProgress: Record<string, boolean>;
  currentUser?: { email: string } | null;
  onNavigate?: (viewId: string) => void;
  avisos?: string[];
}

export default function Dashboard({ userProgress, currentUser, onNavigate, avisos = [] }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [countdown, setCountdown] = useState({ eear: 0, esa: 0 });

  useEffect(() => {
    // Dummy dates for the next exams (e.g. late 2026)
    const eearDate = new Date('2026-11-15T00:00:00');
    const esaDate = new Date('2026-10-04T00:00:00');

    const updateTimer = () => {
      const now = new Date();
      setCountdown({
        eear: Math.max(0, Math.ceil((eearDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))),
        esa: Math.max(0, Math.ceil((esaDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      });
    };
    updateTimer();
    const intv = setInterval(updateTimer, 86400000);
    return () => clearInterval(intv);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results: Array<{
      subjectId: string;
      subjectTitle: string;
      subjectIcon: string;
      moduleTitle: string;
      topicId: string;
      topicText: string;
      isCompleted: boolean;
      tag: string;
    }> = [];

    Object.values(syllabusData).forEach(subject => {
      subject.modules.forEach((mod, mIdx) => {
        mod.topics.forEach((topic, tIdx) => {
          if (topic.text.toLowerCase().includes(query)) {
            results.push({
              subjectId: subject.id,
              subjectTitle: subject.title,
              subjectIcon: subject.icon,
              moduleTitle: mod.title,
              topicId: topic.id,
              topicText: topic.text,
              isCompleted: !!userProgress[`${subject.id}-m${mIdx}-t${tIdx}`],
              tag: topic.tag
            });
          }
        });
      });
    });

    return results.slice(0, 50); // limit reasonable max results
  }, [searchQuery, userProgress]);

  const { chartData, stats, subjectStats, suggestedReview } = useMemo(() => {
    let countAmbos = 0;
    let countEEAR = 0;
    let countESA = 0;
    
    let totalTopics = 0;
    let complete = 0;
    let completedList: any[] = [];

    const subjects = Object.values(syllabusData).map(subject => {
      let subTotal = 0;
      let subComplete = 0;
      
      subject.modules.forEach((mod, mIdx) => {
        mod.topics.forEach((topic, tIdx) => {
          subTotal++;
          totalTopics++;
          
          if (topic.tag === 'AMBOS') countAmbos++;
          else if (topic.tag === 'EEAR') countEEAR++;
          else if (topic.tag === 'ESA') countESA++;
          
          if (userProgress[`${subject.id}-m${mIdx}-t${tIdx}`]) {
            complete++;
            subComplete++;
            completedList.push({
              subjectId: subject.id,
              subjectIcon: subject.icon,
              subjectTitle: subject.title,
              text: topic.text
            });
          }
        });
      });
      
      return {
        id: subject.id,
        icon: subject.icon,
        title: subject.title,
        total: subTotal,
        completed: subComplete,
        progress: subTotal > 0 ? Math.round((subComplete / subTotal) * 100) : 0,
      };
    });

    const randomized = [...completedList].sort(() => 0.5 - Math.random());
    const suggestedReview = randomized.slice(0, 2);

    return {
      stats: {
        total: totalTopics,
        completed: complete,
        progress: totalTopics > 0 ? Math.round((complete / totalTopics) * 100) : 0,
      },
      subjectStats: subjects,
      suggestedReview,
      chartData: {
        labels: ['Comum aos dois (Ambos)', 'Apenas EEAR', 'Apenas ESA'],
        datasets: [
          {
            data: [countAmbos, countEEAR, countESA],
            backgroundColor: [
              '#e2e8f0', // slate-200
              '#3b82f6', // blue-500
              '#65a30d', // lime-600
            ],
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 4,
          },
        ],
      }
    };
  }, [userProgress]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 24,
          font: { family: "'Inter', sans-serif", size: 13, weight: 500 },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderColor: '#334155',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed + ' Tópicos';
            return label;
          },
        },
      },
    },
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const firstName = currentUser?.email?.split('@')[0] || 'Aluno';
  
  // Gamificação: Patentes
  const getBadgeInfo = () => {
    if (stats.progress >= 95) return { title: 'General de Exército', color: '#fbbf24', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' };
    if (stats.progress >= 75) return { title: 'Coronel', color: '#f59e0b', bg: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' };
    if (stats.progress >= 50) return { title: 'Capitão', color: '#10b981', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' };
    if (stats.progress >= 25) return { title: 'Sargento', color: '#3b82f6', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' };
    return { title: 'Recruta', color: '#64748b', bg: 'bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300' };
  };
  const badge = getBadgeInfo();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pb-12"
    >
      {avisos.length > 0 && (
        <div className="mb-8">
          <div className="bg-amber-50 dark:bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg p-4 shadow-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-2">Mural de Avisos</h4>
              <ul className="space-y-2">
                {avisos.map((aviso, idx) => (
                  <li key={idx} className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed whitespace-pre-wrap">{aviso}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {greeting}, <span className="text-militar-600 dark:text-militar-400 capitalize">{firstName}</span>!
            </h2>
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${badge.bg}`}>
              <Medal className="w-4 h-4" /> {badge.title}
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-3xl leading-relaxed">
            Bem-vindo de volta à sua trilha de estudos unificada.
          </p>
        </div>

        <div className="relative w-full md:w-96 z-20">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tópicos (ex: Geometria)..."
              className="block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-militar-500 focus:border-militar-500 sm:text-sm transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <AnimatePresence>
            {searchQuery && (
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 10 }}
                 transition={{ duration: 0.15 }}
                 className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto z-50 flex flex-col"
               >
                 {searchResults.length > 0 ? (
                   <ul className="divide-y divide-slate-100 dark:divide-slate-700/50">
                     {searchResults.map((res, i) => (
                       <li key={`${res.subjectId}-${res.topicId}-${i}`}>
                         <button
                           onClick={() => {
                             if(onNavigate) onNavigate(res.subjectId);
                             setSearchQuery('');
                           }}
                           className="w-full text-left px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-start gap-4"
                         >
                           <span className="text-2xl shrink-0 mt-0.5">{res.subjectIcon}</span>
                           <div className="flex-1 min-w-0">
                             <p className={`text-sm font-medium line-clamp-2 leading-relaxed ${res.isCompleted ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                               {res.topicText}
                             </p>
                             <div className="flex items-center gap-2 mt-2">
                               <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                 {res.subjectTitle}
                               </span>
                               <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                               <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                 {res.moduleTitle}
                               </span>
                             </div>
                           </div>
                         </button>
                       </li>
                     ))}
                   </ul>
                 ) : (
                   <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                     <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
                     <p className="text-sm">Nenhum tópico encontrado para "{searchQuery}"</p>
                     <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">Tente buscar por conceitos específicos.</p>
                   </div>
                 )}
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col transition-colors duration-300 relative overflow-hidden group"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2.5 bg-militar-50 dark:bg-militar-500/10 text-militar-600 dark:text-militar-400 rounded-lg group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Progresso Geral</h3>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.progress}%</span>
          </div>
          <div className="mt-4 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative z-10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.progress}%` }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="h-full bg-militar-500 rounded-full" 
            />
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col transition-colors duration-300 group"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Tópicos Concluídos</h3>
          </div>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-baseline gap-2"
          >
            <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.completed}</span>
            <span className="text-slate-500 dark:text-slate-500 font-medium">/ {stats.total}</span>
          </motion.div>
        </motion.div>

        <motion.div 
          className="bg-militar-600 dark:bg-militar-900 rounded-2xl shadow-md border-none p-6 flex flex-col relative overflow-hidden transition-colors duration-300 group justify-between"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute -top-4 -right-4 p-4 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
            <Timer className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10 flex flex-col gap-3">
             <h3 className="text-white/90 font-bold flex items-center gap-2"><Flag className="w-4 h-4" /> Contagem Regressiva</h3>
             <div className="flex gap-4 items-center">
               <div className="bg-white/10 rounded-lg p-3 text-center flex-1 backdrop-blur-sm">
                 <p className="text-white text-2xl font-black">{countdown.eear}</p>
                 <p className="text-white/70 text-[10px] uppercase font-bold tracking-wider">Dias - EEAR</p>
               </div>
               <div className="bg-white/10 rounded-lg p-3 text-center flex-1 backdrop-blur-sm">
                 <p className="text-white text-2xl font-black">{countdown.esa}</p>
                 <p className="text-white/70 text-[10px] uppercase font-bold tracking-wider">Dias - ESA</p>
               </div>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col transition-colors duration-300">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              Distribuição do Edital
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Análise do volume de tópicos solicitados pelas bancas.</p>

            <div className="relative w-full aspect-square max-w-[280px] mx-auto flex-1">
               <div className="absolute inset-0 pb-6">
                 <Doughnut data={{...chartData, datasets: chartData.datasets.map(d => ({...d, borderColor: 'transparent', hoverBorderColor: 'transparent'})) }} options={{...options, maintainAspectRatio: false}} />
               </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-6">
                <div className="text-center mt-[-30px]">
                  <span className="block text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-widest">Tópicos</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col transition-colors duration-300">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
               <Timer className="w-5 h-5 text-militar-600 dark:text-militar-400" /> Revisão Sugerida
            </h3>
            {suggestedReview.length > 0 ? (
               <ul className="space-y-3">
                 {suggestedReview.map((rev: any, idx: number) => (
                   <li key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 flex flex-col gap-1 hover:border-militar-200 dark:hover:border-militar-700 transition-colors cursor-pointer" onClick={() => onNavigate && onNavigate(rev.subjectId)}>
                     <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                       <span className="text-base">{rev.subjectIcon}</span> {rev.subjectTitle}
                     </div>
                     <span className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">{rev.text}</span>
                   </li>
                 ))}
               </ul>
            ) : (
               <p className="text-sm text-slate-500 dark:text-slate-400 italic">Conclua tópicos para ativar o algoritmo de revisão espaçada.</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 flex flex-col transition-colors duration-300">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                Progresso por Matéria
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Continue de onde parou e avance no edital.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 content-start">
            {subjectStats.map((sub, i) => (
              <motion.button
                key={sub.id}
                onClick={() => onNavigate && onNavigate(sub.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col text-left p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm hover:border-militar-200 dark:hover:border-militar-500/30 transition-all duration-200 group"
              >
                <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-3">
                     <span className="text-2xl group-hover:scale-110 transition-transform">{sub.icon}</span>
                     <div>
                       <h4 className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{sub.title}</h4>
                       <span className="text-xs text-slate-500 dark:text-slate-400">{sub.completed}/{sub.total} tópicos</span>
                     </div>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-militar-50 dark:group-hover:bg-militar-500/20 group-hover:text-militar-600 dark:group-hover:text-militar-400 transition-colors">
                     <ArrowRight className="w-4 h-4" />
                   </div>
                </div>
                
                <div className="w-full mt-auto">
                   <div className="flex justify-between items-center mb-1.5">
                     <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Progresso</span>
                     <span className={`text-xs font-bold ${sub.progress === 100 ? 'text-militar-600 dark:text-militar-400' : 'text-slate-700 dark:text-slate-300'}`}>
                       {sub.progress}%
                     </span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${sub.progress}%` }}
                       transition={{ duration: 1, ease: 'easeOut' }}
                       className={`h-full rounded-full ${sub.progress === 100 ? 'bg-militar-500' : 'bg-slate-400 dark:bg-slate-500 group-hover:bg-militar-400 dark:group-hover:bg-militar-500 transition-colors'}`}
                     />
                   </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
