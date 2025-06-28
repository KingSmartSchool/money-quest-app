// 初始變數
let startAmount = 0;
let goalAmount = 0;
let goalDate = null;
let activeIncome = 0;
let passiveIncome = 0;
let activeIncomeHistory = []; // 儲存主動收入紀錄

// 更新畫面上所有統計資料
function updateDisplay() {
  const currentTotal = startAmount + activeIncome + passiveIncome;
  document.getElementById("startAmountDisplay").textContent = `NT$${startAmount.toLocaleString()}`;
  document.getElementById("goalAmount").textContent = `NT$${goalAmount.toLocaleString()}`;
  document.getElementById("activeIncome").textContent = `NT$${activeIncome.toLocaleString()}`;
  document.getElementById("passiveIncome").textContent = `NT$${passiveIncome.toLocaleString()}`;
  document.getElementById("currentTotal").textContent = `NT$${currentTotal.toLocaleString()}`;

  // 更新進度條
  let progress = goalAmount ? Math.min((currentTotal / goalAmount) * 100, 100) : 0;
  document.getElementById("progressFill").style.width = `${progress}%`;
  document.getElementById("progressPercent").textContent = `${progress.toFixed(1)}%`;

  // 更新剩餘天數
  if (goalDate) {
    const today = new Date();
    const end = new Date(goalDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById("remainingDays").textContent = `${diffDays} 天`;
  }
  
  // 更新收入歷史
  updateHistoryList();
}

// 設定起始資金
function setStartAmount() {
  const input = document.getElementById("startAmountInput").value;
  startAmount = parseInt(input) || 0;
  updateDisplay();
}

// 設定目標
function setGoal() {
  const inputAmount = document.getElementById("goalInput").value;
  const inputDate = document.getElementById("goalDateInput").value;

  goalAmount = parseInt(inputAmount) || 0;
  goalDate = inputDate;
  updateDisplay();
}

// 新增主動收入
function addActiveIncome() {
  const input = document.getElementById("activeInput").value;
  const amount = parseInt(input) || 0;
  if (amount > 0) {
    activeIncome += amount;
    // 新增收入紀錄
    activeIncomeHistory.push({
      amount: amount,
      timestamp: new Date().toISOString()
    });
    updateDisplay();
    document.getElementById("activeInput").value = "";
  }
}

// 新增被動收入
function addPassiveIncome() {
  const input = document.getElementById("passiveInput").value;
  const amount = parseInt(input) || 0;
  if (amount > 0) {
    passiveIncome += amount;
    updateDisplay();
    document.getElementById("passiveInput").value = "";
  }
}

// 顯示主動收入紀錄
function updateHistoryList() {
  const ul = document.getElementById("activeHistory");
  ul.innerHTML = "";
  activeIncomeHistory.forEach(entry => {
    const li = document.createElement("li");
    const date = new Date(entry.timestamp);
    li.textContent = `${date.toLocaleString()}：NT$${entry.amount.toLocaleString()}`;
    ul.appendChild(li);
  });
}

// 初始執行一次畫面更新
updateDisplay();

// 載入任務清單
async function loadTasks() {
  try {
    const response = await fetch('data/tasks.json');
    const tasks = await response.json();
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.style.background = '#f2faff';
      li.style.padding = '10px';
      li.style.marginBottom = '10px';
      li.style.borderRadius = '8px';

      const title = document.createElement('strong');
      title.textContent = task.title;

      const desc = document.createElement('div');
      desc.innerHTML = `📝 ${task.description}`;

      const info = document.createElement('div');
      info.innerHTML = `📅 到期日：${task.due} ｜ 💰 價值 NT$${task.value.toLocaleString()}`;

      const button = document.createElement('button');
      button.textContent = '✅ 確認完成';
      button.onclick = () => completeTask(button, task.value);

      li.appendChild(title);
      li.appendChild(document.createElement('br'));
      li.appendChild(desc);
      li.appendChild(document.createElement('br'));
      li.appendChild(info);
      li.appendChild(document.createElement('br'));
      li.appendChild(button);

      taskList.appendChild(li);
    });
  } catch (error) {
    console.error("載入任務失敗：", error);
  }
}


// 頁面載入後自動執行任務載入
loadTasks();

function completeTask(button, value) {
  // 加入主動收入（或你也可以改成 passiveIncome += value）
  activeIncome += value;

  // 加入歷史紀錄
  activeIncomeHistory.push({
    amount: value,
    timestamp: new Date().toISOString()
  });

  // 更新畫面
  updateDisplay();

  // 把該任務樣式改成完成狀態
  const li = button.parentElement;
  li.style.textDecoration = 'line-through';
  li.style.opacity = '0.6';

  // 禁用按鈕
  button.disabled = true;
  button.textContent = '已完成';
}

