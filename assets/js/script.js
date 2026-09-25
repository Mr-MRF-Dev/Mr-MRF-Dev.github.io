// ===== GitHub API Configuration =====
const GITHUB_USERNAME = "Mr-MRF-Dev";
const GITHUB_API_BASE = "https://api.github.com";

// ===== Supported Bento Grid Sizes =====
const PROJECT_SIZES = ["1x1", "2x1", "1x2", "2x2"];

// ===== Utility: Escape HTML to prevent markup injection =====
function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ===== Cover Palette for Generated Project Covers =====
const COVER_GRADIENTS = [
  ["#0f172a", "#0f9f8f"],
  ["#111827", "#1687d9"],
  ["#0b1220", "#7c3aed"],
  ["#12131a", "#ec4899"],
  ["#0c1a1a", "#22c55e"],
  ["#151312", "#f59e0b"],
];

// ===== Utility: Deterministic Hash (for stable, varied cover colors) =====
function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ===== Utility: Initials for the Generated Cover (e.g. "SmartClass" -> "SC") =====
function getInitials(name) {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// ===== Generated Project Cover (used when no real screenshot is provided) =====
// Avoids relying on GitHub's auto-generated preview images, which already bake
// in their own text and clash with this card's title/description overlay.
function createPlaceholderImage(label) {
  const [from, to] =
    COVER_GRADIENTS[hashString(label) % COVER_GRADIENTS.length];
  const initials = escapeHTML(getInitials(label));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${from}"/>
        <stop offset="100%" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#g)"/>
    <circle cx="660" cy="110" r="190" fill="#ffffff" opacity="0.07"/>
    <circle cx="110" cy="520" r="150" fill="#ffffff" opacity="0.06"/>
    <text x="50%" y="54%" font-family="Space Grotesk, sans-serif" font-size="180" font-weight="700" fill="#ffffff" fill-opacity="0.9" text-anchor="middle" dominant-baseline="middle">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// ===== Fetch GitHub Profile Stats (About section counters) =====
async function fetchProfileStats() {
  const statNumbers = document.querySelectorAll(".stat-number");
  statNumbers.forEach((stat) => stat.classList.add("loading"));

  try {
    const userResponse = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`,
    );
    if (!userResponse.ok) throw new Error("Failed to fetch user data");
    const userData = await userResponse.json();

    updateStats({
      projects: userData.public_repos,
      followers: userData.followers,
    });

    console.log("✅ GitHub profile stats fetched successfully!");
  } catch (error) {
    console.error("❌ Error fetching GitHub profile stats:", error);
  } finally {
    statNumbers.forEach((stat) => stat.classList.remove("loading"));
  }
}

// ===== Load Curated Projects from projects.json =====
async function loadProjects() {
  const projectsGrid = document.getElementById("projectsGrid");
  if (!projectsGrid) return;

  try {
    const response = await fetch("assets/data/projects.json");
    if (!response.ok) throw new Error("Failed to fetch projects.json");
    const projects = await response.json();

    projectsGrid.replaceChildren();

    if (!Array.isArray(projects) || projects.length === 0) {
      projectsGrid.innerHTML =
        '<p class="projects-error">No projects to show yet. Check back soon.</p>';
      return;
    }

    projects.forEach((project) => {
      projectsGrid.appendChild(createProjectCard(project));
    });
  } catch (error) {
    console.error("❌ Error loading projects:", error);
    projectsGrid.innerHTML =
      '<p class="projects-error">Projects could not be loaded right now. Please try again later.</p>';
  }
}

// ===== Create Project Card Element =====
function createProjectCard(project) {
  const name = escapeHTML(project.name || "Untitled project");
  const description = escapeHTML(project.description || "");
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const stars = Number(project.stars) || 0;
  const size = PROJECT_SIZES.includes(project.size) ? project.size : "1x1";
  const hasLiveUrl =
    Boolean(project.liveUrl) && project.liveUrl !== project.repoUrl;
  const imageSrc =
    project.image || createPlaceholderImage(project.name || "Project");

  const card = document.createElement("article");
  card.className = "project-card";
  card.dataset.size = size;
  card.innerHTML = `
    <div class="project-media">
      <img
        src="${imageSrc}"
        alt="Preview of ${name}"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="project-scrim" aria-hidden="true"></div>
    <div class="project-top">
      ${project.featured ? '<span class="project-featured">Featured</span>' : ""}
      <div class="project-meta">
        ${project.language ? `<span class="project-lang">${escapeHTML(project.language)}</span>` : ""}
        ${stars > 0 ? `<span class="project-stars">⭐ ${stars}</span>` : ""}
      </div>
    </div>
    <div class="project-content">
      <h3 class="project-name">${name}</h3>
      ${description ? `<p class="project-desc">${description}</p>` : ""}
      ${
        tags.length > 0
          ? `<div class="project-tags">${tags
              .map((tag) => `<span class="tag">${escapeHTML(tag)}</span>`)
              .join("")}</div>`
          : ""
      }
      <div class="project-links">
        ${
          hasLiveUrl
            ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-btn">Live Demo</a>`
            : ""
        }
        <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="project-btn">${hasLiveUrl ? "Code" : "View Code"}</a>
      </div>
    </div>
  `;

  const previewImage = card.querySelector(".project-media img");
  previewImage.addEventListener(
    "error",
    () => {
      previewImage.src = createPlaceholderImage(project.name || "Project");
    },
    { once: true },
  );

  return card;
}

// ===== Update Stats Numbers =====
function updateStats(data) {
  const statItems = document.querySelectorAll(".stat-number");
  statItems[0].setAttribute("data-target", data.projects);
  statItems[1].setAttribute("data-target", data.followers);

  // Animate counters with new values
  statItems.forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-target"));
    stat.textContent = "0"; // Reset to 0
    animateCounter(stat, target);
  });
}

// ===== Theme Toggle =====
const themeToggle = document.getElementById("themeToggle");
const htmlElement = document.documentElement;

// Check for saved theme preference or default to dark mode
const currentTheme = htmlElement.dataset.theme || "dark";
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

function syncThemeUI(theme) {
  htmlElement.setAttribute("data-theme", theme);
  themeToggle.setAttribute(
    "aria-label",
    `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
  );

  if (themeColorMeta) {
    themeColorMeta.setAttribute(
      "content",
      theme === "dark" ? "#05070a" : "#f5f7fa",
    );
  }
}

syncThemeUI(currentTheme);

// Toggle theme
themeToggle.addEventListener("click", () => {
  const activeTheme = htmlElement.getAttribute("data-theme");
  const newTheme = activeTheme === "light" ? "dark" : "light";

  syncThemeUI(newTheme);
  try {
    localStorage.setItem("theme", newTheme);
  } catch {
    // Theme switching still works when storage is unavailable.
  }

  // Add a fun animation
  themeToggle.style.transform = "rotate(360deg)";
  setTimeout(() => {
    themeToggle.style.transform = "rotate(0deg)";
  }, 300);
});

// ===== Typing Animation =====
const typingText = document.getElementById("typingText");
const phrases = [
  "Full Stack Developer",
  "Web Developer",
  "Problem Solver",
  "Creative Thinker",
  "Tech Enthusiast",
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typingText.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 50;
  } else {
    typingText.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 100;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    typingSpeed = 2000; // Pause at end
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typingSpeed = 500; // Pause before typing next phrase
  }

  setTimeout(typeEffect, typingSpeed);
}

// Start typing animation
document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // Load live profile stats and curated projects
  fetchProfileStats();
  loadProjects();
  setTimeout(typeEffect, 1000);
});

