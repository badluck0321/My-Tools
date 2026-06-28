import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight, Heart, Zap, Users, Globe } from 'lucide-react';

const jobs = [
  { id:1, title:'Full-Stack Developer',      team:'Engineering', location:'Casablanca / Remote', type:'Full-time',  tags:['React','Spring Boot','MongoDB'] },
  { id:2, title:'Mobile Developer (React Native)', team:'Engineering', location:'Remote',   type:'Full-time',  tags:['React Native','iOS','Android'] },
  { id:3, title:'UI/UX Designer',             team:'Design',     location:'Casablanca',           type:'Full-time',  tags:['Figma','Tailwind','Prototyping'] },
  { id:4, title:'Community Manager',          team:'Marketing',  location:'Casablanca / Remote',  type:'Full-time',  tags:['Social Media','Content','Arabic/French'] },
  { id:5, title:'Customer Support Specialist',team:'Operations', location:'Casablanca',           type:'Part-time',  tags:['Support','CRM','Bilingual'] },
];

const perks = [
  { icon: Heart,  title: 'Health Coverage',    desc: 'Full medical, dental and vision for you and your family.' },
  { icon: Zap,    title: 'Fast Growth',         desc: 'Early-stage startup — your work ships and matters on day one.' },
  { icon: Users,  title: 'Great Team',          desc: 'A small, experienced, and genuinely kind team.' },
  { icon: Globe,  title: 'Remote-Friendly',     desc: 'Most roles can be done fully remote within GMT±2.' },
];

const Careers = () => (
  <div className="min-h-screen bg-[#fafaf9] dark:bg-[#1a1816]">

    {/* Hero */}
    <section className="bg-gradient-to-br from-[#6d2842] to-[#a64d6d] py-20 text-white text-center">
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}>
        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4">
          <Briefcase size={26} />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">Join Our Team</h1>
        <p className="text-white/80 max-w-xl mx-auto">
          We're building the marketplace for professionals in the trades. Come help us do it.
        </p>
      </motion.div>
    </section>

    <div className="container-custom py-16 space-y-20">

      {/* Perks */}
      <section>
        <h2 className="text-2xl font-bold text-[#2d2a27] dark:text-[#fafaf9] mb-8 text-center">Why My-Tools?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={i} initial={{ opacity:0,y:16 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
              className="bg-white dark:bg-[#2d2a27] rounded-2xl p-6 border border-[#e8e7e5] dark:border-[#4a4642]">
              <div className="w-10 h-10 bg-[#6d2842]/10 dark:bg-[#6d2842]/30 rounded-xl flex items-center justify-center mb-4">
                <Icon size={18} className="text-[#6d2842] dark:text-[#e8a0b4]" />
              </div>
              <h3 className="font-bold text-[#1a1816] dark:text-[#f0ece8] mb-1">{title}</h3>
              <p className="text-sm text-[#5d5955] dark:text-[#c4bfb9]">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Open roles */}
      <section>
        <h2 className="text-2xl font-bold text-[#2d2a27] dark:text-[#fafaf9] mb-8">Open Positions</h2>
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <motion.div key={job.id} initial={{ opacity:0,x:-12 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ delay:i*0.07 }}
              className="bg-white dark:bg-[#2d2a27] rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#6d2842]/40 transition-all group">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#6d2842]/10 text-[#6d2842] dark:bg-[#6d2842]/30 dark:text-[#e8a0b4]">
                    {job.team}
                  </span>
                  <span className="text-xs text-[#8a8580] flex items-center gap-1"><Clock size={11} /> {job.type}</span>
                  <span className="text-xs text-[#8a8580] flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                </div>
                <h3 className="text-lg font-bold text-[#1a1816] dark:text-[#f0ece8] group-hover:text-[#6d2842] dark:group-hover:text-[#e8a0b4] transition-colors">
                  {job.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-[#f0eeeb] dark:bg-[#3a3633] text-[#5d5955] dark:text-[#c4bfb9]">{t}</span>
                  ))}
                </div>
              </div>
              <a href={`mailto:careers@my-tools.ma?subject=Application: ${job.title}`}
                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all">
                Apply <ArrowRight size={15} />
              </a>
            </motion.div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-[#8a8580] dark:text-[#7a756f]">
          Don't see a fit?{' '}
          <a href="mailto:careers@my-tools.ma" className="text-[#6d2842] dark:text-[#e8a0b4] underline underline-offset-4">
            Send us a spontaneous application.
          </a>
        </p>
      </section>

    </div>
  </div>
);
export default Careers;