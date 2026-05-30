import React from 'react';
import { syllabusData, Subject } from '../data/syllabus';
import { motion } from 'motion/react';
import { Check, BookOpen } from 'lucide-react';

interface SubjectViewProps {
  subjectId: string;
  userProgress: Record<string, boolean>;
  toggleProgress: (topicId: string, checked: boolean) => void;
}

const getTagStyle = (tag: string) => {
  switch (tag) {
    case 'AMBOS':
      return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent';
    case 'EEAR':
      return 'bg-fab-50 dark:bg-fab-500/20 text-fab-600 dark:text-fab-400 border-transparent';
    case 'ESA':
      return 'bg-esa-50 dark:bg-esa-500/20 text-esa-600 dark:text-esa-400 border-transparent';
    default:
      return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent';
  }
};

const getTagLabel = (tag: string) => {
  switch (tag) {
    case 'AMBOS':
      return 'Ambos';
    case 'EEAR':
      return 'EEAR';
    case 'ESA':
      return 'ESA';
    default:
      return tag;
  }
};

export default function SubjectView({ subjectId, userProgress, toggleProgress }: SubjectViewProps) {
  const data: Subject = syllabusData[subjectId];
  if (!data) return null;

  return (
    <motion.div 
      key={subjectId}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="pb-12"
    >
      <div className="mb-10 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <div className="flex items-center justify-center w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-3xl">
            {data.icon}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{data.title}</h2>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-3xl sm:mx-0 mx-auto">
          {data.description}
        </p>
        <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500"></span>
            Cai em Ambos
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-fab-50 dark:bg-fab-500/20 text-fab-600 dark:text-fab-400">
            <span className="w-2 h-2 rounded-full bg-fab-400"></span>
            Apenas EEAR
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-esa-50 dark:bg-esa-500/20 text-esa-600 dark:text-esa-400">
            <span className="w-2 h-2 rounded-full bg-esa-400"></span>
            Apenas ESA
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {data.modules.map((module, mIndex) => {
          let modTotal = module.topics.length;
          let modCompleted = module.topics.filter((_, tIdx) => userProgress[`${subjectId}-m${mIndex}-t${tIdx}`]).length;
          const isFinished = modCompleted === modTotal;

          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mIndex * 0.05 + 0.1 }}
              key={mIndex}
              className={`bg-white dark:bg-slate-900 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border transition-all duration-300 ${isFinished ? 'border-militar-300 dark:border-militar-500/30 shadow-militar-100 dark:shadow-none' : 'border-slate-200 dark:border-slate-800'}`}
            >
              <div className={`p-6 border-b transition-colors duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isFinished ? 'bg-militar-50/50 dark:bg-militar-500/10 border-militar-100 dark:border-militar-500/20' : 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'}`}>
                <div className="flex gap-4 items-start">
                  <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm ${isFinished ? 'bg-militar-500 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-sm'}`}>
                    {isFinished ? <Check className="w-5 h-5" /> : mIndex + 1}
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold tracking-tight ${isFinished ? 'text-militar-800 dark:text-militar-400' : 'text-slate-800 dark:text-slate-200'}`}>{module.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{module.desc}</p>
                  </div>
                </div>
                <div className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm text-sm font-medium ${isFinished ? 'bg-white dark:bg-slate-800 border-militar-200 dark:border-militar-500/30' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                  <span className={isFinished ? 'text-militar-600 dark:text-militar-400' : 'text-slate-600 dark:text-slate-300'}>{modCompleted}</span>
                  <span className="text-slate-400 dark:text-slate-500">/</span>
                  <span className="text-slate-500 dark:text-slate-400">{modTotal}</span>
                </div>
              </div>
              
              <div className="p-6">
                <ul className="space-y-2.5">
                  {module.topics.map((topic, tIndex) => {
                    const topicId = `${subjectId}-m${mIndex}-t${tIndex}`;
                    const isChecked = !!userProgress[topicId];
                    const tagStyle = getTagStyle(topic.tag);
                    const tagLabel = getTagLabel(topic.tag);

                    return (
                      <li 
                        key={tIndex} 
                        className={`flex items-start gap-4 p-3 rounded-xl transition-all duration-200 group ${isChecked ? 'bg-militar-50/30 dark:bg-militar-500/5' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                      >
                        <label className="relative flex items-start cursor-pointer mt-0.5">
                          <input
                            id={topicId}
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => toggleProgress(topicId, e.target.checked)}
                            className="w-5 h-5 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-militar-500 focus:ring-militar-500 focus:ring-offset-0 cursor-pointer shadow-sm transition-colors"
                          />
                        </label>
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                          <label 
                            htmlFor={topicId}
                            className={`text-[15px] block ${isChecked ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300 font-medium'}`}
                          >
                            {topic.text}
                          </label>
                          <span className={`shrink-0 text-[10px] uppercase font-bold px-2 py-1 rounded inline-flex items-center justify-center tracking-wider ${tagStyle} ${isChecked ? 'opacity-50' : 'opacity-100'}`}>
                            {tagLabel}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
