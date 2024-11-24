// Budget class to manage incomes, expenses, and transactions
class Budget{
    constructor() {
        // Arrays to store income and expense transactions
        this.incomes = [];
        this.expenses = [];
    }
    // Method to add a transaction (income/expense)
    addTransaction(type, date, description, amount) {
        const transaction = { date, description, amount}; // Transaction object

        // Determine if the transaction is income or expense, and add it to the respective array
        if (type === "income") {
            this.incomes.push(transaction);
        } else if (type === "expense") {
            this.expenses.push(transaction);
        }
    }

    // Method to calculate total income, expenses, and remaining budget
    calculateTotals() {
        const totalIncome = this.incomes.reduce((sum, income) => sum + income.amount, 0); // Sum of incomes
        const totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0); // Sum of expenses
        // Return an object with the calculated totals
        return {
            totalIncome,
            totalExpenses,
            totalBudget: totalIncome - totalExpenses,
        };
    }
    // Method to get all transactions with type information
    getTransactions(){
        return [
            ...this.incomes.map((income) => ({ ...income, type: "Income" })),
            ...this.expenses.map((expense) => ({ ...expense, type: "Expense"})),
        ];
    }
}
// Create a new instance of the Budget class
const budget = new Budget();

// Add event listener to the form submission button
document.getElementById("submitTrns").addEventListener("click", () => {
    // Get input values from the form
    const date = document.getElementById("date").value.trim(); // Date input
    const description = document.getElementById("description").value.trim();  // Description input
    const type = document.getElementById("type").value; // Transaction type (income/expense)
    const amount = parseFloat(document.getElementById("amount").value);  // Amount input

    // Validate input fields
    if (!date || !description || !type || isNaN(amount) || amount <= 0) {
        alert("Make sure all fields are filled out with valid information."); // Show alert if validation fails
        return;
    }

    // Add the transaction to the budget
    budget.addTransaction(type, date, description, amount);
    updateUI() // Update the UI to reflect changes
    document.getElementById("budgetForm").reset(); // Reset the form inputs
});

// Function to update the user interface with current transactions and totals
function updateUI(){
    // Calculate totals from the Budget class
    const { totalIncome, totalExpenses, totalBudget } = budget.calculateTotals();
    // Generate HTML for the transactions table
    const transactionList = budget.getTransactions()
    .map(
    (transaction, index) => `
        <tr>
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td>${transaction.type}</td>
            <td>${transaction.amount.toFixed(2)}</td>
            <td>
                <!-- Button to delete a transaction -->
                <button class="deleteBtn" data-type="${transaction.type.toLowerCase()}" data-index="${index}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `
    )
    .join(""); // Join all rows into a single string

    // Update the transaction table in the DOM
    document.getElementById("trnsList").innerHTML = transactionList;
    // Update totals in the DOM
    document.getElementById("totalIncome").textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById("totalExpenses").textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById("totalBudget").textContent = `$${totalBudget.toFixed(2)}`;

    // Add event listeners to delete buttons
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
        btn.addEventListener("click", (event) => {
             // Get type and index from button's dataset
            const {type, index } = event.target.closest("button").dataset;
            deleteTrns(type, index); // Call delete function
        });
    });
}   

// Function to delete a transaction by type and index
function deleteTrns(type, index) {
     // Remove transaction from the appropriate array
    if (type === "income") {
        budget.incomes.splice(index, 1);
    } else if (type === "expense") {
        budget.expenses.splice(index, 1);
    }
    updateUI(); // Update the UI after deletion
}