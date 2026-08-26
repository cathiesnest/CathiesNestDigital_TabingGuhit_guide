/* =========================================================
   TABING GUHIT
   Powered by CathiesNest Digital

   FUNCTIONALITY:
   - Find Your Niche
   - AI Co-Pilot
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
   ========================================================= */


/* =========================================================
   SAFE CONFIGURATION
   ========================================================= */

const CONFIG = {

  ALISON_AFFILIATE_URL:
    "https://alison.com/?utm_source=alison_user&utm_medium=affiliate&utm_campaign=42404117",

  /*
    AI Co-Pilot uses a local career guidance response system.
    No private API key is exposed in this public JavaScript file.
  */
  AI_ENABLED: true,

  /*
    Currency conversion uses a public exchange-rate service.
    No private API key is required.
  */
  EXCHANGE_RATES_ENABLED: true,

  EXCHANGE_RATE_API:
    "https://open.er-api.com/v6/latest/"
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

function trackEvent(eventName, parameters = {}) {

  if (typeof window.gtag === "function") {

    window.gtag(
      "event",
      eventName,
      parameters
    );

  }

}


/* =========================================================
   FIND YOUR NICHE
   ========================================================= */

const nicheForm =
  document.getElementById("nicheForm");

const nicheResult =
  document.getElementById("nicheResult");

const clearNicheButton =
  document.getElementById("clearNiche");


if (nicheForm && nicheResult) {

  nicheForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const interest =
      document.getElementById("nicheInterest").value;

    const strength =
      document.getElementById("nicheStrength").value;

    const work =
      document.getElementById("nicheWork").value;

    const goal =
      document.getElementById("nicheGoal").value;

    const lifestyle =
      document.getElementById("nicheLifestyle").value;


    if (
      !interest ||
      !strength ||
      !work ||
      !goal ||
      !lifestyle
    ) {

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


    Object.entries(scores).forEach(
      ([direction, score]) => {

        if (score > highestScore) {

          highestScore = score;

          bestDirection = direction;

        }

      }
    );


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


    const result =
      resultDetails[bestDirection];


    nicheResult.classList.remove("hidden");


    nicheResult.innerHTML = `

      <h3>
        Your Possible Direction: ${bestDirection}
      </h3>

      <p>
        ${result.explanation}
      </p>

      <p>
        <strong>Suggested next step:</strong>
        ${result.nextStep}
      </p>

    `;


    trackEvent(
      "niche_result_generated",
      {
        direction: bestDirection
      }
    );


    nicheResult.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

  });

}


/* =========================================================
   CLEAR NICHE
   ========================================================= */

if (clearNicheButton) {

  clearNicheButton.addEventListener(
    "click",
    function () {

      if (nicheForm) {

        nicheForm.reset();

      }


      if (nicheResult) {

        nicheResult.classList.add("hidden");

        nicheResult.innerHTML = "";

      }


      trackEvent(
        "niche_form_cleared"
      );

    }
  );

}


/* =========================================================
   AI CO-PILOT
   ========================================================= */

const chatForm =
  document.getElementById("chatForm");

const chatInput =
  document.getElementById("chatInput");

const chatMessages =
  document.getElementById("chatMessages");

const clearChatButton =
  document.getElementById("clearChat");


function addChatMessage(
  type,
  title,
  message
) {

  if (!chatMessages) {

    return;

  }


  const messageElement =
    document.createElement("div");


  messageElement.className =
    `chat-message ${type}`;


  const strong =
    document.createElement("strong");

  strong.textContent =
    title;


  const paragraph =
    document.createElement("p");

  paragraph.textContent =
    message;


  messageElement.appendChild(
    strong
  );

  messageElement.appendChild(
    paragraph
  );


  chatMessages.appendChild(
    messageElement
  );


  chatMessages.scrollTop =
    chatMessages.scrollHeight;

}


/* =========================================================
   AI CAREER RESPONSE ENGINE
   ========================================================= */