// ===== Mobile Menu Toggle =====
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("active");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// ===== Combined Scroll Effects (navbar, back-to-top, active link) =====
const navbar = document.getElementById("navbar");
const backToTopButton = document.getElementById("backToTop");
const sections = document.querySelectorAll(".section, .hero");
const navLinks = document.querySelectorAll(".nav-link");

function handleScrollEffects() {
  const scrollY = window.scrollY;

  navbar.classList.toggle("scrolled", scrollY > 50);
  backToTopButton.classList.toggle("show", scrollY > 300);

  let current = "";
  sections.forEach((section) => {
    if (scrollY >= section.offsetTop - 100) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${current}`,
    );
  });
}

window.addEventListener("scroll", handleScrollEffects);

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Smooth Scrolling for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offset = 80; // Account for fixed navbar
      const targetPosition = target.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ===== Animated Counter for Stats =====
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16); // 60fps
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target + "+";
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 16);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
  threshold: 0.05,
  rootMargin: "0px 0px 0px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";

      // Animate skill bars when skills section is visible
      if (entry.target.classList.contains("skills")) {
        document.querySelectorAll(".skill-progress").forEach((bar) => {
          const progress = bar.getAttribute("data-progress");
          setTimeout(() => {
            bar.style.width = progress + "%";
          }, 200);
        });
      }

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll(".section").forEach((section) => {
  section.style.opacity = "0";
  section.style.transform = "translateY(30px)";
  section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(section);
});

// ===== Console Message =====
console.log(
  "%c👋 Welcome to my portfolio!",
  "font-size: 20px; font-weight: bold; color: #6366f1;",
);
console.log(
  "%cInterested in the code? Check out my GitHub:",
  "font-size: 14px; color: #64748b;",
);
console.log(
  "%chttps://github.com/Mr-MRF-Dev",
  "font-size: 14px; color: #ec4899;",
);

// ===== Easter Egg: Konami Code =====
let konamiCode = [];
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join(",") === konamiSequence.join(",")) {
    document.body.style.animation = "rainbow 2s infinite";
    alert("🎉 You found the secret! You are awesome!");
    setTimeout(() => {
      document.body.style.animation = "";
    }, 5000);
  }
});
