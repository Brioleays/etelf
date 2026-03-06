document.addEventListener("DOMContentLoaded", () => {
    loadAllComponents();
});

// --- 1. COMPONENT LOADER ---
function loadAllComponents() {
    const inSubfolder = window.location.pathname.includes('/staffdash/');
    const path = inSubfolder ? '../' : './';
    const components = {
        navbar: `${path}partials/navbar.html`,
        footer: `${path}partials/footer.html`,
        footerTwo: `${path}partials/footertwo.html`,
        footerThree: `${path}partials/footerthree.html`,
        sidebarContainer: `${path}partials/sidebar.html`,
        sidebarHead: `${path}partials/sidebarhead.html`,
        staffSidebar: `${path}partials/staffsidebar.html`,
        staffSidebarHead: `${path}partials/staffsidebarhead.html`,

    };
    Object.entries(components).forEach(([id, file]) => loadComponent(id, file));
}

function loadComponent(id, file) {
    fetch(file)
        .then((res) => {
            if (!res.ok) throw new Error(`Failed to load ${file}`);
            return res.text();
        })
        .then((html) => {
            const container = document.getElementById(id);
            if (!container) return;
            container.innerHTML = html;

            // ✅ TRIGGER SIDEBAR HIGHLIGHT EXACTLY WHEN IT LOADS
            if (id === 'sidebarContainer' || id === 'staffSidebar') {
                highlightActiveLink();
            }

            const scriptPath = file.replace(".html", ".js");
            loadComponentScript(scriptPath, id);
        })
        .catch((err) => console.error(err));
}

function loadComponentScript(scriptPath, id) {
    fetch(scriptPath)
        .then((res) => {
            if (!res.ok) return;
            const script = document.createElement("script");
            script.src = scriptPath;
            script.onload = () => {
                if (typeof window[`init${capitalize(id)}Events`] === "function") {
                    window[`init${capitalize(id)}Events`]();
                }
            };
            document.body.appendChild(script);
        })
        .catch(() => {});
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- 2. UNIVERSAL CLICK LISTENER ---
document.addEventListener("click", (e) => {
    // A. Dashboard Sidebar Toggle
    const openSidebar = e.target.closest("#openSidebar");
    const sidebar = document.getElementById("sidebar");
    if (openSidebar && sidebar) {
        sidebar.classList.toggle("-translate-x-full");
    }

    // B. Landing Page Mobile Menu
    const menuToggle = e.target.closest("#menu-toggle");
    const navLinks = document.getElementById("nav-links");
    if (menuToggle && navLinks) {
        navLinks.classList.toggle("hidden");
    }

    // C. Universal Tabs (Order Details & Notifications)
    const tabBtn = e.target.closest(".tab-btn, #documentTab, #messageTab, .tab-trigger");
    if (tabBtn) {
        const tabId = tabBtn.getAttribute("data-tab") || tabBtn.getAttribute("data-target") || tabBtn.id;
        handleUniversalTabs(tabBtn, tabId);
    }

    // D. Mobile Auto-Close Sidebar
    if (sidebar && !sidebar.classList.contains("-translate-x-full") && window.innerWidth < 768) {
        if (!sidebar.contains(e.target) && !openSidebar) {
            sidebar.classList.add("-translate-x-full");
        }
    }

    // E. Mobile Chat Toggle
    const chatItem = e.target.closest(".conversation-item");
    const backBtn = e.target.closest("#back-to-list");
    const chatList = document.getElementById("chat-list");
    const chatWindow = document.getElementById("chat-window");

    if (chatItem && window.innerWidth < 1024) {
        if (chatList) chatList.classList.add("hidden");
        if (chatWindow) chatWindow.classList.remove("hidden");
    }
    if (backBtn) {
        if (chatList) chatList.classList.remove("hidden");
        if (chatWindow) chatWindow.classList.add("hidden");
    }

    // F. Active Chat Send Logic
    const sendBtn = e.target.closest("button");
    if (sendBtn && sendBtn.textContent.trim() === "Send") {
        const inputField = sendBtn.previousElementSibling; 
        const chatBox = sendBtn.closest("#chat-window")?.querySelector(".overflow-y-auto");

        if (inputField && chatBox && inputField.value.trim() !== "") {
            const newMessage = `
                <div class="flex justify-end mt-4">
                    <div class="bg-[#0B1E8A] text-white px-4 py-2 rounded-lg text-sm max-w-[85%] lg:max-w-[75%] break-words">
                        ${inputField.value}
                    </div>
                </div>
            `;
            chatBox.insertAdjacentHTML("beforeend", newMessage);
            inputField.value = "";
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    // G. Modal Auto-Close
    if (e.target.classList.contains("bg-black/50")) {
        closeModal(e.target.id);
    }
});

// --- 3. HELPER FUNCTIONS ---

// ✅ FIXED DOM TRAPPING: Now searches the whole main tag
function handleUniversalTabs(btn, id) {
    const container = btn.closest('main') || document.body;
    
    container.querySelectorAll(".tab-pane").forEach(pane => pane.classList.add("hidden"));
    
    const target = document.getElementById(id) || document.getElementById(id + "-pane");
    if (target) target.classList.remove("hidden");

    container.querySelectorAll(".tab-btn, .tab-trigger, #documentTab, #messageTab").forEach(b => {
        b.classList.remove("text-blue-700", "border-b-2", "border-blue-700", "text-blue-600", "font-bold");
        b.classList.add("text-gray-500");
    });
    
    btn.classList.add("text-blue-600", "font-bold");
    btn.classList.remove("text-gray-500");
}

// ✅ FIXED RACE CONDITION: Instantly highlights based on URL
function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('#sidebar nav a');

    navLinks.forEach(link => {
        link.classList.remove('border-l-4', 'border-blue-600', 'bg-blue-50', 'text-blue-600', 'font-medium');
        link.classList.add('text-gray-600');

        const href = link.getAttribute('href');
        if (href) {
            const fileName = href.split('/').pop(); 
            if (currentPath.includes(fileName)) {
                link.classList.add('border-l-4', 'border-blue-600', 'bg-blue-50', 'text-blue-600', 'font-medium');
                link.classList.remove('text-gray-600');
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("hidden");
        document.body.style.overflow = 'hidden'; 
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("hidden");
        document.body.style.overflow = 'auto'; 
    }
}

// --- 4. FORM AUTOMATION ---
document.addEventListener("submit", (e) => {
    const form = e.target.closest("form");
    if (form) {
        const successModal = document.getElementById('success-modal');
        if (successModal) {
            e.preventDefault(); 
            openModal('success-modal'); 
        }
    }
});

