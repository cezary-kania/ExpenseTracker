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
                .filter( el => parseInt(el.amount)>=0)
                .reduce((r,b)=> r + parseInt(b.amount),0);
    }
    static Expences(transactions) {
        return transactions
                .filter((el)=> parseInt(el.amount)<0)
                .reduce((a,b)=> a + parseInt(b.amount),0);
    }
    static Balance(transactions){
        return transactions.reduce((r,b)=> r + parseInt(b.amount),0);
    };
}
function UpdateElement(DOMel, balanceEl) {
    document.querySelector(DOMel).textContent = `$${balanceEl.toFixed(2)}`;
}
function UpdateStatus() {
    UpdateElement("#balance__status", BalanceCalc.Balance(transactions));
    UpdateElement("#balance__Incomes", BalanceCalc.Incomes(transactions));
    UpdateElement("#balance__Expences", BalanceCalc.Expences(transactions));
}
function CreateHistoryItem(item) {
    let historyItem = document.createElement("li");
    historyItem.classList.add("history__item");
    historyItem.id = `transaction_${item.transactionID}`;

    let historyItemDesc = document.createElement("div");
    historyItemDesc.classList.add("history__item-desc");

    let itemTitle = document.createElement("p");
    itemTitle.classList.add("history__item-title");
    itemTitle.textContent= item.title;

    let itemAmount = document.createElement("p");
    itemAmount.classList.add("history__item-amount");

    let sign = "", displayColor = "";
    if(item.amount < 0) {
        displayColor = "red";
        sign = "-";
    }
    else {
        displayColor = "green";
        sign = "+";
    }
    itemAmount.classList.add(`history__item-amount--color-${displayColor}`);
    itemAmount.textContent= `${sign}${item.currency}${Math.abs(item.amount)}`;

    historyItemDesc.appendChild(itemTitle);
    historyItemDesc.appendChild(itemAmount);
    historyItem.appendChild(historyItemDesc);
    return historyItem;
}
function AddHistoryItemsToList(itemsList) {
    itemsList.forEach(item => {
        document.querySelector("#history__list")
            .appendChild(
                CreateHistoryItem(item)
            );
    });
}
function SendNewTransactionToServer(transaction) {
    console.log( transaction.title + " " + transaction.amount + " - new transaction sended to server");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/", false);
    var data = new FormData();
    data.append('title', transaction.title);
    data.append('amount', transaction.amount);
    data.append('currency', transaction.currency);
    xhr.send(data);
    return xhr;
}
function LoadTransactionsFromServer(user_id) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `http://127.0.0.1:5000/?user_id=${user_id}`, false);
    xhr.send();
    return JSON.parse(xhr.response);
}
function AddNewTransaction() {
    let TransactionTitle = document.getElementsByName("TransactionTitle")[0].value;
    let TransactionAmount = parseFloat(document.getElementsByName("TransactionAmount")[0].value);
    if(isNaN(TransactionAmount)) TransactionAmount = 0;
    if(TransactionTitle == "") TransactionTitle = "Empty Title";
    let transaction = new Transaction(TransactionTitle, TransactionAmount, "$",null);
    let res = SendNewTransactionToServer(transaction);
    if(res.status == 200) {
        let result = JSON.parse(res.response);
        transaction.transactionID = result.transactionID;
        document.querySelector("#history__list")
            .appendChild(
                CreateHistoryItem(transaction)
            );
        transactions.push(transaction);
        UpdateStatus();
    }
    else {
        console.log("Transaction adding error");
    }  
}
function SendDelRequestToServer(transactionID) {
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `http://127.0.0.1:5000/${transactionID}`, false);
    xhr.send();
    console.log(transactionID + " - deleted");
    return xhr.status;
}
function DeleteTransaction(transactionID) {
    let result = SendDelRequestToServer(transactionID);
    if(result == 204) {
        transactions = transactions.filter((value) => {
            return value.transactionID != transactionID;
        });
        UpdateStatus();
        let transaction = document.querySelector(`#transaction_${transactionID}`);
        transaction.parentNode.removeChild(transaction);
    }
}
function CreateDeleteBtns() {
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
function AskIfDeleteTrans(transactionItem) {
    let transactionID = transactionItem.id.substring(12);
    let delBtns = CreateDeleteBtns();
    delBtns.childNodes[1].addEventListener('click', () => {
        DeleteTransaction(transactionID);
    });
    transactionItem.appendChild(delBtns);
}
function InitHistoryList(transactions) {
    AddHistoryItemsToList(transactions);
    const historyList = document.querySelector("#history__list");
    historyList.addEventListener('click', (e) => {
    let clickedElement = e.target;
    if(clickedElement.className == "history__item-desc" && 
        clickedElement.parentNode
            .querySelector(".history__item-delBtns") == null) {
                AskIfDeleteTrans(clickedElement.parentNode);
            } 
    });
}
function InitAddBtn() {
    document.querySelector("#NewTransaction__btn")
            .addEventListener('click',AddNewTransaction);
}

let transactions = LoadTransactionsFromServer(1);
UpdateStatus();
InitHistoryList(transactions);
InitAddBtn();