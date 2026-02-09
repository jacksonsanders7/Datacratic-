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

// Initialize app
function initApp() {
  showTab("account");
  renderStatus();
  startStatusLifecycle();
}

// Show a specific tab
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
}

// Upload data
function uploadData() {
  if (!dataContent.value.trim()) return;

  const newData = {
    id: uid(),
    type: dataType.value,
    status: "Uploaded"
  };

  db.data.push(newData);
  save();
  dataContent.value = "";
  renderStatus();
  showTab("status");
}

// Render data status with badges
function renderStatus() {
  if (db.data.length === 0) {
    dataStatus.innerHTML = "<p class='muted'>No data uploaded yet.</p>";
    return;
  }

  dataStatus.innerHTML = db.data
    .map(d => `
      <div class="data-row">
        <span class="data-type">${d.type}</span>
        <span class="badge ${d.status.replace(/ /g,'').toLowerCase()}">${d.status}</span>
      </div>
    `)
    .join("");
}

// Animate status lifecycle for demo purposes
function startStatusLifecycle() {
  db.data.forEach(d => {
    if (d.status === "Uploaded") {
      // After 3 seconds, move to In Negotiation
      setTimeout(() => {
        d.status = "In Negotiation";
        save();
        renderStatus();
      }, 3000);

      // After 6 seconds, move to Payment Available
      setTimeout(() => {
        d.status = "Payment Available";
        save();
        renderStatus();
      }, 6000);
    }
  });
}

// Re-run lifecycle every 5 seconds to catch new uploads
setInterval(startStatusLifecycle, 5000);
