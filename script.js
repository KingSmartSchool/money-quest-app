let initialFund = 0;
let activeIncome = 0;
let passiveIncome = 0;

// 載入目標與任務資料
async function loadData() {
  const goalRes = await fetch("data/goals.json");
  const taskRes = await fetch("data/tasks.json");

  const goalData = await goalRes.json();
  const taskData = await taskRes.json();

  renderGoal(goalData, taskData);
  renderTasks(taskData);

  // 載入本地儲存資料
  initialFund = Number(localStorage.getItem("initial")) || 0;
  activeIncome = Number(localStorage.getItem("active")) || 0;
  passiveIncome = Number(localStorage.getItem("passive")) || 0;

  updateIncomeUI();
  updateProgress(goalData.goal);
}

// 顯示目標與進度條
function renderGoal(goal, tasks) {
  document.getElementById("goal-amount").textContent = `NT$${goal.goal.toLocaleString()}`;

  const now = new Date();
  const end = new Date(goal.endDate);
  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  document.getElementById("days-left").textContent = `${daysLeft} 天`;
}

// 顯示任務清單
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

// 設定起始資金
function setInitial() {
  const input = document.getElementById("initial-fund");
  const amount = Number(input.value) || 0;

  if (amount >= 0) {
    initialFund = amount;
    localStorage.setItem("initial", initialFund);
    document.getElementById("initial-amount").textContent = `NT$${initialFund.toLocaleString()}`;
    updateIncomeUI();
    updateProgress(3000000); // 可改成 goalData.goal
    input.value = "";
  } else {
    alert("請輸入有效的金額！");
  }
}

// 新增收入
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
  updateProgress(3000000);

  activeInput.value = "";
  passiveInput.value = "";
}

// 更新金額總覽畫面
function updateIncomeUI() {
  const earned = initialFund + activeIncome + passiveIncome;
  document.getElementById("initial-amount").textContent = `NT$${initialFund.toLocaleString()}`;
  document.getElementById("active-total").textContent = `NT$${activeIncome.toLocaleString()}`;
  document.getElementById("passive-total").textContent = `NT$${passiveIncome.toLocaleString()}`;
  document.getElementById("earned-total").textContent = `NT$${earned.toLocaleString()}`;
}

// 更新進度條
funct