function generateCareerResponse(question) {

  const text =
    question.toLowerCase();


  /* REMOTE WORK */

  if (
    text.includes("remote") ||
    text.includes("work from home") ||
    text.includes("wfh")
  ) {

    return `
If you're aiming for a remote career, focus first on skills that employers can clearly see and evaluate.

Good areas to explore include virtual assistance, customer success, administrative support, project coordination, AI-assisted operations, and digital support.

Start with one direction rather than trying to learn everything at once. Build a simple portfolio or sample project, then apply for roles that match your existing experience while continuing to upskill.

Your existing experience is valuable. A career transition does not mean starting from zero.
    `.trim();

  }


  /* CAREER CHANGE */

  if (
    text.includes("career change") ||
    text.includes("change career") ||
    text.includes("career transition") ||
    text.includes("switch career")
  ) {

    return `
A career change can be approached as a transition rather than starting over.

First, identify the skills you already have that transfer to another role. Communication, customer service, administration, problem-solving, quality assurance, coordination, and technology skills can often transfer across industries.

Then choose one target role and identify the two or three skills you need to strengthen.

Build evidence of those skills through a small project, course, portfolio sample, or practical experience.

You don't need to change everything at once. A focused transition is usually easier to manage.
    `.trim();

  }


  /* JOB SEARCH */

  if (
    text.includes("job") ||
    text.includes("apply") ||
    text.includes("application") ||
    text.includes("hiring") ||
    text.includes("employment")
  ) {

    return `
For your job search, focus on alignment rather than applying everywhere.

Choose roles that match your strongest transferable skills and tailor your resume toward those skills.

For each application, make sure your professional summary and recent accomplishments clearly show how you can solve the employer's problems.

Also consider remote roles in administration, customer success, virtual assistance, operations, project support, and AI-enabled business support if they match your experience.

Quality and relevance can be more useful than sending a very large number of applications.
    `.trim();

  }


  /* SALARY */

  if (
    text.includes("salary") ||
    text.includes("pay") ||
    text.includes("rate") ||
    text.includes("worth") ||
    text.includes("underpaid") ||
    text.includes("lowball") ||
    text.includes("low-ball")
  ) {

    return `
Your compensation should reflect the value of the work, your experience, the responsibilities of the role, and the market.

Before accepting an offer, compare the responsibilities, required skills, schedule, benefits, and expected workload—not just the headline salary.

If an offer is below your target, you can respectfully ask whether there is flexibility or explain the value you bring.

Starting small is okay. Undervaluing yourself is not.
    `.trim();

  }


  /* SKILLS */

  if (
    text.includes("skill") ||
    text.includes("learn") ||
    text.includes("course") ||
    text.includes("upskill") ||
    text.includes("training")
  ) {

    return `
Choose a skill that connects directly to the type of work you want.

For example, if you want administrative or VA work, strengthen tools such as Google Workspace, project management, documentation, CRM systems, and AI-assisted workflows.

If you want a digital career, consider AI tools, automation, data fundamentals, or web technologies.

The best learning plan is practical: learn one skill, use it in a small project, document the result, and use that evidence when applying for work.
    `.trim();

  }


  /* FREELANCE */

  if (
    text.includes("freelance") ||
    text.includes("freelancing") ||
    text.includes("client") ||
    text.includes("side hustle")
  ) {

    return `
For freelancing, start with one clear service instead of offering everything.

Choose a skill you already perform reasonably well, define the problem you solve, and create one or two simple examples of your work.

Your first goal does not have to be a large income. It can be getting your first client, testimonial, or portfolio example.

As you gain experience, you can improve your service, raise your rates, and specialize.
    `.trim();

  }


  /* CONFIDENCE */

  if (
    text.includes("confidence") ||
    text.includes("scared") ||
    text.includes("afraid") ||
    text.includes("lost") ||
    text.includes("don't know") ||
    text.includes("dont know")
  ) {

    return `
Feeling uncertain about your career does not mean you are behind.

Start by separating what you already know from what you still need to learn.

Write down three things you are good at, three things you have experience doing, and one type of work you would like to explore.

Then choose one small action you can complete this week—such as updating your resume, learning one skill, creating a portfolio sample, or applying for one well-matched role.

Progress becomes easier when the next step is small and specific.
    `.trim();

  }


  /* DEFAULT CAREER RESPONSE */

  return `
That's a good career question.

Start by looking at three things: your existing experience, the skills you enjoy using, and the type of work you want next.

You don't necessarily need to start over. Many career moves can be built from transferable skills.

A practical approach is to choose one target direction, identify the skills employers are asking for, strengthen the most important gap, and create evidence of your ability through a project, course, or portfolio sample.

If you're deciding between several career paths, compare them based on income potential, stability, required skills, flexibility, and how well they fit your current experience.
  `.trim();

}


