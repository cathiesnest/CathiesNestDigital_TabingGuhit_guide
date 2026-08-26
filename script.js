/* =========================================================
   TABING GUHIT
   Powered by CathiesNest Digital

   FUNCTIONALITY:
   - Find Your Niche
   - AI Co-Pilot interface
   - Know Your Worth calculator
   - Financial Reset
   - Expense management
   - Alison affiliate-link configuration
   - Optional GA4 event tracking

   SECURITY:
   - No API keys
   - No passwords
   - No private credentials
   - No permanent storage of financial information
   - No invented exchange rates
   ========================================================= */


/* =========================================================
   SAFE CONFIGURATION
   ========================================================= */

/*
  IMPORTANT:

  Replace this placeholder only when you have your actual
  Alison affiliate URL.

  Do NOT place private API keys here.
*/

const CONFIG = {
  ALISON_AFFILIATE_URL: "ALISON_AFFILIATE_URL",

  /*
    AI is intentionally disabled until a secure backend/API
    connection is configured.

    Never place a secret AI API key in this frontend file.
  */
  AI_ENABLED: false,

  /*
    Exchange-rate conversion is intentionally disabled until
    a real exchange-rate source is connected.

    Never invent or hard-code a "live" rate.
  */
  EXCHANGE_RATES_ENABLED: false
};


/* =========================================================
   GENERAL HELPERS
   ========================================================= */

function formatNumber(value, decimals = 2) {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}


function getCurrencySymbol(currency) {
  const symbols = {
    USD: "$",
    PHP: "₱",
    EUR: "€",
    GBP: "£",
    CAD: "C$",
    AUD: "A$",
    SGD: "S$",
    AED: "د.إ",
    SAR: "﷼",
    JPY: "¥"
  };

  return symbols[currency] || currency;
}


function scrollToElement(id) {
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}


/* =========================================================
   OPTIONAL GA4 EVENT TRACKING
   ========================================================= */

/*
  This works only if Google Analytics 4 has been installed
  separately with your own Measurement ID.

  We intentionally do not invent a GA4 Measurement ID.
*/

function trackEvent(eventName, parameters = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, parameters);
  }
}


/* =========================================================
   FIND YOUR NICHE
   ========================================================= */

const nicheForm = document.getElementById("nicheForm");
const nicheResult = document.getElementById("nicheResult");
const clearNicheButton = document.getElementById("clearNiche");


