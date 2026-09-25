// ===== GitHub API Configuration =====
const GITHUB_USERNAME = "Mr-MRF-Dev";
const GITHUB_API_BASE = "https://api.github.com";

// ===== Projects Pagination State =====
let allRepos = [];
let displayedProjects = 0;
const PROJECTS_PER_PAGE = 6;

// ===== Language Icon Map =====
const LANGUAGE_EMOJIS = {
  TypeScript: "💢",
  JavaScript: "📜",
  "C++": "🖥️",
  C: "🧨",
  Python: "🐍",
  HTML: "📇",
  CSS: "🎨",
  TSQL: "🧮",
  Java: "☕",
  Rust: "🦀",
  Go: "🐹",
  Ruby: "💎",
  PHP: "🐘",
  Swift: "🍎",
  Kotlin: "🎯",
};

// ===== Utility: Escape HTML to prevent markup injection =====
function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ===== Fallback Preview Image (no external dependency) =====
function createPlaceholderImage(label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="#0d1219"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#8e9aaa" font-family="sans-serif" font-size="20">${escapeHTML(label)}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// ===== Fetch GitHub User Data =====
async function fetchGitHubData() {
  // Add loading state
  const statNumbers = document.querySelectorAll(".stat-number");
  statNumbers.forEach((stat) => stat.classList.add("loading"));

  try {
    // Fetch user profile
    const userResponse = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`,
    );
    if (!userResponse.ok) throw new Error("Failed to fetch user data");
    const userData = await userResponse.json();

    // Fetch all repositories
    const reposResponse = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
    );
    if (!reposResponse.ok) throw new Error("Failed to fetch repos");
    allRepos = await reposResponse.json();

    // Calculate total stars across all repos
    const totalStars = allRepos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0,
    );

    // Update stats with real data
    updateStats({
      projects: userData.public_repos,
      followers: userData.followers,
    });

    // Remove loading state
    statNumbers.forEach((stat) => stat.classList.remove("loading"));

    // Display initial projects
    displayProjects();

    console.log("✅ GitHub data fetched successfully!");
    console.log(
      `📊 Repos: ${userData.public_repos} | ⭐ Stars: ${totalStars} | 👥 Followers: ${userData.followers}`,
    );
  } catch (error) {
    console.error("❌ Error fetching GitHub data:", error);
    // Remove loading state even on error
    statNumbers.forEach((stat) => stat.classList.remove("loading"));
    // Show error message in projects grid
    const projectsGrid = document.getElementById("projectsGrid");
    if (projectsGrid) {
      projectsGrid.innerHTML =
        '<p class="projects-error">Projects could not be loaded right now. Please try again later.</p>';
    }
  }
}

// ===== Display Projects with Pagination =====
function displayProjects() {
  const projectsGrid = document.getElementById("projectsGrid");
  const loadMoreContainer = document.getElementById("loadMoreContainer");

  if (!projectsGrid) return;

  // Remove the initial loading skeletons before rendering real projects.
  if (displayedProjects === 0) {
    projectsGrid.replaceChildren();
  }

  // Get next batch of projects
  const projectsToShow = allRepos.slice(
    displayedProjects,
    displayedProjects + PROJECTS_PER_PAGE,
  );

  // Create and append project cards
  projectsToShow.forEach((repo) => {
    const card = createProjectCard(repo);
    projectsGrid.appendChild(card);
  });

  displayedProjects += projectsToShow.length;

  // Show/hide Load More button
  if (loadMoreContainer) {
    loadMoreContainer.style.display =
      displayedProjects < allRepos.length ? "flex" : "none";
  }
}

// ===== Create Project Card Element =====
function createProjectCard(repo) {
  const emoji = LANGUAGE_EMOJIS[repo.language] || "💻";
  const description = escapeHTML(repo.description || "A cool project");
  const displayName = escapeHTML(repo.name.replace(/-/g, " "));
  const homepage = repo.homepage || repo.html_url;

  const card = document.createElement("div");
  card.className = "project-card";
  card.innerHTML = `
    <div class="project-image">
      <img
        src="https://opengraph.githubassets.com/1/${repo.full_name}"
        alt="Preview of ${escapeHTML(repo.name)}"
        loading="lazy"
        decoding="async"
      />
      <div class="project-overlay">
        <h3>${emoji} ${displayName}</h3>
        <div class="project-links">
          <a href="${homepage}" target="_blank" rel="noopener noreferrer" class="project-btn">View Project</a>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-btn">Code</a>
        </div>
      </div>
    </div>
    <div class="project-info">
      <p class="project-description">${description}</p>
      <div class="project-tags">
        ${repo.language ? `<span class="tag">${escapeHTML(repo.language)}</span>` : ""}
        ${
          repo.topics && repo.topics.length > 0
            ? repo.topics
                .slice(0, 2)
                .map((topic) => `<span class="tag">${escapeHTML(topic)}</span>`)
                .join("")
            : ""
        }
      </div>
    </div>
    <div class="project-footer">
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        View Repo
      </a>
      <div class="project-stats">
        <span class="stat-item">⭐ ${repo.stargazers_count}</span>
      </div>
    </div>
  `;

  const previewImage = card.querySelector(".project-image img");
  previewImage.addEventListener(
    "error",
    () => {
      previewImage.src = createPlaceholderImage(repo.name);
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

  // Fetch GitHub data on page load
  fetchGitHubData();
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

// ===== Load More Projects Button =====
const loadMoreBtn = document.getElementById("loadMoreBtn");
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    displayProjects();
  });
}
