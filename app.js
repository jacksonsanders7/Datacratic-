// Local "database"
const db = {
  data: JSON.parse(localStorage.getItem("datacratic_data") || "[]")
};

function save() {
  localStorage.setItem("datacratic_data", JSON.stringify(db.data));
}

function uid() {
  return Math.random().toString(36).substring(2, 9);
}

// Initialize
function initApp() {
  showTab("account");
  renderStatus();
}

// Show specific tab
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
    .map(d => `<div style="margin-bottom:12px"><strong>${d.type}</strong><div class="muted">${d.status}</div></div>`)
    .join("");
}
