// ---- Local "Database" ----
const db = {
  users: JSON.parse(localStorage.getItem("users")) || [],
  data: JSON.parse(localStorage.getItem("data")) || []
};

function saveDB() {
  localStorage.setItem("users", JSON.stringify(db.users));
  localStorage.setItem("data", JSON.stringify(db.data));
}

function id() {
  return Math.random().toString(36).substring(2, 10);
}

// ---- AUTH ----
function signup() {
  const user = {
    id: id(),
    name: signupName.value,
    email: signupEmail.value,
    password: signupPassword.value
  };

  if (db.users.find(u => u.email === user.email)) {
    authMessage.textContent = "Account already exists.";
    return;
  }

  db.users.push(user);
  saveDB();
  authMessage.textContent = "Account created. You can sign in.";
}

function login() {
  const user = db.users.find(
    u =>
      u.email === loginEmail.value &&
      u.password === loginPassword.value
  );

  if (!user) {
    authMessage.textContent = "Invalid credentials.";
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
  accountInfo.textContent = JSON.stringify(
    {
      name: user.name,
      email: user.email,
      password: user.password
    },
    null,
    2
  );

  renderDataStatus();
}

function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab =>
    tab.classList.add("hidden")
  );
  document.getElementById(tabId).classList.remove("hidden");
}

// ---- DATA UPLOAD ----
function uploadData() {
  const userId = localStorage.getItem("currentUser");

  db.data.push({
    id: id(),
    userId,
    type: dataType.value,
    content: dataContent.value,
    status: "Uploaded"
  });

  saveDB();
  dataContent.value = "";
  renderDataStatus();
  showTab("status");
}

// ---- DATA STATUS ----
function renderDataStatus() {
  const userId = localStorage.getItem("currentUser");
  const userData = db.data.filter(d => d.userId === userId);

  dataStatus.textContent = JSON.stringify(
    userData.map(d => ({
      type: d.type,
      status: d.status
    })),
    null,
    2
  );
}
