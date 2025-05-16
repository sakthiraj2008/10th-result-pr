// Switch between a quick front-end prank mode and a real API mode:
const USE_BACKEND = false;   // flip to true when you wire the Express route

document.getElementById("resultForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const regNo = e.target.regNo.value.trim();
  const dob   = e.target.dob.value.trim();

  if (!regNo || !dob) return;

  if (USE_BACKEND) {
    // --- real fetch to Express API ------------------------------------------
    try {
      const res = await fetch("/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regNo, dob }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No record found");

      showAlert(formatResult(data), "success");
    } catch (err) {
      showAlert(err.message, "error");
    }
  } else {
    // --- prank mode: random marks -------------------------------------------
    const randomMarks = () => Math.floor(Math.random() * 50) + 50; // 50-99
    const mock = {
      name: "YOUR NAME HERE",
      regNo,
      dob,
      subjects: {
        Tamil: randomMarks(),
        English: randomMarks(),
        Physics: randomMarks(),
        Chemistry: randomMarks(),
        Maths: randomMarks(),
        Biology: randomMarks(),
      },
    };
    showAlert(formatResult(mock), "success");
  }
});

function formatResult(obj) {
  const total = Object.values(obj.subjects).reduce((a, b) => a + b, 0);
  return `
    <strong>${obj.name}</strong><br />
    Reg No: ${obj.regNo}<br />
    DOB: ${obj.dob}<br /><br />
    ${Object.entries(obj.subjects)
      .map(([sub, mark]) => `${sub}: <strong>${mark}</strong>`)
      .join("<br />")}
    <br /><br />
    <em>Total: ${total} / 600</em>
  `;
}

function showAlert(html, type = "info") {
  let box = document.getElementById("alertBox");
  if (!box) {
    box = document.createElement("div");
    box.id = "alertBox";
    document.body.appendChild(box);
  }
  box.innerHTML = html;
  box.className = type;
}

/* quick styles for alert box */
const style = document.createElement("style");
style.textContent = `
  #alertBox {
    position: fixed; left: 50%; top: 20%; transform: translateX(-50%);
    background: #fff; border: 2px solid #333; border-radius: 6px;
    padding: 1.25rem 1.6rem; max-width: 320px; width: 90vw;
    font-size: .92rem; line-height: 1.35; box-shadow: 0 8px 18px rgba(0,0,0,.25);
    z-index: 9999;
  }
`;
document.head.appendChild(style);
