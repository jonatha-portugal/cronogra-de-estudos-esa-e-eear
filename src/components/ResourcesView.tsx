import React from 'react';
import { motion } from 'motion/react';
import { FileText, Link as LinkIcon, ExternalLink, Download } from 'lucide-react';

const resources = [
  {
    type: 'pdf',
    title: 'Edital EEAR 2026',
    description: 'Documento completo (Em breve/Placeholder)',
    url: '#',
  },
  {
    type: 'pdf',
    title: 'Edital ESA 2026',
    description: 'Documento completo (Em breve/Placeholder)',
    url: '#',
  },
  {
    type: 'link',
    title: 'Provas Anteriores - EEAR',
    description: 'Acesse o portal oficial para download de provas passadas.',
    url: 'https://ingresso.eear.aer.mil.br/',
  },
  {
    type: 'link',
    title: 'Provas Anteriores - ESA',
    description: 'Página oficial de provas da Escola de Sargentos das Armas.',
    url: 'https://esa.eb.mil.br/index.php/pt/concurso/provas-anteriores',
  }
];

export default function ResourcesView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pb-12 max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Materiais & Links Úteis</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Central de arquivos e links para auxiliar a sua jornada aos exames militares.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resources.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-militar-300 dark:hover:border-militar-600 transition-all duration-200"
          >
            <div className={`p-3 rounded-xl flex-shrink-0 transition-colors ${
              item.type === 'pdf' 
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-500/20' 
                : 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20'
            }`}>
              {item.type === 'pdf' ? <FileText className="w-6 h-6" /> : <LinkIcon className="w-6 h-6" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.title}</h3>
                {item.type === 'pdf' ? <Download className="w-3.5 h-3.5 text-slate-400" /> : <ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{item.description}</p>
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
}
