"use strict";

const form = document.getElementById("regform");
const themeBtn = document.getElementById("theme");
const memberList = document.getElementById("memberList");
const count = document.getElementById("count");
const successMsg = document.getElementById("successMsg");

const members = [];

const fieldErrors = {
    name: "nameError",
    email: "emailError",
    password: "passwordError",
    "confirm-password": "confirmError",
    gender: "genderError",
    dob: "dobError",
    country: "countryError",
    phone: "phoneError",
    bio: "bioError"
};

// Show or clear a field's error
function showError(fieldId, message = "") {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldErrors[fieldId]);

    error.textContent = message;
    field.classList.toggle("invalid", Boolean(message));
    field.setAttribute("aria-invalid", String(Boolean(message)));
}

// Clear all validation errors
function clearErrors() {
    Object.keys(fieldErrors).forEach(id => showError(id));
}

// Validate the registration form
function validateForm() {
    clearErrors();

    let valid = true;

    const value = id => document.getElementById(id).value.trim();
    const name = value("name");
    const email = value("email");
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirm-password").value;
    const gender = value("gender");
    const dob = value("dob");
    const country = value("country");
    const phone = value("phone");
    const bio = value("bio");

    function reject(id, message) {
        showError(id, message);
        valid = false;
    }

    if (name.length < 2 || name.length > 100) {
        reject("name", "Enter a name between 2 and 100 characters.");
    } else if (/\d/.test(name)) {
        reject("name", "Your name should not contain numbers.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        reject("email", "Enter a valid email address.");
    }

    if (password.length < 8 || password.length > 128) {
        reject("password", "Password must be 8–128 characters long.");
    }

    if (!confirmPassword || password !== confirmPassword) {
        reject("confirm-password", "Passwords do not match.");
    }

    if (!gender) {
        reject("gender", "Please select your gender.");
    }

    if (!dob) {
        reject("dob", "Please select your date of birth.");
    } else {
        const birthDate = new Date(dob + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
            reject("dob", "Choose a valid date that is not in the future.");
        }
    }

    if (country.length < 2 || country.length > 80) {
        reject("country", "Enter a valid country name.");
    }

    const digits = phone.replace(/\D/g, "");

    if (!/^[+\d][\d\s()-]*$/.test(phone) ||
        digits.length < 7 || digits.length > 15) {
        reject("phone", "Enter a valid phone number.");
    }

    if (bio.length > 500) {
        reject("bio", "Bio cannot exceed 500 characters.");
    }

    if (members.some(member =>
        member.email.toLowerCase() === email.toLowerCase()
    )) {
        reject("email", "This email is already registered.");
    }

    return valid;
}

// Render one member using the CSS structure you provided
function renderMember(member) {
    const li = document.createElement("li");
    li.className = "member-item";

    const info = document.createElement("div");
    info.className = "info";

    const name = document.createElement("strong");
    name.textContent = member.name;

    const email = document.createElement("span");
    email.textContent = member.email;

    const details = document.createElement("span");
    details.textContent =
        `${member.country} | ${member.gender} | ${member.phone}`;

    info.append(name, email, document.createElement("br"), details);

    if (member.bio) {
        const bio = document.createElement("span");
        bio.textContent = `Bio: ${member.bio}`;
        info.append(document.createElement("br"), bio);
    }

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${member.name}`);

    removeButton.addEventListener("click", () => {
        const index = members.indexOf(member);

        if (index !== -1) {
            members.splice(index, 1);
            li.remove();
            updateCount();
            showEmptyMessage();
        }
    });

    li.append(info, removeButton);
    memberList.prepend(li);
}

// Update the registered member count
function updateCount() {
    count.textContent = members.length;
}

// Show the empty-state message when there are no members
function showEmptyMessage() {
    if (members.length === 0 &&
        !document.getElementById("emptyNote")) {
        const empty = document.createElement("li");
        empty.id = "emptyNote";
        empty.className = "empty";
        empty.textContent =
            "No members yet. Register someone to begin.";
        memberList.appendChild(empty);
    }
}

// Handle registration
form.addEventListener("submit", event => {
    event.preventDefault();

    successMsg.textContent = "";
    successMsg.classList.add("hidden");

    if (!validateForm()) {
        const firstInvalid = form.querySelector(".invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
    }

    const member = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        gender: document.getElementById("gender").value,
        dob: document.getElementById("dob").value,
        country: document.getElementById("country").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        bio: document.getElementById("bio").value.trim()
    };

    members.push(member);

    const emptyNote = document.getElementById("emptyNote");
    if (emptyNote) emptyNote.remove();

    renderMember(member);
    updateCount();

    successMsg.textContent =
        `Registration successful! Welcome, ${member.name}.`;
    successMsg.classList.remove("hidden");

    form.reset();
    clearErrors();
});

// Clear field errors as users correct their input
Object.keys(fieldErrors).forEach(id => {
    const field = document.getElementById(id);

    field.addEventListener("input", () => {
        showError(id);
    });

    field.addEventListener("change", () => {
        showError(id);
    });
});

// Dark mode
themeBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");

    themeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
    themeBtn.setAttribute("aria-pressed", String(isDark));
});