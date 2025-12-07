(function () {
    const currentScript = document.currentScript || (() => {
        const scriptNodes = document.querySelectorAll("script[data-sidebar-template]");
        return scriptNodes[scriptNodes.length - 1];
    })();
    const templatePath = currentScript?.dataset?.sidebarTemplate || "./common/sidebar.html";

    async function injectSidebar() {
        if (document.getElementById("menuToggle")) {
            bindSidebarInteractions();
            return;
        }

        try {
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`Sidebar template request failed with status ${response.status}`);
            }

            const markup = await response.text();
            document.body.insertAdjacentHTML("afterbegin", markup);
            bindSidebarInteractions();
        } catch (error) {
            console.error("Failed to load sidebar template:", error);
        }
    }

    function bindSidebarInteractions() {
        const menuToggle = document.getElementById("menuToggle");
        const sidebar = document.getElementById("sidebar");
        const pageDim = document.getElementById("pageDim");

        if (!menuToggle || !sidebar) {
            return;
        }

        const toggleNav = () => {
            const isOpen = document.body.classList.toggle("nav-open");
            menuToggle.setAttribute("aria-expanded", isOpen);
            sidebar.setAttribute("aria-hidden", (!isOpen).toString());
            if (pageDim) {
                pageDim.setAttribute("aria-hidden", (!isOpen).toString());
            }
        };

        menuToggle.addEventListener("click", toggleNav);

        if (pageDim) {
            pageDim.addEventListener("click", () => {
                if (document.body.classList.contains("nav-open")) {
                    toggleNav();
                }
            });
        }

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
                toggleNav();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectSidebar);
    } else {
        injectSidebar();
    }
})();
