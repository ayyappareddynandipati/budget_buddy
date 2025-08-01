document.addEventListener("DOMContentLoaded", () => {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const budgets = JSON.parse(localStorage.getItem("budgets")) || {};

    // Monthly Expenses Bar Chart
    const monthlyExpensesCtx = document.getElementById("monthlyExpensesChart").getContext("2d");
    const monthlyData = getMonthlyExpenses(transactions);
    new Chart(monthlyExpensesCtx, {
        type: "bar",
        data: {
            labels: Object.keys(monthlyData),
            datasets: [{
                label: "Monthly Expenses",
                data: Object.values(monthlyData),
                backgroundColor: "#36a2eb",
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Monthly Expenses",
                },
            },
        },
    });

    // Category-Wise Spending Pie Chart
    const categoryCtx = document.getElementById("categoryChart").getContext("2d");
    const categoryData = getCategorySpending(transactions);
    new Chart(categoryCtx, {
        type: "pie",
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                label: "Category-Wise Spending",
                data: Object.values(categoryData),
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Category-Wise Spending",
                },
            },
        },
    });

    // Budget vs Actual Comparison Chart
    const budgetVsActualCtx = document.getElementById("budgetVsActualChart").getContext("2d");
    const comparisonData = getBudgetVsActual(transactions, budgets);
    new Chart(budgetVsActualCtx, {
        type: "bar",
        data: {
            labels: Object.keys(comparisonData),
            datasets: [{
                    label: "Budget",
                    data: Object.values(comparisonData).map(data => data.budget),
                    backgroundColor: "#4bc0c0",
                },
                {
                    label: "Actual",
                    data: Object.values(comparisonData).map(data => data.actual),
                    backgroundColor: "#ff6384",
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Budget vs Actual",
                },
            },
        },
    });

    // Helper Functions
    function getMonthlyExpenses(transactions) {
        const monthlyData = {};
        transactions.forEach(txn => {
            const month = new Date(txn.date).toLocaleString('default', { month: 'long' });
            monthlyData[month] = (monthlyData[month] || 0) + parseFloat(txn.amount);
        });
        return monthlyData;
    }

    function getCategorySpending(transactions) {
        const categoryData = {};
        transactions.forEach(txn => {
            categoryData[txn.category] = (categoryData[txn.category] || 0) + parseFloat(txn.amount);
        });
        return categoryData;
    }

    function getBudgetVsActual(transactions, budgets) {
        const comparisonData = {};
        transactions.forEach(txn => {
            const month = new Date(txn.date).toLocaleString('default', { month: 'long' });
            if (!comparisonData[month]) {
                comparisonData[month] = { budget: 0, actual: 0 };
            }
            comparisonData[month].actual += parseFloat(txn.amount);
        });
        Object.keys(budgets).forEach(month => {
            if (!comparisonData[month]) {
                comparisonData[month] = { budget: 0, actual: 0 };
            }
            comparisonData[month].budget = Object.values(budgets[month]).reduce((sum, amount) => sum + amount, 0);
        });
        return comparisonData;
    }
});