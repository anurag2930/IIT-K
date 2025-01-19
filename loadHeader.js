document.addEventListener("DOMContentLoaded", () => {
    const headerContainer = document.getElementById("headerContainer");

    fetch("header.html")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error loading header: ${response.status}`);
            }
            return response.text();
        })
        .then((headerHTML) => {
            headerContainer.innerHTML = headerHTML;

            // Reinitialize any scripts or functionality in the loaded header
            const cartCounter = getCartCounter();
            updateCartBadge(cartCounter);
        })
        .catch((error) => {
            console.error("Error loading header:", error);
        });
});
