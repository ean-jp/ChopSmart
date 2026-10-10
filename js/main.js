
// ======================================
// CHOPSMART NAVIGATION AND CART COUNTER
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".nav-links");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", function () {
            const isOpen = navigation.classList.toggle("open");

            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.textContent = isOpen ? "✕" : "☰";
        });
    }

    // Display the current number of items in the cart.
    const savedCart = JSON.parse(
        localStorage.getItem("chopsmart_cart") || "[]"
    );

    const itemCount = savedCart.reduce(function (total, item) {
        return total + Number(item.quantity || 0);
    }, 0);

    document.querySelectorAll(".cart-count").forEach(function (element) {
        element.textContent = itemCount;
    });
});


// ======================================
// CHOPSMART VENDOR DIRECTORY
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const vendorGrid = document.getElementById("vendor-grid");
    const searchInput = document.getElementById("vendor-search");
    const categorySelect = document.getElementById("vendor-category");
    const vendorCount = document.getElementById("vendor-count");
    const emptyMessage = document.getElementById("vendor-empty");

    // Run this functionality only on the vendors page.
    if (!vendorGrid) {
        return;
    }

    function displayVendors(vendorList) {

        vendorGrid.innerHTML = "";

        vendorCount.textContent =
            `${vendorList.length} vendor(s) found`;

        emptyMessage.hidden = vendorList.length !== 0;

        vendorList.forEach(function (vendor) {

            // Create vendor card.
            const card = document.createElement("article");
            card.className = "vendor-card";

            // ======================================
            // VENDOR PHOTOGRAPH
            // ======================================

            const visual = document.createElement("div");
            visual.className = "vendor-image";
            visual.style.backgroundColor = vendor.color;

            const image = document.createElement("img");
            image.src = vendor.image;
            image.alt = `Food from ${vendor.name}`;
            image.loading = "lazy";
            image.className = "food-photo";

            // Display the emoji if the photograph fails to load.
            image.onerror = function () {
                visual.textContent = vendor.emoji;
            };

            visual.appendChild(image);

            // ======================================
            // VENDOR DETAILS
            // ======================================

            const details = document.createElement("div");
            details.className = "vendor-details";

            const category = document.createElement("span");
            category.className = "meal-tag";
            category.textContent = vendor.category;

            const heading = document.createElement("h3");
            heading.textContent = vendor.name;

            const description = document.createElement("p");
            description.textContent = vendor.description;

            const popular = document.createElement("p");
            popular.className = "vendor-popular";
            popular.textContent = `Popular: ${vendor.popular}`;

            // ======================================
            // PRICE AND VIEW MENU LINK
            // ======================================

            const bottom = document.createElement("div");
            bottom.className = "vendor-bottom";

            const price = document.createElement("strong");
            price.textContent =
                `From GHS ${vendor.startingPrice.toFixed(2)}`;

            const link = document.createElement("a");
            link.className = "small-btn";
            link.href = `menu.html?vendor=${vendor.id}`;
            link.textContent = "View Menu →";

            bottom.append(price, link);

            details.append(
                category,
                heading,
                description,
                popular,
                bottom
            );

            card.append(visual, details);

            vendorGrid.appendChild(card);
        });
    }

    // ======================================
    // SEARCH AND CATEGORY FILTERING
    // ======================================

    function filterVendors() {

        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categorySelect.value;

        const filtered = vendors.filter(function (vendor) {

            const matchesSearch =
                vendor.name.toLowerCase().includes(searchTerm) ||
                vendor.popular.toLowerCase().includes(searchTerm) ||
                vendor.description.toLowerCase().includes(searchTerm);

            const matchesCategory =
                selectedCategory === "all" ||
                vendor.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        displayVendors(filtered);
    }

    searchInput.addEventListener("input", filterVendors);
    categorySelect.addEventListener("change", filterVendors);

    displayVendors(vendors);
});
