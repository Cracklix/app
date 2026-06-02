'use client';

import { motion } from "framer-motion"
import { ShieldCheck, Target, Trophy, Clock } from "lucide-react"

const features = [
  { 
    icon: <ShieldCheck className="h-8 w-8 text-white" />, 
    title: "Real Exam Pattern Based Mocks", 
    desc: "Mocks designed exactly as per the latest exam pattern."
  },
  { 
    icon: <Target className="h-8 w-8 text-white" />, 
    title: "Detailed Solutions", 
    desc: "Step-by-step solutions with explanations."
  },
  { 
    icon: <Trophy className="h-8 w-8 text-white" />, 
    title: "Performance Analytics", 
    desc: "Track your progress and performance."
  },
  { 
    icon: <Clock className="h-8 w-8 text-white" />, 
    title: "Study Anytime Anywhere", 
    desc: "Learn from mobile, tablet or desktop."
  },
]

export default function Features() {
  return (
    <section className="py-24 bg-[#08152d] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-5xl font-bold mb-16"
        >
          Why Choose <span className="text-orange-500">Cracklix?</span>
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-orange-500/50 transition-all group"
            >
              <div className="h-16 w-16 rounded-xl bg-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                {feature.icon}
              </div>
              <h3 className="font-bold text-xl mb-3 group-hover:text-orange-500 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
