document.addEventListener("DOMContentLoaded", () => {
  loadAllComponents();
//   initSidebar();
//   highlightActiveLink();
//   initAlert();
});

function loadAllComponents() {
  const components = {
    navbar: "./partials/navbar.html",
    footer: "./partials/footer.html",
    footerTwo: "./partials/footertwo.html",
    footerThree: "./partials/footerthree.html"
    // sidebar: "partials/sidebar.html",
  };

  Object.entries(components).forEach(([id, file]) => loadComponent(id, file));
}


// Generalized loader
function loadComponent(id, file) {
  fetch(file)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${file}`);
      return res.text();
    })
    .then((html) => {
      const container = document.getElementById(id);
      if (!container) return console.warn(`Container #${id} not found`);
      container.innerHTML = html;

      // Try to load matching JS file (optional)
      const scriptPath = file.replace(".html", ".js");
      loadComponentScript(scriptPath, id);
    })
    .catch((err) => console.error(err));
}

// Optional JS loader for each component
function loadComponentScript(scriptPath, id) {
  fetch(scriptPath)
    .then((res) => {
      if (!res.ok) return; // silently skip if no JS file
      const script = document.createElement("script");
      script.src = scriptPath;
      script.onload = () => {
        console.log(`${id} script loaded`);
        if (typeof window[`init${capitalize(id)}Events`] === "function") {
          window[`init${capitalize(id)}Events`](); // auto-run init if exists
        }
      };
      document.body.appendChild(script);
    })
    .catch(() => {});
}

// Helper: capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ✅ Dynamic Hamburger Menu Logic (works for all loaded navbars)
document.addEventListener("click", (e) => {
  // Check if the click is on a hamburger button
  if (e.target.closest("#menu-toggle")) {
    const navLinks = document.querySelector("#nav-links");
    if (navLinks) {
      navLinks.classList.toggle("hidden");
    }
  }
});