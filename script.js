document.addEventListener("DOMContentLoaded", () => {
  const categorySelect = document.getElementById("category");
  const participantsContainer = document.getElementById("participantsContainer");
  const form = document.getElementById("registrationForm");
  const statusEl = document.getElementById("formStatus");
  const submitBtn = form.querySelector("button[type='submit']");

  // Dynamically generate participants based on category
  function updateParticipants() {
    participantsContainer.innerHTML = ""; // Clear old fields
    const category = categorySelect.value;
    const count = category === "Singles" ? 3 : category === "Doubles" ? 6 : 0;

    for (let i = 1; i <= count; i++) {
      const div = document.createElement("div");
      div.className = "participant";
      div.dataset.index = i;
      div.innerHTML = `
        <h4>Member ${i}</h4>
        <div class="form-group-inline">
          <div class="form-group">
            <label>Name</label>
            <input type="text" id="member${i}Name" name="member${i}Name" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="member${i}Email" name="member${i}Email">
          </div>
          <div class="form-group">
            <label>SUC Code</label>
            <input type="text" id="member${i}SUC" name="member${i}SUC" maxlength="10" minlength="10" required>
          </div>
        </div>
      `;
      participantsContainer.appendChild(div);
    }
  }

  // Update participants on category change
  categorySelect.addEventListener("change", updateParticipants);

  // Initialize participants on page load
  updateParticipants();

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Submitting...";
    statusEl.style.color = "#e5e7eb";
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const category = formData.get("category");
    const memberCount = category === "Singles" ? 3 : 6;

    const payload = {
      teamName: formData.get("teamName"),
      category: category,
      leaderPhone: formData.get("leaderPhone"),
      leaderEmail: formData.get("leaderEmail"),
      collegeBranch: formData.get("collegeBranch"),
      city: formData.get("city"),
      members: []
    };

    // Collect participants
    for (let i = 1; i <= memberCount; i++) {
      const name = formData.get(`member${i}Name`);
      const email = formData.get(`member${i}Email`);
      const suc = formData.get(`member${i}SUC`);

      if (!name || !suc || suc.length !== 10) {
        statusEl.textContent = `Member ${i} must have a name and a SUC code of 10 characters.`;
        statusEl.style.color = "#f87171";
        submitBtn.disabled = false;
        return;
      }

      payload.members.push({ name, email, suc });
    }

    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbxH3Q3p0EQkXU0OnlDc-MwFJnpyaqaYtDg9vG1BhSRZ5Tk4qnEuvgmhM7G_cCaZIUto/exec", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.status === "success") {
        statusEl.textContent = "Registration successful!";
        statusEl.style.color = "#22c55e";
        form.reset();
        updateParticipants();
        window.location.href = "thankyou.html"; // Redirect to thank you page
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err) {
      statusEl.textContent = "Error submitting form. Try again later.";
      statusEl.style.color = "#f87171";
      submitBtn.disabled = false;
    }
  });
});






