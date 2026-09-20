const topicContent = {
  signs: {
    title: "Signs of abuse",
    body: `<p>Abuse can be physical, emotional, sexual or financial. Some warning signs can be subtle and may become more controlling over time.</p>
      <ul><li>Controlling who someone sees, where they go or how they communicate.</li><li>Threats, intimidation, humiliation or repeated insults.</li><li>Physical harm or threats of physical harm.</li><li>Sexual activity without freely given consent.</li><li>Controlling money, work or access to basic needs.</li></ul>
      <p class="modal-note">If you recognise something concerning, you do not have to handle it alone. Consider speaking to someone you trust or a relevant support service.</p>`
  },
  rights: {
    title: "Know your rights",
    body: `<p>Everyone deserves dignity, bodily autonomy and safety. Consent should be freely given and can be withdrawn.</p>
      <ul><li>You can say no to sexual activity.</li><li>Being in a relationship does not remove your right to boundaries.</li><li>You can ask for help when you feel unsafe.</li><li>You can choose who you trust with your story.</li></ul>
      <p class="modal-note">This is general awareness information, not legal advice.</p>`
  },
  exit: {
    title: "Safer exit strategies",
    body: `<p>Leaving an unsafe situation can carry risks. If possible, think about safety before making a major move.</p>
      <ul><li>Identify a safer place you could go.</li><li>Tell a trusted person what is happening if it is safe to do so.</li><li>Keep important documents and essential items accessible when possible.</li><li>Consider how you can contact help without increasing risk.</li><li>If technology is being monitored, use a safer device or account when possible.</li></ul>
      <p class="modal-note">There is no single correct plan. If you are in immediate danger, prioritise getting to a safer place and contacting emergency help.</p>`
  },
  supporting: {
    title: "Supporting someone",
    body: `<p>You do not need to be an expert to support someone. Listening without judgement can matter.</p>
      <ul><li>Listen and take what they say seriously.</li><li>Ask what kind of support they want.</li><li>Avoid blaming them for what happened.</li><li>Respect their choices and privacy.</li><li>Help them find appropriate services if they want that support.</li></ul>
      <p class="modal-note">Avoid confronting an alleged abuser yourself if doing so could increase danger.</p>`
  }
};

const quizzes = [
  {
    q: "Which statement best describes consent?",
    a: ["Consent is assumed in a relationship.", "Consent must be freely given and can be withdrawn.", "Consent only matters the first time.", "Silence always means yes."],
    c: 1,
    e: "Consent should be freely given. A person can change their mind at any time."
  },
  {
    q: "Which can be a sign of controlling behaviour?",
    a: ["Respecting someone's boundaries.", "Encouraging healthy friendships.", "Demanding access to someone's messages and isolating them.", "Listening when someone says no."],
    c: 2,
    e: "Monitoring messages and isolating someone can be warning signs of controlling behaviour."
  },
  {
    q: "If someone tells you they are experiencing abuse, what is a helpful first response?",
    a: ["Blame them for staying.", "Listen, believe them and ask how you can support them.", "Immediately confront the person accused.", "Tell everyone you know."],
    c: 1,
    e: "Listening, avoiding blame and asking what support they want can help preserve their safety and control."
  },
  {
    q: "What is an important consideration when planning to leave an unsafe situation?",
    a: ["Announce your plan publicly.", "Safety planning and identifying a safer place.", "Delete every contact immediately.", "Confront the person alone."],
    c: 1,
    e: "Leaving can carry risks. Thinking through a safer place and support options can be important."
  },
  {
    q: "What should you do if you are in immediate danger?",
    a: ["Stay and argue until the situation improves.", "Prioritise getting somewhere safer and seek emergency help.", "Post your location publicly.", "Ignore the danger."],
    c: 1,
    e: "When immediate danger exists, prioritise safety and contact appropriate emergency support."
  }
];

let quizIndex = 0;
let score = 0;
let answered = false;

const $ = (id) => document.getElementById(id);

