# 🌐 Mr MRF Dev - Portfolio

![GitHub repo size](https://img.shields.io/github/repo-size/Mr-MRF-Dev/Mr-MRF-Dev.github.io)
![GitHub License](https://img.shields.io/github/license/Mr-MRF-Dev/Mr-MRF-Dev.github.io)
[![pages-build-deployment](https://github.com/Mr-MRF-Dev/Mr-MRF-Dev.github.io/actions/workflows/pages/pages-build-deployment/badge.svg?branch=master)](https://github.com/Mr-MRF-Dev/Mr-MRF-Dev.github.io/actions/workflows/pages/pages-build-deployment)
![Website](https://img.shields.io/website?down_message=offline&label=site&up_message=online&url=http%3A%2F%2FMr-MRF-Dev.github.io)

A modern, responsive portfolio website showcasing my skills, projects, and development process as a Full Stack Developer. Built with vanilla HTML, CSS, and JavaScript, featuring live GitHub integration, a dark-first visual system, and a persistent dark/light theme toggle.

🔗 **Live Site**: [mr-mrf-dev.github.io](https://mr-mrf-dev.github.io)

## ✨ Features

- **📱 Fully Responsive**: Optimized for all devices (mobile, tablet, desktop)
- **🌓 Theme Toggle**: Dark mode by default, with a persistent light mode override
- **🔄 GitHub Integration**: Live profile stats (projects, followers) via the GitHub API
- **🧩 Curated Projects**: A customizable bento grid driven by `assets/data/projects.json` — no code changes needed to add, edit, resize, or reorder project cards
- **🎨 Modern UI**: Dark-first editorial design with bento layouts and ambient gradients
- **⚡ Fast & Lightweight**: Pure vanilla JavaScript, no frameworks or build step
- **🎯 SEO Optimized**: Semantic HTML, canonical URL, Open Graph/Twitter Card metadata, and JSON-LD
- **♿ Accessible**: Skip navigation, reduced-motion support, and accessible menu states

## 🛠️ Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Flexbox, Grid, animations
- **JavaScript (ES6+)**: Vanilla JS with modern APIs
- **GitHub API**: Live profile stats (followers, public repo count)
- **Google Fonts**: Manrope and Space Grotesk font families

## 📂 Project Structure

```txt
.
├── index.html              # Main HTML file
├── robots.txt              # Search engine crawl rules
├── sitemap.xml             # Search engine sitemap
├── assets/
│   ├── css/
│   │   ├── normalize.css   # CSS reset
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── script.js       # Main JavaScript
│   ├── data/
│   │   ├── projects.json   # Curated project data (see assets/data/README.md)
│   │   └── README.md       # Schema docs for projects.json
│   ├── images/              # Profile images
│   └── favicon/             # Favicon files
├── LICENSE
└── README.md
```

## 🎨 Sections

1. **Hero**: Editorial introduction with typing animation and clear calls to action
2. **About**: Bento-grid background with live GitHub stats (Projects, Followers)
3. **Projects**: A curated, customizable bento grid (see `assets/data/projects.json`), with a link out to the full [GitHub Stars list](https://github.com/stars/Mr-MRF-Dev/lists/my-projects)
4. **Skills**: Technical proficiencies across Frontend, Backend, and Tools
5. **Process**: Discover, Build, and Refine workflow
6. **Contact**: Collaboration call to action with social and email links
7. **Footer**: Brand summary and copyright

## 🎯 Performance Features

- Intersection Observer for scroll and skill animations
- Lazy-loaded, asynchronously decoded project images
- Loading skeletons while project and stats data is fetched
- Dark mode by default, rendered before first paint to prevent color flashing
- Minimal dependencies and no build step

## 🤝 Contributing

We welcome any contributions you may have. If you're interested in helping out, please fork the repository and create an [Issue](https://github.com/Mr-MRF-Dev/Mr-MRF-Dev.github.io/issues) or [Pull Request](https://github.com/Mr-MRF-Dev/Mr-MRF-Dev.github.io/pulls). We'll be happy to review your contributions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with 🍀 and lots of ☕
