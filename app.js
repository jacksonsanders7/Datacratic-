let db = {
  users: JSON.parse(localStorage.getItem("users") || "[]"),
  groups: JSON.parse(localStorage.getItem("groups") || "[]"),
  data: JSON.parse(localStorage.getItem("data") || "[]")
};

let currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

function save() {
  localStorage.setItem("users", JSON.stringify(db.users));
  localStorage.setItem("groups", JSON.stringify(db.groups));
  localStorage.setItem("data", JSON.stringify(db.data));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

function init() {
  if (currentUser) {
    showDashboard();
  }
}

/* ================= AUTH ================= */

function signup() {
  const name = authName.value.trim();
  const email = authEmail.value.trim().toLowerCase();
  const password = authPassword.value.trim();

  if (!name || !email || !password) {
    authMessage.textContent = "All fields are required.";
    return;
  }

  if (db.users.find(u => u.email === email)) {
    authMessage.textContent = "User already exists.";
    return;
  }

  const user = {
    id: Date.now(),
    name,
    email,
    password
  };

  db.users.push(user);

  // AUTO LOGIN IMMEDIATELY
  currentUser = user;

  save();
  showDashboard();
}

function login() {
  const email = authEmail.value.trim().toLowerCase();
  const password = authPassword.value.trim();

  const user = db.users.find(u =>
    u.email === email &&
    u.password === password
  );

  if (!user) {
    authMessage.textContent = "Invalid email or password.";
    return;
  }

  currentUser = user;
  save();
  showDashboard();
}

function logout() {
  currentUser = null;
  save();
  location.reload();
}

/* ================= DASHBOARD ================= */

function showDashboard() {
  authContainer.classList.add("hidden");
  dashboard.classList.remove("hidden");
  renderAccount();
  renderGroups();
  renderStatus();
  populateTargets();
}

function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function renderAccount() {
  accountInfo.innerHTML = `
    <p><strong>Name:</strong> ${currentUser.name}</p>
    <p><strong>Email:</strong> ${currentUser.email}</p>
  `;
}

/* ================= DATA ================= */

function uploadData() {
  if (!dataContent.value.trim()) return;

  const target = uploadTarget.value;

  const entry = {
    id: Date.now(),
    userId: currentUser.id,
    type: dataType.value,
    status: "Uploaded",
    groupId: target === "personal" ? null : Number(target)
  };

  db.data.push(entry);

  if (entry.groupId) {
    const group = db.groups.find(g => g.id === entry.groupId);
    if (group) group.datasets++;
  }

  dataContent.value = "";
  save();
  renderStatus();
}

function renderStatus() {
  const myData = db.data.filter(d => d.userId === currentUser.id);

  if (myData.length === 0) {
    statusList.innerHTML = "No uploads yet.";
    return;
  }

  statusList.innerHTML = myData.map(d => {
    let groupName = "Personal";
    if (d.groupId) {
      const g = db.groups.find(g => g.id === d.groupId);
      groupName = g ? g.name : "Group";
    }
    return `<p>${d.type} — ${d.status} (${groupName})</p>`;
  }).join("");
}

/* ================= GROUPS ================= */

function createGroup() {
  const name = groupName.value.trim();
  if (!name) return;

  const group = {
    id: Date.now(),
    name,
    members: 1,
    datasets: 0,
    memberIds: [currentUser.id]
  };

  db.groups.push(group);
  groupName.value = "";
  save();
  renderGroups();
  populateTargets();
}

function joinGroup(groupId) {
  const group = db.groups.find(g => g.id === groupId);
  if (!group.memberIds.includes(currentUser.id)) {
    group.memberIds.push(currentUser.id);
    group.members++;
    save();
    renderGroups();
    populateTargets();
  }
}

function renderGroups() {
  if (db.groups.length === 0) {
    groupList.innerHTML = "No groups yet.";
    return;
  }

  groupList.innerHTML = db.groups.map(g => `
    <div style="margin-top:15px;">
      <strong>${g.name}</strong><br>
      Members: ${g.members} | Datasets: ${g.datasets}<br>
      ${
        g.memberIds.includes(currentUser.id)
        ? "<em>You are a member</em>"
        : `<button onclick="joinGroup(${g.id})">Join</button>`
      }
    </div>
  `).join("");
}

function populateTargets() {
  uploadTarget.innerHTML = `<option value="personal">Personal</option>`;

  db.groups
    .filter(g => g.memberIds.includes(currentUser.id))
    .forEach(g => {
      uploadTarget.innerHTML += `<option value="${g.id}">${g.name}</option>`;
    });
}
