document.addEventListener("DOMContentLoaded", () => {
    const totalExpensesEl = document.getElementById("total-expenses");
    const recentTransactionsEl = document.getElementById("recent-transactions");
    const categoryChartEl = document.getElementById("categoryChart");

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Function to save transactions to localStorage
    function saveTransactions() {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    // Function to render transactions in the table
    function renderTransactions() {
        const transactionList = document.getElementById("transaction-list");
        transactionList.innerHTML = "";
        transactions.forEach((transaction, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${transaction.description}</td>
                <td>$${transaction.amount}</td>
                <td>${transaction.date}</td>
                <td>${transaction.category}</td>
                <td>
                    <button class="delete" onclick="deleteTransaction(${index})">Delete</button>
                </td>
            `;
            transactionList.appendChild(row);
        });
        updateDashboard();
    }

    // Function to update the dashboard
    function updateDashboard() {
        updateTotalExpenses();
        updateRecentTransactions();
        updateCategoryChart();
    }

    // Function to update total expenses
    function updateTotalExpenses() {
        const totalExpenses = transactions.reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
        totalExpensesEl.textContent = `$${totalExpenses.toFixed(2)}`;
    }

    // Function to update recent transactions (last 5)
    function updateRecentTransactions() {
        recentTransactionsEl.innerHTML = "";
        transactions.slice(-5).forEach(txn => {
            const li = document.createElement("li");
            li.textContent = `${txn.description} - $${txn.amount}`;
            recentTransactionsEl.appendChild(li);
        });
    }

    // Function to update the category breakdown pie chart
    function updateCategoryChart() {
        const categoryData = {};
        transactions.forEach(txn => {
            categoryData[txn.category] = (categoryData[txn.category] || 0) + parseFloat(txn.amount);
        });

        // Destroy existing chart if it exists
        if (window.categoryChart) {
            window.categoryChart.destroy();
        }

        // Create new chart
        const ctx = categoryChartEl.getContext("2d");
        window.categoryChart = new Chart(ctx, {
            type: "pie", // Use "pie" for a pie chart
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    label: "Expenses",
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
    }

    // Function to delete a transaction
    window.deleteTransaction = (index) => {
        if (confirm("Are you sure you want to delete this transaction?")) {
            transactions.splice(index, 1);
            saveTransactions();
            renderTransactions();
        }
    };

    // Function to handle form submission for adding a transaction
    const transactionForm = document.getElementById("transaction-form");
    if (transactionForm) {
        transactionForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const description = document.getElementById("description").value;
            const amount = document.getElementById("amount").value;
            const date = document.getElementById("date").value;
            const category = document.getElementById("category").value;

            if (!description || !amount || !date || !category) {
                alert("All fields are required!");
                return;
            }

            transactions.push({ description, amount, date, category });
            saveTransactions();
            renderTransactions();
            transactionForm.reset();
        });
    }

    // Initial render
    renderTransactions();
});