if (nicheForm && nicheResult) {

  nicheForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const interest = document.getElementById("nicheInterest").value;
    const strength = document.getElementById("nicheStrength").value;
    const work = document.getElementById("nicheWork").value;
    const goal = document.getElementById("nicheGoal").value;
    const lifestyle = document.getElementById("nicheLifestyle").value;

    if (!interest || !strength || !work || !goal || !lifestyle) {
      nicheResult.classList.remove("hidden");

      nicheResult.innerHTML = `
        <h3>Please complete all five questions.</h3>
        <p>
          Choose an answer for each question so we can create
          a more useful self-reflection result.
        </p>
      `;

      return;
    }


    /*
      Simple scoring system.

      Each answer contributes to possible directions.
      The result is based on the user's combination of answers.
    */

    const scores = {
      "Digital & Technology": 0,
      "Creative & Content": 0,
      "Virtual Assistance & Administration": 0,
      "Customer Support & People Services": 0,
      "Freelancing & Entrepreneurship": 0,
      "Learning & Professional Development": 0
    };


    /* INTEREST */

    if (interest === "technology") {
      scores["Digital & Technology"] += 3;
    }

    if (interest === "creative") {
      scores["Creative & Content"] += 3;
    }

    if (interest === "organization") {
      scores["Virtual Assistance & Administration"] += 3;
    }

    if (interest === "people") {
      scores["Customer Support & People Services"] += 3;
    }

    if (interest === "business") {
      scores["Freelancing & Entrepreneurship"] += 3;
    }


    /* STRENGTH */

    if (strength === "creative") {
      scores["Creative & Content"] += 3;
    }

    if (strength === "analytical") {
      scores["Digital & Technology"] += 2;
      scores["Virtual Assistance & Administration"] += 1;
    }

    if (strength === "communication") {
      scores["Customer Support & People Services"] += 3;
    }

    if (strength === "organization") {
      scores["Virtual Assistance & Administration"] += 3;
    }

    if (strength === "empathy") {
      scores["Customer Support & People Services"] += 3;
    }


    /* WORK STYLE */

    if (work === "independent") {
      scores["Freelancing & Entrepreneurship"] += 2;
    }

    if (work === "team") {
      scores["Customer Support & People Services"] += 2;
    }

    if (work === "client") {
      scores["Customer Support & People Services"] += 2;
      scores["Virtual Assistance & Administration"] += 1;
    }

    if (work === "project") {
      scores["Creative & Content"] += 2;
      scores["Digital & Technology"] += 1;
    }

    if (work === "structured") {
      scores["Virtual Assistance & Administration"] += 2;
    }


    /* GOAL */

    if (goal === "income") {
      scores["Freelancing & Entrepreneurship"] += 2;
      scores["Virtual Assistance & Administration"] += 1;
    }

    if (goal === "career") {
      scores["Digital & Technology"] += 2;
      scores["Learning & Professional Development"] += 1;
    }

    if (goal === "freelance") {
      scores["Freelancing & Entrepreneurship"] += 3;
    }

    if (goal === "business") {
      scores["Freelancing & Entrepreneurship"] += 3;
    }

    if (goal === "learning") {
      scores["Learning & Professional Development"] += 3;
    }


    /* LIFESTYLE */

    if (lifestyle === "remote") {
      scores["Digital & Technology"] += 2;
      scores["Virtual Assistance & Administration"] += 2;
      scores["Freelancing & Entrepreneurship"] += 2;
    }

    if (lifestyle === "hybrid") {
      scores["Customer Support & People Services"] += 1;
    }

    if (lifestyle === "office") {
      scores["Customer Support & People Services"] += 1;
      scores["Virtual Assistance & Administration"] += 1;
    }

    if (lifestyle === "flexible") {
      scores["Freelancing & Entrepreneurship"] += 2;
    }

    if (lifestyle === "stable") {
      scores["Virtual Assistance & Administration"] += 2;
      scores["Customer Support & People Services"] += 1;
    }


    /* FIND HIGHEST SCORE */

    let bestDirection = "";
    let highestScore = -1;

    Object.entries(scores).forEach(([direction, score]) => {

      if (score > highestScore) {
        highestScore = score;
        bestDirection = direction;
      }

    });


    const resultDetails = {

      "Digital & Technology": {
        explanation:
          "Your answers suggest that digital tools, technology, and problem-solving may be worth exploring.",

        nextStep:
          "Consider exploring beginner-friendly digital skills such as AI tools, automation, data, web technologies, or digital operations."
      },

      "Creative & Content": {
        explanation:
          "Your answers suggest that creativity and project-based work may fit your interests and strengths.",

        nextStep:
          "Consider exploring content creation, graphic design, writing, social media, video editing, or other creative digital skills."
      },

      "Virtual Assistance & Administration": {
        explanation:
          "Your answers suggest that organization, structure, and practical support work may be a strong direction.",

        nextStep:
          "Consider exploring virtual assistance, administrative support, project coordination, documentation, or operations support."
      },

      "Customer Support & People Services": {
        explanation:
          "Your answers suggest that communication, empathy, and people-focused work may suit you.",

        nextStep:
          "Consider exploring customer support, customer success, onboarding, community support, or people-centered service roles."
      },

      "Freelancing & Entrepreneurship": {
        explanation:
          "Your answers suggest that independence, flexibility, and building your own opportunities may appeal to you.",

        nextStep:
          "Consider identifying one marketable skill, building a small portfolio, and researching realistic freelance or business opportunities."
      },

      "Learning & Professional Development": {
        explanation:
          "Your answers suggest that learning and developing new capabilities are important to your current direction.",

        nextStep:
          "Consider choosing one practical skill and completing a beginner-friendly course or project to build evidence of your ability."
      }

    };


    const result = resultDetails[bestDirection];


    nicheResult.classList.remove("hidden");

    nicheResult.innerHTML = `
      <h3>Your Possible Direction: ${bestDirection}</h3>

      <p>
        ${result.explanation}
      </p>

      <p>
        <strong>Suggested next step:</strong>
        ${result.nextStep}
      </p>
    `;


    trackEvent("niche_result_generated", {
      direction: bestDirection
    });

    nicheResult.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

  });
}


/* CLEAR NICHE */

if (clearNicheButton) {

  clearNicheButton.addEventListener("click", function () {

    if (nicheForm) {
      nicheForm.reset();
    }

    if (nicheResult) {
      nicheResult.classList.add("hidden");
      nicheResult.innerHTML = "";
    }

    trackEvent("niche_form_cleared");

  });

}


