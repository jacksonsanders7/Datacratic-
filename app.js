// ---- DATABASE ----
const db = {
  users: JSON.parse(localStorage.getItem("users") || "[]"),
  data: JSON.parse(localStorage.getItem("data") || "[]")
};

function saveDB() {
  localStorage.setItem("users", JSON.stringify(db.users));
  localStorage.setItem("data", JSON.stringify(db.data));
}

function uid() {
  return Math.random().toString(36).substring(2, 10);
}

// ---- AUTH ----
function signup() {
  const name = signupName.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();

  if (!name || !email || !password) {
    authMessage.textContent = "All fields are required.";
    return;
  }

  if (db.users.some(u => u.email === email)) {
    authMessage.textContent = "Account already exists.";
    return;
  }

  db.users.push({ id: uid(), name, email, password });
  saveDB();
  authMessage.style.color = "#059669";
  authMessage.textContent = "Account created. You can now sign in.";
}

function login() {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  const user = db.users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    authMessage.textContent = "Invalid email or password.";
    return;
  }

  localStorage.setItem("currentUser", user.id);
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// ---- DASHBOARD ----
function loadDashboard() {
  const userId = localStorage.getItem("currentUser");
  if (!userId) {
    window.location.href = "index.html";
    return;
  }

  const user = db.users.find(u => u.id === userId);
  accountInfo.innerHTML = `
    <strong>Name:</strong> ${user.name}<br/>
    <strong>Email:</strong> ${user.email}<br/>
    <strong>Password:</strong> ${user.password}
  `;

  renderDataStatus();
}

function showTab(id) {
  document.querySelectorAll(".tab").forEach(t =>
    t.classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}

// ---- DATA ----
function uploadData() {
  const userId = localStorage.getItem("currentUser");
  const content = dataContent.value.trim();

  if (!content) return;

  db.data.push({
    id: uid(),
    userId,
    type: dataType.value,
    status: "Uploaded"
  });

  saveDB();
  dataContent.value = "";
  renderDataStatus();
  showTab("status");
}

function renderDataStatus() {
  const userId = localStorage.getItem("currentUser");
  const rows = db.data
    .filter(d => d.userId === userId)
    .map(
      d => `<div><strong>${d.type}</strong> — ${d.status}</div>`
    )
    .join("");

  dataStatus.innerHTML = rows || "No data uploaded yet.";
}
