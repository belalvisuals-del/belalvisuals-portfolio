import React from 'react';
import { motion } from 'motion/react';
import { Skill, SiteSettings } from '../types';
import { Trophy, Zap, Award, CheckCircle } from 'lucide-react';
import { getGoogleDriveDirectLink } from '../utils';

interface ExperienceProps {
  skills: Skill[];
  settings: SiteSettings | null;
}

const Experience = ({ skills, settings }: ExperienceProps) => {
  return (
    <section id="experience" className="py-16 lg:py-24 bg-primary-dark px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              My <span className="text-primary-light">Experience</span> & Skills
            </h2>
            <p className="text-gray-400 mb-10 text-sm md:text-lg leading-relaxed font-light text-center lg:text-left">
              I have spent years mastering the industry's leading creative tools. My expertise spans across graphic design, video editing, and visual storytelling.
            </p>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="bg-primary-navy p-4 md:p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-12 h-12 bg-primary-blue/20 rounded-2xl flex items-center justify-center mb-4">
                  <Trophy className="text-primary-blue" size={24} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {settings?.successfulProjects || 0}+
                </h3>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Successful Projects</p>
              </div>
              <div className="bg-primary-navy p-4 md:p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-12 h-12 bg-primary-light/20 rounded-2xl flex items-center justify-center mb-4">
                  <CheckCircle className="text-primary-light" size={24} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">100%</h3>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Client Satisfaction</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {skills.map((skill, idx) => (
              <div key={skill.id} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    {skill.icon ? (
                      <img src={getGoogleDriveDirectLink(skill.icon)} alt={skill.name} className="w-4 h-4 object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <Zap size={14} className="text-primary-light" />
                    )}
                    {skill.name}
                  </span>
                  <span className="text-primary-light font-mono text-xs">{skill.percentage}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary-blue to-primary-light rounded-full"
                  />
                </div>
              </div>
            ))}
            {skills.length === 0 && (
              <div className="text-gray-500 italic text-sm">Skills will be listed here once added from admin panel.</div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
