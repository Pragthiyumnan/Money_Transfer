import icon from '../icon.png';

let HomeNav = () => {

  window.onload = () => {
    
  const account1 = {
    owner: "Jonas Schmedtmann",
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  
    movementsDates: [
      "2019-11-18T21:31:17.178Z",
      "2019-12-23T07:42:02.383Z",
      "2020-01-28T09:15:04.904Z",
      "2020-04-01T10:17:24.185Z",
      "2020-05-08T14:11:59.604Z",
      "2020-07-26T17:01:17.194Z",
      "2020-07-28T23:36:17.929Z",
      "2020-08-01T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "pt-PT", // de-DE
  };
  
  const account2 = {
    owner: "Jessica Davis",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  
    movementsDates: [
      "2019-11-01T13:15:33.035Z",
      "2019-11-30T09:48:16.867Z",
      "2019-12-25T06:04:23.907Z",
      "2020-01-25T14:18:46.235Z",
      "2020-02-05T16:33:06.386Z",
      "2020-04-10T14:43:26.374Z",
      "2020-06-25T18:49:59.371Z",
      "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
  };
  
  const accounts = [account1, account2];
  
  /////////////////////////////////////////////////
  // Elements
  const labelWelcome = document.querySelector(".welcome");
  const labelDate = document.querySelector(".date");
  const labelBalance = document.querySelector(".balance__value");
  const labelSumIn = document.querySelector(".summary__value--in");
  const labelSumOut = document.querySelector(".summary__value--out");
  const labelSumInterest = document.querySelector(".summary__value--interest");
  const labelTimer = document.querySelector(".timer");
  
  const containerApp = document.querySelector(".app");
  const containerMovements = document.querySelector(".movements");
  
  const btnLogin = document.querySelector(".login__btn");
  const btnTransfer = document.querySelector(".form__btn--transfer");
  const btnLoan = document.querySelector(".form__btn--loan");
  const btnClose = document.querySelector(".form__btn--close");
  const btnSort = document.querySelector(".btn--sort");
  
  const inputLoginUsername = document.querySelector(".login__input--user");
  const inputLoginPin = document.querySelector(".login__input--pin");
  const inputTransferTo = document.querySelector(".form__input--to");
  const inputTransferAmount = document.querySelector(".form__input--amount");
  const inputLoanAmount = document.querySelector(".form__input--loan-amount");
  const inputCloseUsername = document.querySelector(".form__input--user");
  const inputClosePin = document.querySelector(".form__input--pin");
  
  /////////////////////////////////////////////////
  // Functions
  
  const formatMovementDate = function (date, locale) {
    const calcDaysPassed = (date1, date2) =>
      Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  
    const daysPassed = calcDaysPassed(new Date(), date);
    console.log(daysPassed);
  
    if (daysPassed === 0) return "Today";
    if (daysPassed === 1) return "Yesterday";
    if (daysPassed <= 7) return `${daysPassed} days ago`;
  
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  };
  
  const formatCur = function (value, locale, currency) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(value);
  };
  
  const displayMovements = function (acc, sort = false) {
    containerMovements.innerHTML = "";
  
    const movs = sort
      ? acc.movements.slice().sort((a, b) => a - b)
      : acc.movements;
  
    movs.forEach(function (mov, i) {
      const type = mov > 0 ? "deposit" : "withdrawal";
  
      const date = new Date(acc.movementsDates[i]);
      const displayDate = formatMovementDate(date, acc.locale);
  
      const formattedMov = formatCur(mov, acc.locale, acc.currency);
  
      const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
        i + 1
      } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
      `;
  
      containerMovements.insertAdjacentHTML("afterbegin", html);
    });
  };
  
  const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
  };
  
  const calcDisplaySummary = function (acc) {
    const incomes = acc.movements
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  
    const out = acc.movements
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);
  
    const interest = acc.movements
      .filter((mov) => mov > 0)
      .map((deposit) => (deposit * acc.interestRate) / 100)
      .filter((int, i, arr) => {
        // console.log(arr);
        return int >= 1;
      })
      .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
  };
  
  const createUsernames = function (accs) {
    accs.forEach(function (acc) {
      acc.username = acc.owner
        .toLowerCase()
        .split(" ")
        .map((name) => name[0])
        .join("");
    });
  };
  createUsernames(accounts);
  
  const updateUI = function (acc) {
    // Display movements
    displayMovements(acc);
  
    // Display balance
    calcDisplayBalance(acc);
  
    // Display summary
    calcDisplaySummary(acc);
  };
  
  const startLogOutTimer = function () {
    const tick = function () {
      const min = String(Math.trunc(time / 60)).padStart(2, 0);
      const sec = String(time % 60).padStart(2, 0);
  
      // In each call, print the remaining time to UI
      labelTimer.textContent = `${min}:${sec}`;
  
      // When 0 seconds, stop timer and log out user
      if (time === 0) {
        clearInterval(timer);
        labelWelcome.textContent = "Log in to get started";
        containerApp.style.opacity = 0;
      }
  
      // Decrease 1s
      time--;
    };
  
    // Set time to 5 minutes
    let time = 120;
  
    // Call the timer every second
    tick();
    const timer = setInterval(tick, 1000);
  
    return timer;
  };
  
  ///////////////////////////////////////
  // Event handlers
  let currentAccount, timer;
  
  btnLogin.addEventListener("click", function (e) {
    // Prevent form from submitting
    e.preventDefault();
  
    currentAccount = accounts.find(
      (acc) => acc.username === inputLoginUsername.value
    );
    console.log(currentAccount);
  
    if (currentAccount?.pin === +inputLoginPin.value) {
      // Display UI and message
      labelWelcome.textContent = `Welcome back, ${
        currentAccount.owner.split(" ")[0]
      }`;
      containerApp.style.opacity = 100;
  
      // Create current date and time
      const now = new Date();
      const options = {
        hour: "numeric",
        minute: "numeric",
        day: "numeric",
        month: "numeric",
        year: "numeric",
      };
  
      labelDate.textContent = new Intl.DateTimeFormat(
        currentAccount.locale,
        options
      ).format(now);
  
      // Clear input fields
      inputLoginUsername.value = inputLoginPin.value = "";
      inputLoginPin.blur();
  
      // Timer
      if (timer) clearInterval(timer);
      timer = startLogOutTimer();
  
      // Update UI
      updateUI(currentAccount);
    }
  });
  
  btnTransfer.addEventListener("click", function (e) {
    e.preventDefault();
    const amount = +inputTransferAmount.value;
    const receiverAcc = accounts.find(
      (acc) => acc.username === inputTransferTo.value
    );
    inputTransferAmount.value = inputTransferTo.value = "";
  
    if (
      amount > 0 &&
      receiverAcc &&
      currentAccount.balance >= amount &&
      receiverAcc?.username !== currentAccount.username
    ) {
      // Doing the transfer
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);
  
      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());
  
      // Update UI
      updateUI(currentAccount);
  
      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }
  });
  
  btnLoan.addEventListener("click", function (e) {
    e.preventDefault();
  
    const amount = Math.floor(inputLoanAmount.value);
  
    if (
      amount > 0 &&
      currentAccount.movements.some((mov) => mov >= amount * 0.1)
    ) {
      setTimeout(function () {
        // Add movement
        currentAccount.movements.push(amount);
  
        // Add loan date
        currentAccount.movementsDates.push(new Date().toISOString());
  
        // Update UI
        updateUI(currentAccount);
  
        // Reset timer
        clearInterval(timer);
        timer = startLogOutTimer();
      }, 2500);
    }
    inputLoanAmount.value = "";
  });
  
  btnClose.addEventListener("click", function (e) {
    e.preventDefault();
  
    if (
      inputCloseUsername.value === currentAccount.username &&
      +inputClosePin.value === currentAccount.pin
    ) {
      const index = accounts.findIndex(
        (acc) => acc.username === currentAccount.username
      );
      console.log(index);
      // .indexOf(23)
  
      // Delete account
      accounts.splice(index, 1);
  
      // Hide UI
      containerApp.style.opacity = 0;
    }
  
    inputCloseUsername.value = inputClosePin.value = "";
  });
  
  let sorted = false;
  btnSort.addEventListener("click", function (e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
  });
};
  
  return(
   <div>
    <nav>
        <p class="welcome">Log in to get started</p>
        <img src={icon} class="logo" alt="" />
        <form class="login">
          <input
            type="text"
            placeholder="user"
            class="login__input login__input--user"
          />
          <input
            type="text"
            placeholder="PIN"
            maxlength="4"
            class="login__input login__input--pin"
          />
          <button class="login__btn">&rarr;</button>
        </form>
     </nav>
     <main class="app">      
          <div class="balance">
            <div>
              <p class="balance__label">Current balance</p>
              <p class="balance__date">
                As of <span class="date">05/03/2037</span>
              </p>
            </div>
            <p class="balance__value">0000€</p>
          </div>
          <div class="movements">
           <div class="movements__row">
             <div class="movements__type movements__type--deposit">2 deposit</div>
             <div class="movements__date">3 days ago</div>
             <div class="movements__value">4 000€</div>
           </div>
           <div class="movements__row">
             <div class="movements__type movements__type--withdrawal">
               1 withdrawal
             </div>
             <div class="movements__date">24/01/2037</div>
             <div class="movements__value">-378€</div>
           </div>
         </div>
    
      <div class="summary">
        <p class="summary__label">In</p>
        <p class="summary__value summary__value--in">0000€</p>
        <p class="summary__label">Out</p>
        <p class="summary__value summary__value--out">0000€</p>
        <p class="summary__label">Interest</p>
        <p class="summary__value summary__value--interest">0000€</p>
        <button class="btn--sort">&downarrow; SORT</button>
      </div>


      <div class="operation operation--transfer">
        <h2>Transfer money</h2>
        <form class="form form--transfer">
          <input type="text" class="form__input form__input--to" />
          <input type="number" class="form__input form__input--amount" />
          <button class="form__btn form__btn--transfer">&rarr;</button>
          <label class="form__label">Transfer to</label>
          <label class="form__label">Amount</label>
        </form>
      </div>

      
      <div class="operation operation--loan">
        <h2>Request loan</h2>
        <form class="form form--loan">
          <input type="number" class="form__input form__input--loan-amount" />
          <button class="form__btn form__btn--loan">&rarr;</button>
          <label class="form__label form__label--loan">Amount</label>
        </form>
      </div>

      <div class="operation operation--close">
        <h2>Close account</h2>
        <form class="form form--close">
          <input type="text" class="form__input form__input--user" />
          <input
            type="password"
            maxlength="4"
            class="form__input form__input--pin"
          />
          <button class="form__btn form__btn--close">&rarr;</button>
          <label class="form__label">Confirm user</label>
          <label class="form__label">Confirm PIN</label>
        </form>
      </div>

      <p class="logout-timer">
        You will be logged out in <span class="timer">05:00</span>
      </p>
    </main>
     </div>
  )
};

export default HomeNav;