if (
  chatForm &&
  chatInput
) {

  chatForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const question =
        chatInput.value.trim();


      if (!question) {

        return;

      }


      addChatMessage(
        "user",
        "You",
        question
      );


      chatInput.value = "";


      if (!CONFIG.AI_ENABLED) {

        return;

      }


      /*
        Generate a career-focused response locally.

        This keeps the public GitHub Pages site from
        exposing a private AI API key.
      */

      setTimeout(
        function () {

          const response =
            generateCareerResponse(
              question
            );


          addChatMessage(
            "assistant",
            "AI Co-Pilot",
            response
          );


          trackEvent(
            "ai_copilot_response_generated"
          );

        },
        300
      );

    }
  );

}


/* =========================================================
   CLEAR CHAT
   ========================================================= */

if (
  clearChatButton &&
  chatMessages
) {

  clearChatButton.addEventListener(
    "click",
    function () {

      chatMessages.innerHTML = `
        <div class="chat-message assistant">
          <strong>AI Co-Pilot</strong>

          <p>
            AI Co-Pilot is ready to help with career questions.
          </p>
        </div>
      `;


      if (chatInput) {

        chatInput.value = "";

      }


      trackEvent(
        "ai_conversation_cleared"
      );

    }
  );

}


/* =========================================================
   KNOW YOUR WORTH
   ========================================================= */

const worthForm =
  document.getElementById("worthForm");

const worthResult =
  document.getElementById("worthResult");

const clearWorthButton =
  document.getElementById("clearWorth");


if (
  worthForm &&
  worthResult
) {

  worthForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const startingCurrency =
        document.getElementById(
          "startingCurrency"
        ).value;


      const targetCurrency =
        document.getElementById(
          "targetCurrency"
        ).value;


      const hourly =
        Number(
          document.getElementById(
            "hourlyAmount"
          ).value
        );


      const hoursPerDay =
        Number(
          document.getElementById(
            "hoursPerDay"
          ).value
        );


      const daysPerWeek =
        Number(
          document.getElementById(
            "daysPerWeek"
          ).value
        );


      const monthsPerYear =
        Number(
          document.getElementById(
            "monthsPerYear"
          ).value
        );


      if (
        hourly < 0 ||
        hoursPerDay <= 0 ||
        daysPerWeek <= 0 ||
        monthsPerYear <= 0
      ) {

        worthResult.classList.remove(
          "hidden"
        );


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


      /* SAME CURRENCY */

      if (
        startingCurrency ===
        targetCurrency
      ) {

        const symbol =
          getCurrencySymbol(
            startingCurrency
          );


        displayWorthResults(
          symbol,
          symbol,
          daily,
          weekly,
          monthly,
          annual,
          startingCurrency,
          targetCurrency,
          null
        );


        return;

      }


      /* DIFFERENT CURRENCIES */

      if (
        !CONFIG.EXCHANGE_RATES_ENABLED
      ) {

        return;

      }


      worthResult.classList.remove(
        "hidden"
      );


      worthResult.innerHTML = `
        <h3>Calculating your earnings...</h3>

        <p>
          Please wait while we retrieve the latest
          available exchange rate.
        </p>
      `;


      try {

        const response =
          await fetch(
            CONFIG.EXCHANGE_RATE_API +
            encodeURIComponent(
              startingCurrency
            )
          );


        if (!response.ok) {

          throw new Error(
            "Exchange rate request failed."
          );

        }


        const data =
          await response.json();


        if (
          data.result !== "success" ||
          !data.rates ||
          !data.rates[targetCurrency]
        ) {

          throw new Error(
            "Exchange rate unavailable."
          );

        }


        const rate =
          Number(
            data.rates[targetCurrency]
          );


        if (
          !Number.isFinite(rate) ||
          rate <= 0
        ) {

          throw new Error(
            "Invalid exchange rate."
          );

        }


        const convertedDaily =
          daily * rate;


        const convertedWeekly =
          weekly * rate;


        const convertedMonthly =
          monthly * rate;


        const convertedAnnual =
          annual * rate;


        const convertedHourly =
          hourly * rate;


        displayWorthResults(
          getCurrencySymbol(
            startingCurrency
          ),
          getCurrencySymbol(
            targetCurrency
          ),
          convertedDaily,
          convertedWeekly,
          convertedMonthly,
          convertedAnnual,
          startingCurrency,
          targetCurrency,
          {
            rate: rate,
            convertedHourly: convertedHourly
          }
        );


        trackEvent(
          "worth_calculated",
          {
            starting_currency:
              startingCurrency,

            target_currency:
              targetCurrency
          }
        );


      } catch (error) {

        worthResult.classList.remove(
          "hidden"
        );


        worthResult.innerHTML = `
          <h3>Conversion could not be completed.</h3>

          <p>
            Your earnings were calculated, but the live
            exchange-rate service could not be reached.
          </p>

          <p>
            Please try again in a moment or select the
            same starting and target currency.
          </p>
        `;


        trackEvent(
          "currency_conversion_error",
          {
            starting_currency:
              startingCurrency,

            target_currency:
              targetCurrency
          }
        );

      }

    }
  );

}


