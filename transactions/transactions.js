document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("transaction-form");
    const transactionList = document.getElementById("transaction-list");
    const totalExpensesEl = document.getElementById("total-expenses");
    const recentTransactionsEl = document.getElementById("recent-transactions");
    const categoryChartEl = document.getElementById("categoryChart");

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Save transactions to local storage
    function saveTransactions() {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    // Render transactions in the table
    function renderTransactions() {
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
        updateDashboard(); // Update the dashboard whenever transactions are rendered
    }

    // Update the dashboard with total expenses, recent transactions, and category breakdown
    function updateDashboard() {
        let totalExpenses = 0;
        let categoryData = {};

        // Calculate total expenses and category breakdown
        transactions.forEach(txn => {
            totalExpenses += parseFloat(txn.amount);
            categoryData[txn.category] = (categoryData[txn.category] || 0) + parseFloat(txn.amount);
        });

        // Update total expenses
        totalExpensesEl.textContent = `$${totalExpenses.toFixed(2)}`;

        // Update recent transactions (last 5)
        recentTransactionsEl.innerHTML = "";
        transactions.slice(-5).forEach(txn => {
            const li = document.createElement("li");
            li.textContent = `${txn.description} - $${txn.amount}`;
            recentTransactionsEl.appendChild(li);
        });

        // Update the category breakdown chart
        updateCategoryChart(categoryData);
    }

    // Update the doughnut chart for category breakdown
    function updateCategoryChart(data) {
        if (window.categoryChart) {
            window.categoryChart.destroy(); // Destroy the existing chart if it exists
        }

        const ctx = categoryChartEl.getContext("2d");
        window.categoryChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: "Expenses",
                    data: Object.values(data),
                    backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"],
                }]
            }
        });
    }

    // Delete a transaction
    window.deleteTransaction = (index) => {
        transactions.splice(index, 1);
        saveTransactions();
        renderTransactions();
    };

    // Add a new transaction
    form.addEventListener("submit", (event) => {
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
        form.reset();
    });

    // Render transactions and update dashboard on page load
    renderTransactions();
});