/* =========================================================
   AI CO-PILOT
   ========================================================= */

const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const clearChatButton = document.getElementById("clearChat");


function addChatMessage(type, title, message) {

  if (!chatMessages) {
    return;
  }

  const messageElement = document.createElement("div");

  messageElement.className = `chat-message ${type}`;

  const strong = document.createElement("strong");
  strong.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.textContent = message;

  messageElement.appendChild(strong);
  messageElement.appendChild(paragraph);

  chatMessages.appendChild(messageElement);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}


if (chatForm && chatInput) {

  chatForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const question = chatInput.value.trim();

    if (!question) {
      return;
    }


    addChatMessage(
      "user",
      "You",
      question
    );


    chatInput.value = "";


    /*
      AI is intentionally not connected yet.

      A frontend-only API key would expose the key to visitors.
      A secure backend is required before enabling real AI.
    */

    if (!CONFIG.AI_ENABLED) {

      setTimeout(function () {

        addChatMessage(
          "assistant",
          "AI Co-Pilot",
          "AI Co-Pilot is not configured yet. Your question was not sent to an external AI service. Please configure a secure backend connection before enabling AI responses."
        );

      }, 300);

      return;
    }


    /*
      Future secure implementation goes here.

      Example architecture:

      Browser
          ↓
      Your secure backend
          ↓
      AI provider

      Never:

      Browser
          ↓
      Private API key
    */

  });

}


/* CLEAR CHAT */

if (clearChatButton && chatMessages) {

  clearChatButton.addEventListener("click", function () {

    chatMessages.innerHTML = `
      <div class="chat-message assistant">
        <strong>AI Co-Pilot</strong>
        <p>
          AI Co-Pilot is not configured yet. Please check back later.
        </p>
      </div>
    `;

    if (chatInput) {
      chatInput.value = "";
    }

    trackEvent("ai_conversation_cleared");

  });

}


/* =========================================================
   KNOW YOUR WORTH
   ========================================================= */

const worthForm = document.getElementById("worthForm");
const worthResult = document.getElementById("worthResult");
const clearWorthButton = document.getElementById("clearWorth");


if (worthForm && worthResult) {

  worthForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const startingCurrency =
      document.getElementById("startingCurrency").value;

    const targetCurrency =
      document.getElementById("targetCurrency").value;

    const hourly =
      Number(document.getElementById("hourlyAmount").value);

    const hoursPerDay =
      Number(document.getElementById("hoursPerDay").value);

    const daysPerWeek =
      Number(document.getElementById("daysPerWeek").value);

    const monthsPerYear =
      Number(document.getElementById("monthsPerYear").value);


    if (
      hourly < 0 ||
      hoursPerDay <= 0 ||
      daysPerWeek <= 0 ||
      monthsPerYear <= 0
    ) {

      worthResult.classList.remove("hidden");

      worthResult.innerHTML = `
        <h3>Please check your numbers.</h3>

        <p>
          Hours per day, days per week, and months per year
          must contain valid positive values.
        </p>
      `;

      return;
    }


    const daily =
      hourly * hoursPerDay;

    const weekly =
      daily * daysPerWeek;

    const monthly =
      weekly * 52 / 12;

    const annual =
      weekly * 52;


    /*
      If both currencies are the same, no conversion is necessary.
    */

    if (
      startingCurrency === targetCurrency
    ) {

      const symbol =
        getCurrencySymbol(startingCurrency);

      displayWorthResults(
        symbol,
        symbol,
        daily,
        weekly,
        monthly,
        annual,
        startingCurrency,
        targetCurrency
      );

      return;
    }


    /*
      Different currencies require a live exchange-rate source.

      We intentionally refuse to guess.
    */

    if (!CONFIG.EXCHANGE_RATES_ENABLED) {

      worthResult.classList.remove("hidden");

      worthResult.innerHTML = `
        <h3>Conversion is not available yet.</h3>

        <p>
          Your earnings have been calculated in
          <strong>${startingCurrency}</strong>,
          but a live exchange-rate service has not been configured.
        </p>

        <p>
          No exchange rate has been estimated or invented.
          Please try again later or select the same starting
          and target currency.
        </p>
      `;

      trackEvent("currency_conversion_unavailable", {
        starting_currency: startingCurrency,
        target_currency: targetCurrency
      });

      return;
    }

    /*
      A secure exchange-rate integration can be added here later.
    */

  });
}


