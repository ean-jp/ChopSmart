
// ==========================================
// CHOPSMART ORDER HISTORY
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const ordersList = document.getElementById("orders-list");
    const emptyMessage = document.getElementById("orders-empty");
    const ordersCount = document.getElementById("orders-count");

    const totalOrdersDisplay = document.getElementById("total-orders");
    const totalSpentDisplay = document.getElementById("total-spent");
    const totalMealsDisplay = document.getElementById("total-meals");

    if (!ordersList) return;

    function formatMoney(amount) {
        return `GHS ${Number(amount).toFixed(2)}`;
    }

    function getOrders() {
        try {
            const saved = JSON.parse(
                localStorage.getItem("chopsmart_orders") || "[]"
            );

            return Array.isArray(saved) ? saved : [];
        } catch (error) {
            console.error("Unable to load orders:", error);
            return [];
        }
    }

    function createTextElement(tag, className, content) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        element.textContent = content;
        return element;
    }

    function renderOrders() {
        const orders = getOrders();

        ordersList.innerHTML = "";
        emptyMessage.hidden = orders.length > 0;

        ordersCount.textContent =
            `${orders.length} order(s) found`;

        let totalSpent = 0;
        let totalMeals = 0;

        orders.forEach(function (order) {
            totalSpent += Number(order.total) || 0;

            (order.items || []).forEach(function (item) {
                totalMeals += Number(item.quantity) || 0;
            });

            const card = document.createElement("article");
            card.className = "order-history-card";

            const header = document.createElement("div");
            header.className = "order-history-header";

            const headingGroup = document.createElement("div");

            headingGroup.append(
                createTextElement("span", "eyebrow", "ORDER NUMBER"),
                createTextElement("h3", "", order.id)
            );

            const date = new Date(order.date);
            const formattedDate = Number.isNaN(date.getTime())
                ? "Date unavailable"
                : date.toLocaleString("en-GH", {
                    dateStyle: "medium",
                    timeStyle: "short"
                });

            headingGroup.append(
                createTextElement("p", "order-date", formattedDate)
            );

            const status = createTextElement(
                "span",
                "order-status",
                order.status || "Demo order placed"
            );

            header.append(headingGroup, status);

            const details = document.createElement("div");
            details.className = "order-history-details";

            const customer = createTextElement(
                "p",
                "",
                `Customer: ${order.customerName || "Unknown"}`
            );

            const pickup = createTextElement(
                "p",
                "",
                `Pickup: ${order.pickupLocation || "Not specified"}`
            );

            details.append(customer, pickup);

            if (order.notes) {
                details.append(
                    createTextElement(
                        "p",
                        "",
                        `Notes: ${order.notes}`
                    )
                );
            }

            const itemsContainer = document.createElement("div");
            itemsContainer.className = "order-history-items";

            (order.items || []).forEach(function (item) {
                const row = document.createElement("div");
                row.className = "order-history-item";

                const name = createTextElement(
                    "span",
                    "",
                    `${item.quantity} × ${item.name}`
                );

                const price = createTextElement(
                    "strong",
                    "",
                    formatMoney(
                        Number(item.price) * Number(item.quantity)
                    )
                );

                row.append(name, price);
                itemsContainer.appendChild(row);
            });

            const footer = document.createElement("div");
            footer.className = "order-history-footer";

            footer.append(
                createTextElement("span", "", "Order Total"),
                createTextElement(
                    "strong",
                    "",
                    formatMoney(order.total)
                )
            );

            card.append(header, details, itemsContainer, footer);
            ordersList.appendChild(card);
        });

        totalOrdersDisplay.textContent = orders.length;
        totalSpentDisplay.textContent = formatMoney(totalSpent);
        totalMealsDisplay.textContent = totalMeals;
    }

    renderOrders();
});
