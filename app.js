// Local "database"
const db = {
  data: JSON.parse(localStorage.getItem("datacratic_data") || "[]"),
  groups: JSON.parse(localStorage.getItem("datacratic_groups") || "[]")
};

function save() {
  localStorage.setItem("datacratic_data", JSON.stringify(db.data));
  localStorage.setItem("datacratic_groups", JSON.stringify(db.groups));
}

function uid() {
  return Math.random().toString(36).substring(2, 9);
}

// Initialize
function initApp() {
  showTab("account");
  renderStatus();
  renderGroups();
}

// Show tab
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
}

// Upload data
function uploadData() {
  if (!dataContent.value.trim()) return;

  db.data.push({
    id: uid(),
    type: dataType.value,
    status: "Uploaded"
  });

  save();
  dataContent.value = "";
  renderStatus();
  showTab("status");
}

// Render data status
function renderStatus() {
  if (db.data.length === 0) {
    dataStatus.innerHTML = "<p class='muted'>No data uploaded yet.</p>";
    return;
  }

  dataStatus.innerHTML = db.data
    .map(d => `<div class="data-row"><strong>${d.type}</strong> — ${d.status}</div>`)
    .join("");
}

// Create group
function createGroup() {
  const name = groupName.value.trim();
  if (!name) return;

  const newGroup = { id: uid(), name, members: 1, datasets: 0 };
  db.groups.push(newGroup);
  save();
  groupName.value = "";
  renderGroups();
}

// Render groups
function renderGroups() {
  if (db.groups.length === 0) {
    groupList.innerHTML = "<p class='muted'>No groups created yet.</p>";
    return;
  }

  groupList.innerHTML = db.groups
    .map(g => `<div class="data-row"><span><strong>${g.name}</strong> (${g.members} member${g.members > 1 ? 's' : ''})</span><span>${g.datasets} datasets pooled</span></div>`)
    .join("");
}
