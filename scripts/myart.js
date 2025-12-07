(() => {
    const currentScript = document.currentScript;
    const CONFIG_PATH = currentScript?.dataset?.config || "../config/myart.json";
    let modal;
    let modalImage;

    document.addEventListener("DOMContentLoaded", () => {
        loadMyArt(CONFIG_PATH).catch((error) => console.error("Failed loading art config:", error));
        ensureModal();
    });

    async function loadMyArt(path) {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Unable to fetch art config (${response.status})`);
        }

        const data = await response.json();
        renderSection("pinned-cards", data.pinned || []);
        renderSection("normal-cards", filterNormal(data));
    }

    function filterNormal(data) {
        const pinnedPaths = new Set((data.pinned || []).map((item) => item.art));
        return (data.normal || []).filter((item) => !pinnedPaths.has(item.art));
    }

    function renderSection(containerId, entries) {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        container.innerHTML = "";
        const fragment = document.createDocumentFragment();

        entries.forEach((entry) => {
            fragment.appendChild(buildCard(entry));
        });

        container.appendChild(fragment);
    }

    function buildCard(entry) {
        const article = document.createElement("article");
        article.className = "art-card";

        const img = document.createElement("img");
        img.src = `../${entry.art}`;
        img.alt = entry.alt || entry.header || entry.art;
        article.appendChild(img);

        const body = document.createElement("div");
        body.className = "art-card-body";

        if (entry["art-card-label"]) {
            const label = document.createElement("p");
            label.className = "art-card-label";
            label.textContent = entry["art-card-label"];
            body.appendChild(label);
        }

        const heading = document.createElement("h2");
        heading.textContent = entry.header || entry.alt || entry.art;
        body.appendChild(heading);

        (entry.desc || []).forEach((descBlock) => {
            if (descBlock.p) {
                const p = document.createElement("p");
                p.textContent = descBlock.p;
                body.appendChild(p);
            }
        });

        if (Array.isArray(entry.meta) && entry.meta.length) {
            body.appendChild(buildMeta(entry.meta));
        }

        img.addEventListener("click", () => openModal(img.src, img.alt));

        article.appendChild(body);
        return article;
    }

    function buildMeta(metaEntries) {
        const meta = document.createElement("p");
        meta.className = "art-card-meta";

        const nodes = [];
        let hasLink = false;

        metaEntries.forEach((item) => {
            if (item.a && Array.isArray(item.a)) {
                const linkDef = item.a[0] || {};
                const displayDef = item.a[1] || {};
                const anchor = document.createElement("a");
                anchor.href = linkDef.link || "#";
                anchor.textContent = displayDef.display || linkDef.link || "";
                anchor.className = "meta-link";
                anchor.target = "_blank";
                anchor.rel = "noreferrer noopener";
                nodes.push(anchor);
                hasLink = true;
            } else if (item.t) {
                const span = document.createElement("span");
                span.textContent = item.t;
                nodes.push(span);
            } else if (item.x) {
                nodes.push(buildArtIdNode(item.x));
            }
        });

        nodes.forEach((node, index) => {
            if (index > 0) {
                meta.appendChild(document.createTextNode(" • "));
            }
            meta.appendChild(node);
        });

        if (hasLink) {
            meta.classList.add("meta-line");
        }

        return meta;
    }

    function buildArtIdNode(hex) {
        const span = document.createElement("span");
        span.className = "art-id";
        span.textContent = `id: ${hex}`;

        const timestamp = parseInt(hex, 16);
        if (!Number.isNaN(timestamp)) {
            const date = new Date(timestamp * 1000);
            if (!Number.isNaN(date.getTime())) {
                span.title = `Timestamp: ${date.toISOString().replace("T", " ").slice(0, 16)}`;
            }
        }

        return span;
    }

    function ensureModal() {
        if (modal) {
            return;
        }

        modal = document.createElement("div");
        modal.className = "art-modal";
        modal.setAttribute("aria-hidden", "true");

        const inner = document.createElement("div");
        inner.className = "art-modal__inner";

        const closeButton = document.createElement("button");
        closeButton.className = "art-modal__close";
        closeButton.setAttribute("aria-label", "Close artwork");
        closeButton.innerHTML = "&times;";

        modalImage = document.createElement("img");
        modalImage.className = "art-modal__image";
        modalImage.alt = "";

        inner.appendChild(closeButton);
        inner.appendChild(modalImage);
        modal.appendChild(inner);
        document.body.appendChild(modal);

        closeButton.addEventListener("click", closeModal);
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && modal.classList.contains("open")) {
                closeModal();
            }
        });
    }

    function openModal(src, alt) {
        ensureModal();
        modalImage.src = src;
        modalImage.alt = alt || "";
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
        if (!modal) {
            return;
        }

        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
    }
})();
