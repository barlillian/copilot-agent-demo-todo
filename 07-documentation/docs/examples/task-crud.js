// 任務 CRUD 操作範例 (Node.js)
const fetch = require('node-fetch');

const API = 'http://localhost:3000/api';
let token = '';

async function login() {
  const res = await fetch(`${API}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alice@example.com', password: '123456' })
  });
  const data = await res.json();
  token = data.data.token;
}

async function createTask() {
  const res = await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: '寫文件', description: '完成 API 文件' })
  });
  return res.json();
}

async function getTasks() {
  const res = await fetch(`${API}/tasks`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

async function updateTask(id) {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'completed' })
  });
  return res.json();
}

async function deleteTask(id) {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

(async () => {
  await login();
  const created = await createTask();
  console.log('建立任務:', created);
  const tasks = await getTasks();
  console.log('查詢任務:', tasks);
  if (tasks.data.length > 0) {
    const updated = await updateTask(tasks.data[0].id);
    console.log('更新任務:', updated);
    const deleted = await deleteTask(tasks.data[0].id);
    console.log('刪除任務:', deleted);
  }
})();
