// ===== GitHub API Configuration =====
const GITHUB_USERNAME = "Mr-MRF-Dev";
const GITHUB_API_BASE = "https://api.github.com";

// ===== Projects Pagination State =====
let allRepos = [];
let displayedProjects = 0;
const PROJECTS_PER_PAGE = 6;

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
        '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">Failed to load projects. Please try again later.</p>';
    }
  }
}

// ===== Display Projects with Pagination =====
function displayProjects() {
  const projectsGrid = document.getElementById("projectsGrid");
  const loadMoreContainer = document.getElementById("loadMoreContainer");

  if (!projectsGrid) return;

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
  const languageEmojis = {
    TypeScript: "💢",
    JavaScript: "📜",
    "C++": "🖥️",
    C: "🧨",
    Python: "🐍",
    HTML: "📇",
    CSS: "🎨",
    TSQL: "✈️",
    Java: "☕",
    Rust: "🦀",
    Go: "🐹",
    Ruby: "💎",
    PHP: "🐘",
    Swift: "🍎",
    Kotlin: "🎯",
  };

  const emoji = languageEmojis[repo.language] || "💻";
  const description = repo.description || "A cool project";
  const homepage = repo.homepage || repo.html_url;

  const card = document.createElement("div");
  card.className = "project-card";
  card.innerHTML = `
    <div class="project-image">
      <img
        src="https://opengraph.githubassets.com/1/${repo.full_name}"
        alt="${repo.name}"
        onerror="this.src='https://via.placeholder.com/400x250?text=${encodeURIComponent(repo.name)}'"
      />
      <div class="project-overlay">
        <h3>${emoji} ${repo.name.replace(/-/g, " ")}</h3>
        <p>${description}</p>
        <div class="project-links">
          <a href="${homepage}" target="_blank" class="project-btn">View Project</a>
          <a href="${repo.html_url}" target="_blank" class="project-btn">Code</a>
        </div>
      </div>
    </div>
    <div class="project-info">
      <div class="project-tags">
        ${repo.language ? `<span class="tag">${repo.language}</span>` : ""}
        ${
          repo.topics && repo.topics.length > 0
            ? repo.topics
                .slice(0, 4)
                .map((topic) => `<span class="tag">${topic}</span>`)
                .join("")
            : ""
        }
        <span class="tag">⭐ ${repo.stargazers_count}</span>
        ${repo.forks_count > 0 ? `<span class="tag">🍴 ${repo.forks_count}</span>` : ""}
      </div>
    </div>
  `;

  return card;
}

// ===== Update Stats Numbers =====
function updateStats(data) {
  const statItems = document.querySelectorAll(".stat-number");
  statItems[0].setAttribute("data-target", data.projects);
  statItems[1].setAttribute("data-target", data.followers);

  // Mark stats as animated
  statsAnimated = true;

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

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem("theme") || "light";
htmlElement.setAttribute("data-theme", currentTheme);

// Toggle theme
themeToggle.addEventListener("click", () => {
  const currentTheme = htmlElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  htmlElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

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
  "Web Designer",
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
  // Fetch GitHub data on page load
  fetchGitHubData();
  setTimeout(typeEffect, 1000);
});

// ===== Mobile Menu Toggle =====
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

// Close menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    menuToggle.classList.remove("active");
  });
});

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
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
let statsAnimated = false; // Track if stats have been animated

const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";

      // Don't animate counters here - let the GitHub fetch do it
      // This prevents double animation
      if (entry.target.classList.contains("about") && !statsAnimated) {
        // Mark as ready to animate when data is fetched
        entry.target.setAttribute("data-ready", "true");
      }

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
  section.style.transform = "translateY(50px)";
  section.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  observer.observe(section);
});

// ===== Back to Top Button =====
const backToTopButton = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ===== Contact Form Handling =====
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // Here you would typically send the form data to a server
  // For now, we'll just show an alert
  alert(
    `Thank you, ${name}! Your message has been received.\n\nI'll get back to you at ${email} as soon as possible.`,
  );

  // Reset form
  contactForm.reset();
});

// ===== Active Navigation Link Highlighting =====
const sections = document.querySelectorAll(".section, .hero");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - 100) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// ===== Project Card Tilt Effect =====
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
  });
});

// ===== Cursor Trail Effect (Optional) =====
const createCursorTrail = () => {
  const coords = { x: 0, y: 0 };
  const circles = document.querySelectorAll(".cursor-circle");

  if (circles.length === 0) return; // Only run if cursor circles exist

  circles.forEach((circle, index) => {
    circle.x = 0;
    circle.y = 0;
  });

  window.addEventListener("mousemove", (e) => {
    coords.x = e.clientX;
    coords.y = e.clientY;
  });

  function animateCircles() {
    let x = coords.x;
    let y = coords.y;

    circles.forEach((circle, index) => {
      circle.style.left = x - 12 + "px";
      circle.style.top = y - 12 + "px";
      circle.style.transform = `scale(${
        (circles.length - index) / circles.length
      })`;

      circle.x = x;
      circle.y = y;

      const nextCircle = circles[index + 1] || circles[0];
      x += (nextCircle.x - x) * 0.3;
      y += (nextCircle.y - y) * 0.3;
    });

    requestAnimationFrame(animateCircles);
  }

  animateCircles();
};

// ===== Form Input Animation =====
document
  .querySelectorAll(".form-group input, .form-group textarea")
  .forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "translateY(-2px)";
    });

    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "translateY(0)";
    });
  });

// ===== Loading Animation (Optional) =====
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
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
