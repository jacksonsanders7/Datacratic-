// Always wait for DOM to fully load
document.addEventListener("DOMContentLoaded", function () {

  const authContainer = document.getElementById("authContainer");
  const dashboard = document.getElementById("dashboard");

  const authName = document.getElementById("authName");
  const authEmail = document.getElementById("authEmail");
  const authPassword = document.getElementById("authPassword");
  const authMessage = document.getElementById("authMessage");

  const signupModeBtn = document.getElementById("signupModeBtn");
  const loginModeBtn = document.getElementById("loginModeBtn");
  const submitAuthBtn = document.getElementById("submitAuthBtn");

  const accountInfo = document.getElementById("accountInfo");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
  let isSignupMode = true;

  function save() {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }

  function resetMessage() {
    authMessage.textContent = "";
  }

  function updateMode() {
    signupModeBtn.classList.toggle("active", isSignupMode);
    loginModeBtn.classList.toggle("active", !isSignupMode);
    signupModeBtn.setAttribute("aria-selected", isSignupMode ? "true" : "false");
    loginModeBtn.setAttribute("aria-selected", !isSignupMode ? "true" : "false");

    authName.classList.toggle("hidden", !isSignupMode);
    authName.disabled = !isSignupMode;
    authName.placeholder = "Name";

    authPassword.autocomplete = isSignupMode ? "new-password" : "current-password";
    submitAuthBtn.textContent = isSignupMode ? "Create Account" : "Login";

    resetMessage();
  }

  function renderAccountInfo(user) {
    accountInfo.innerHTML = "";

    const name = document.createElement("p");
    const nameLabel = document.createElement("strong");
    nameLabel.textContent = "Name:";
    name.append(nameLabel, ` ${user.name}`);

    const email = document.createElement("p");
    const emailLabel = document.createElement("strong");
    emailLabel.textContent = "Email:";
    email.append(emailLabel, ` ${user.email}`);

    accountInfo.append(name, email);
  }

  function showDashboard() {
    authContainer.classList.add("hidden");
    dashboard.classList.remove("hidden");
    renderAccountInfo(currentUser);
  }

  function signup() {
    const name = authName.value.trim();
    const email = authEmail.value.trim().toLowerCase();
    const password = authPassword.value.trim();

    if (!name || !email || !password) {
      authMessage.textContent = "All fields are required for sign up.";
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

    resetMessage();
    showDashboard();
  }

  function login() {
    const email = authEmail.value.trim().toLowerCase();
    const password = authPassword.value.trim();

    if (!email || !password) {
      authMessage.textContent = "Email and password are required.";
      return;
    }

    const user = users.find(u =>
      u.email === email && u.password === password
    );

    if (!user) {
      authMessage.textContent = "Invalid email or password.";
      return;
    }

    currentUser = user;
    save();
    resetMessage();
    showDashboard();
  }

  function logout() {
    currentUser = null;
    save();
    location.reload();
  }

  function handleSubmit() {
    if (isSignupMode) {
      signup();
      return;
    }

    login();
  }

  // Attach events
  signupModeBtn.addEventListener("click", () => {
    isSignupMode = true;
    updateMode();
  });

  loginModeBtn.addEventListener("click", () => {
    isSignupMode = false;
    updateMode();
  });

  submitAuthBtn.addEventListener("click", handleSubmit);

  [authName, authEmail, authPassword].forEach(input => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
    });

    input.addEventListener("input", resetMessage);
  });

  window.logout = logout;

  // Auto login if session exists
  if (currentUser) {
    showDashboard();
    return;
  }

  updateMode();

});
