document.addEventListener("DOMContentLoaded", function () {
  const openButton = document.getElementById("friendship-test-open");
  const closeButton = document.getElementById("friendship-test-close");
  const nextButton = document.getElementById("friendship-test-next");
  const modal = document.getElementById("friendship-test-modal");
  const stage = document.getElementById("friendship-test-stage");
  const progress = document.getElementById("friendship-test-progress");

  if (
    !openButton ||
    !closeButton ||
    !nextButton ||
    !modal ||
    !stage ||
    !progress
  ) {
    return;
  }

  const questions = [
    {
      prompt: "Your favorite social energy?",
      options: [
        {
          key: "A",
          text: "Solo/Alone",
          points: 5,
          image: "ft/assets/solo.jpg",
          imagePosition: "center center",
        },
        {
          key: "B",
          text: "Small group",
          points: 3,
          image: "ft/assets/small.jpg",
          imagePosition: "center center",
        },
        {
          key: "C",
          text: "Big group",
          points: 0,
          image: "ft/assets/group.jpg",
          imagePosition: "center 58%",
        },
      ],
    },
    {
      prompt: "Which type of music do you naturally prefer?",
      options: [
        { key: "A", text: "Lyrics-driven", points: 3 },
        { key: "B", text: "Instrumental / no vocals", points: 5 },
      ],
    },
    {
      prompt: "Do you support piracy?",
      options: [
        { key: "A", text: "Yes", points: 5 },
        { key: "B", text: "No", points: 0 },
      ],
    },
    {
      prompt: "What kind of recognition do you prefer?",
      options: [
        { key: "A", text: "Unnoticed competence", points: 7 },
        { key: "B", text: "Recognition is useful but optional", points: 4 },
        { key: "C", text: "Being seen matters", points: 0 },
      ],
    },
    {
      prompt: "How do you prefer to learn?",
      options: [
        { key: "A", text: "Fast progress through various topics", points: 0 },
        { key: "B", text: "Depth over breadth", points: 8 },
        { key: "C", text: "Balanced", points: 5 },
      ],
    },
    {
      prompt: "When facing disagreement:",
      options: [
        { key: "A", text: "Walk away", points: 10 },
        { key: "B", text: "Confront directly", points: 10 },
        { key: "C", text: "Avoid and adapt", points: 0 },
      ],
    },
    {
      prompt: "Social adaptability:",
      options: [
        {
          key: "A",
          text: "I have the ability to fix people in need of help",
          points: 6,
        },
        { key: "B", text: "I dont deal with broken people", points: 10 },
        {
          key: "C",
          text: "I stay regardless of their nature and dont get affected",
          points: 0,
        },
      ],
    },
    {
      prompt: "Meaning of life:",
      options: [
        { key: "A", text: "meaning is constructed by humans", points: 15 },
        { key: "B", text: "meaning is divine and beyond-human", points: 0 },
        {
          key: "C",
          text: "there's no meaning/meaning is a distraction",
          points: 15,
        },
      ],
    },
    {
      prompt: "If given power over the world:",
      options: [
        { key: "A", text: "Reset everything and restart", points: 0 },
        { key: "B", text: "Reform gradually", points: 9 },
        { key: "C", text: "Ignore world, optimize self", points: 15 },
      ],
    },
    {
      prompt: "High-pressure decision making:",
      detail:
        "scenario -> you are a doctor in a warzone. you are left with limited resources to treat just one person. two injured people are brought forth you. whom will you save?",
      options: [
        {
          key: "A",
          text: "a newly admitted soldier. most kind-hearted one who is ready to sacrifice his life to protect as many people as possible.",
          points: 0,
        },
        {
          key: "B",
          text: "the strongest general of your army who can take the enemy's head and stop the war in less than an hour.",
          points: 20,
        },
      ],
    },
  ];

  let index = 0;
  let score = 0;
  let answers = [];
  let selected = null;
  let started = false;

  function setProgress() {
    const ratio = Math.min(index / questions.length, 1);
    progress.style.width = `${ratio * 100}%`;
  }

  function resetState() {
    index = 0;
    score = 0;
    answers = [];
    selected = null;
    started = false;
    nextButton.hidden = true;
  }

  function openModal() {
    resetState();
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("ft-open");
    renderIntro();
  }

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("ft-open");
    stage.innerHTML = "";
  }

  function renderQuestion() {
    selected = null;
    nextButton.hidden = true;
    setProgress();

    const question = questions[index];
    const detailHtml = question.detail
      ? `<p class="ft-scenario">${question.detail}</p>`
      : "";

    stage.innerHTML = `
      <div class="ft-question-wrap">
        <p class="ft-kicker">Friendship Test</p>
        <h2 class="ft-question">${question.prompt}</h2>
        ${detailHtml}
        <div class="ft-options" id="friendship-test-options"></div>
      </div>
    `;

    const options = document.getElementById("friendship-test-options");
    question.options.forEach(function (option) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ft-option";
      const media = option.image
        ? `<span class="ft-option-media"><img src="${option.image}" alt="" loading="lazy" style="object-position: ${option.imagePosition || "center center"}"></span>`
        : "";
      button.innerHTML = `
        ${media}
        <span class="ft-option-label">${option.key}</span>
        <span>${option.text}</span>
      `;
      button.addEventListener("click", function () {
        selected = option;
        answers[index] = option.key;
        nextButton.hidden = false;
        options.querySelectorAll(".ft-option").forEach(function (node) {
          node.classList.remove("is-selected");
        });
        button.classList.add("is-selected");
      });
      options.appendChild(button);
    });
  }

  function renderIntro() {
    progress.style.width = "0";
    nextButton.hidden = true;
    stage.innerHTML = `
      <div class="ft-question-wrap">
        <p class="ft-kicker">Friendship Test</p>
        <h2 class="ft-question">Before you start</h2>
        <div class="ft-options">
          <div class="ft-note-card">
            <ul class="ft-note-list">
              <li>This ain't a test of intelligence/morality</li>
              <li>No answer here is right or wrong</li>
              <li>Answers are anonymous</li>
	      <li>This is just for fun</li>
            </ul>
          </div>
        </div>
        <button type="button" class="ft-next" id="friendship-test-start">start</button>
      </div>
    `;

    const startButton = document.getElementById("friendship-test-start");
    startButton.addEventListener("click", function () {
      started = true;
      renderQuestion();
    });
  }

  function renderResult() {
    progress.style.width = "100%";
    stage.innerHTML = `
      <div class="ft-result">
        <p>${
          score >= 90
            ? "High compatibility. This is a strong personality match. Reach out on X if you want!"
            : "Heavily incompatible. Not a match."
        }</p>
      </div>
    `;
    nextButton.hidden = true;
  }

  openButton.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  nextButton.addEventListener("click", function () {
    if (!started || !selected) {
      return;
    }

    score += selected.points;
    index += 1;

    if (index >= questions.length) {
      renderResult();
      return;
    }

    renderQuestion();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
});
