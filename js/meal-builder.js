
// ==========================================
// CHOPSMART SMART MEAL BUILDER
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("meal-builder-form");

    if (!form) {
        return;
    }

    const budgetInput = document.getElementById("budget");
    const categoryInput = document.getElementById("builder-category");
    const priorityInput = document.getElementById("builder-priority");

    const resultsSection = document.getElementById("builder-results");
    const recommendationGrid = document.getElementById("recommendation-grid");
    const summary = document.getElementById("builder-summary");
    const emptyMessage = document.getElementById("builder-empty");
    const notification = document.getElementById("builder-notification");

    function formatMoney(amount) {
        return `GHS ${amount.toFixed(2)}`;
    }

    // Generate combinations of one or two different meals.
    function generateCombinations(availableMeals, budget) {

        const combinations = [];

        for (let i = 0; i < availableMeals.length; i++) {

            const firstMeal = availableMeals[i];

            if (firstMeal.price <= budget) {
                combinations.push({
                    items: [firstMeal],
                    total: firstMeal.price
                });
            }

            for (let j = i + 1; j < availableMeals.length; j++) {

                const secondMeal = availableMeals[j];
                const total = firstMeal.price + secondMeal.price;

                if (total <= budget) {
                    combinations.push({
                        items: [firstMeal, secondMeal],
                        total: total
                    });
                }
            }
        }

        return combinations;
    }

    // Sort combinations according to student preference.
    function rankCombinations(combinations, priority) {

        if (priority === "save") {

            combinations.sort(function (a, b) {
                return a.total - b.total;
            });

        } else if (priority === "variety") {

            combinations.sort(function (a, b) {

                if (a.items.length !== b.items.length) {
                    return b.items.length - a.items.length;
                }

                const aCategories =
                    new Set(a.items.map(item => item.category)).size;

                const bCategories =
                    new Set(b.items.map(item => item.category)).size;

                if (aCategories !== bCategories) {
                    return bCategories - aCategories;
                }

                return b.total - a.total;
            });

        } else {

            combinations.sort(function (a, b) {
                return b.total - a.total;
            });
        }

        return combinations;
    }

    // Create recommendation cards.
    function displayRecommendations(combinations, budget) {

        recommendationGrid.innerHTML = "";

        const topRecommendations = combinations.slice(0, 6);

        emptyMessage.hidden = topRecommendations.length !== 0;

        topRecommendations.forEach(function (combination, index) {

            const remaining = budget - combination.total;

            const card = document.createElement("article");
            card.className = "recommendation-card";

            const badge = document.createElement("span");
            badge.className = "recommendation-badge";
            badge.textContent = `OPTION ${index + 1}`;

            const heading = document.createElement("h3");
            heading.textContent =
                combination.items.length === 1
                    ? "Single Meal Pick"
                    : "Meal Combination";

            const itemsList = document.createElement("div");
            itemsList.className = "recommendation-items";

            combination.items.forEach(function (meal) {

                const row = document.createElement("div");
                row.className = "recommendation-item";

                const name = document.createElement("span");
                name.textContent = `${meal.emoji} ${meal.name}`;

                const price = document.createElement("strong");
                price.textContent = formatMoney(meal.price);

                row.append(name, price);
                itemsList.appendChild(row);
            });

            const totalRow = document.createElement("div");
            totalRow.className = "recommendation-total";

            const totalLabel = document.createElement("span");
            totalLabel.textContent = "Total cost";

            const totalValue = document.createElement("strong");
            totalValue.textContent = formatMoney(combination.total);

            totalRow.append(totalLabel, totalValue);

            const remainingRow = document.createElement("div");
            remainingRow.className = "recommendation-remaining";

            const remainingLabel = document.createElement("span");
            remainingLabel.textContent = "Money left";

            const remainingValue = document.createElement("strong");
            remainingValue.textContent = formatMoney(remaining);

            remainingRow.append(remainingLabel, remainingValue);

            const addButton = document.createElement("button");
            addButton.type = "button";
            addButton.className = "btn btn-primary recommendation-button";
            addButton.textContent = "Add Combination to Cart";

            addButton.addEventListener("click", function () {

                combination.items.forEach(function (meal) {
                    addToCart(meal.id);
                });

                notification.textContent =
                    "Your recommended meals were added to the cart!";

                notification.classList.add("visible");

                addButton.textContent = "✓ Added to Cart";

                setTimeout(function () {
                    addButton.textContent = "Add Combination to Cart";
                }, 1500);
            });

            card.append(
                badge,
                heading,
                itemsList,
                totalRow,
                remainingRow,
                addButton
            );

            recommendationGrid.appendChild(card);
        });
    }

    // Process student input.
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const budget = Number(budgetInput.value);
        const category = categoryInput.value;
        const priority = priorityInput.value;

        if (!Number.isFinite(budget) || budget <= 0) {
            alert("Please enter a valid budget greater than zero.");
            return;
        }

        const availableMeals = meals.filter(function (meal) {
            return category === "all" || meal.category === category;
        });

        const combinations = generateCombinations(
            availableMeals,
            budget
        );

        rankCombinations(combinations, priority);

        summary.textContent =
            `Your budget: ${formatMoney(budget)} | ` +
            `${combinations.length} affordable option(s) found`;

        resultsSection.hidden = false;

        displayRecommendations(combinations, budget);

        resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});
