// Not working yet version based on classses
class Transaction {
    constructor(title, amount, currency, transactionID) {
        this.title = title;
        this.amount = amount;
        this.currency = currency;
        this.transactionID = transactionID;
    }
}
class BalanceCalc {
    static Incomes(transactions) {
        return transactions
                .filter( el => el.amount>=0)
                .reduce((r,b)=> r + b.amount,0);
    }
    static Expences(transactions) {
        return transactions
                .filter((el)=> el.amount<0)
                .reduce((a,b)=> a + b.amount,0);
    }
    static Balance(transactions){
        return transactions.reduce((r,b)=> r + b.amount,0);
    };
}
class DOMOperator {
    static UpdateElement(DOMel, balanceEl) {
        document.querySelector(DOMel).textContent = `$${balanceEl.toFixed(2)}`;
    }
    static UpdateStatus(transactions) {
        DOMOperator.UpdateElement("#balance__status", BalanceCalc.Balance(transactions));
        DOMOperator.UpdateElement("#balance__Incomes", BalanceCalc.Incomes(transactions));
        DOMOperator.UpdateElement("#balance__Expences", BalanceCalc.Expences(transactions));
    }
    static CreateHistoryTransactionEl(transaction) {
        let historyTransaction = document.createElement("li");
        historyTransaction.classList.add("history__item");
        historyTransaction.id = `transaction_${transaction.transactionID}`;
    
        let historyTransactionDesc = document.createElement("div");
        historyTransactionDesc.classList.add("history__item-desc");
    
        let transactionTitle = document.createElement("p");
        transactionTitle.classList.add("history__item-title");
        transactionTitle.textContent= transaction.title;
    
        let transactionAmount = document.createElement("p");
        transactionAmount.classList.add("history__item-amount");
    
        let sign = "", displayColor = "";
        if(transaction.amount < 0) {
            displayColor = "red";
            sign = "-";
        }
        else {
            displayColor = "green";
            sign = "+";
        }
        transactionAmount.classList.add(`history__item-amount--color-${displayColor}`);
        transactionAmount.textContent= `${sign}${transaction.currency}${Math.abs(transaction.amount)}`;
    
        historyTransactionDesc.appendChild(transactionTitle);
        historyTransactionDesc.appendChild(transactionAmount);
        historyTransaction.appendChild(historyTransactionDesc);
        return historyTransaction;
    }
    static AddHistoryTransactionsToList(transactionsList) {
        transactionsList.forEach(transaction => {
            document.querySelector("#history__list")
                .appendChild(
                    DOMOperator.CreateHistoryTransactionEl(transaction)
                );
        });
    }
    static CreateDeleteBtns() {
        let btnsDiv = document.createElement("div");
        btnsDiv.classList.add("history__item-delBtns");
    
        let cancelBtn = document.createElement('input');
        cancelBtn.setAttribute("type","button");
        cancelBtn.setAttribute("value","Cancel");
        cancelBtn.classList.add("history__item-cancelDelBtn");
    
        let delBtn = document.createElement('input');
        delBtn.setAttribute("type","button");
        delBtn.setAttribute("value","Delete");
        delBtn.classList.add("history__item-DelBtn");
    
        cancelBtn.addEventListener('click', () => {
            btnsDiv.parentElement.removeChild(btnsDiv);
        });
    
        btnsDiv.appendChild(cancelBtn);
        btnsDiv.appendChild(delBtn);
        return btnsDiv;
    }
    static AddNewTransactionToList(transaction) {
        document.querySelector("#history__list")
            .appendChild(
                DOMOperator.CreateHistoryTransactionEl(transaction)
            );
    }
    static AskIfDeleteTrans(transactionItem) {
        let transactionID = transactionItem.id.substring(12);
        let delBtns = DOMOperator.CreateDeleteBtns();
        delBtns.childNodes[1].addEventListener('click', () => {
            DeleteTransaction(transactionID);
        });
        transactionItem.appendChild(delBtns);
    }
    static InitHistoryList() {
        const historyList = document.querySelector("#history__list")
        historyList.addEventListener('click', (e) => {
        let clickedElement = e.target;
        if(clickedElement.className == "history__item-desc" && 
            clickedElement.parentNode
                .querySelector(".history__item-delBtns") == null) {
                    DOMOperator.AskIfDeleteTrans(clickedElement.parentNode);
                } 
        });
    }
}
class ExpenseTracker {
    constructor() {
        this.transactions = [
            new Transaction("Payment", 500, "$", 1),
            new Transaction("Book", -50, "$", 2),
            new Transaction("ProteinBar", -10, "$",3)
        ];
    }
    static SendNewTransactionToServer(transaction) {
        console.log( transaction.title + " " + transaction.amount + " - new transaction sended to server");
        return {
            status : "success",
            transactionID : Math.round(Math.random() * 100)
        }
    }
    AddNewTransaction() {
        let TransactionTitle = document.getElementsByName("TransactionTitle")[0].value;
        let TransactionAmount = parseFloat(document.getElementsByName("TransactionAmount")[0].value);
        let transaction = new Transaction(TransactionTitle, TransactionAmount, "$", null);
        let result = ExpenceTracker.SendNewTransactionToServer(transaction);
        console.log(this.transactions);
        if(result.status == "success") {
            transaction.transactionID = result.transactionID;
            DOMOperator.AddNewTransactionToList(transaction);
            this.transactions.push(transaction);
            DOMOperator.UpdateStatus(this.transactions);
        }
        else {
            console.log("Transaction adding error");
        }  
    }
    SendDelRequestToServer(transactionID) {
        console.log(transactionID + " - deleted");
        return {
            status : "success"
        }
    }
    DeleteTransaction(transactionID) {
        let result = this.SendDelRequestToServer(transactionID);
        if(result.status == "success") {
            this.transactions =  this.transactions.filter((value) => {
                return value.transactionID != transactionID;
            });
            DOMOperator.UpdateStatus();
            let transaction = document.querySelector(`#transaction_${transactionID}`);
            transaction.parentNode.removeChild(transaction);
        }
    }
    InitApplication() {
        DOMOperator.UpdateStatus(this.transactions);
        DOMOperator.AddHistoryTransactionsToList(this.transactions);
        document.querySelector("#NewTransaction__btn")
            .addEventListener('click',this.AddNewTransaction);
        DOMOperator.InitHistoryList();
    }
}
const app = new ExpenseTracker();

app.InitApplication();