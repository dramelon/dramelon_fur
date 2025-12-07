const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const pageDim = document.getElementById("pageDim");

function toggleNav() {
    const isOpen = document.body.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", isOpen);
    sidebar.setAttribute("aria-hidden", (!isOpen).toString());
    if (pageDim) {
        pageDim.setAttribute("aria-hidden", (!isOpen).toString());
    }
}

if (menuToggle && sidebar) {
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
