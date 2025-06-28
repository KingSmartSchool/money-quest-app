// 讀取目標資訊與任務清單
async function loadData() {
  const goalRes = await fetch("data/goals.json");
  const taskRes = await fetch("data/tasks.json");

  const goalData = await goalRes.json();
  const taskData = await taskRes.json();

  renderGoal(goalData, taskData);
  renderTasks(taskData, goalData.goal);
}

// 顯示目標金額、倒數日與進度條
function renderGoal(goal, tasks) {
  document.getElementById("goal-amount").textContent = `NT$${goal.goal.toLocaleString()}`;

  const now = new Date();
  const end = new Date(goal.endDate);
  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  document.getElementById("days-left").textContent = `${daysLeft} 天`;

  const totalEarned = tasks
    .filter(t => t.completed)
    .reduce((sum, task) => sum + task.value, 0);

  const percent = Math.min(100, (totalEarned / goal.goal) * 100).toFixed(1);
  document.getElementById("progress-bar").style.width = `${percent}%`;
  document.getElementById("progress-percent").textContent = `${percent}%`;
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

loadData();
