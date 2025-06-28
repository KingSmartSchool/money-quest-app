// 載入任務清單
async function loadTasks() {
  try {
    const response = await fetch("data/tasks.json");
    const tasks = await response.json();
    const taskList = document.getElementById("taskList");

    tasks.forEach(task => {
      const taskItem = document.createElement("div");
      taskItem.className = "task-item";
      taskItem.style.backgroundColor = "#e6faff";
      taskItem.style.padding = "10px";
      taskItem.style.marginBottom = "10px";
      taskItem.style.borderRadius = "10px";

      taskItem.innerHTML = `
        <strong>${task.title}</strong><br>
        📝 ${task.description}<br>
        📅 到期日：${task.due_date} ｜ 💰 價值 NT$${task.value.toLocaleString()}
      `;
      taskList.appendChild(taskItem);
    });
  } catch (error) {
    console.error("載入任務時發生錯誤：", error);
  }
}

loadTasks();
