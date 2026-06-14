(function () {
  const state = {
    problem: null,
    delivery: null,
    need: null
  };

  const labels = {
    context: "AI context ownership or freshness",
    egress: "Data movement or egress",
    runtime: "Runtime placement",
    delivery: "Delivery workflow or operating model",
    unsure: "Not sure yet",
    ams: "AMS / Run",
    waterfall: "Waterfall / Project",
    agile: "Agile / Product",
    platform: "Platform / Engineering",
    mixed: "Mixed / unknown",
    assessment: "Governance assessment",
    architecture: "Architecture guidance",
    controls: "Policy and control mapping",
    mcp: "MCP workflow integration",
    docs: "Repository or document entry point"
  };

  const routes = {
    context: {
      primary: "ContextOps",
      support: "ContextBoundary",
      why: "Your issue is about ownership, freshness, accountability, and the context AI systems depend on.",
      docs: [
        ["ContextOps FRAMEWORK.md", "https://github.com/kannanokannan/ContextOps/blob/main/FRAMEWORK.md"],
        ["ContextOps DOCUMENT_MAP.md", "https://github.com/kannanokannan/ContextOps/blob/main/DOCUMENT_MAP.md"],
        ["ContextOps self-assessment agent", "https://github.com/kannanokannan/ContextOps/blob/main/agent-instructions/README.md"]
      ]
    },
    egress: {
      primary: "ContextBoundary",
      support: "ContextOps",
      why: "Your issue is about where AI-processed data, capabilities, and tool calls are allowed to cross.",
      docs: [
        ["ContextBoundary FRAMEWORK.md", "https://github.com/kannanokannan/ContextBoundary/blob/main/FRAMEWORK.md"],
        ["ContextBoundary RATIONALE.md", "https://github.com/kannanokannan/ContextBoundary/blob/main/RATIONALE.md"],
        ["GDPR audit profile", "https://github.com/kannanokannan/ContextBoundary/blob/main/gdpr.md"]
      ]
    },
    runtime: {
      primary: "Sthala",
      support: "ContextBoundary",
      why: "Your issue is about where governed AI should run and what execution boundary applies.",
      docs: [
        ["Sthala SPEC.md", "https://github.com/kannanokannan/Sthala/blob/main/SPEC.md"],
        ["Sthala AGENTS.md", "https://github.com/kannanokannan/Sthala/blob/main/AGENTS.md"],
        ["ContextBoundary vendor tier matrix", "https://github.com/kannanokannan/ContextBoundary/blob/main/vendor-tier-matrix.md"]
      ]
    },
    delivery: {
      primary: "Griha",
      support: "ContextOps",
      why: "Your issue is about turning governed AI principles into usable workflows, products, or operating routines.",
      docs: [
        ["Griha README.md", "https://github.com/kannanokannan/Griha"],
        ["ContextOps FRAMEWORK.md", "https://github.com/kannanokannan/ContextOps/blob/main/FRAMEWORK.md"],
        ["Context Stack decisions", "https://github.com/kannanokannan/context-stack/blob/main/DECISIONS.md"]
      ]
    },
    unsure: {
      primary: "ContextOps",
      support: "ContextBoundary",
      why: "Start with the organizational assessment, then route data movement and runtime questions to ContextBoundary and Sthala.",
      docs: [
        ["ContextOps self-assessment agent", "https://github.com/kannanokannan/ContextOps/blob/main/agent-instructions/README.md"],
        ["ContextOps FRAMEWORK.md", "https://github.com/kannanokannan/ContextOps/blob/main/FRAMEWORK.md"],
        ["Context Stack glossary", "https://github.com/kannanokannan/context-stack/blob/main/GLOSSARY.md"]
      ]
    }
  };

  function selectChoice(button) {
    const group = button.dataset.group;
    const value = button.dataset.value;
    state[group] = value;

    document.querySelectorAll(`[data-group="${group}"]`).forEach((item) => {
      item.classList.toggle("is-selected", item === button);
      item.setAttribute("aria-pressed", item === button ? "true" : "false");
    });

    renderResult();
  }

  function renderResult() {
    const route = routes[state.problem || "unsure"];
    const delivery = labels[state.delivery] || "delivery mode not selected";
    const need = labels[state.need] || "next step not selected";
    const completion = [state.problem, state.delivery, state.need].filter(Boolean).length;

    const title = document.querySelector("[data-result-title]");
    const text = document.querySelector("[data-result-text]");
    const meta = document.querySelector("[data-result-meta]");
    const docs = document.querySelector("[data-result-docs]");
    const prompt = document.querySelector("[data-result-prompt]");
    const progress = document.querySelector("[data-progress]");

    if (!title || !text || !meta || !docs || !prompt || !progress) return;

    progress.textContent = `${completion} / 3 answered`;
    title.textContent = route.primary;
    text.textContent = route.why;
    meta.innerHTML = `<li><strong>Supporting layer:</strong> ${route.support}</li><li><strong>Delivery mode:</strong> ${delivery}</li><li><strong>Need:</strong> ${need}</li>`;

    docs.innerHTML = route.docs
      .map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${label}</a></li>`)
      .join("");

    prompt.value = buildPrompt(route, delivery, need);
  }

  function buildPrompt(route, delivery, need) {
    const problem = labels[state.problem] || "an unclear AI governance problem";
    return `Use Context Stack to assess this situation.\n\nProblem: ${problem}\nDelivery mode: ${delivery}\nNeed: ${need}\n\nStart with ${route.primary}. Use ${route.support} as the supporting layer. Identify the first governance questions, likely weak controls, and the documents we should read first. Keep enforcement separate from framework guidance.`;
  }

  function copyPrompt() {
    const prompt = document.querySelector("[data-result-prompt]");
    const status = document.querySelector("[data-copy-status]");
    if (!prompt || !status) return;

    const done = () => {
      status.textContent = "Prompt copied.";
      window.setTimeout(() => {
        status.textContent = "";
      }, 1800);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(prompt.value).then(done).catch(() => {
        prompt.select();
        document.execCommand("copy");
        done();
      });
      return;
    }

    prompt.select();
    document.execCommand("copy");
    done();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => selectChoice(button));
    });

    const copy = document.querySelector("[data-copy-prompt]");
    if (copy) copy.addEventListener("click", copyPrompt);

    renderResult();
  });
})();
