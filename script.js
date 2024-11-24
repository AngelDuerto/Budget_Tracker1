class Budget{
    constructor() {
        this.incomes = [];
        this.expenses = [];
    }

    addTransaction(type, date, description, amount) {
        const transaction = { date, description, amount};
        if (type === "income") {
            this.incomes.push(transaction);
        } else if (type === "expense") {
            this.expenses.push(transaction);
        }
    }

    calculateTotals() {
        const totalIncome = this.incomes.reduce((sum, income) => sum + income.amount, 0);
        const totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        return {
            totalIncome,
            totalExpenses,
            totalBudget: totalIncome - totalExpenses,
        };
    }

    getTransactions(){
        return [
            ...this.incomes.map((income) => ({ ...income, type: "Income" })),
            ...this.expenses.map((expense) => ({ ...expense, type: "Expense"})),
        ];
    }
}

const budget = new Budget();

document.getElementById("submitTrns").addEventListener("click", () => {
    const date = document.getElementById("date").value.trim();
    const description = document.getElementById("description").value.trim();
    const type = document.getElementById("type").value;
    const amount = parseFloat(document.getElementById("amount").value);

    if (!date || !description || !type || isNaN(amount) || amount <= 0) {
        alert("Make sure all fields are filled out with valid information.");
        return;
    }

    budget.addTransaction(type, date, description, amount);
    updateUI()
    document.getElementById("budgetForm").reset();
});

function updateUI(){
    const { totalIncome, totalExpenses, totalBudget } = budget.calculateTotals();
    const transactionList = budget.getTransactions()
    .map(
    (transaction, index) => `
        <tr>
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td>${transaction.type}</td>
            <td>${transaction.amount.toFixed(2)}</td>
            <td>
                <button class="deleteBtn" data-type="${transaction.type.toLowerCase()}" data-index="${index}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `
    )
    .join("");

    document.getElementById("trnsList").innerHTML = transactionList;
    document.getElementById("totalIncome").textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById("totalExpenses").textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById("totalBudget").textContent = `$${totalBudget.toFixed(2)}`;

    document.querySelectorAll(".deleteBtn").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            const {type, index } = event.target.closest("button").dataset;
            deleteTrns(type, index);
        });
    });
}   
function deleteTrns(type, index) {
    if (type === "income") {
        budget.incomes.splice(index, 1);
    } else if (type === "expense") {
        budget.expenses.splice(index, 1);
    }
    updateUI();
}