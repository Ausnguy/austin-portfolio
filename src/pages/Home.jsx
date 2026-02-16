import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import ExperienceCard from '../components/ExperienceCard';
import { getFeaturedProjects } from '../data/projects';
import { experiences } from '../data/experience';
import { skillsData } from '../data/skills';

const Home = () => {
  const featuredProjects = getFeaturedProjects();
  const resumeFileUrl = `${import.meta.env.BASE_URL}resume.pdf`;
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-num">/ PORTFOLIO 2026</div>
            <h1 className="font-sans text-6xl md:text-7xl font-bold mb-6 leading-[0.9]">
              <span className="offset-header" data-text="Austin">Austin</span><br />
              <span className="offset-header" data-text="Nguyen">Nguyen</span>
            </h1>
            <div className="max-w-2xl">
              <p className="font-serif text-2xl mb-3 leading-relaxed">
                MIS student who turns messy data into clear answers.
              </p>
              <p className="font-mono text-sm text-slate mb-8">
                Currently: University of Houston '27 → Incoming at HPE, ToolAndMore LLC
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <a href="#projects" className="btn">View Work</a>
              <a href="#contact" className="btn btn-outline">Get in Touch</a>
            </div>
          </motion.div>
        </div>

        {/* Floating info card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute top-24 right-6 hidden lg:block"
        >
          <div className="bg-white border-2 border-charcoal p-6 max-w-xs">
            <div className="font-mono text-xs text-slate mb-2">CURRENTLY BUILDING</div>
            <div className="font-sans font-semibold mb-2">  Handwriting Recognition Model</div>
            <div className="font-serif text-sm italic">   Teaching a model to read handwritten numbers
</div>
          </div>
        </motion.div>
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
              <div className="section-num">/ 01</div>
              <h2 className="font-sans text-4xl font-bold mb-6">Background</h2>
            </div>
            <div className="lg:col-span-3 space-y-6">
              <p className="font-serif text-lg leading-relaxed">
                I'm studying Management Information Systems at UH with a focus on turning data into 
                business decisions. Started an Amazon FBA business in 2021, which taught me that 
                good analytics beats good hunches every time.
              </p>
              <p className="font-serif text-lg leading-relaxed">
                <p className="font-serif text-lg leading-relaxed">
  Spent summer 2025 working on analytics projects at USI Insurance Services. 
  I’ll be joining HPE as a Compensation Analyst Intern in Summer 2026.
</p>

<p className="font-serif text-lg leading-relaxed">
  Currently building ML models and data dashboards.
</p>

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
      <section id="work" className="bg-white border-y-2 border-charcoal py-16 my-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-12">
              <div className="section-num">/ 02</div>
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
      <section id="projects" className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <div className="section-num">/ 03</div>
            <h2 className="font-sans text-4xl font-bold mb-4">Selected Projects</h2>
            <p className="font-mono text-sm text-slate max-w-2xl">
              Mix of ML research, web apps, and dashboards. Focus on practical impact over technical complexity.
            </p>
          </div>

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
                <div className="section-num">/ 04</div>
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
      <section id="contact" className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="section-num">/ 05</div>
          <h2 className="font-sans text-5xl font-bold mb-6">Let's work together</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Looking for summer 2026 internships in data analytics, BI, or data science. 
            Also happy to chat about ML projects or e-commerce analytics.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <a href="mailto:ausnguybusiness@gmail.com" className="bg-white border-2 border-charcoal p-6 hover:bg-sand transition-colors">
              <div className="font-mono text-xs mb-2 text-slate">EMAIL</div>
              <div className="font-sans font-semibold">ausnguybusiness@gmail.com</div>
            </a>
            <a href="https://www.linkedin.com/in/austin-nguyen-business/" target="_blank" rel="noopener noreferrer" className="bg-white border-2 border-charcoal p-6 hover:bg-sand transition-colors">
              <div className="font-mono text-xs mb-2 text-slate">LINKEDIN</div>
              <div className="font-sans font-semibold">/in/austin-nguyen-business</div>
            </a>
            <a href="https://github.com/Ausnguy" target="_blank" rel="noopener noreferrer" className="bg-white border-2 border-charcoal p-6 hover:bg-sand transition-colors">
              <div className="font-mono text-xs mb-2 text-slate">GITHUB</div>
              <div className="font-sans font-semibold">@Ausnguy</div>
            </a>
            <div className="bg-white border-2 border-charcoal p-6">
              <div className="font-mono text-xs mb-2 text-slate">LOCATION</div>
              <div className="font-sans font-semibold">Houston, TX</div>
            </div>
          </div>

          <a href={resumeFileUrl} download="resume.pdf" className="btn">Download Resume</a>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
