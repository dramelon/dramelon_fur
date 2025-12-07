(function () {
    const scriptElement = document.currentScript || (() => {
        const scripts = document.querySelectorAll("script[data-topbar-template]");
        return scripts[scripts.length - 1];
    })();

    const templatePath = scriptElement?.dataset?.topbarTemplate || "./common/topbar.html";

    async function injectTopbar() {
        if (document.querySelector(".topbar")) {
            return;
        }

        try {
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`Topbar template request failed with status ${response.status}`);
            }

            const markup = await response.text();
            document.body.insertAdjacentHTML("afterbegin", markup);
        } catch (error) {
            console.error("Failed to load topbar template:", error);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectTopbar);
    } else {
        injectTopbar();
    }
})();
