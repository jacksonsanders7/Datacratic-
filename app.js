// Always wait for DOM to fully load
document.addEventListener("DOMContentLoaded", function () {

  const authContainer = document.getElementById("authContainer");
  const dashboard = document.getElementById("dashboard");

  const authName = document.getElementById("authName");
  const authEmail = document.getElementById("authEmail");
  const authPassword = document.getElementById("authPassword");
  const authMessage = document.getElementById("authMessage");

  const signupBtn = document.getElementById("signupBtn");
  const loginBtn = document.getElementById("loginBtn");

  const accountInfo = document.getElementById("accountInfo");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

  function save() {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }

  function showDashboard() {
    authContainer.classList.add("hidden");
    dashboard.classList.remove("hidden");
    accountInfo.innerHTML = `
      <p><strong>Name:</strong> ${currentUser.name}</p>
      <p><strong>Email:</strong> ${currentUser.email}</p>
    `;
  }

  function signup() {
    const name = authName.value.trim();
    const email = authEmail.value.trim().toLowerCase();
    const password = authPassword.value.trim();

    if (!name || !email || !password) {
      authMessage.textContent = "All fields required.";
      return;
    }

    if (users.find(u => u.email === email)) {
      authMessage.textContent = "User already exists.";
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password
    };

    users.push(newUser);
    currentUser = newUser;
    save();

    authMessage.textContent = "";
    showDashboard();
  }

  function login() {
    const email = authEmail.value.trim().toLowerCase();
    const password = authPassword.value.trim();

    const user = users.find(u =>
      u.email === email && u.password === password
    );

    if (!user) {
      authMessage.textContent = "Invalid email or password.";
      return;
    }

    currentUser = user;
    save();
    authMessage.textContent = "";
    showDashboard();
  }

  function logout() {
    currentUser = null;
    save();
    location.reload();
  }

  // Attach events
  signupBtn.addEventListener("click", signup);
  loginBtn.addEventListener("click", login);
  window.logout = logout;

  // Auto login if session exists
  if (currentUser) {
    showDashboard();
  }

});
