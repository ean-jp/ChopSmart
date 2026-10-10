
// ======================================
// CHOPSMART CART MANAGEMENT
// ======================================

const CART_KEY = "chopsmart_cart";

// Read the current cart from browser storage.
function getCart() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(CART_KEY) || "[]"
        );

        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.error("Could not read cart:", error);
        return [];
    }
}

// Save cart changes.
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

// Update the cart number displayed in the navigation bar.
function updateCartCount() {
    const cart = getCart();

    const totalItems = cart.reduce(function (total, item) {
        return total + Number(item.quantity || 0);
    }, 0);

    document.querySelectorAll(".cart-count").forEach(function (element) {
        element.textContent = totalItems;
    });
}

// Add a selected meal to the shopping cart.
function addToCart(mealId) {
    const meal = meals.find(function (item) {
        return item.id === mealId;
    });

    if (!meal) {
        return;
    }

    const cart = getCart();

    const existingItem = cart.find(function (item) {
        return item.mealId === mealId;
    });

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            mealId: meal.id,
            quantity: 1
        });
    }

    saveCart(cart);

    const notification = document.getElementById("cart-notification");

    if (notification) {
        notification.textContent = `${meal.name} added to your cart!`;
        notification.classList.add("visible");
    }
}


// ======================================
// REUSABLE FOOD IMAGE FUNCTION
// ======================================

// Creates a food photograph with an emoji fallback.
// This function is used on both the menu and cart pages.
function createFoodVisual(meal, containerClass) {
    const container = document.createElement("div");
    container.className = containerClass;

    if (!meal.image) {
        container.textContent = meal.emoji;
        return container;
    }

    const image = document.createElement("img");

    image.src = meal.image;
    image.alt = meal.name;
    image.loading = "lazy";
    image.className = "food-photo";

    // If the image cannot load, show the original emoji.
    image.onerror = function () {
        container.textContent = meal.emoji;
    };

    container.appendChild(image);

    return container;
}


// ======================================
// FOOD MENU PAGE
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const menuGrid = document.getElementById("menu-grid");

    // Only execute menu code on menu.html.
    if (!menuGrid) {
        return;
    }

    const searchInput = document.getElementById("meal-search");
    const categorySelect = document.getElementById("meal-category");
    const mealCount = document.getElementById("meal-count");
    const menuTitle = document.getElementById("menu-title");
    const emptyMessage = document.getElementById("menu-empty");

    // Read vendor ID from URL, e.g. menu.html?vendor=2
    const parameters = new URLSearchParams(window.location.search);
    const vendorId = Number(parameters.get("vendor"));

    const selectedVendor = vendors.find(function (vendor) {
        return vendor.id === vendorId;
    });

    if (selectedVendor) {
        menuTitle.textContent = `${selectedVendor.name}'s Menu`;
    }

    // ======================================
    // DISPLAY MEALS
    // ======================================

    function displayMeals(mealList) {

        menuGrid.innerHTML = "";

        mealCount.textContent =
            `${mealList.length} meal(s) available`;

        emptyMessage.hidden = mealList.length !== 0;

        mealList.forEach(function (meal) {

            const vendor = vendors.find(function (item) {
                return item.id === meal.vendorId;
            });

            // Create meal card.
            const card = document.createElement("article");
            card.className = "meal-card";

            // Create food photograph.
            const art = createFoodVisual(meal, "meal-art");

            // Create meal details.
            const details = document.createElement("div");
            details.className = "meal-details";

            const tag = document.createElement("span");
            tag.className = "meal-tag";
            tag.textContent = meal.category;

            const heading = document.createElement("h3");
            heading.textContent = meal.name;

            const description = document.createElement("p");
            description.textContent = meal.description;

            const vendorName = document.createElement("p");
            vendorName.className = "meal-vendor";
            vendorName.textContent =
                `By ${vendor ? vendor.name : "ChopSmart"}`;

            // Create price and Add to Cart button.
            const bottom = document.createElement("div");
            bottom.className = "meal-bottom";

            const price = document.createElement("strong");
            price.textContent = `GHS ${meal.price.toFixed(2)}`;

            const button = document.createElement("button");
            button.type = "button";
            button.className = "small-btn add-cart-btn";
            button.textContent = "+ Add to Cart";

            button.addEventListener("click", function () {

                addToCart(meal.id);

                button.textContent = "✓ Added!";

                setTimeout(function () {
                    button.textContent = "+ Add to Cart";
                }, 1200);
            });

            bottom.append(price, button);

            details.append(
                tag,
                heading,
                description,
                vendorName,
                bottom
            );

            card.append(art, details);

            menuGrid.appendChild(card);
        });
    }

    // ======================================
    // SEARCH AND CATEGORY FILTERING
    // ======================================

    function filterMeals() {

        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categorySelect.value;

        const filtered = meals.filter(function (meal) {

            const vendor = vendors.find(function (item) {
                return item.id === meal.vendorId;
            });

            const matchesVendor =
                !selectedVendor || meal.vendorId === selectedVendor.id;

            const matchesSearch =
                meal.name.toLowerCase().includes(searchTerm) ||
                meal.description.toLowerCase().includes(searchTerm) ||
                (
                    vendor &&
                    vendor.name.toLowerCase().includes(searchTerm)
                );

            const matchesCategory =
                selectedCategory === "all" ||
                meal.category === selectedCategory;

            return matchesVendor && matchesSearch && matchesCategory;
        });

        displayMeals(filtered);
    }

    searchInput.addEventListener("input", filterMeals);
    categorySelect.addEventListener("change", filterMeals);

    filterMeals();
    updateCartCount();
});


