import React, { useRef } from 'react';
import { ScrollyCanvas } from '../components/About/ScrollyCanvas';
import { AboutOverlay } from '../components/About/AboutOverlay';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, ExternalLink, Trophy, BadgeCheck, Scroll, Briefcase, Calendar, Building2, Mail, Linkedin } from 'lucide-react';
import { HoloLogo } from '../components/About/HoloLogo';

const About: React.FC = () => {
    // 500vh container for the scroll scrub logic
    const scrollRef = useRef<HTMLDivElement>(null);
    const numFrames = 192; // Total frames we have

    return (
        <div className="bg-[#121212] min-h-screen text-white">

            {/* --- Scrollytelling Section (500vh height) --- */}
            <div ref={scrollRef} className="relative h-[500vh] w-full bg-black">
                <ScrollyCanvas numFrames={numFrames} scrollRef={scrollRef} />
                <AboutOverlay scrollRef={scrollRef} />
            </div>

            {/* --- Content Below the Fold --- */}
            <div className="relative z-20 bg-[#121212] pt-32 pb-32 px-6 mt-24">
                <div className="max-w-7xl mx-auto space-y-32">

                    {/* Intro Grid */}
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h3 className="text-3xl font-serif text-primary-300">Background</h3>
                            <div className="space-y-4 text-gray-300 leading-relaxed font-light text-lg">
                                <p>
                                    I am a <span className="text-white font-medium">Nutrition Professional and Research Scholar</span> with formal training in food and nutrition and ongoing doctoral research in <span className="text-primary-200">Food Bioprocessing and Nutrition</span> at the Indian Institute of Technology, Guwahati.
                                </p>
                                <p>
                                    My approach integrates research, applied nutrition, and real-world food choices with an emphasis on sustainable, culturally relevant dietary practices. I aim to help individuals and communities make informed, confident decisions about food and health through clarity, science-backed insights, and practicality.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-4">
                                {["Clinical Dietetics", "Research Methodology", "Functional Foods", "Nutrigenomics", "Public Health"].map((skill) => (
                                    <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-primary-300">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 p-8 space-y-8"
                        >
                            <div className="absolute top-0 right-0 p-32 bg-primary-900/20 blur-[100px] rounded-full pointer-events-none" />

                            {/* Holographic Seal - Top Right */}
                            {/* Holographic Seal - Top Right */}
                            <div className="absolute top-4 right-4 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 pointer-events-none">
                                {/* Premium Glass Container Effect */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 to-transparent border border-white/10 shadow-[0_0_30px_rgba(20,184,166,0.1)] backdrop-blur-[1px]" />
                                <div className="absolute inset-1 rounded-full border border-teal-500/20 opacity-50" />
                                <div className="relative w-full h-full p-2">
                                    <HoloLogo />
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2 pr-24 md:pr-0">
                                    <GraduationCap className="text-primary-400" /> Academic Excellence
                                </h4>
                                <div className="space-y-6">
                                    <div className="relative pl-6 border-l border-primary-500/30">
                                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                        <h5 className="text-lg font-semibold text-white">Doctor of Philosophy (PhD)</h5>
                                        <p className="text-primary-200 text-sm">Food Bioprocessing & Nutrition • Ongoing</p>
                                        <p className="text-gray-500 text-xs mt-1">Indian Institute of Technology, Guwahati</p>
                                    </div>
                                    <div className="relative pl-6 border-l border-white/10">
                                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.3)]" />
                                        <h5 className="text-lg font-semibold text-white">Visiting Research Student</h5>
                                        <p className="text-gray-300 text-sm">International Research Exchange • Oct 2024 - Mar 2025</p>
                                        <p className="text-gray-500 text-xs mt-1">Gifu University, Japan</p>
                                    </div>
                                    <div className="relative pl-6 border-l border-white/10">
                                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-600" />
                                        <h5 className="text-lg font-semibold text-white">Master of Science (MSc)</h5>
                                        <p className="text-gray-300 text-sm">Food & Nutrition</p>
                                        <p className="text-gray-500 text-xs mt-1">JD Birla Institute (Jadavpur University)</p>
                                    </div>
                                    <div className="relative pl-6 border-l border-white/10">
                                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-600" />
                                        <h5 className="text-lg font-semibold text-white">Bachelor of Science (BSc)</h5>
                                        <p className="text-gray-300 text-sm">Food & Nutrition</p>
                                        <p className="text-gray-500 text-xs mt-1">JD Birla Institute (Jadavpur University)</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Professional Journey - Vertical Timeline */}
                    <div className="space-y-12">
                        <h3 className="text-3xl font-serif text-primary-300 flex items-center gap-3">
                            <Briefcase size={28} /> Professional Journey
                        </h3>

                        <div className="relative border-l-2 border-white/10 ml-3 md:ml-6 space-y-12 py-4">
                            {[
                                {
                                    role: "UGC Senior Research Fellow",
                                    org: "Indian Institute of Technology, Guwahati",
                                    date: "Feb 2024 - Present",
                                    desc: "Leading research initiatives in translational nutrition.",
                                    subRoles: [
                                        { title: "UGC Junior Research Fellow", date: "Feb 2022 - Jan 2024" }
                                    ]
                                },
                                {
                                    role: "Junior Research Fellow (Project)",
                                    org: "Uttar Banga Krishi Vishwavidyalaya",
                                    date: "Jul 2021 - Dec 2021",
                                    desc: "Project focused on bio-fortified foods."
                                },
                                {
                                    role: "Nutritionist",
                                    org: "HealthifyMe",
                                    date: "Dec 2020 - Apr 2021",
                                    desc: "Provided personalized dietary counseling for diverse client profiles."
                                },
                                {
                                    role: "Community Nutritionist",
                                    org: "Sahayata-Nutrition, Health, Education & Research Foundation",
                                    date: "Oct 2020 - Feb 2022",
                                    desc: "Led community health workshops and nutritional assessment drives.",
                                    subRoles: [
                                        { title: "Community Nutritionist Intern", date: "Jul 2020 - Oct 2020" }
                                    ]
                                },
                                {
                                    role: "Consultant Dietitian",
                                    org: "Freelance",
                                    date: "May 2020 - Present",
                                    desc: "Evidence-based practice serving private clients."
                                },
                                {
                                    role: "Dietitian Intern",
                                    org: "Charnock Hospital",
                                    date: "Apr 2018 - May 2018",
                                    desc: "Clinical nutrition rotation and patient care."
                                }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-8 md:pl-12"
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[5px] md:-left-[5px] top-2 w-3 h-3 rounded-full bg-primary-500 shadow-[0_0_15px_rgba(168,85,247,0.6)] ring-4 ring-black" />

                                    <div className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary-500/30 hover:bg-white/10 transition-all">
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                                            <div>
                                                <h4 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors">
                                                    {item.role}
                                                </h4>
                                                <div className="flex items-center gap-2 text-gray-400 mt-1">
                                                    <Building2 size={14} />
                                                    <span className="text-sm font-medium tracking-wide text-gray-300">{item.org}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary-400/80 bg-primary-500/10 px-3 py-1 rounded-full w-fit">
                                                <Calendar size={12} />
                                                <span>{item.date}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                            {item.desc}
                                        </p>

                                        {/* Sub-roles (Promotions/History within same org) */}
                                        {item.subRoles && (
                                            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                                                {item.subRoles.map((sub, idx) => (
                                                    <div key={idx} className="relative pl-4 border-l border-white/20">
                                                        <h5 className="text-sm font-semibold text-gray-300">{sub.title}</h5>
                                                        <span className="text-xs text-gray-500">{sub.date}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Research & Publications */}
                    <div className="space-y-12">
                        <div className="flex justify-between items-end border-b border-white/10 pb-8">
                            <h3 className="text-4xl md:text-5xl font-bold">Selected Publications</h3>
                            <a
                                href="https://scholar.google.com/citations?user=kXhEKvMAAAAJ&hl=en"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden md:flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                            >
                                View Google Scholar <ExternalLink size={18} />
                            </a>
                        </div>

                        <div className="grid gap-6">
                            {[
                                {
                                    title: "Nutritional and Functional Quality of Mustard and Coriander Greens at Different Phases of Development",
                                    journal: "Current Research in Nutrition and Food Science",
                                    year: "Feb 14, 2023",
                                    desc: "Evaluating the phytochemical profile and antioxidant capacity of greens at various growth stages to optimize harvest timing for maximum nutritional value.",
                                    link: "https://www.foodandnutritionjournal.org/volume11number1/nutritional-and-functional-quality-of-mustard-and-coriander-greens-at-different-phases-of-development/"
                                },
                                {
                                    title: "Micronutrient Bioavailability in Plant-Based Diets",
                                    journal: "Journal of Nutrition",
                                    year: "2024",
                                    desc: "Investigating the absorption rates of iron and zinc in predominantly vegetarian demographics using isotope tracer techniques.",
                                    link: "#"
                                },
                                {
                                    title: "Impact of Traditional Processing on Antinutritional Factors",
                                    journal: "Food Chemistry",
                                    year: "2023",
                                    desc: "Analysis of fermentation and germination techniques in reducing phytates and improving protein digestibility in legumes.",
                                    link: "#"
                                }
                            ].map((pub, index) => (
                                <a
                                    key={index}
                                    href={pub.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block group"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-primary-500/30 hover:bg-white/10 transition-all cursor-pointer"
                                    >
                                        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                            <div className="space-y-2">
                                                <div className="flex gap-3 text-xs uppercase tracking-wider text-primary-400/80 mb-2">
                                                    <span>{pub.journal}</span>
                                                    <span>•</span>
                                                    <span>{pub.year}</span>
                                                </div>
                                                <h4 className="text-2xl font-bold group-hover:text-primary-300 transition-colors">
                                                    {pub.title}
                                                </h4>
                                                <p className="text-gray-400 max-w-3xl">
                                                    {pub.desc}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white/20 group-hover:bg-primary-500 group-hover:border-primary-500 transition-all shrink-0">
                                                <ArrowRight className="group-hover:text-black" />
                                            </div>
                                        </div>
                                    </motion.div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Credentials Grid: Awards & Certifications */}
                    <div className="grid md:grid-cols-2 gap-12">

                        {/* Honors & Awards */}
                        <div className="space-y-8">
                            <h3 className="text-3xl font-bold font-serif text-white flex items-center gap-3">
                                <Trophy className="text-yellow-500" /> Honors & Awards
                            </h3>
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-colors group"
                                >
                                    <div className="flex gap-4">
                                        <div className="mt-1">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">Young Scientist Junior Award</h4>
                                            <p className="text-sm text-gray-400 mt-1">Nutrition Society of India • Nov 2025</p>
                                            <p className="text-xs text-gray-500 mt-2 uppercase tracking-wide">Experimental Nutrition Category</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-colors group"
                                >
                                    <div className="flex gap-4">
                                        <div className="mt-1">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">UGC JRF</h4>
                                            <p className="text-sm text-gray-400 mt-1">Issued by UGC • Feb 2022</p>
                                            <p className="text-xs text-gray-500 mt-2 uppercase tracking-wide">Associated with IIT Guwahati</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-colors group"
                                >
                                    <div className="flex gap-4">
                                        <div className="mt-1">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">DST Fellowship</h4>
                                            <p className="text-sm text-gray-400 mt-1">SEED Division, DST • Jul 2021</p>
                                            <p className="text-xs text-gray-500 mt-2 uppercase tracking-wide">Associated with UBKV, Cooch Behar</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Licenses & Certifications */}
                        <div className="space-y-8">
                            <h3 className="text-3xl font-bold font-serif text-white flex items-center gap-3">
                                <BadgeCheck className="text-primary-400" /> Certifications
                            </h3>
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-500/50 transition-colors flex items-center gap-4 group"
                                >
                                    <div className="p-3 rounded-full bg-white/5 text-primary-400 group-hover:text-primary-300 group-hover:shadow-[0_0_15px_rgba(38,166,154,0.5)] group-hover:bg-primary-500/10 transition-all">
                                        <Scroll size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">UGC NET for Assistant Professor & JRF</h4>
                                        <p className="text-sm text-gray-400 mt-1">University Grants Commission • Feb 2022</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-500/50 transition-colors flex items-center gap-4 group"
                                >
                                    <div className="p-3 rounded-full bg-white/5 text-primary-400 group-hover:text-primary-300 group-hover:shadow-[0_0_15px_rgba(38,166,154,0.5)] group-hover:bg-primary-500/10 transition-all">
                                        <Scroll size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">Certified Food Safety Supervisor</h4>
                                        <p className="text-sm text-gray-400 mt-1">World Business Watch • Manufacturing Lvl 2</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-500/50 transition-colors flex items-center gap-4 group"
                                >
                                    <div className="p-3 rounded-full bg-white/5 text-primary-400 group-hover:text-primary-300 group-hover:shadow-[0_0_15px_rgba(38,166,154,0.5)] group-hover:bg-primary-500/10 transition-all">
                                        <Scroll size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">UGC NET for Assistant Professor</h4>
                                        <p className="text-sm text-gray-400 mt-1">University Grants Commission • Dec 2020</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                    </div>

                    {/* Connect & Collaborate */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="py-20 text-center space-y-12"
                    >
                        <h2 className="text-5xl md:text-7xl font-serif text-white">Let's Create<br /><span className="text-primary-400">Impact Together</span></h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                            Whether for research collaboration, nutritional consultancy, or academic discourse, I am always open to meaningful connections.
                        </p>

                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <a
                                href="mailto:darunima20@gmail.com"
                                className="group relative px-8 py-4 bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-full">
                                        <Mail size={20} className="text-primary-300" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-xs text-gray-400 uppercase tracking-wider">Email Me</span>
                                        <span className="text-lg font-medium text-white">darunima20@gmail.com</span>
                                    </div>
                                </div>
                            </a>

                            <a
                                href="https://linkedin.com/in/arunima-dhar-275131177"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative px-8 py-4 bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-full">
                                        <Linkedin size={20} className="text-blue-400" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-xs text-gray-400 uppercase tracking-wider">Connect on LinkedIn</span>
                                        <span className="text-lg font-medium text-white">Arunima Dhar</span>
                                    </div>
                                    <ExternalLink size={14} className="text-gray-500 group-hover:text-white transition-colors ml-2" />
                                </div>
                            </a>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default About;