function displayWorthResults(
  startingSymbol,
  targetSymbol,
  daily,
  weekly,
  monthly,
  annual,
  startingCurrency,
  targetCurrency
) {

  worthResult.classList.remove("hidden");

  worthResult.innerHTML = `
    <h3>Earnings Estimate</h3>

    <p>
      <strong>Starting Currency:</strong>
      ${startingCurrency}
    </p>

    <p>
      <strong>Target Currency:</strong>
      ${targetCurrency}
    </p>

    <div class="earnings-list">

      <p>
        <strong>Hourly Earnings:</strong>
        ${startingSymbol}${formatNumber(
          Number(document.getElementById("hourlyAmount").value)
        )}
      </p>

      <p>
        <strong>Daily Earnings:</strong>
        ${startingSymbol}${formatNumber(daily)}
      </p>

      <p>
        <strong>Weekly Earnings:</strong>
        ${startingSymbol}${formatNumber(weekly)}
      </p>

      <p>
        <strong>Monthly Earnings:</strong>
        ${startingSymbol}${formatNumber(monthly)}
      </p>

      <p>
        <strong>Annual Earnings:</strong>
        ${startingSymbol}${formatNumber(annual)}
      </p>

    </div>

    <p class="small-note">
      Starting and target currencies are currently the same,
      so no conversion was necessary.
    </p>
  `;


  trackEvent("worth_calculated", {
    currency: startingCurrency
  });


  worthResult.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });

}


/* CLEAR WORTH */

if (clearWorthButton) {

  clearWorthButton.addEventListener("click", function () {

    if (worthForm) {
      worthForm.reset();
    }

    if (worthResult) {
      worthResult.classList.add("hidden");
      worthResult.innerHTML = "";
    }

    trackEvent("worth_calculator_cleared");

  });

}


/* =========================================================
   FINANCIAL RESET
   ========================================================= */

const addExpenseButton =
  document.getElementById("addExpense");

const expensesList =
  document.getElementById("expensesList");

const showBudgetButton =
  document.getElementById("showBudget");

const resetBudgetButton =
  document.getElementById("resetBudget");

const budgetResult =
  document.getElementById("budgetResult");


/* ADD EXPENSE */

if (addExpenseButton && expensesList) {

  addExpenseButton.addEventListener("click", function () {

    const row =
      document.createElement("div");

    row.className =
      "expense-row";

    row.innerHTML = `
      <input
        type="text"
        class="expense-name"
        placeholder="Expense name"
        aria-label="Expense name"
      >

      <input
        type="number"
        class="expense-amount"
        min="0"
        step="0.01"
        placeholder="Amount"
        aria-label="Expense amount"
      >

      <button
        type="button"
        class="delete-expense"
        aria-label="Delete expense"
        title="Delete expense"
      >
        🗑
      </button>
    `;

    expensesList.appendChild(row);

    trackEvent("expense_added");

    const nameInput =
      row.querySelector(".expense-name");

    if (nameInput) {
      nameInput.focus();
    }

  });

}


/* DELETE EXPENSE */

if (expensesList) {

  expensesList.addEventListener("click", function (event) {

    const deleteButton =
      event.target.closest(".delete-expense");

    if (!deleteButton) {
      return;
    }

    const row =
      deleteButton.closest(".expense-row");

    if (row) {
      row.remove();

      trackEvent("expense_deleted");
    }

  });

}


/* SHOW BUDGET */

