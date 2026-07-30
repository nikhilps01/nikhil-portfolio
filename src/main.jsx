import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { defaultProjects } from "./data/projects";
import "./styles.css";

const STORAGE_KEY = "nikhil-nexus-custom-projects-v1";

function Icon({ name }) {
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    up: <><path d="m6 15 6-6 6 6"/></>,
    external: <><path d="M15 3h6v6"/><path d="m10 14 11-11"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
    github: <><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 2a13.4 13.4 0 0 0-7 0C4.8.1 3.7.5 3.7.5A5 5 0 0 0 3.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4"/><path d="M8 19c-3 .9-3-1.5-4-2"/></>,
    download: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    copy: <><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    terminal: <><path d="m4 17 6-5-6-5"/><path d="M12 19h8"/></>,
    menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"/></>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function ProjectStudio({ onClose, onAdd }) {
  const [form, setForm] = useState({
    title: "", category: "Full Stack", description: "", image: "",
    live: "", github: "", tech: "", featured: false
  });
  const [copied, setCopied] = useState(false);

  const projectObject = useMemo(() => ({
    id: form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") || "new-project",
    title: form.title || "New Project",
    category: form.category || "Full Stack",
    year: String(new Date().getFullYear()),
    description: form.description || "Add your project description.",
    image: form.image || "/projects/your-project.png",
    live: form.live || "https://your-project.vercel.app",
    github: form.github,
    tech: form.tech.split(",").map(item => item.trim()).filter(Boolean),
    featured: form.featured
  }), [form]);

  const update = event => {
    const { name, value, type, checked } = event.target;
    setForm(current => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(projectObject, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const submit = event => {
    event.preventDefault();
    if (!form.title.trim()) return;
    onAdd(projectObject);
    onClose();
  };

  return (
    <div className="studio-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <section className="project-studio">
        <header className="studio-header">
          <div>
            <span>PROJECT STUDIO</span>
            <h2>Connect a new project</h2>
          </div>
          <button className="icon-button" onClick={onClose}><Icon name="close"/></button>
        </header>

        <div className="studio-layout">
          <form onSubmit={submit} className="studio-form">
            <label>Project title<input name="title" value={form.title} onChange={update} placeholder="Example: AI Interview Coach" required /></label>
            <div className="field-row">
              <label>Category<input name="category" value={form.category} onChange={update} placeholder="Full Stack" /></label>
              <label>Technologies<input name="tech" value={form.tech} onChange={update} placeholder="React, Node.js, MongoDB" /></label>
            </div>
            <label>Description<textarea name="description" value={form.description} onChange={update} placeholder="What did you build and why?" rows="4"/></label>
            <label>Screenshot path or URL<input name="image" value={form.image} onChange={update} placeholder="/projects/project-name.png" /></label>
            <div className="field-row">
              <label>Live URL<input name="live" value={form.live} onChange={update} placeholder="https://..." /></label>
              <label>GitHub URL<input name="github" value={form.github} onChange={update} placeholder="https://github.com/..." /></label>
            </div>
            <label className="checkbox-label">
              <input type="checkbox" name="featured" checked={form.featured} onChange={update}/>
              Mark as featured project
            </label>
            <div className="studio-actions">
              <button type="button" className="ghost-button" onClick={copyJson}><Icon name="copy"/>{copied ? "Copied" : "Copy JSON"}</button>
              <button className="primary-button" type="submit"><Icon name="plus"/> Add to this browser</button>
            </div>
          </form>

          <aside className="json-preview">
            <div className="preview-title"><span>LIVE OBJECT</span><i/></div>
            <pre>{JSON.stringify(projectObject, null, 2)}</pre>
            <p>
              “Add to this browser” saves with localStorage. For a permanent GitHub/Vercel project,
              copy this object into <code>src/data/projects.js</code> and add the screenshot to
              <code> public/projects</code>.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [customProjects, setCustomProjects] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  });
  const [activeProject, setActiveProject] = useState(0);
  const [studioOpen, setStudioOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [emailCopied, setEmailCopied] = useState(false);
  const heroRef = useRef(null);

  const projects = useMemo(() => (
    [...defaultProjects, ...customProjects].map((project, index) => ({
      ...project,
      number: String(index + 1).padStart(2, "0")
    }))
  ), [customProjects]);

  const technologyCount = useMemo(
    () => new Set(projects.flatMap(project => project.tech)).size,
    [projects]
  );

  useReveal();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customProjects));
  }, [customProjects]);

  useEffect(() => {
    const updateTime = () => setTime(new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      timeZone: "Asia/Kolkata"
    }).format(new Date()));
    updateTime();
    const timer = setInterval(updateTime, 1000);

    let previousY = window.scrollY;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setProgress(max > 0 ? window.scrollY / max * 100 : 0);
      document.body.dataset.direction = window.scrollY > previousY ? "down" : "up";
      previousY = window.scrollY;
    };
    const onPointer = event => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        heroRef.current.style.setProperty("--hero-x", `${x * 18}px`);
        heroRef.current.style.setProperty("--hero-y", `${y * 18}px`);
      }
    };
    const onKey = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setStudioOpen(true);
      }
      if (event.key === "Escape") setStudioOpen(false);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("pointermove", onPointer);
    addEventListener("keydown", onKey);
    onScroll();
    return () => {
      clearInterval(timer);
      removeEventListener("scroll", onScroll);
      removeEventListener("pointermove", onPointer);
      removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1650);
    return () => clearTimeout(timer);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("nikhilprasadsah2@gmail.com");
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 1800);
    } catch {
      window.location.href = "mailto:nikhilprasadsah2@gmail.com";
    }
  };

  const addProject = project => {
    setCustomProjects(current => [...current, project]);
    setActiveProject(projects.length);
  };

  const removeCustomProject = id => {
    setCustomProjects(current => current.filter(project => project.id !== id));
    setActiveProject(0);
  };

  return (
    <>
      <div className={loading ? "site-loader" : "site-loader loader-hidden"} aria-hidden={!loading}>
        <div className="loader-grid"/>
        <div className="loader-content">
          <span>NIKHIL PRASAD SAH</span>
          <h2>Initializing portfolio<span className="loader-dots">...</span></h2>
          <div className="loader-status"><i/><p>LOADING EXPERIENCE</p><strong>READY</strong></div>
          <div className="loader-bar"><i/></div>
        </div>
      </div>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="scroll-progress" style={{ width: `${progress}%` }}/>
      <div className="grain"/>
      <div className="pointer-light"/>
      <div className="ambient ambient-a"/>
      <div className="ambient ambient-b"/>

      <header className="navbar">
        <a href="#home" className="brand">
          <span>N</span>
          <div><strong>Nikhil Prasad Sah</strong><small>FULL STACK DEVELOPER</small></div>
        </a>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          {["About", "Skills", "Projects", "Contact"].map(item =>
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>
          )}
        </nav>
        <div className="nav-actions">
          <button className="studio-trigger" onClick={() => setStudioOpen(true)}><Icon name="plus"/> Add project <kbd>Ctrl K</kbd></button>
          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}><Icon name="menu"/></button>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="home" ref={heroRef}>
          <div className="hero-grid"/>
          <div className="coordinate coord-a">24.006° N</div>
          <div className="coordinate coord-b">85.941° E</div>

          <div className="hero-main" data-reveal>
            <div className="availability"><i/> AVAILABLE FOR OPPORTUNITIES <span>IST {time}</span></div>
            <h1>
              Building digital products
              <em> beyond the ordinary.</em>
            </h1>
            <p>
              I’m Nikhil, a full-stack developer turning complex ideas into fast,
              intuitive and production-ready web experiences.
            </p>
            <div className="hero-buttons">
              <a className="primary-button magnetic" href="#projects">View selected work <Icon name="arrow"/></a>
              <a className="ghost-button magnetic" href="/resume/Nikhil-Prasad-Sah-Resume.pdf" target="_blank" rel="noreferrer">Resume <Icon name="download"/></a>
            </div>
          </div>

          <div className="hero-orbit" data-reveal>
            <div className="orbit outer"><span>REACT</span><span>NODE</span></div>
            <div className="orbit middle"><span>API</span><span>DB</span></div>
            <div className="orbit inner"/>
            <div className="orbit-core">
              <small>DEVELOPER</small>
              <strong>NPS</strong>
              <span>BUILD / SHIP / IMPROVE</span>
            </div>
          </div>

          <div className="hero-bottom">
            <div><span>SCROLL TO EXPLORE</span><i/></div>
            <div className="hero-stats">
              <span><strong>{projects.length}+</strong> PROJECTS</span>
              <span><strong>{technologyCount}+</strong> TECHNOLOGIES</span>
              <span><strong>01</strong> MISSION</span>
            </div>
          </div>
        </section>

        <div className="marquee">
          <div>
            {["REACT.JS","NODE.JS","EXPRESS","MONGODB","JAVASCRIPT","NEXT.JS","GIT","VERCEL"].concat(
              ["REACT.JS","NODE.JS","EXPRESS","MONGODB","JAVASCRIPT","NEXT.JS","GIT","VERCEL"]
            ).map((item, index) => <span key={`${item}-${index}`}>{item}<i>✦</i></span>)}
          </div>
        </div>

        <section className="section about" id="about">
          <div className="section-side"><span>01</span><p>ABOUT / PROFILE</p></div>
          <div className="section-body" data-reveal>
            <div className="eyebrow">WHO I AM</div>
            <h2>Curiosity drives the code. <span>Purpose shapes the product.</span></h2>
            <div className="about-columns">
              <div className="large-copy">
                I combine frontend craft, backend logic and continuous learning to
                build practical products that solve real problems.
              </div>
              <div className="body-copy">
                <p>Final-year B.Tech Computer Science student with hands-on experience building and deploying full-stack applications.</p>
                <p>My focus is clean interfaces, secure authentication, scalable APIs, databases and reliable cloud deployment.</p>
                <a href="mailto:nikhilprasadsah2@gmail.com">Start a conversation <Icon name="arrow"/></a>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-summary-section" id="summary">
          <div className="summary-heading" data-reveal>
            <div>
              <span className="eyebrow">PROFESSIONAL SUMMARY</span>
              <h2>One developer. <em>Three strong directions.</em></h2>
            </div>
            <p>
              I build reliable software, complete full-stack products and practical
              AI-powered experiences with a strong focus on usability and deployment.
            </p>
          </div>

          <div className="summary-role-grid">
            {[
              {
                number: "01",
                role: "Software Developer",
                tag: "ENGINEERING",
                copy:
                  "Software developer with a strong foundation in object-oriented programming, problem solving and application development. I focus on clean, maintainable code and practical solutions that can grow with product requirements.",
                focus: ["Problem Solving", "OOP", "Clean Code", "Application Logic"]
              },
              {
                number: "02",
                role: "Full Stack Developer",
                tag: "WEB PRODUCTS",
                copy:
                  "Full-stack developer experienced in creating responsive interfaces, secure REST APIs, authentication systems, database integrations and production deployments using the MERN ecosystem.",
                focus: ["React.js", "Node.js", "REST APIs", "MongoDB"]
              },
              {
                number: "03",
                role: "AI / ML Developer",
                tag: "INTELLIGENT SYSTEMS",
                copy:
                  "AI/ML developer with practical exposure to Python, data preprocessing, classical machine-learning workflows and AI API integrations for automation, analysis and intelligent product features.",
                focus: ["Python", "Scikit-learn", "Data Processing", "AI Integration"]
              }
            ].map(item => (
              <article className="summary-role-card" key={item.role} data-reveal>
                <div className="summary-card-top">
                  <span>{item.number}</span>
                  <small>{item.tag}</small>
                </div>
                <h3>{item.role}</h3>
                <p>{item.copy}</p>
                <div className="summary-focus">
                  {item.focus.map(skill => <span key={skill}>{skill}</span>)}
                </div>
                <div className="summary-card-line"/>
              </article>
            ))}
          </div>
        </section>

        <section className="section skills skills-v2" id="skills">
          <div className="section-side"><span>02</span><p>SKILLS / MATRIX</p></div>
          <div className="section-body">
            <div className="skills-intro" data-reveal>
              <div>
                <div className="eyebrow">TECHNOLOGY MATRIX</div>
                <h2>Tools I use to move from <span>idea to deployment.</span></h2>
              </div>
              <p>
                Skills are grouped by real development responsibility rather than
                subjective percentages. Every category supports an end-to-end product workflow.
              </p>
            </div>

            <div className="tech-matrix">
              {[
                {
                  code: "FE",
                  title: "Frontend Development",
                  description: "Responsive, accessible and interactive user interfaces.",
                  tools: ["React.js", "Next.js", "JavaScript", "HTML5", "CSS3", "Tailwind CSS"]
                },
                {
                  code: "BE",
                  title: "Backend Development",
                  description: "Secure APIs, application logic and authentication flows.",
                  tools: ["Node.js", "Express.js", "REST APIs", "JWT", "Flask", "Postman"]
                },
                {
                  code: "DB",
                  title: "Database Systems",
                  description: "Structured data models, queries and application persistence.",
                  tools: ["MongoDB", "MySQL", "Firebase", "Mongoose", "MongoDB Atlas"]
                },
                {
                  code: "AI",
                  title: "AI / Machine Learning",
                  description: "Data-driven features and intelligent application integrations.",
                  tools: ["Python", "Scikit-learn", "Pandas", "NumPy", "TF-IDF", "AI APIs"]
                },
                {
                  code: "SE",
                  title: "Software Engineering",
                  description: "Maintainable implementation built on strong programming concepts.",
                  tools: ["C++", "OOP", "Data Structures", "Algorithms", "Debugging", "Git"]
                },
                {
                  code: "DX",
                  title: "Deployment & Tools",
                  description: "Testing, version control and reliable production delivery.",
                  tools: ["GitHub", "Vercel", "Render", "VS Code", "Linux", "Cloud Deployment"]
                }
              ].map((group, index) => (
                <article className="tech-matrix-card" key={group.title} data-reveal>
                  <div className="matrix-card-index">
                    <span>{group.code}</span>
                    <small>{String(index + 1).padStart(2, "0")}</small>
                  </div>
                  <div className="matrix-card-content">
                    <h3>{group.title}</h3>
                    <p>{group.description}</p>
                    <div className="matrix-tools">
                      {group.tools.map(tool => <span key={tool}>{tool}</span>)}
                    </div>
                  </div>
                  <div className="matrix-corner"><Icon name="arrow"/></div>
                </article>
              ))}
            </div>

            <div className="skill-highlight-strip" data-reveal>
              <div>
                <span>CORE STRENGTH</span>
                <strong>Full-stack product delivery</strong>
              </div>
              <div>
                <span>WORKING STYLE</span>
                <strong>Build · Test · Improve · Deploy</strong>
              </div>
              <div>
                <span>CURRENT FOCUS</span>
                <strong>Next.js · AI Agents · System Design</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="journey-section" id="journey">
          <div className="journey-heading" data-reveal>
            <div className="eyebrow">DEVELOPER JOURNEY</div>
            <h2>Learning by building, <span>one stage at a time.</span></h2>
          </div>

          <div className="journey-layout">
            <div className="journey-rail" aria-hidden="true"><i/></div>
            <div className="journey-items">
              {[
                {
                  year: "2023",
                  title: "Programming Foundation",
                  copy: "Started building a foundation in C, C++, problem solving, object-oriented programming and core computer-science concepts.",
                  stack: "C · C++ · OOP"
                },
                {
                  year: "2024",
                  title: "Frontend Engineering",
                  copy: "Moved into web development by creating responsive interfaces and learning component-based application development.",
                  stack: "HTML · CSS · JavaScript · React"
                },
                {
                  year: "2025",
                  title: "Full Stack Development",
                  copy: "Built end-to-end applications with APIs, authentication, databases, real-world features and collaborative source control.",
                  stack: "Node.js · Express · MongoDB · Git"
                },
                {
                  year: "2026",
                  title: "AI, Cloud & Production",
                  copy: "Integrated AI-powered capabilities into applications and focused on deployment, performance and production-ready workflows.",
                  stack: "Python · AI APIs · Vercel · Render"
                }
              ].map((item, index) => (
                <article className="journey-item" key={item.year} data-reveal>
                  <div className="journey-year">{item.year}</div>
                  <div className="journey-dot"><span>{String(index + 1).padStart(2, "0")}</span></div>
                  <div className="journey-card">
                    <small>{item.stack}</small>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>


        <section className="recruiter-section">
          <div className="recruiter-heading" data-reveal>
            <div>
              <div className="eyebrow">RECRUITER HIGHLIGHTS</div>
              <h2>Ready to contribute across the <span>complete development lifecycle.</span></h2>
            </div>
            <p>
              From understanding a requirement to building, testing and deploying the
              final application, I can contribute across multiple stages of product development.
            </p>
          </div>

          <div className="recruiter-highlight-grid">
            {[
              ["01","Full Stack Projects","Built complete applications covering frontend, backend and database workflows."],
              ["02","REST API Development","Designed application endpoints and connected interfaces with backend services."],
              ["03","Secure Authentication","Implemented JWT-based login, protected routes and user authorization."],
              ["04","Responsive UI","Created mobile-friendly interfaces that remain clear across screen sizes."],
              ["05","Database Integration","Worked with MongoDB, MySQL and Firebase for application persistence."],
              ["06","Cloud Deployment","Deployed frontend and backend applications using Vercel and Render."],
              ["07","AI Integration","Added AI-powered analysis, automation and intelligent product capabilities."],
              ["08","Team Collaboration","Use Git, GitHub and structured workflows to manage and share development work."]
            ].map(([number,title,copy]) => (
              <article className="recruiter-highlight-card" key={title} data-reveal>
                <div className="highlight-number">{number}</div>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
                <span className="highlight-check">✓</span>
              </article>
            ))}
          </div>

          <div className="portfolio-stats" data-reveal>
            <article>
              <span>PROJECTS</span>
              <strong>{projects.length}+</strong>
              <p>Software, full-stack and AI-focused builds</p>
            </article>
            <article>
              <span>TECHNOLOGIES</span>
              <strong>{technologyCount}+</strong>
              <p>Frontend, backend, database and AI tools</p>
            </article>
            <article>
              <span>DEPLOYMENT</span>
              <strong>LIVE</strong>
              <p>Production applications on modern cloud platforms</p>
            </article>
            <article>
              <span>LEARNING</span>
              <strong>DAILY</strong>
              <p>Improving system design, AI and engineering skills</p>
            </article>
          </div>
        </section>

        <section className="section projects" id="projects">
          <div className="section-side"><span>03</span><p>WORK / ARCHIVE</p></div>
          <div className="section-body">
            <div className="projects-heading" data-reveal>
              <div><div className="eyebrow">SELECTED PROJECTS</div><h2>Built to work. <span>Designed to stand out.</span></h2></div>
              <button className="add-big" onClick={() => setStudioOpen(true)}><Icon name="plus"/> Connect new project</button>
            </div>

            <div className="project-workspace" data-reveal>
              <aside className="project-list">
                {projects.map((project,index) =>
                  <button className={activeProject === index ? "active" : ""} onClick={() => setActiveProject(index)} key={`${project.id}-${index}`}>
                    <span>{project.number}</span>
                    <div><strong>{project.title}</strong><small>{project.category} / {project.year}</small></div>
                    <Icon name="arrow"/>
                  </button>
                )}
              </aside>

              <article className="project-display" key={projects[activeProject]?.id}>
                <a className="project-image" href={projects[activeProject]?.live} target="_blank" rel="noreferrer">
                  <img src={projects[activeProject]?.image} alt={projects[activeProject]?.title}/>
                  <div className="image-scan"/>
                  <div className="open-label">OPEN LIVE PROJECT <Icon name="external"/></div>
                </a>
                <div className="project-info">
                  <div>
                    <div className="project-category">{projects[activeProject]?.category}</div>
                    <h3>{projects[activeProject]?.title}</h3>
                    <p>{projects[activeProject]?.description}</p>
                  </div>
                  <div className="project-meta">
                    <div className="tech-list">{projects[activeProject]?.tech.map(t => <span key={t}>{t}</span>)}</div>
                    <div className="project-actions">
                      <a href={projects[activeProject]?.live} target="_blank" rel="noreferrer">Live experience <Icon name="arrow"/></a>
                      {projects[activeProject]?.github && <a href={projects[activeProject].github} target="_blank" rel="noreferrer"><Icon name="github"/> Source</a>}
                      {customProjects.some(p => p.id === projects[activeProject]?.id) &&
                        <button onClick={() => removeCustomProject(projects[activeProject].id)}>Remove local project</button>}
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="project-manager-section">
          <div className="manager-orbit"/>
          <div className="manager-content" data-reveal>
            <span className="eyebrow">PROJECT MANAGER</span>
            <h2>Your next project already has a place here.</h2>
            <p>
              Use the built-in studio to enter the title, links, technology stack and screenshot.
              Preview the generated project object, copy it for GitHub, or add it instantly to this browser.
            </p>
            <button className="primary-button" onClick={() => setStudioOpen(true)}><Icon name="plus"/> Open Project Studio</button>
          </div>
          <div className="manager-code" data-reveal>
            <header><i/><i/><i/><span>projects.js</span></header>
            <pre>{`{
  title: "Your New Project",
  category: "Full Stack",
  image: "/projects/image.png",
  live: "https://...",
  github: "https://...",
  tech: ["React", "Node.js"],
  featured: true
}`}</pre>
          </div>
        </section>

        <section className="contact contact-v3" id="contact">
          <div className="contact-signal" aria-hidden="true"><i/><i/><i/></div>
          <div className="contact-top" data-reveal>
            <span>04 / CONTACT</span>
            <h2>Have an idea, opportunity or challenge? <em>Let’s build it well.</em></h2>
            <p>
              I am open to Software Developer, Full Stack Developer and AI/ML opportunities,
              internships and collaborative product work.
            </p>
            <div className="contact-actions">
              <a className="primary-button" href="mailto:nikhilprasadsah2@gmail.com"><Icon name="mail"/> Send an email</a>
              <button className="ghost-button" onClick={copyEmail}><Icon name="copy"/>{emailCopied ? "Email copied" : "Copy email"}</button>
              <a className="ghost-button" href="/resume/Nikhil-Prasad-Sah-Resume.pdf" target="_blank" rel="noreferrer"><Icon name="download"/> View resume</a>
            </div>
          </div>

          <div className="contact-cards">
            <a href="mailto:nikhilprasadsah2@gmail.com" data-reveal>
              <span><Icon name="mail"/></span><small>EMAIL</small><strong>nikhilprasadsah2@gmail.com</strong><i><Icon name="arrow"/></i>
            </a>
            <a href="tel:+919939099939" data-reveal>
              <span><Icon name="phone"/></span><small>PHONE</small><strong>+91 99390 99939</strong><i><Icon name="arrow"/></i>
            </a>
            <a href="https://github.com/nikhilps01" target="_blank" rel="noreferrer" data-reveal>
              <span><Icon name="github"/></span><small>GITHUB</small><strong>github.com/nikhilps01</strong><i><Icon name="external"/></i>
            </a>
            <a href="https://www.linkedin.com/in/nikhil-prasad-sah-33a78328b" target="_blank" rel="noreferrer" data-reveal>
              <span><Icon name="linkedin"/></span><small>LINKEDIN</small><strong>Connect professionally</strong><i><Icon name="external"/></i>
            </a>
          </div>

          <div className="availability-banner" data-reveal>
            <div><i/><span>AVAILABLE FOR OPPORTUNITIES</span></div>
            <p>Hoshiarpur, Punjab, India · Open to remote and on-site roles</p>
            <strong>IST {time}</strong>
          </div>
        </section>
      </main>

      <footer className="footer-v3">
        <div className="footer-main">
          <div className="footer-identity">
            <div className="footer-monogram">NPS</div>
            <h3>Building useful software with clarity, curiosity and care.</h3>
            <p>Software Developer · Full Stack Developer · AI/ML Enthusiast</p>
          </div>
          <div className="footer-nav">
            <div><strong>EXPLORE</strong><a href="#about">About</a><a href="#summary">Summary</a><a href="#skills">Skills</a><a href="#projects">Projects</a></div>
            <div><strong>CONNECT</strong><a href="mailto:nikhilprasadsah2@gmail.com">Email</a><a href="https://github.com/nikhilps01" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/nikhil-prasad-sah-33a78328b" target="_blank" rel="noreferrer">LinkedIn</a></div>
            <div><strong>RESOURCES</strong><a href="/resume/Nikhil-Prasad-Sah-Resume.pdf" target="_blank" rel="noreferrer">Resume</a><button onClick={() => setStudioOpen(true)}>Project Studio</button><a href="#contact">Availability</a></div>
          </div>
        </div>
        <div className="footer-tech"><span>BUILT WITH</span><p>React · Vite · CSS · LocalStorage · Responsive Design</p></div>
        <div className="footer-bottom">
          <p>© 2026 Nikhil Prasad Sah. Designed and developed with intention.</p>
          <a href="#home"><Icon name="up"/> Back to top</a>
        </div>
      </footer>

      {studioOpen && <ProjectStudio onClose={() => setStudioOpen(false)} onAdd={addProject}/>}
    </>
  );
}

createRoot(document.getElementById("root")).render(<App/>);
