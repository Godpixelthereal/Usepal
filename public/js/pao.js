/* PAO Core: projects, team, tasks, and command handling */
(function(global){
  const STORAGE = {
    projects: 'pao_projects',
    members: 'pao_members',
    settings: 'userSettings'
  };

  const defaultMembers = [
    { id: 'u-des-1', name: 'Alex D.', role: 'Designer' },
    { id: 'u-fe-1', name: 'Sam F.', role: 'Frontend Dev' },
    { id: 'u-be-1', name: 'Lee B.', role: 'Backend Dev' },
    { id: 'u-pm-1', name: 'Pat M.', role: 'PM' }
  ];

  function load(key, fallback){
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch(e){ return fallback; }
  }
  function save(key, value){ localStorage.setItem(key, JSON.stringify(value)); }

  function uid(prefix){ return `${prefix}-${Math.random().toString(36).slice(2,8)}`; }

  function getProjects(){ return load(STORAGE.projects, []); }
  function setProjects(v){ save(STORAGE.projects, v); }
  function getMembers(){ return load(STORAGE.members, defaultMembers); }
  function setMembers(v){ save(STORAGE.members, v); }

  // Basic brief parser -> role tasks
  function parseBriefToTasks(brief){
    const text = (brief||'').toLowerCase();
    const tasks = [];
    const add = (role, title, desc)=> tasks.push({ id: uid('t'), role, title, description: desc, deadline: null, status: 'Pending', assigneeId: null, deliverable: '' });

    // Designer
    if (text.includes('homepage') || text.includes('landing')) add('Designer', 'Create homepage wireframe', 'Design wireframe in Figma and export assets.');
    if (text.includes('brand') || text.includes('logo')) add('Designer', 'Prepare brand assets', 'Logo, color palette, and components in Figma.');

    // Frontend
    add('Frontend Dev', 'Build homepage hero', 'Implement responsive hero section (React/Tailwind).');
    if (text.includes('forms') || text.includes('signup')) add('Frontend Dev', 'Implement signup form', 'Responsive form with validation.');

    // Backend
    if (text.includes('api') || text.includes('auth')) add('Backend Dev', 'Setup API endpoints', 'Auth + basic CRUD services.');
    add('Backend Dev', 'Configure data models', 'Define schema and persistence layer.');

    // PM
    add('PM', 'Create delivery timeline', 'Plan sprints/milestones and owners.');
    add('PM', 'Review deliverables', 'QA assets and coordinate approvals.');

    if (!tasks.length) {
      add('Designer', 'Design initial mockups', 'Figma mockups for key screens.');
      add('Frontend Dev', 'Build UI shell', 'Navigation and layout in React/Tailwind.');
      add('Backend Dev', 'Scaffold backend', 'Initial service scaffolding.');
      add('PM', 'Define scope and risks', 'Write up scope, risks, communication plan.');
    }
    return tasks;
  }

  function createProject(data){
    const projects = getProjects();
    const id = uid('p');
    const project = {
      id,
      title: data.title || 'Untitled Project',
      client: data.client || '',
      description: data.description || '',
      budget: data.budget || '',
      timeline: data.timeline || '',
      brief: data.brief || '',
      members: (data.members && data.members.length ? data.members : getMembers()),
      tasks: parseBriefToTasks(data.brief)
    };
    // Auto assign tasks by role if member exists
    project.tasks.forEach(t => {
      const m = project.members.find(mm => (mm.role||'').toLowerCase() === t.role.toLowerCase());
      if (m) t.assigneeId = m.id;
    });
    projects.unshift(project);
    setProjects(projects);
    return project;
  }

  function getProject(pid){ return getProjects().find(p=>p.id===pid) || null; }
  function updateProject(pid, updater){
    const projects = getProjects();
    const i = projects.findIndex(p=>p.id===pid);
    if (i<0) return null;
    const prev = projects[i];
    const next = updater({ ...prev });
    projects[i] = next;
    setProjects(projects);
    return next;
  }

  function setTaskStatus(pid, tid, status){
    return updateProject(pid, p => {
      p.tasks = p.tasks.map(t => t.id===tid ? { ...t, status } : t);
      return p;
    });
  }
  function setTaskDeliverable(pid, tid, url){
    return updateProject(pid, p => {
      p.tasks = p.tasks.map(t => t.id===tid ? { ...t, deliverable: url||'' } : t);
      return p;
    });
  }

  // Progress helpers
  function progressByRole(pid){
    const p = getProject(pid); if (!p) return {};
    const roles = {};
    p.tasks.forEach(t=>{
      roles[t.role] = roles[t.role] || { total:0, done:0, tasks:[] };
      roles[t.role].total++;
      if (t.status === 'Done') roles[t.role].done++;
      roles[t.role].tasks.push(t);
    });
    return roles;
  }
  function pendingOwners(pid){
    const p = getProject(pid); if (!p) return [];
    const pending = p.tasks.filter(t=>t.status!=='Done');
    const ids = Array.from(new Set(pending.map(t=>t.assigneeId).filter(Boolean)));
    const byId = Object.fromEntries(p.members.map(m=>[m.id, m]));
    return ids.map(id=>byId[id]).filter(Boolean);
  }

  // Command handling
  function handleCommand(text, ctx){
    const msg = (text||'').trim();
    const res = { reply: '', data: null };

    // Create project quickly
    if (/^create project[:]?/i.test(msg) || /^new project/i.test(msg)){
      const title = (msg.split(':')[1]||'').trim() || 'Untitled Project';
      const project = createProject({ title, brief: title });
      res.reply = `Created project “${project.title}” with ${project.tasks.length} tasks assigned by role.`;
      res.data = { project };
      return res;
    }

    if (/assign( these)? tasks/i.test(msg)){
      const pid = ctx && ctx.projectId; const p = pid && getProject(pid);
      if (!p) { res.reply = 'No active project context. Open a project to assign.'; return res; }
      p.tasks.forEach(t=>{ if(!t.assigneeId){ const m = p.members.find(mm=> (mm.role||'').toLowerCase()===t.role.toLowerCase()); if (m) t.assigneeId = m.id; }});
      setProjects(getProjects().map(pp=>pp.id===p.id? p: pp));
      res.reply = 'Tasks have been (re)assigned to team members by role.';
      res.data = { project: p };
      return res;
    }

    if (/show progress( on)? (the )?(design|designer|frontend|backend|pm)/i.test(msg)){
      const role = msg.match(/(design|designer|frontend|backend|pm)/i)[1].toLowerCase();
      const pid = ctx && ctx.projectId; const p = pid && getProject(pid);
      if (!p) { res.reply = 'No active project context. Open a project to view progress.'; return res; }
      const roles = progressByRole(p.id);
      const key = role.includes('design')? 'Designer' : role.includes('front')? 'Frontend Dev' : role.includes('back')? 'Backend Dev' : 'PM';
      const r = roles[key] || { total:0, done:0, tasks:[] };
      res.reply = `${key} progress: ${r.done}/${r.total} done.`;
      res.data = { role: key, tasks: r.tasks };
      return res;
    }

    if (/who hasn[’']?t submitted/i.test(msg) || /who has not submitted/i.test(msg)){
      const pid = ctx && ctx.projectId; const p = pid && getProject(pid);
      if (!p) { res.reply = 'No active project context. Open a project first.'; return res; }
      const owners = pendingOwners(p.id);
      res.reply = owners.length? `Pending submissions: ${owners.map(o=>o.name).join(', ')}.` : 'All assigned tasks are done.';
      res.data = { owners };
      return res;
    }

    res.reply = "I can create projects, assign tasks, show role progress, or list who hasn't submitted. Try: ‘Create project: Website Redesign’.";
    return res;
  }

  // Expose API
  global.PAO = {
    getProjects, setProjects, getMembers, setMembers,
    createProject, getProject, updateProject,
    setTaskStatus, setTaskDeliverable,
    parseBriefToTasks, progressByRole, pendingOwners,
    handleCommand
  };
})(window);