document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     HERO TYPING EFFECT
  ============================================================ */
  if (document.querySelector("#typed-text")) {
    new Typed("#typed-text", {
      strings: [
        "Python Developer",
        "Machine Learning Enthusiast",
        "AI Systems Student"
      ],
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 1200,
      loop: true,
      showCursor: false
    });
  }

  /* ============================================================
     CONTACT / FEEDBACK FORM
  ============================================================ */
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const resultsDiv = document.getElementById("formResults");
  const resultsDisplay = document.getElementById("resultsDisplay");
  const averageRatingDiv = document.getElementById("averageRating");

  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");

  const nameError = document.getElementById("nameError");
  const surnameError = document.getElementById("surnameError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");
  const addressError = document.getElementById("addressError");

  const rating1 = document.getElementById("rating1");
  const rating2 = document.getElementById("rating2");
  const rating3 = document.getElementById("rating3");
  const rating1Value = document.getElementById("rating1Value");
  const rating2Value = document.getElementById("rating2Value");
  const rating3Value = document.getElementById("rating3Value");

  if (submitBtn) submitBtn.disabled = true;

  function setInvalid(input) {
    input.classList.add("invalid-input");
    input.classList.remove("valid-input");
  }

  function setValid(input) {
    input.classList.remove("invalid-input");
    input.classList.add("valid-input");
  }

  function validateName() {
    if (!/^[A-Za-z]+$/.test(nameInput.value.trim())) {
      nameError.textContent = "Letters only";
      setInvalid(nameInput);
      return false;
    }
    nameError.textContent = "";
    setValid(nameInput);
    return true;
  }

  function validateSurname() {
    if (!/^[A-Za-z]+$/.test(surnameInput.value.trim())) {
      surnameError.textContent = "Letters only";
      setInvalid(surnameInput);
      return false;
    }
    surnameError.textContent = "";
    setValid(surnameInput);
    return true;
  }

  function validateEmail() {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(emailInput.value.trim())) {
      emailError.textContent = "Invalid email";
      setInvalid(emailInput);
      return false;
    }
    emailError.textContent = "";
    setValid(emailInput);
    return true;
  }

  function validateAddress() {
    if (addressInput.value.trim().length < 5) {
      addressError.textContent = "Invalid address";
      setInvalid(addressInput);
      return false;
    }
    addressError.textContent = "";
    setValid(addressInput);
    return true;
  }

  phoneInput?.addEventListener("input", () => {
    let v = phoneInput.value.replace(/\D/g, "");
    if (!v.startsWith("3706")) v = "3706" + v.slice(4);
    phoneInput.value = `+370 6 ${v.slice(4,7)} ${v.slice(7,11)}`.trim();

    if (!/^\+370 6 \d{3} \d{4}$/.test(phoneInput.value)) {
      phoneError.textContent = "Format: +370 6 xxx xxxx";
      setInvalid(phoneInput);
    } else {
      phoneError.textContent = "";
      setValid(phoneInput);
    }
    validateForm();
  });

  function validateForm() {
    submitBtn.disabled = !(
      validateName() &&
      validateSurname() &&
      validateEmail() &&
      validateAddress() &&
      phoneError.textContent === ""
    );
  }

  nameInput?.addEventListener("input", validateForm);
  surnameInput?.addEventListener("input", validateForm);
  emailInput?.addEventListener("input", validateForm);
  addressInput?.addEventListener("input", validateForm);

  rating1?.addEventListener("input", () => rating1Value.textContent = rating1.value);
  rating2?.addEventListener("input", () => rating2Value.textContent = rating2.value);
  rating3?.addEventListener("input", () => rating3Value.textContent = rating3.value);

  form?.addEventListener("submit", e => {
    e.preventDefault();

    const data = {
      name: nameInput.value,
      surname: surnameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      address: addressInput.value,
      r1: +rating1.value,
      r2: +rating2.value,
      r3: +rating3.value
    };

    resultsDisplay.innerHTML = `
      <p>Name: ${data.name}</p>
      <p>Surname: ${data.surname}</p>
      <p>Email: ${data.email}</p>
      <p>Phone: ${data.phone}</p>
      <p>Address: ${data.address}</p>
    `;

    const avg = ((data.r1 + data.r2 + data.r3) / 3).toFixed(1);
    const color = avg < 4 ? "red" : avg < 7 ? "orange" : "green";

    averageRatingDiv.innerHTML =
      `${data.name} ${data.surname}: <span style="color:${color}">${avg}</span>`;

    resultsDiv.style.display = "block";
    showPopup("Form submitted successfully!");
  });

  /* ============================================================
     MEMORY GAME + TIMER (FIXED)
  ============================================================ */
  const board = document.getElementById("gameBoard");
  const movesEl = document.getElementById("moves");
  const matchesEl = document.getElementById("matches");
  const timeEl = document.getElementById("gameTime");
  const startBtn = document.getElementById("startGame");
  const restartBtn = document.getElementById("restartGame");
  const difficulty = document.getElementById("difficulty");

  const icons = ["🍎","🍌","🍇","🍒","🍑","🥝","🍉","🍍","🥥","🍓","🍈","🍋"];
  let first = null, lock = false, moves = 0, matches = 0;
  let timer = null, seconds = 0;

  function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timeEl.textContent = "0";
    timer = setInterval(() => {
      seconds++;
      timeEl.textContent = seconds;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  function startGame() {
    board.innerHTML = "";
    moves = matches = 0;
    movesEl.textContent = matchesEl.textContent = "0";
    first = null; lock = false;
    startTimer();

    const pairs = difficulty.value === "easy" ? 6 : 12;
    board.className = "memory-board " + difficulty.value;

    const set = [...icons].sort(() => 0.5 - Math.random()).slice(0, pairs);
    [...set, ...set].sort(() => 0.5 - Math.random()).forEach(icon => {
      const card = document.createElement("div");
      card.className = "memory-card";
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">${icon}</div>
          <div class="card-back">?</div>
        </div>`;
      card.onclick = () => flip(card);
      board.appendChild(card);
    });
  }

  function flip(card) {
    if (lock || card === first || card.classList.contains("matched")) return;
    card.classList.add("flipped");

    if (!first) { first = card; return; }

    moves++; movesEl.textContent = moves;
    const a = first.querySelector(".card-front").textContent;
    const b = card.querySelector(".card-front").textContent;

    if (a === b) {
      first.classList.add("matched");
      card.classList.add("matched");
      matches++; matchesEl.textContent = matches;
      first = null;

      if (matches * 2 === board.children.length) {
        stopTimer();
        showPopup("🎉 You won the game!");
      }
    } else {
      lock = true;
      setTimeout(() => {
        first.classList.remove("flipped");
        card.classList.remove("flipped");
        first = null;
        lock = false;
      }, 800);
    }
  }

  startBtn?.addEventListener("click", startGame);
  restartBtn?.addEventListener("click", startGame);

  /* ============================================================
     POPUP
  ============================================================ */
  function showPopup(msg) {
    const p = document.createElement("div");
    p.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999"></div>
      <div style="position:fixed;top:50%;left:50%;
      transform:translate(-50%,-50%);
      background:#4CAF50;color:#fff;
      padding:25px 40px;border-radius:12px;
      z-index:10000">${msg}</div>`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2500);
  }

});
