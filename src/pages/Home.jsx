import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import ExperienceCard from '../components/ExperienceCard';
import LoopVideo from '../components/LoopVideo';
import StatStrip from '../components/StatStrip';
import { getFeaturedProjects, getSpotlightProject } from '../data/projects';
import { EASE_OUT } from '../lib/motion';
import { experiences } from '../data/experience';
import { skillsData } from '../data/skills';

const Home = () => {
  const spotlight = getSpotlightProject();
  const featuredProjects = getFeaturedProjects().filter((p) => p !== spotlight);
  const baseUrl = import.meta.env.BASE_URL;
  const resumeFileUrl = `${baseUrl}resume.pdf`;
  
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-20 pb-16">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-12 lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="section-num"
            >
              / PORTFOLIO 2026
            </motion.div>

            <h1 className="font-sans text-6xl sm:text-7xl xl:text-8xl font-bold leading-[0.9] mb-6">
              {['Austin', 'Nguyen'].map((word, i) => (
                <span key={word} className="block overflow-hidden pr-2 pb-2 -mb-2">
                  <motion.span
                    className="offset-header"
                    data-text={word}
                    initial={{ transform: 'translateY(105%)' }}
                    animate={{ transform: 'translateY(0%)' }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: EASE_OUT }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.div
              initial={{ opacity: 0, transform: 'translateY(8px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{ duration: 0.5, delay: 0.35, ease: EASE_OUT }}
            >
              <p className="font-serif text-xl sm:text-2xl mb-3 leading-relaxed max-w-xl">
                MIS student who turns messy data into clear answers, and lately into working software.
              </p>

              <p className="font-mono text-sm text-slate mb-8 leading-relaxed max-w-xl">
                University of Houston '27. Data Analyst Intern, Compensation &amp; Equity at HPE.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://www.linkedin.com/in/austin-nguyen-business/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline inline-flex items-center gap-2"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                    <path d="M6.94 8.5A1.5 1.5 0 1 1 6.94 5.5a1.5 1.5 0 0 1 0 3Zm-1.25 1.61h2.5v8.39h-2.5v-8.39Zm4.4 0h2.4v1.15h.03c.33-.63 1.14-1.3 2.35-1.3 2.52 0 2.98 1.66 2.98 3.81v4.73h-2.5v-4.43c0-1.06-.02-2.42-1.47-2.42-1.48 0-1.7 1.15-1.7 2.34v4.51h-2.5v-8.39Z"/>
                  </svg>
                  LinkedIn
                </a>
                <a href={resumeFileUrl} target="_blank" rel="noopener noreferrer" className="btn">
                  View Resume
                </a>
                <a href="mailto:ausnguybusiness@gmail.com" className="btn btn-outline">
                  Email Me
                </a>
              </div>
            </motion.div>
          </div>

          {spotlight && (
            <motion.figure
              initial={{ opacity: 0, transform: 'translateY(12px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{ duration: 0.6, delay: 0.25, ease: EASE_OUT }}
              className="mr-3 mb-3"
            >
              <div className="plate aspect-video overflow-hidden">
                <LoopVideo
                  src={`${baseUrl}${spotlight.videoLoop}`}
                  poster={`${baseUrl}${spotlight.videoLoopPoster}`}
                  to={`/projects/${spotlight.slug}`}
                  label="Open the Parvius case study and demo video"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="mt-6 flex items-baseline justify-between gap-4 font-mono text-xs text-slate">
                <span>Latest: Parvius, built for CaseQuest 2026</span>
                <Link to={`/projects/${spotlight.slug}`} className="text-charcoal underline decoration-rust decoration-2 underline-offset-4 hover:text-rust transition-colors whitespace-nowrap">
                  Read the case study
                </Link>
              </figcaption>
            </motion.figure>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <div className="section-num">/ 02</div>
              <h2 className="font-sans text-4xl font-bold mb-6">Background</h2>
            </div>
            <div className="lg:col-span-3 space-y-6">
              <p className="font-serif text-lg leading-relaxed">
                I'm studying Management Information Systems at UH with a focus on turning data into 
                business decisions. Started an Amazon FBA business in 2021, which taught me that 
                good analytics beats good hunches every time.
              </p>
              <p className="font-serif text-lg leading-relaxed">
                Spent summer 2025 working on analytics projects at USI Insurance Services.
                Since May 2026 I've been a Data Analyst Intern on HPE's Compensation &amp; Equity team,
                and in August 2026 I was one of 35 participants in Bloomberg's Decoded: Data program.
              </p>
              <p className="font-serif text-lg leading-relaxed">
                Most recently, my team built a failure-prediction model, a 3D operations console
                and a field engineer phone app for CaseQuest 2026.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div>
                  <div className="font-mono text-xs mb-1 text-slate">FOCUS</div>
                  <div className="font-sans font-semibold">Data Analytics</div>
                </div>
                <div>
                  <div className="font-mono text-xs mb-1 text-slate">TOOLS</div>
                  <div className="font-sans font-semibold">Python, SQL, Power BI</div>
                </div>
                <div>
                  <div className="font-mono text-xs mb-1 text-slate">GRAD</div>
                  <div className="font-sans font-semibold">May 2027</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Experience Section */}
      <section id="work" className="scroll-mt-20 bg-white border-y-2 border-charcoal py-16 my-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-12">
              <div className="section-num">/ 03</div>
              <h2 className="font-sans text-4xl font-bold">Experience</h2>
            </div>

            <div className="space-y-12 md:ml-10">
              {experiences.map((exp, index) => (
                <ExperienceCard key={exp.id} experience={exp} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="scroll-mt-20 max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <div className="section-num">/ 04</div>
            <h2 className="font-sans text-4xl font-bold mb-4">Selected Projects</h2>
            <p className="font-mono text-sm text-slate max-w-2xl">
              Mix of ML research, web apps, and dashboards. Focus on practical impact over technical complexity.
            </p>
          </div>

          {spotlight && (
            <article className="border-2 border-charcoal bg-white p-6 md:p-10 mb-16">
              <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8 lg:gap-12 mb-10">
                <div>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="tag bg-rust text-cream border-rust">Latest</span>
                    <span className="tag">{spotlight.category}</span>
                  </div>
                  <h3 className="font-sans text-3xl md:text-4xl font-bold leading-tight mb-4 text-balance">
                    {spotlight.title}
                  </h3>
                  <p className="font-serif text-lg leading-relaxed max-w-2xl">
                    {spotlight.description}
                  </p>
                </div>
                <div className="flex flex-col justify-between gap-6">
                  <p className="font-mono text-xs text-slate leading-relaxed">
                    {spotlight.event}
                    <br />
                    Team of {spotlight.team.length}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to={`/projects/${spotlight.slug}`} className="btn">
                      Case Study + Video
                    </Link>
                    <a href={spotlight.links.demo} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
              <StatStrip metrics={spotlight.metrics} />
            </article>
          )}

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/projects" className="btn">View All Projects</Link>
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="bg-sand py-16 my-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <div className="section-num">/ 05</div>
                <h2 className="font-sans text-4xl font-bold mb-8">Skills</h2>
                
                <div className="space-y-6">
                  {Object.entries(skillsData)[0][1].map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="font-mono text-sm font-semibold">{skill.name}</span>
                        <span className="font-mono text-xs text-slate">
                          {skill.level > 85 ? 'Expert' : skill.level > 75 ? 'Advanced' : skill.level > 60 ? 'Proficient' : 'Intermediate'}
                        </span>
                      </div>
                      <div className="border-2 border-charcoal bg-white h-3 relative overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="bg-sage h-full relative"
                        >
                          <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-charcoal"></div>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                {Object.entries(skillsData).slice(1).map(([category, skills]) => (
                  <div key={category}>
                    <div className="font-mono text-xs mb-3 text-slate">{category.toUpperCase()}</div>
                    <div className="flex gap-2 flex-wrap">
                      {skills.map((skill) => (
                        <span key={skill.name} className="tag">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="bg-white border-l-4 border-rust p-6 mt-8">
                  <p className="font-serif italic text-lg leading-relaxed">
                    "The best analysis is the one that actually gets used."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-20 max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <div className="section-num">/ 06</div>
            <h2 className="font-sans text-4xl sm:text-5xl font-bold leading-tight">Let's work together</h2>
          </div>

          <p className="font-serif text-lg sm:text-xl mb-8 leading-relaxed max-w-4xl">
            I am interested in analytics, business intelligence, and data science projects.
            Also happy to chat about ML projects or e-commerce analytics.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 max-w-4xl">
            <a href="https://www.linkedin.com/in/austin-nguyen-business/" target="_blank" rel="noopener noreferrer" className="bg-white border-2 border-charcoal p-5 hover:bg-sand transition-colors">
              <div className="font-mono text-[10px] sm:text-xs mb-2 text-slate uppercase">LinkedIn</div>
              <div className="font-sans font-semibold inline-flex items-center gap-2 text-sm sm:text-base">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M6.94 8.5A1.5 1.5 0 1 1 6.94 5.5a1.5 1.5 0 0 1 0 3Zm-1.25 1.61h2.5v8.39h-2.5v-8.39Zm4.4 0h2.4v1.15h.03c.33-.63 1.14-1.3 2.35-1.3 2.52 0 2.98 1.66 2.98 3.81v4.73h-2.5v-4.43c0-1.06-.02-2.42-1.47-2.42-1.48 0-1.7 1.15-1.7 2.34v4.51h-2.5v-8.39Z"/>
                </svg>
                /in/austin-nguyen-business
              </div>
            </a>
            <a href="mailto:ausnguybusiness@gmail.com" className="bg-white border-2 border-charcoal p-5 hover:bg-sand transition-colors">
              <div className="font-mono text-[10px] sm:text-xs mb-2 text-slate uppercase">Email</div>
              <div className="font-sans font-semibold text-sm sm:text-base">ausnguybusiness@gmail.com</div>
            </a>
            <a href="https://github.com/Ausnguy" target="_blank" rel="noopener noreferrer" className="bg-white border-2 border-charcoal p-5 hover:bg-sand transition-colors">
              <div className="font-mono text-[10px] sm:text-xs mb-2 text-slate uppercase">GitHub</div>
              <div className="font-sans font-semibold text-sm sm:text-base">@Ausnguy</div>
            </a>
            <div className="bg-white border-2 border-charcoal p-5">
              <div className="font-mono text-[10px] sm:text-xs mb-2 text-slate uppercase">Location</div>
              <div className="font-sans font-semibold text-sm sm:text-base">Houston, TX</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-10">
            <a href={resumeFileUrl} target="_blank" rel="noopener noreferrer" className="btn">
              View Resume
            </a>
            <a href={resumeFileUrl} download="resume.pdf" className="btn btn-outline">
              Download Resume
            </a>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;
