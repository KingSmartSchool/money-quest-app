// 初始化變數
let earnedSoFar = 0;

// 載入目標與任務資料
async function loadData() {
  const goalRes = await fetch("data/goals.json");
  const taskRes = await fetch("data/tasks.json");

  const goalData = await goalRes.json();
  const taskData = await taskRes.json();

  renderGoal(goalData, taskData);
  renderTasks(taskData, goalData.goal);
}

// 顯示目標與進度條
function renderGoal(goal, tasks) {
  document.getElementById("goal-amount").textContent = `NT$${goal.goal.toLocaleString()}`;

  const now = new Date();
  const end = new Date(goal.endDate);
  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  document.getElementById("days-left").textContent = `${daysLeft} 天`;

  // 初始畫面：載入 localStorage 的收入總額
  const saved = localStorage.getItem("earned");
  earnedSoFar = saved ? Number(saved) : 0;
  document.getElementById("earned-total").textContent = `NT$${earnedSoFar.toLocaleString()}`;

  updateProgress(goal.goal);
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

// 新增收入後更新畫面與儲存
function addIncome() {
  const input = document.getElementById("income-input");
  const amount = Number(input.value);

  if (amount && amount > 0) {
    earnedSoFar += amount;
    localStorage.setItem("earned", earnedSoFar); // 儲存進 localStorage
    document.getElementById("earned-total").textContent = `NT$${earnedSoFar.toLocaleString()}`;
    updateProgress(3000000); // 可動態抓 goal
    input.value = "";
  } else {
    alert("請輸入有效的金額！");
  }
}

// 更新進度條
function updateProgress(goalAmount) {
  const percent = Math.min(100, (earnedSoFar / goalAmount) * 100).toFixed(1);
  document.getElementById("progress-bar").style.width = `${percent}%`;
  document.getElementById("progress-percent").textContent = `${percent}%`;
}

loadData();
