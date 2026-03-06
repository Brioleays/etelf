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
     sidebarContainer: "./partials/sidebar.html",
     sidebarHead: "./partials/sidebarhead.html"
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
        console.log(`${id} script loaded`);        if (typeof window[`init${capitalize(id)}Events`] === "function") {
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

// // ✅ Dynamic Hamburger Menu Logic (works for all loaded navbars)
// document.addEventListener("click", (e) => {
//   // Check if the click is on a hamburger button
//   if (e.target.closest("#menu-toggle")) {
//     const navLinks = document.querySelector("#nav-links");
//     if (navLinks) {
//       navLinks.classList.toggle("hidden");
//     }
//   }
// });

// document.addEventListener("click", function (e) {
//   if (e.target.classList.contains("tab-btn")) {

//     // Remove active state
//     document.querySelectorAll(".tab-btn").forEach(btn => {
//       btn.classList.remove("text-blue-700", "border-b-2", "border-blue-700");
//       btn.classList.add("text-gray-500");
//     });

//     // Activate clicked
//     e.target.classList.remove("text-gray-500");
//     e.target.classList.add("text-blue-700", "border-b-2", "border-blue-700");

//     // Hide all panes
//     document.querySelectorAll(".tab-pane").forEach(pane => {
//       pane.classList.add("hidden");
//     });

//     // Show selected
//     const target = e.target.getAttribute("data-tab");
//     document.getElementById(target).classList.remove("hidden");
//   }
// });
// document.addEventListener("DOMContentLoaded", function(){
// const sidebar = document.getElementById("sidebar");
//   const openBtn = document.getElementById("openSidebar");
//   if( openBtn && sidebar) {
//   openBtn.addEventListener("click", function (){
//     sidebar.classList.toggle("-translate-x-full");
//   });
// }
//   });

//   // Auto close on mobile click outside
//   document.addEventListener("click", function (e) {
//     if (
//       window.innerWidth < 768 &&
//       !sidebar.contains(e.target) &&
//       !openBtn.contains(e.target)
//     ) {
//       sidebar.classList.add("-translate-x-full");
//     }
//   });


/**
 * FGT Universal Logic - Proven for Landing & Dashboard
 * Fixes "nothing clicking" via event delegation and handles async components.
 */

document.addEventListener("DOMContentLoaded", () => {
    // If you are still using the loader, keep this; otherwise, the click logic handles the rest.
    console.log("FGT Logic Initialized");
});

document.addEventListener("click", (e) => {
    // 1. DASHBOARD SIDEBAR TOGGLE
    const openSidebar = e.target.closest("#openSidebar"); // Button in Header
    const sidebar = document.getElementById("sidebar");   // Aside element
    if (openSidebar && sidebar) {
        sidebar.classList.toggle("-translate-x-full");
    }

    // 2. LANDING PAGE NAVBAR (Mobile Menu)
    const menuToggle = e.target.closest("#menu-toggle"); // Hamburger button
    const navLinks = document.getElementById("nav-links"); // UL list
    if (menuToggle && navLinks) {
        navLinks.classList.toggle("hidden");
    }

    // 3. TABS (Works for Notifications, Order Details, and Messaging)
    // Targets elements with .tab-btn or specific IDs from your HTML
    const tabBtn = e.target.closest(".tab-btn, #documentTab, #messageTab");
    if (tabBtn) {
        const tabId = tabBtn.getAttribute("data-tab") || tabBtn.id;
        handleUniversalTabs(tabBtn, tabId);
    }

    // 4. MOBILE AUTO-CLOSE (UX Fix)
    // Closes sidebar if user clicks main content while sidebar is open on mobile
    if (sidebar && !sidebar.classList.contains("-translate-x-full") && window.innerWidth < 768) {
        if (!sidebar.contains(e.target) && !openSidebar) {
            sidebar.classList.add("-translate-x-full");
        }
    }
});

/**
 * Handles tab switching for any section
 * @param {Element} btn - The clicked button
 * @param {string} id - The ID of the content to show
 */
function handleUniversalTabs(btn, id) {
    // Find the closest parent container to scope the search
    const container = btn.closest('main, section, .bg-white');
    
    // Hide all panes in this section
    container.querySelectorAll(".tab-pane").forEach(pane => pane.classList.add("hidden"));
    
    // Show the target pane (supports ID or ID-pane naming)
    const target = document.getElementById(id) || document.getElementById(id + "-pane");
    if (target) {
        target.classList.remove("hidden");
    }

    // Update UI Styles: Reset all buttons in section, then highlight active
    container.querySelectorAll(".tab-btn, #documentTab, #messageTab").forEach(b => {
        b.classList.remove("text-blue-700", "border-b-2", "border-blue-700", "text-blue-600");
        b.classList.add("text-gray-500");
    });
    
    btn.classList.add("text-blue-700", "border-b-2", "border-blue-700");
    btn.classList.remove("text-gray-500");
}

// ✅ MOBILE CHAT TOGGLE LOGIC
document.addEventListener("click", (e) => {
    const chatList = document.getElementById("chat-list");
    const chatWindow = document.getElementById("chat-window");

    // 1. When a user clicks a conversation item on mobile
    if (e.target.closest(".conversation-item") && window.innerWidth < 1024) {
        chatList.classList.add("hidden"); // Hide the list
        chatWindow.classList.remove("hidden"); // Show the chat
    }

    // 2. When the user clicks the 'Back' button in the chat header
    if (e.target.closest("#back-to-list")) {
        chatList.classList.remove("hidden"); // Show the list again
        chatWindow.classList.add("hidden"); // Hide the chat
    }
});
 