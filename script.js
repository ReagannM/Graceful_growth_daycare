document.documentElement.classList.add("js-enabled");

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
const header = document.querySelector(".site-header");

function closeMenu() {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("is-open");
}

menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    navigation.classList.toggle("is-open", isOpen);
});

navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
        closeMenu();
    }
});

document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) {
        closeMenu();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
        menuButton.focus();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        closeMenu();
    }
});

const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealItems = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealVisibleItems = () => {
    revealItems.forEach((item) => {
        if (item.classList.contains("is-visible")) {
            return;
        }

        const bounds = item.getBoundingClientRect();
        if (bounds.top < window.innerHeight * 0.9 && bounds.bottom > 0) {
            item.classList.add("is-visible");
        }
    });
};

if (!reduceMotion) {
    revealVisibleItems();
    window.addEventListener("scroll", revealVisibleItems, { passive: true });
    window.addEventListener("resize", revealVisibleItems);
}

if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => {
        if (!item.classList.contains("is-visible")) {
            revealObserver.observe(item);
        }
    });
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

const galleryFilters = document.querySelectorAll(".filter-button");
const galleryCards = document.querySelectorAll(".gallery-card");

galleryFilters.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedCategory = button.dataset.filter;

        galleryFilters.forEach((filter) => {
            const isSelected = filter === button;
            filter.classList.toggle("is-active", isSelected);
            filter.setAttribute("aria-pressed", String(isSelected));
        });

        galleryCards.forEach((card) => {
            card.hidden = selectedCategory !== "all" && card.dataset.category !== selectedCategory;
        });
    });
});

document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("toggle", () => {
        if (item.open) {
            document.querySelectorAll(".faq-item").forEach((otherItem) => {
                if (otherItem !== item) {
                    otherItem.open = false;
                }
            });
        }
    });
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
        return;
    }

    const formData = new FormData(contactForm);
    const name = formData.get("name").trim();
    const phone = formData.get("phone").trim();
    const childAge = formData.get("childAge").trim();
    const message = formData.get("message").trim();
    const subject = `Daycare enquiry from ${name}`;
    const body = [
        `Hello Graceful Growth Daycare,`,
        "",
        message,
        "",
        `My name is ${name}.`,
        `My phone number is ${phone}.`,
        childAge ? `My child's age is ${childAge}.` : "",
    ].filter(Boolean).join("\n");

    formStatus.textContent = "Opening your email app with your message ready to send.";
    window.location.href = `mailto:gracefulgrowth2026@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
