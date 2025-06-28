let initialFund = 0;
let activeIncome = 0;
let passiveIncome = 0;
let goalAmount = 0;
let goalDeadline = "";

// 🚀 1. 頁面載入時讀取本地資料與畫面初始化
async function loadData() {
  // 任務清單
  const taskRes = await fetch("data/tasks.json");
  const taskData = await taskRes.json();
  renderTasks(taskData);

  // 本地收入資料
  initialFund = Number(localStorage.getItem("initial")) || 0;
  activeIncome = Number(localStorage.getItem("active")) || 0;
  passiveIncome = Number(localStorage.getItem("passive")) || 0;

  // 本地目標資料
  goalAmount = Number(localStorage.getItem("goalAmount")) || 0;
  goalDeadline = localStorage.getItem("goalDeadline") || "";

  renderGoal();
  updateIncomeUI();
  updateProgress(goalAmount);
}

// 🎯 2. 設定目標金額與截止日期
function setGoal() {
  const amountInput = document.getElementById("goal-amount-input");
  const dateInput = document.getElementById("goal-deadline-input");

  const amount = Number(amountInput.value);
  const deadline = dateInput.value;

  if (amount > 0 && deadline) {
    goalAmount = amount;
    goalDeadline = deadline;

    localStorage.setItem("goalAmount", goalAmount);
    localStorage.setItem("goalDeadline", goalDeadline);

    renderGoal();
    updateIncomeUI();
    updateProgress(goalAmount);

    amountInput.value = "";
    dateInput.value = "";
  } else {
    alert("請輸入有效的金額與日期！");
  }
}

// 📊 3. 顯示目標與倒數天數
function renderGoal() {
  if (!goalAmount || !goalDeadline) return;

  document.getElementById("goal-amount").textContent = `NT$${goalAmount.toLocaleString()}`;

  const now = new Date();
  const end = new Date(goalDeadline);
  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  document.getElementById("days-left").textContent = `${daysLeft} 天`;
}

// 📝 4. 顯示任務清單（從 tasks.json 載入）
function renderTasks(tasks) {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${task.title}</strong><br>
                    ${task.description}<br>
                    🕒 到期日：${task.due}｜💰 價值 NT$${task.value.toLocaleString()}`;
    list.appendChild(li);
  });
}

// 🏁 5. 設定起始資金
function setInitial() {
  const input = document.getElementById("initial-fund");
  const amount = Number(input.value) || 0;

  if (amount >= 0) {
    initialFund = amount;
    localStorage.setItem("initial", initialFund);
    document.getElementById("initial-amount").textContent = `NT$${initialFund.toLocaleString()}`;
    updateIncomeUI();
    updateProgress(goalAmount);
    input.value = "";
  } else {
    alert("請輸入有效的金額！");
  }
}

// 💰 6. 新增主／被動收入
function addIncome() {
  const activeInput = document.getElementById("active-income");
  const passiveInput = document.getElementById("passive-income");

  const activeAmount = Number(activeInput.value) || 0;
  const passiveAmount = Number(passiveInput.value) || 0;

  activeIncome += activeAmount;
  passiveIncome += passiveAmount;

  localStorage.setItem("active", activeIncome);
  localStorage.setItem("passive", passiveIncome);

  updateIncomeUI();
  updateProgress(goalAmount);

  activeInput.value = "";
  passiveInput.value = "";
}

// 📈 7. 更新畫面上的收入與資產總額
function updateIncomeUI() {
  const earned = initialFund + activeIncome + passiveIncome;
  document.getElementById("initial-amount").textContent = `NT$${initialFund.toLocaleString()}`;
  document.getElementById("active-total").textContent = `NT$${activeIncome.toLocaleString()}`;
  document.getElementById("passive-total").textContent = `NT$${passiveIncome.toLocaleString()}`;
  document.getElementById("earned-total").textContent = `NT$${earned.toLocaleString()}`;
}

// 🔄 8. 更新進度條百分比
function updateProgress(goal) {
  const earned = initialFund + activeIncome + passiveIncome;
  const percent = Math.min(100, (earned / goal) * 100).toFixed(1);
  document.getElementById("progress-bar").style.width = `${percent}%`;
  document.getElementById("progress-percent").textContent = `${percent}%`;
}

loadData();