if (showBudgetButton && budgetResult) {

  showBudgetButton.addEventListener("click", function () {

    const income =
      Number(
        document.getElementById("monthlyIncome").value
      );


    if (!Number.isFinite(income) || income < 0) {

      budgetResult.classList.remove("hidden");

      budgetResult.innerHTML = `
        <h3>Please enter your monthly income.</h3>

        <p>
          Enter a valid amount before creating your budget summary.
        </p>
      `;

      return;
    }


    const currency =
      document.getElementById("displayCurrency").value;

    const symbol =
      getCurrencySymbol(currency);


    const expenseRows =
      document.querySelectorAll(".expense-row");


    let totalExpenses = 0;


    expenseRows.forEach(function (row) {

      const amountInput =
        row.querySelector(".expense-amount");

      const amount =
        Number(amountInput?.value || 0);

      if (Number.isFinite(amount) && amount > 0) {
        totalExpenses += amount;
      }

    });


    const remaining =
      income - totalExpenses;


    const percentageUsed =
      income > 0
        ? (totalExpenses / income) * 100
        : 0;


    const status =
      remaining < 0
        ? "Your listed expenses are higher than your monthly income."
        : "Your listed expenses are within your monthly income.";


    const statusClass =
      remaining < 0
        ? "budget-warning"
        : "budget-positive";


    budgetResult.classList.remove("hidden");


    budgetResult.innerHTML = `
      <h3>Budget Summary</h3>

      <p>
        <strong>Total Monthly Income:</strong>
        ${symbol}${formatNumber(income)}
      </p>

      <p>
        <strong>Total Monthly Expenses:</strong>
        ${symbol}${formatNumber(totalExpenses)}
      </p>

      <p>
        <strong>Remaining Balance:</strong>
        ${symbol}${formatNumber(remaining)}
      </p>

      <p>
        <strong>Percentage of Income Used:</strong>
        ${formatNumber(percentageUsed, 1)}%
      </p>

      <p class="${statusClass}">
        <strong>${status}</strong>
      </p>
    `;


    trackEvent("budget_summary_generated", {
      currency: currency
    });


    budgetResult.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

  });

}


/* RESET BUDGET */

if (resetBudgetButton) {

  resetBudgetButton.addEventListener("click", function () {

    const incomeInput =
      document.getElementById("monthlyIncome");

    if (incomeInput) {
      incomeInput.value = "";
    }


    if (expensesList) {

      expensesList.innerHTML = `
        <div class="expense-row">

          <input
            type="text"
            class="expense-name"
            value="Rent"
            aria-label="Expense name"
          >

          <input
            type="number"
            class="expense-amount"
            min="0"
            step="0.01"
            placeholder="Amount"
            aria-label="Expense amount"
          >

          <button
            type="button"
            class="delete-expense"
            aria-label="Delete Rent expense"
            title="Delete expense"
          >
            🗑
          </button>

        </div>

        <div class="expense-row">

          <input
            type="text"
            class="expense-name"
            value="Bills"
            aria-label="Expense name"
          >

          <input
            type="number"
            class="expense-amount"
            min="0"
            step="0.01"
            placeholder="Amount"
            aria-label="Expense amount"
          >

          <button
            type="button"
            class="delete-expense"
            aria-label="Delete Bills expense"
            title="Delete expense"
          >
            🗑
          </button>

        </div>
      `;

    }


    if (budgetResult) {
      budgetResult.classList.add("hidden");
      budgetResult.innerHTML = "";
    }


    trackEvent("budget_reset");

  });

}


/* =========================================================
   ALISON FREE COURSES
   ========================================================= */

const alisonLink =
  document.getElementById("alisonLink");

const alisonMessage =
  document.getElementById("alisonMessage");


if (alisonLink) {

  if (
    CONFIG.ALISON_AFFILIATE_URL &&
    CONFIG.ALISON_AFFILIATE_URL !== "ALISON_AFFILIATE_URL"
  ) {

    alisonLink.href =
      CONFIG.ALISON_AFFILIATE_URL;

    alisonLink.addEventListener("click", function () {

      trackEvent("alison_course_link_click");

    });


    if (alisonMessage) {
      alisonMessage.textContent =
        "Course information and availability are provided by Alison.";
    }

  } else {

    /*
      We do not invent an affiliate URL.

      The button remains disabled until the owner adds
      the correct URL to the configuration.
    */

    alisonLink.addEventListener("click", function (event) {

      event.preventDefault();

      if (alisonMessage) {

        alisonMessage.textContent =
          "The course link has not been configured yet. Please check back later.";

      }

    });


    alisonMessage.textContent =
      "The course link will be available once the site owner configures it.";

  }

}


/* =========================================================
   PREVENT ACCIDENTAL FORM SUBMISSION ON ENTER
   WHERE APPROPRIATE
   ========================================================= */

document.addEventListener("keydown", function (event) {

  if (
    event.key === "Enter" &&
    event.target.tagName === "INPUT" &&
    event.target.closest(".expense-row")
  ) {

    event.preventDefault();

  }

});


/* =========================================================
   BASIC INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /*
    We intentionally do not store financial information
    in localStorage, cookies, databases, or browser storage.
  */

  trackEvent("tabing_guhit_page_loaded");

});
