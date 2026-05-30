import React, { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, Plus, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminPanelProps {
  currentUserEmail: string;
}

export default function AdminPanel({ currentUserEmail }: AdminPanelProps) {
  const [allowedUsers, setAllowedUsers] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [months, setMonths] = useState(1);

  useEffect(() => {
    fetch('/api/admin/users', {
      headers: {
        'x-admin-email': currentUserEmail
      }
    })
      .then(res => res.json())
      .then(data => setAllowedUsers(data.users || []))
      .catch(console.error);
  }, [currentUserEmail]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-email': currentUserEmail 
        },
        body: JSON.stringify({ email: newEmail, months })
      });
      const data = await res.json();
      setAllowedUsers(data.users || []);
      setNewEmail('');
      setMonths(1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (emailToRemove: string) => {
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(emailToRemove)}`, {
        method: 'DELETE',
        headers: {
          'x-admin-email': currentUserEmail
        }
      });
      const data = await res.json();
      setAllowedUsers(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAvisos = async (e: React.FormEvent) => {
    e.preventDefault();
    const avisoList = document.getElementById('avisosText') as HTMLTextAreaElement;
    const items = avisoList.value.split('\n').filter(s => s.trim() !== '');
    try {
      await fetch('/api/admin/avisos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-email': currentUserEmail
        },
        body: JSON.stringify({ avisos: items })
      });
      alert('Avisos atualizados com sucesso!');
    } catch(err) {
      console.error(err);
      alert('Erro ao atualizar avisos.');
    }
  };

  const calculateDaysRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pb-12"
    >
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-red-500" /> Painel de Administração
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-3xl leading-relaxed">
          Gerencie permissões. Somente o seu email e os emails listados abaixo poderão acessar a plataforma.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 flex flex-col transition-colors duration-300">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
           <Users className="w-5 h-5 text-militar-600 dark:text-militar-400" /> Lista de Acesso Permitido
        </h3>

        <form onSubmit={handleAddSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="email"
            value={newEmail}
            required
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Digite o email do aluno..."
            className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-militar-500 focus:border-militar-500 transition-colors"
          />
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">Meses:</label>
            <input
              type="number"
              value={months}
              min={1}
              max={12}
              onChange={(e) => setMonths(parseInt(e.target.value) || 1)}
              className="w-20 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-militar-500 focus:border-militar-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-militar-600 hover:bg-militar-700 text-white rounded-xl shadow-sm font-medium transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-5 h-5" /> Adicionar / Renovar
          </button>
        </form>

        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
           {allowedUsers.length > 0 ? (
             <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {allowedUsers.map(user => {
                  const daysRemaining = calculateDaysRemaining(user.expiresAt);
                  const isExpired = daysRemaining === 0;
                  return (
                  <li key={user.email} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors gap-4">
                     <div>
                       <span className="font-medium text-slate-700 dark:text-slate-300 block">{user.email}</span>
                       <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                         Status: {isExpired ? <span className="text-red-500 font-semibold">Expirado</span> : <span className="text-emerald-500 font-semibold">{daysRemaining} dias restantes</span>}
                       </span>
                       <span className="text-xs text-slate-400 dark:text-slate-500 block">
                         Adicionado em: {new Date(user.addedAt).toLocaleDateString()} | Expira em: {new Date(user.expiresAt).toLocaleDateString()}
                       </span>
                     </div>
                     <button
                       onClick={() => handleRemove(user.email)}
                       className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors self-start sm:self-auto"
                       title="Remover acesso"
                     >
                       <Trash2 className="w-5 h-5" />
                     </button>
                  </li>
                )})}
             </ul>
           ) : (
             <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                <Users className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <p>Nenhum email extra cadastrado na lista de permissões.</p>
                <p className="text-sm mt-1">Apenas o seu email mestre conseguirá entrar.</p>
             </div>
           )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 flex flex-col transition-colors duration-300 mt-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
           <ShieldAlert className="w-5 h-5 text-militar-600 dark:text-militar-400" /> Mural de Avisos
        </h3>
        <form onSubmit={handleUpdateAvisos} className="flex flex-col gap-4">
           <p className="text-sm text-slate-500 dark:text-slate-400">Digite um aviso por linha. Eles aparecerão no painel dos alunos.</p>
           <textarea 
             id="avisosText"
             className="w-full h-32 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-militar-500 transition-colors resize-none"
             placeholder="Novo material adicionado&#10;Simulado no próximo fim de semana"
           />
           <button
             type="submit"
             className="px-6 py-3 bg-militar-600 hover:bg-militar-700 text-white rounded-xl shadow-sm font-medium transition-colors sm:self-start w-full sm:w-auto"
           >
             Atualizar Mural
           </button>
        </form>
      </div>
    </motion.div>
  );
}
