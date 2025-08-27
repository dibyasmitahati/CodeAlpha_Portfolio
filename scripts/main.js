(function(){
  // Reveal on scroll
  const revealer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        revealer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-animate]').forEach(el=>revealer.observe(el));

  // Scrollspy (active link)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const linkById = {};
  navLinks.forEach(a=>{ linkById[a.getAttribute('href').slice(1)] = a; });

  // Immediate highlight on click
  navLinks.forEach(a=>{
    a.addEventListener('click', ()=>{
      navLinks.forEach(x=>x.classList.remove('active'));
      a.classList.add('active');
    });
  });

  const spy = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const id = e.target.id;
        navLinks.forEach(a=>a.classList.remove('active'));
        if(linkById[id]) linkById[id].classList.add('active');
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 });
  sections.forEach(s=>spy.observe(s));

  // Initial active
  const setInitialActive = ()=>{
    let currentId = 'home';
    const bandTop = window.innerHeight * 0.45;
    const bandBottom = window.innerHeight * 0.55;
    sections.forEach(sec=>{
      const r = sec.getBoundingClientRect();
      const mid = r.top + r.height/2;
      if (mid >= bandTop && mid <= bandBottom) currentId = sec.id;
    });
    navLinks.forEach(a=>a.classList.remove('active'));
    if (linkById[currentId]) linkById[currentId].classList.add('active');
  };
  window.addEventListener('load', setInitialActive);

  // Tone toggle with persistence
  const toggle = document.getElementById('sepia-toggle');
  if(localStorage.getItem('tone') === 'on'){ document.body.classList.add('sepia'); if(toggle) toggle.ariaPressed = "true"; }
  if(toggle){
    toggle.addEventListener('click', ()=>{
      document.body.classList.toggle('sepia');
      const on = document.body.classList.contains('sepia');
      localStorage.setItem('tone', on ? 'on':'off');
      toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  // Mobile nav
  const burger = document.getElementById('burger');
  const links = document.getElementById('nav-links');
  if(burger && links){
    burger.addEventListener('click', ()=>{
      const isOpen = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.forEach(a=>a.addEventListener('click', ()=>links.classList.remove('open')));
  }

  // Subtle parallax on hero image card
  const heroThumb = document.querySelector('.hero-thumb');
  if(heroThumb){
    window.addEventListener('scroll', ()=>{
      const y = window.scrollY * 0.04;
      heroThumb.style.transform = `translateY(${Math.min(10, y)}px)`;
    }, { passive:true });
  }

  // Sticky top scroll progress
  const bar = document.querySelector('#scroll-progress i');
  const setProgress = ()=>{
    const el = document.documentElement;
    const scrolled = el.scrollTop;
    const height = el.scrollHeight - el.clientHeight;
    const pct = Math.max(0, Math.min(1, height ? scrolled / height : 0));
    if(bar) bar.style.width = (pct * 100).toFixed(2) + '%';
  };
  setProgress();
  window.addEventListener('scroll', setProgress, { passive:true });
  window.addEventListener('resize', setProgress);

  // Honor hash on load
  if(location.hash){
    const id = location.hash.replace('#','');
    if(linkById[id]){
      navLinks.forEach(a=>a.classList.remove('active'));
      linkById[id].classList.add('active');
    }
  }

  // Projects filter (All / Web / Backend / UI)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project');
  const grid = document.getElementById('project-grid');

  const applyFilter = (key)=>{
    const k = key === 'all' ? null : key;
    cards.forEach(card=>{
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const show = !k || tags.split(/\s+/).includes(k);
      card.style.display = show ? '' : 'none';
      if (show) {
        card.classList.remove('in-view');
        requestAnimationFrame(()=>card.classList.add('in-view'));
      }
    });
    if(grid){
      grid.style.minHeight = grid.offsetHeight + 'px';
      setTimeout(()=>grid.style.minHeight='', 0);
    }
  };

  filterBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filterBtns.forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active'); btn.setAttribute('aria-selected','true');
      applyFilter(btn.dataset.filter);
    });
  });

  // Animate group meters on load
  window.addEventListener('load', ()=>{
    document.querySelectorAll('.group-meter i').forEach(i=>{
      const w = i.getAttribute('style');
      i.setAttribute('style', w);
    });
  });
})();