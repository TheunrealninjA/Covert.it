document.addEventListener("DOMContentLoaded", () => {
    const servicesButton = document.querySelector(".dropdown > button");
    servicesButton.addEventListener("click", () => {
        const dropdownContent = document.querySelector(".dropdown-content");
        dropdownContent.classList.toggle("show");
    });

    // Optionally prevent clicks inside the dropdown from closing it:
    document.querySelectorAll(".dropdown-content a").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    });
});