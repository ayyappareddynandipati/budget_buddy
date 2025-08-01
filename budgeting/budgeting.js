document.addEventListener("DOMContentLoaded", () => {
    const budgetForm = document.getElementById("budget-form");
    const budgetList = document.getElementById("budget-list");
    const insightsEl = document.getElementById("spending-insights");

    // Load budgets and transactions from localStorage
    let budgets = JSON.parse(localStorage.getItem("budgets")) || {};
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    console.log("Initial Budgets:", budgets); // Debug log
    console.log("Initial Transactions:", transactions); // Debug log

    // Save budgets to localStorage
    function saveBudgets() {
        localStorage.setItem("budgets", JSON.stringify(budgets));
    }

    // Render budgets in the table
    function renderBudgets() {
        console.log("Rendering Budgets..."); // Debug log
        budgetList.innerHTML = "";
        Object.keys(budgets).forEach((month) => {
            Object.keys(budgets[month]).forEach((category) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${month}</td>
                    <td>${category}</td>
                    <td>$${budgets[month][category].toFixed(2)}</td>
                    <td><button onclick="deleteBudget('${month}', '${category}')">Delete</button></td>
                `;
                budgetList.appendChild(row);
            });
        });
        updateInsights();
    }

    // Update spending insights
    function updateInsights() {
        console.log("Updating Insights..."); // Debug log
        insightsEl.innerHTML = "";
        let spendingData = {};

        // Calculate total spending per category for the selected month
        const selectedMonth = document.getElementById("budget-month").value;
        transactions.forEach((txn) => {
            const txnMonth = new Date(txn.date).toLocaleString('default', { month: 'long' });
            if (txnMonth === selectedMonth) {
                if (!spendingData[txn.category]) {
                    spendingData[txn.category] = 0;
                }
                spendingData[txn.category] += parseFloat(txn.amount);
            }
        });

        // Display insights for each budget in the selected month
        if (budgets[selectedMonth]) {
            Object.keys(budgets[selectedMonth]).forEach((category) => {
                const budgetLimit = budgets[selectedMonth][category];
                const spent = spendingData[category] || 0;
                const remaining = budgetLimit - spent;
                const percentageUsed = (spent / budgetLimit) * 100;

                // Determine budget status
                let status = "✅ Within Budget";
                let statusClass = "within-budget";
                if (remaining < 0) {
                    status = "⚠ Over Budget!";
                    statusClass = "over-budget";
                } else if (percentageUsed >= 80) {
                    status = "⚠ Close to Limit";
                    statusClass = "close-to-limit";
                }

                // Create insight element
                const insightDiv = document.createElement("div");
                insightDiv.classList.add("insight");
                insightDiv.innerHTML = `
                    <strong>${category}</strong>: 
                    <div class="progress-bar">
                        <div class="progress" style="width: ${Math.min(percentageUsed, 100)}%;"></div>
                    </div>
                    <div class="budget-details">
                        Spent: $${spent.toFixed(2)} / Budget: $${budgetLimit.toFixed(2)} <br>
                        Remaining: $${remaining.toFixed(2)} <br>
                        <span class="${statusClass}">${status}</span>
                    </div>
                `;
                insightsEl.appendChild(insightDiv);
            });
        }
    }

    // Delete a budget
    window.deleteBudget = (month, category) => {
        if (confirm(`Are you sure you want to delete the budget for ${category} in ${month}?`)) {
            delete budgets[month][category];
            if (Object.keys(budgets[month]).length === 0) {
                delete budgets[month];
            }
            saveBudgets();
            renderBudgets();
        }
    };

    // Handle budget form submission
    budgetForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const month = document.getElementById("budget-month").value;
        const category = document.getElementById("budget-category").value;
        const amount = parseFloat(document.getElementById("budget-amount").value);

        console.log("Form Data:", { month, category, amount }); // Debug log

        // Validate inputs
        if (!month || !category || isNaN(amount)) {
            alert("Please fill out all fields correctly.");
            return;
        }
        if (amount <= 0) {
            alert("Budget amount must be greater than 0.");
            return;
        }

        // Initialize month if it doesn't exist
        if (!budgets[month]) {
            budgets[month] = {};
        }

        // Add or update budget
        budgets[month][category] = amount;
        console.log("Updated Budgets:", budgets); // Debug log
        saveBudgets();
        renderBudgets();
        budgetForm.reset();
    });

    // Initial render
    renderBudgets();
});