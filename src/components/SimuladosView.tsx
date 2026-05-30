import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, TrendingUp, Calendar, CheckSquare, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';

interface SimuladoData {
  id: string;
  date: string;
  banca: 'EEAR' | 'ESA' | 'AMBOS';
  score: number;
  total: number;
}

interface MetaData {
  id: string;
  text: string;
  done: boolean;
}

interface SimuladosViewProps {
  simulados: SimuladoData[];
  onAddSimulado: (data: SimuladoData) => void;
  onRemoveSimulado: (id: string) => void;
  metas: MetaData[];
  onUpdateMetas: (metas: MetaData[]) => void;
}

export default function SimuladosView({ simulados, onAddSimulado, onRemoveSimulado, metas = [], onUpdateMetas }: SimuladosViewProps) {
  const [banca, setBanca] = useState<'EEAR' | 'ESA'>('EEAR');
  const [score, setScore] = useState<number | ''>('');
  const [total, setTotal] = useState<number>(96);
  const [metaInput, setMetaInput] = useState('');
  
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (score === '' || score < 0 || score > total) return;
    
    onAddSimulado({
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      banca,
      score: Number(score),
      total: banca === 'EEAR' ? 96 : 50
    });
    setScore('');
  };

  const handleAddMeta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metaInput.trim()) return;
    onUpdateMetas([...metas, { id: Math.random().toString(36).substr(2, 9), text: metaInput.trim(), done: false }]);
    setMetaInput('');
  };

  const toggleMeta = (id: string) => {
    onUpdateMetas(metas.map(m => m.id === id ? { ...m, done: !m.done } : m));
  };
  const removeMeta = (id: string) => {
    onUpdateMetas(metas.filter(m => m.id !== id));
  };

  const chartData = simulados
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((s, i) => ({
      name: `Sim #${i+1}`,
      percent: Math.round((s.score / s.total) * 100),
      banca: s.banca,
      score: s.score,
      total: s.total
    }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pb-12 max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Desempenho em Simulados</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Mensure seus resultados e acompanhe a evolução para a prova oficial.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-militar-600" /> Registrar Nota
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Concurso (Banca)</label>
              <select 
                value={banca} 
                onChange={e => {
                  setBanca(e.target.value as 'EEAR' | 'ESA');
                  setTotal(e.target.value === 'EEAR' ? 96 : 50);
                }}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-100"
              >
                <option value="EEAR">EEAR (96 questões)</option>
                <option value="ESA">ESA (50 questões)</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Seus Acertos</label>
                <input 
                  type="number" 
                  min="0" 
                  max={total} 
                  required
                  value={score} 
                  onChange={e => setScore(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-100"
                  placeholder="Ex: 60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total</label>
                <input 
                  type="number" 
                  value={banca === 'EEAR' ? 96 : 50} 
                  disabled 
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-2.5 bg-militar-600 hover:bg-militar-700 text-white rounded-lg font-medium transition-colors"
            >
              Adicionar Simulado
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center lg:col-span-1">
          <div className="p-4 bg-militar-50 dark:bg-militar-500/10 text-militar-600 dark:text-militar-400 rounded-full mb-3">
            <Target className="w-8 h-8" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Média Geral de Acertos</p>
          <p className="text-4xl font-bold text-slate-900 dark:text-white">
            {simulados.length ? Math.round(simulados.reduce((acc, s) => acc + (s.score / s.total), 0) / simulados.length * 100) : 0}%
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 lg:col-span-1 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-militar-600" /> Metas Semanais
          </h3>
          <form onSubmit={handleAddMeta} className="mb-4">
            <div className="relative">
               <input 
                 type="text"
                 value={metaInput}
                 onChange={e => setMetaInput(e.target.value)}
                 className="w-full pl-3 pr-10 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-gray-100 text-sm focus:ring-1 focus:ring-militar-500"
                 placeholder="Ex: Fazer 20 questões de física"
               />
               <button type="submit" className="absolute right-2 top-1.5 p-1 text-militar-600 dark:text-militar-400 hover:bg-militar-50 dark:hover:bg-slate-700 rounded-md transition-colors">
                 <Plus className="w-4 h-4" />
               </button>
            </div>
          </form>
          <div className="flex-1 overflow-y-auto pr-1">
            {metas.length > 0 ? (
              <ul className="space-y-2">
                {metas.map(m => (
                  <li key={m.id} className={`flex items-start gap-3 p-3 rounded-xl border ${m.done ? 'bg-slate-50 border-slate-100 dark:bg-slate-800/30 dark:border-slate-800/50' : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700'} shadow-sm transition-colors group`}>
                    <button onClick={() => toggleMeta(m.id)} className="mt-0.5 shrink-0 text-slate-400 hover:text-militar-500 transition-colors">
                      {m.done ? <CheckCircle2 className="w-5 h-5 text-militar-500" /> : <Circle className="w-5 h-5" />}
                    </button>
                    <span className={`text-sm flex-1 ${m.done ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                      {m.text}
                    </span>
                    <button onClick={() => removeMeta(m.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 dark:text-slate-500 text-sm text-center italic mt-4">Nenhuma meta definida.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-8">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-militar-600" /> Evolução de Simulados (% Acertos)
        </h3>
        <div className="h-72 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPercent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4d7c0f" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4d7c0f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                <ChartTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="percent" stroke="#4d7c0f" strokeWidth={3} fillOpacity={1} fill="url(#colorPercent)" name="% Acertos" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              <p>Adicione simulados para visualizar sua evolução no gráfico.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 overflow-hidden">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-militar-600" /> Histórico
        </h3>
        
        {simulados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="lowercase tracking-wider text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Data</th>
                  <th className="px-4 py-3">Banca</th>
                  <th className="px-4 py-3">Acertos</th>
                  <th className="px-4 py-3">% Rendimento</th>
                  <th className="px-4 py-3 rounded-tr-lg text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {simulados.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(sim => (
                  <tr key={sim.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-300 font-medium">
                      {new Date(sim.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric'})}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        sim.banca === 'EEAR' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-lime-100 text-lime-700 dark:bg-lime-500/20 dark:text-lime-400'
                      }`}>
                        {sim.banca}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                      {sim.score} / {sim.total}
                    </td>
                    <td className="px-4 py-4 text-slate-900 dark:text-slate-100 font-bold">
                      {Math.round((sim.score / sim.total) * 100)}%
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button 
                        onClick={() => onRemoveSimulado(sim.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm"
                        title="Remover Simulado"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 italic">O histórico está vazio.</p>
        )}
      </div>

    </motion.div>
  );
}