function openModal(title, body) {
  $("modalTitle").textContent = title;
  $("modalBody").innerHTML = body;
  $("modalBackdrop").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  $("modalBackdrop").hidden = true;
  document.body.style.overflow = "";
}

document.querySelectorAll(".learn-more").forEach(btn => {
  btn.addEventListener("click", () => {
    const topic = topicContent[btn.dataset.topic];
    openModal(topic.title, topic.body);
  });
});

$("modalClose").addEventListener("click", closeModal);
$("modalBackdrop").addEventListener("click", e => {
  if (e.target === $("modalBackdrop")) closeModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

function renderQuiz() {
  const item = quizzes[quizIndex];
  answered = false;
  $("quizCount").textContent = `Question ${quizIndex + 1} of ${quizzes.length}`;
  $("quizProgressText").textContent = `${Math.round(((quizIndex + 1) / quizzes.length) * 100)}%`;
  $("quizProgress").style.width = `${((quizIndex + 1) / quizzes.length) * 100}%`;
  $("quizQuestion").textContent = item.q;
  $("quizFeedback").textContent = "";
  $("nextQuestion").hidden = true;
  $("nextQuestion").textContent = quizIndex === quizzes.length - 1 ? "See my result →" : "Next question →";

  const answers = $("quizAnswers");
  answers.innerHTML = "";
  item.a.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = answer;
    button.addEventListener("click", () => chooseAnswer(index));
    answers.appendChild(button);
  });
}

function chooseAnswer(index) {
  if (answered) return;
  answered = true;
  const item = quizzes[quizIndex];
  const buttons = [...document.querySelectorAll(".answer")];
  buttons.forEach(b => b.disabled = true);
  buttons[item.c].classList.add("correct");

  if (index === item.c) {
    score++;
    $("quizFeedback").textContent = "Correct — " + item.e;
  } else {
    buttons[index].classList.add("wrong");
    $("quizFeedback").textContent = "Not quite — " + item.e;
  }
  $("nextQuestion").hidden = false;
}

$("nextQuestion").addEventListener("click", () => {
  if (quizIndex === quizzes.length - 1) {
    const percentage = Math.round((score / quizzes.length) * 100);
    const previous = Number(localStorage.getItem("saferiseBestScore") || 0);
    if (percentage > previous) localStorage.setItem("saferiseBestScore", percentage);
    $("bestScore").textContent = `${Math.max(percentage, previous)}%`;
    openModal("Quiz complete", `<p>You scored <strong>${score} / ${quizzes.length}</strong> (${percentage}%).</p>
      <p style="margin-top:12px">Keep learning — the goal of SafeRise is awareness, not perfection.</p>
      <p class="modal-note">You can close this window and take the quiz again whenever you want.</p>`);
    quizIndex = 0;
    score = 0;
    renderQuiz();
  } else {
    quizIndex++;
    renderQuiz();
  }
});

$("bestScore").textContent = `${Number(localStorage.getItem("saferiseBestScore") || 0)}%`;
renderQuiz();

const savedMessages = JSON.parse(localStorage.getItem("saferiseMessages") || "[]");
const chatMessages = $("chatMessages");
savedMessages.forEach(message => addMessage(message, "sent"));

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

$("chatForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("chatInput");
  const value = input.value.trim();
  if (!value) return;
  addMessage(value, "sent");
  const messages = JSON.parse(localStorage.getItem("saferiseMessages") || "[]");
  messages.push(value);
  localStorage.setItem("saferiseMessages", JSON.stringify(messages.slice(-30)));
  input.value = "";
});

$("emergencyButton").addEventListener("click", () => {
  openModal("Emergency options", `
    <p><strong>If you are in immediate danger:</strong></p>
    <ul>
      <li>Move to a safer place if you can do so safely.</li>
      <li>Contact your local emergency service or police.</li>
      <li>If possible, contact someone you trust and tell them where you are.</li>
    </ul>
    <p class="modal-note">SafeRise is a prototype and does not place calls or provide live crisis response. Always verify current local contact details.</p>
  `);
});

const menuToggle = $("menuToggle");
const mobileMenu = $("mobileMenu");
menuToggle.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
