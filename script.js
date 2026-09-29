(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeLabel = document.getElementById("themeLabel");
  const pageProgress = document.getElementById("pageProgress");

  const projects = {
    agenda: {
      index: "01 / 05",
      status: "PRIVATE SYSTEM",
      title: "Projeto Agenda",
      description: "Plataforma SaaS horizontal, white-label e multi-tenant para reservas configuráveis, organizada como monólito modular com API, worker, frontend e infraestrutura PostgreSQL.",
      architecture: "Modular monolith · API · Worker · Web",
      stack: ".NET 10 · React · PostgreSQL · Docker · Playwright",
      focus: "Multi-tenancy · Domains · CI · Testing"
    },
    magicdev: {
      index: "02 / 05",
      status: "PRIVATE SYSTEM",
      title: "MagicDev",
      description: "Mission Control remoto para desenvolvimento assistido: integra projetos locais, Git, agentes, aprovações, execução remota e comunicação em tempo real.",
      architecture: "Agent · Cloud server · Mobile client",
      stack: "Node.js · Expo · WebSocket · Git",
      focus: "Realtime · Agent orchestration · Remote operations"
    },
    pickside: {
      index: "03 / 05",
      status: "PRIVATE PRODUCT",
      title: "PickSide",
      description: "Produto web para batalhas virais com votação orgânica, promoção paga e ciclo de pagamento validado no backend antes da ativação do conteúdo.",
      architecture: "Next.js application · Webhooks · Server validation",
      stack: "Next.js · Supabase · Mercado Pago · Playwright",
      focus: "Payments · Moderation · Anti-abuse · Conversion"
    },
    mapa: {
      index: "04 / 05",
      status: "PRIVATE PRODUCT",
      title: "Mapa da Percepção",
      description: "Aplicação de diagnóstico público com persistência, administração protegida e geração de relatórios em PDF a partir das respostas coletadas.",
      architecture: "Next.js App Router · API · Admin",
      stack: "Next.js · TypeScript · Supabase · PDF",
      focus: "Data capture · Reporting · Access control"
    },
    beto: {
      index: "05 / 05",
      status: "PRIVATE PLATFORM",
      title: "Beto",
      description: "Plataforma gamificada de apostas fictícias com créditos virtuais, autenticação JWT, ranking, administração e separação clara entre domínio, aplicação e infraestrutura.",
      architecture: "Layered backend · SPA · Relational data",
      stack: "ASP.NET Core · React · SQL Server · JWT",
      focus: "Domain logic · Security · Ranking · Admin"
    }
  };

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
    const isDark = theme === "dark";
    themeLabel.textContent = isDark ? "Claro" : "Escuro";
    document.querySelector('meta[name="theme-color"]').setAttribute("content", isDark ? "#0a0a0a" : "#f8f8f6");
  }

  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    setTheme(savedTheme);
  } else {
    setTheme(window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  }

  themeToggle.addEventListener("click", () => {
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    pageProgress.style.width = Math.max(0, Math.min(100, value)) + "%";
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  const revealEls = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(el => el.classList.add("in"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach((el, index) => {
      el.style.transitionDelay = Math.min(index % 4, 3) * 55 + "ms";
      observer.observe(el);
    });
  }

  const rows = Array.from(document.querySelectorAll(".project-row"));
  const detail = {
    index: document.getElementById("detailIndex"),
    status: document.getElementById("detailStatus"),
    title: document.getElementById("detailTitle"),
    description: document.getElementById("detailDescription"),
    architecture: document.getElementById("detailArchitecture"),
    stack: document.getElementById("detailStack"),
    focus: document.getElementById("detailFocus"),
    visualLabel: document.querySelector(".visual-label")
  };

  let activeProject = "agenda";

  function renderProject(key) {
    const data = projects[key];
    if (!data || key === activeProject && detail.title.textContent === data.title) return;

    activeProject = key;
    rows.forEach(row => {
      const active = row.dataset.project === key;
      row.classList.toggle("active", active);
      row.setAttribute("aria-pressed", active ? "true" : "false");
    });

    const nodes = [
      [detail.index, data.index],
      [detail.status, data.status],
      [detail.title, data.title],
      [detail.description, data.description],
      [detail.architecture, data.architecture],
      [detail.stack, data.stack],
      [detail.focus, data.focus],
      [detail.visualLabel, "SYSTEM / " + data.index.slice(0, 2)]
    ];

    document.getElementById("projectDetail").animate(
      [
        { opacity: 0.55, transform: "translateY(7px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      { duration: 260, easing: "cubic-bezier(.2,.7,.2,1)" }
    );

    nodes.forEach(([node, value]) => {
      if (node) node.textContent = value;
    });
  }

  rows.forEach(row => {
    row.setAttribute("aria-pressed", row.classList.contains("active") ? "true" : "false");
    row.addEventListener("click", () => renderProject(row.dataset.project));

    if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      row.addEventListener("mouseenter", () => renderProject(row.dataset.project));
    }
  });

  // Keep the first item fully initialized.
  activeProject = "";
  renderProject("agenda");
})();