/* =========================================================
   DISPLAY WORTH RESULTS
   ========================================================= */

function displayWorthResults(
  startingSymbol,
  targetSymbol,
  daily,
  weekly,
  monthly,
  annual,
  startingCurrency,
  targetCurrency,
  conversion
) {

  worthResult.classList.remove(
    "hidden"
  );


  const originalHourly =
    Number(
      document.getElementById(
        "hourlyAmount"
      ).value
    );


  let hourlyDisplay = "";


  if (
    conversion &&
    Number.isFinite(
      conversion.convertedHourly
    )
  ) {

    hourlyDisplay = `
      <p>
        <strong>Hourly Earnings:</strong>
        ${startingSymbol}${formatNumber(
          originalHourly
        )}
        →
        ${targetSymbol}${formatNumber(
          conversion.convertedHourly
        )}
      </p>
    `;

  } else {

    hourlyDisplay = `
      <p>
        <strong>Hourly Earnings:</strong>
        ${startingSymbol}${formatNumber(
          originalHourly
        )}
      </p>
    `;

  }


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

      ${hourlyDisplay}


      <p>
        <strong>Daily Earnings:</strong>
        ${targetSymbol}${formatNumber(
          daily
        )}
      </p>


      <p>
        <strong>Weekly Earnings:</strong>
        ${targetSymbol}${formatNumber(
          weekly
        )}
      </p>


      <p>
        <strong>Monthly Earnings:</strong>
        ${targetSymbol}${formatNumber(
          monthly
        )}
      </p>


      <p>
        <strong>Annual Earnings:</strong>
        ${targetSymbol}${formatNumber(
          annual
        )}
      </p>

    </div>


    ${
      conversion
        ? `
          <p class="small-note">
            Conversion uses the latest available
            exchange rate returned by the exchange-rate service.
          </p>
        `
        : `
          <p class="small-note">
            Starting and target currencies are currently the same,
            so no conversion was necessary.
          </p>
        `
    }

  `;


  trackEvent(
    "worth_calculated",
    {
      currency:
        startingCurrency
    }
  );


  worthResult.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });

}


/* =========================================================
   CLEAR WORTH
   ========================================================= */

if (clearWorthButton) {

  clearWorthButton.addEventListener(
    "click",
    function () {

      if (worthForm) {

        worthForm.reset();

      }


      if (worthResult) {

        worthResult.classList.add(
          "hidden"
        );

        worthResult.innerHTML = "";

      }


      trackEvent(
        "worth_calculator_cleared"
      );

    }
  );

}


/* =========================================================
   FINANCIAL RESET
   ========================================================= */

const addExpenseButton =
  document.getElementById(
    "addExpense"
  );


const expensesList =
  document.getElementById(
    "expensesList"
  );


const showBudgetButton =
  document.getElementById(
    "showBudget"
  );


const resetBudgetButton =
  document.getElementById(
    "resetBudget"
  );


const budgetResult =
  document.getElementById(
    "budgetResult"
  );


/* ADD EXPENSE */

if (
  addExpenseButton &&
  expensesList
) {

  addExpenseButton.addEventListener(
    "click",
    function () {

      const row =
        document.createElement(
          "div"
        );


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


      expensesList.appendChild(
        row
      );


      trackEvent(
        "expense_added"
      );


      const nameInput =
        row.querySelector(
          ".expense-name"
        );


      if (nameInput) {

        nameInput.focus();

      }

    }
  );

}


/* DELETE EXPENSE */

if (expensesList) {

  expensesList.addEventListener(
    "click",
    function (event) {

      const deleteButton =
        event.target.closest(
          ".delete-expense"
        );


      if (!deleteButton) {

        return;

      }


      const row =
        deleteButton.closest(
          ".expense-row"
        );


      if (row) {

        row.remove();


        trackEvent(
          "expense_deleted"
        );

      }

    }
  );

}


/* SHOW BUDGET */

if (
  showBudgetButton &&
  budgetResult
) {

  showBudgetButton.addEventListener(
    "click",
    function () {

      const income =
        Number(
          document.getElementById(
            "monthlyIncome"
          ).value
        );


      if (
        !Number.isFinite(income) ||
        income < 0
      ) {

        budgetResult.classList.remove(
          "hidden"
        );


        budgetResult.innerHTML = `
          <h3>Please enter your monthly income.</h3>

          <p>
            Enter a valid amount before creating your budget summary.
          </p>
        `;


        return;

      }


      const currency =
        document.getElementById(
          "displayCurrency"
        ).value;


      const symbol =
        getCurrencySymbol(
          currency
        );


      const expenseRows =
        document.querySelectorAll(
          ".expense-row"
        );


      let totalExpenses = 0;


      expenseRows.forEach(
        function (row) {

          const amountInput =
            row.querySelector(
              ".expense-amount"
            );


          const amount =
            Number(
              amountInput?.value || 0
            );


          if (
            Number.isFinite(amount) &&
            amount > 0
          ) {

            totalExpenses +=
              amount;

          }

        }
      );


      const remaining =
        income -
        totalExpenses;


      const percentageUsed =
        income > 0
          ? (
              totalExpenses /
              income
            ) * 100
          : 0;


      const status =
        remaining < 0
          ? "Your listed expenses are higher than your monthly income."
          : "Your listed expenses are within your monthly income.";


      const statusClass =
        remaining < 0
          ? "budget-warning"
          : "budget-positive";


      budgetResult.classList.remove(
        "hidden"
      );


      budgetResult.innerHTML = `

        <h3>Budget Summary</h3>


        <p>
          <strong>Total Monthly Income:</strong>
          ${symbol}${formatNumber(
            income
          )}
        </p>


        <p>
          <strong>Total Monthly Expenses:</strong>
          ${symbol}${formatNumber(
            totalExpenses
          )}
        </p>


        <p>
          <strong>Remaining Balance:</strong>
          ${symbol}${formatNumber(
            remaining
          )}
        </p>


        <p>
          <strong>Percentage of Income Used:</strong>
          ${formatNumber(
            percentageUsed,
            1
          )}%
        </p>


        <p class="${statusClass}">
          <strong>${status}</strong>
        </p>

      `;


      trackEvent(
        "budget_summary_generated",
        {
          currency:
            currency
        }
      );


      budgetResult.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });

    }
  );

}


/* =========================================================
   RESET BUDGET
   ========================================================= */

if (resetBudgetButton) {

  resetBudgetButton.addEventListener(
    "click",
    function () {

      const incomeInput =
        document.getElementById(
          "monthlyIncome"
        );


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

        budgetResult.classList.add(
          "hidden"
        );

        budgetResult.innerHTML = "";

      }


      trackEvent(
        "budget_reset"
      );

    }
  );

}


/* =========================================================
   ALISON FREE COURSES
   ========================================================= */

const alisonLink =
  document.getElementById(
    "alisonLink"
  );


const alisonMessage =
  document.getElementById(
    "alisonMessage"
  );


if (alisonLink) {

  alisonLink.href =
    CONFIG.ALISON_AFFILIATE_URL;


  alisonLink.target =
    "_blank";


  alisonLink.rel =
    "noopener noreferrer";


  alisonLink.addEventListener(
    "click",
    function () {

      trackEvent(
        "alison_course_link_click"
      );

    }
  );


  if (alisonMessage) {

    alisonMessage.textContent =
      "Course information and availability are provided by Alison.";

  }

}


/* =========================================================
   PREVENT ACCIDENTAL FORM SUBMISSION ON ENTER
   WHERE APPROPRIATE
   ========================================================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Enter" &&
      event.target.tagName === "INPUT" &&
      event.target.closest(
        ".expense-row"
      )
    ) {

      event.preventDefault();

    }

  }
);


/* =========================================================
   BASIC INITIALIZATION
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    /*
      We intentionally do not store financial information
      in localStorage, cookies, databases, or browser storage.
    */

    trackEvent(
      "tabing_guhit_page_loaded"
    );

  }
);