// ==========================================
// SHOPPING CART PAGE AND CHECKOUT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const cartItems = document.getElementById("cart-items");

    // Run only on cart.html.
    if (!cartItems) {
        return;
    }

    const emptyMessage = document.getElementById("cart-empty");
    const quantityDisplay = document.getElementById("summary-quantity");
    const subtotalDisplay = document.getElementById("summary-subtotal");
    const totalDisplay = document.getElementById("summary-total");
    const checkoutForm = document.getElementById("checkout-form");
    const placeOrderButton = document.getElementById("place-order-btn");
    const checkoutMessage = document.getElementById("checkout-message");

    function money(value) {
        return `GHS ${value.toFixed(2)}`;
    }

    // ======================================
    // DISPLAY SHOPPING CART
    // ======================================

    function renderCart() {

        const cart = getCart();
        cartItems.innerHTML = "";

        let subtotal = 0;
        let totalQuantity = 0;

        cart.forEach(function (item) {

            const meal = meals.find(function (m) {
                return m.id === item.mealId;
            });

            if (!meal) return;

            const quantity = Number(item.quantity);

            if (!Number.isInteger(quantity) || quantity < 1) {
                return;
            }

            const itemTotal = meal.price * quantity;

            subtotal += itemTotal;
            totalQuantity += quantity;

            // Create cart item card.
            const card = document.createElement("article");
            card.className = "cart-item-card";

            // Display the food photograph.
            const illustration = createFoodVisual(
                meal,
                "cart-item-art"
            );

            // ======================================
            // MEAL DETAILS
            // ======================================

            const details = document.createElement("div");
            details.className = "cart-item-details";

            const heading = document.createElement("h3");
            heading.textContent = meal.name;

            const unitPrice = document.createElement("p");
            unitPrice.textContent = `${money(meal.price)} each`;

            // ======================================
            // QUANTITY CONTROLS
            // ======================================

            const controls = document.createElement("div");
            controls.className = "quantity-controls";

            const decrease = document.createElement("button");
            decrease.type = "button";
            decrease.textContent = "−";
            decrease.setAttribute(
                "aria-label",
                `Decrease ${meal.name} quantity`
            );

            const quantityText = document.createElement("span");
            quantityText.textContent = quantity;

            const increase = document.createElement("button");
            increase.type = "button";
            increase.textContent = "+";
            increase.setAttribute(
                "aria-label",
                `Increase ${meal.name} quantity`
            );

            decrease.addEventListener("click", function () {
                changeQuantity(meal.id, -1);
            });

            increase.addEventListener("click", function () {
                changeQuantity(meal.id, 1);
            });

            controls.append(
                decrease,
                quantityText,
                increase
            );

            details.append(
                heading,
                unitPrice,
                controls
            );

            // ======================================
            // ITEM TOTAL AND REMOVE BUTTON
            // ======================================

            const actions = document.createElement("div");
            actions.className = "cart-item-actions";

            const total = document.createElement("strong");
            total.textContent = money(itemTotal);

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "remove-item-btn";
            remove.textContent = "Remove";

            remove.addEventListener("click", function () {
                removeItem(meal.id);
            });

            actions.append(total, remove);

            card.append(
                illustration,
                details,
                actions
            );

            cartItems.appendChild(card);
        });

        // ======================================
        // UPDATE ORDER SUMMARY
        // ======================================

        quantityDisplay.textContent = totalQuantity;
        subtotalDisplay.textContent = money(subtotal);
        totalDisplay.textContent = money(subtotal);

        emptyMessage.hidden = totalQuantity !== 0;
        checkoutForm.hidden = totalQuantity === 0;
        placeOrderButton.disabled = totalQuantity === 0;

        updateCartCount();
    }

    // ======================================
    // CHANGE MEAL QUANTITY
    // ======================================

    function changeQuantity(mealId, change) {

        const cart = getCart();

        const item = cart.find(function (entry) {
            return entry.mealId === mealId;
        });

        if (!item) return;

        const newQuantity = Number(item.quantity) + change;

        if (newQuantity <= 0) {
            removeItem(mealId);
            return;
        }

        item.quantity = Math.min(newQuantity, 99);

        saveCart(cart);
        renderCart();
    }

    // ======================================
    // REMOVE ITEM FROM CART
    // ======================================

    function removeItem(mealId) {

        const updatedCart = getCart().filter(function (item) {
            return item.mealId !== mealId;
        });

        saveCart(updatedCart);
        renderCart();
    }

    // ======================================
    // PLACE ORDER AND CHECKOUT
    // ======================================

    checkoutForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!checkoutForm.reportValidity()) {
            return;
        }

        const cart = getCart();

        if (cart.length === 0) {
            checkoutMessage.textContent = "Your cart is empty.";
            return;
        }

        const orderItems = [];
        let orderTotal = 0;

        for (const item of cart) {

            const meal = meals.find(function (m) {
                return m.id === item.mealId;
            });

            const quantity = Number(item.quantity);

            if (
                !meal ||
                !Number.isInteger(quantity) ||
                quantity < 1
            ) {
                continue;
            }

            orderItems.push({
                mealId: meal.id,
                name: meal.name,
                price: meal.price,
                quantity: quantity
            });

            orderTotal += meal.price * quantity;
        }

        if (orderItems.length === 0) {
            checkoutMessage.textContent =
                "No valid meals in your cart.";
            return;
        }

        // ======================================
        // CREATE ORDER OBJECT
        // ======================================

        const order = {
            id: "CS-" + Date.now(),
            date: new Date().toISOString(),

            customerName: document
                .getElementById("customer-name")
                .value.trim(),

            phone: document
                .getElementById("customer-phone")
                .value.trim(),

            pickupLocation: document
                .getElementById("pickup-location")
                .value,

            notes: document
                .getElementById("order-notes")
                .value.trim(),

            items: orderItems,
            total: orderTotal,
            status: "Demo order placed"
        };

        if (!order.customerName) {
            checkoutMessage.textContent =
                "Please enter your name.";
            return;
        }

        // ======================================
        // LOAD PREVIOUS ORDERS
        // ======================================

        let previousOrders;

        try {
            previousOrders = JSON.parse(
                localStorage.getItem("chopsmart_orders") || "[]"
            );

            if (!Array.isArray(previousOrders)) {
                previousOrders = [];
            }
        } catch (error) {
            previousOrders = [];
        }

        // Put the newest order first.
        previousOrders.unshift(order);

        // ======================================
        // SAVE ORDER TO LOCAL STORAGE
        // ======================================

        try {
            localStorage.setItem(
                "chopsmart_orders",
                JSON.stringify(previousOrders)
            );

            // Empty cart after successful order.
            saveCart([]);

        } catch (error) {

            checkoutMessage.textContent =
                "Unable to save the order. Please try again.";

            console.error(error);
            return;
        }

        // Reset checkout form.
        checkoutForm.reset();

        // Refresh the cart display.
        renderCart();

        checkoutMessage.textContent =
            "Order saved successfully! Opening your order history...";

        // Redirect to My Orders page.
        window.location.href = "orders.html";
    });

    // Display cart when the page loads.
    renderCart();
});
