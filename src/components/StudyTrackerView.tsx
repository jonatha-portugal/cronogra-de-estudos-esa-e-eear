import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Save, Clock, Target, CalendarDays, Flame, BookOpen, Clock3, Circle, CheckCircle2 } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { syllabusData } from '../data/syllabus';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StudySession {
  id: string;
  subjectId: string;
  subjectName: string;
  duration: number; // in seconds
  timestamp: string;
}

const MOCK_SESSIONS: StudySession[] = [
  { id: '1', subjectId: 'matematica', subjectName: 'Matemática', duration: 7200, timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: '2', subjectId: 'fisica', subjectName: 'Física', duration: 5400, timestamp: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: '3', subjectId: 'portugues', subjectName: 'Português', duration: 3600, timestamp: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: '4', subjectId: 'ingles', subjectName: 'Inglês', duration: 2400, timestamp: new Date(Date.now()).toISOString() }
];

export default function StudyTrackerView() {
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    try {
      const local = localStorage.getItem('eearEsaTracker');
      if (local) return JSON.parse(local);
    } catch(e) {}
    return MOCK_SESSIONS;
  });

  useEffect(() => {
    localStorage.setItem('eearEsaTracker', JSON.stringify(sessions));
  }, [sessions]);

  // Tracker State
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(Object.keys(syllabusData)[0]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const formatTimerDisplay = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleStopAndSave = () => {
    if (seconds > 0) {
      const subjectObj = syllabusData[selectedSubject as keyof typeof syllabusData];
      const newSession: StudySession = {
        id: Math.random().toString(36).substr(2, 9),
        subjectId: selectedSubject,
        subjectName: subjectObj ? subjectObj.title : 'Outros',
        duration: seconds,
        timestamp: new Date().toISOString()
      };
      
      console.log('--- ENVIANDO PARA O BANCO DE DADOS (SIMULAÇÃO JSON) ---');
      console.log(JSON.stringify(newSession, null, 2));

      setSessions(prev => [newSession, ...prev]);
    }
    setIsActive(false);
    setIsPaused(false);
    setSeconds(0);
  };

  // --- Métricas ---
  const totalSeconds = sessions.reduce((acc, curr) => acc + curr.duration, 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);

  const subjectTimes: Record<string, number> = {};
  sessions.forEach(s => {
    subjectTimes[s.subjectName] = (subjectTimes[s.subjectName] || 0) + s.duration;
  });
  
  let topSubject = 'Nenhuma';
  let maxTime = 0;
  Object.entries(subjectTimes).forEach(([name, time]) => {
    if (time > maxTime) {
      maxTime = time;
      topSubject = name;
    }
  });

  const uniqueDays = new Set(sessions.map(s => new Date(s.timestamp).toDateString()));
  const streak = uniqueDays.size;

  // --- Gráfico ---
  const backgroundColors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];
  const labels = Object.keys(subjectTimes);
  const dataValues = Object.values(subjectTimes);

  const chartData = {
    labels: labels.length > 0 ? labels : ['Sem dados'],
    datasets: [{
      data: dataValues.length > 0 ? dataValues : [1],
      backgroundColor: dataValues.length > 0 ? backgroundColors.slice(0, labels.length) : ['#334155'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#64748b',
          usePointStyle: true,
          padding: 20,
          font: { family: "'Inter', sans-serif", size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            if (dataValues.length === 0) return ' Sem dados';
            const value = context.raw;
            const h = Math.floor(value / 3600);
            const m = Math.floor((value % 3600) / 60);
            return ` ${h}h ${m}m`;
          }
        }
      }
    }
  };

  const formatTimelineDuration = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    if (hrs > 0) return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`;
    return `${mins.toString().padStart(2, '0')}m`;
  };

  const formatTimelineDate = (isoString: string) => {
    const date = new Date(isoString);
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    
    if (isToday) {
      return `Hoje às ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return `${date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} às ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pb-12 max-w-7xl mx-auto"
    >
      <div className="mb-8 pl-1">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Dashboard Avançada de Estudos</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Acompanhe seu tempo real de investimento rumo à farda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* 1. COMPONENTE CRONÔMETRO */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center text-center relative overflow-hidden group">
           
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Clock3 className="w-48 h-48 text-slate-900 dark:text-white transform rotate-12" />
           </div>

           <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2 relative z-10 uppercase tracking-widest text-sm">
             <Target className="w-5 h-5 text-militar-500" /> Iniciar Sessão
           </h3>

           <div className="w-full relative z-10 mb-8">
             <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 text-left">Disciplina</label>
             <select 
               value={selectedSubject}
               onChange={(e) => setSelectedSubject(e.target.value)}
               disabled={isActive}
               className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-militar-500 outline-none transition-all disabled:opacity-50 appearance-none font-medium"
             >
               {Object.entries(syllabusData).map(([key, data]: [string, any]) => (
                 <option key={key} value={key}>{data.title}</option>
               ))}
               <option value="outros">Redação / Outros</option>
             </select>
           </div>

           <div className="text-[4rem] font-black text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none mb-10 relative z-10">
             {formatTimerDisplay(seconds)}
           </div>

           <div className="flex flex-col gap-3 w-full relative z-10">
              {!isActive && !isPaused ? (
                <button onClick={handleStart} className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]">
                  <Play className="w-5 h-5 fill-current" /> Iniciar Estudo
                </button>
              ) : (
                <div className="flex gap-3">
                  {isPaused ? (
                    <button onClick={handleStart} className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md transition-all">
                      <Play className="w-5 h-5 fill-current" /> Retomar
                    </button>
                  ) : (
                    <button onClick={handlePause} className="flex-1 flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-md transition-all">
                      <Pause className="w-5 h-5 fill-current" /> Pausar
                    </button>
                  )}
                </div>
              )}
              
              <button 
                onClick={handleStopAndSave}
                disabled={seconds === 0}
                className="w-full flex items-center justify-center gap-2 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-xl font-bold shadow-md transition-all disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" /> Finalizar e Salvar
              </button>
           </div>
        </div>

        {/* 2. COMPONENTE DASHBOARD (MÉTRICAS E GRÁFICOS) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Estudado</p>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white">{totalHours}h</h4>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Top Matéria</p>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white truncate max-w-[120px]">{topSubject}</h4>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500">
                  <Flame className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Sequência</p>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white">{streak} Dias</h4>
                </div>
              </div>
           </div>

           <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
             <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
               <Target className="w-5 h-5 text-militar-500" /> Distribuição de Tempo
             </h3>
             <div className="h-48 md:h-64 w-full relative">
               <Doughnut data={chartData} options={chartOptions} />
             </div>
           </div>
        </div>
      </div>

      {/* 3. COMPONENTE LINHA DO TEMPO */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200 dark:border-slate-800 mt-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-8 flex items-center gap-3">
          <CalendarDays className="w-6 h-6 text-blue-500" /> Histórico de Estudos (Timeline)
        </h3>

        {sessions.length > 0 ? (
          <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-5">
            {sessions.map((session, idx) => {
              const colors = ['text-emerald-500', 'text-blue-500', 'text-amber-500', 'text-purple-500', 'text-pink-500', 'text-cyan-500'];
              const colorClass = colors[idx % colors.length];

              return (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={session.id} 
                  className="mb-8 ml-8 relative group"
                >
                  <span className="absolute -left-[45px] flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 ring-4 ring-white dark:ring-slate-900 transition-transform group-hover:scale-110">
                    <CheckCircle2 className={`h-6 w-6 ${colorClass} bg-white dark:bg-slate-900 rounded-full`} />
                  </span>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{session.subjectName}</h4>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                       {formatTimelineDate(session.timestamp)} 
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 block"></span> 
                       Estudou por {formatTimelineDuration(session.duration)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 italic">
            Nenhuma sessão registrada. Inicie o cronômetro para estudar.
          </div>
        )}
      </div>

    </motion.div>
  );
}
