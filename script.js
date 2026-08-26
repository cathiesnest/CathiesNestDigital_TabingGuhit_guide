```js
/* =========================================================
   KNOW YOUR WORTH
   ========================================================= */

const worthForm =
  document.getElementById("worthForm");

const worthResult =
  document.getElementById("worthResult");

const clearWorthButton =
  document.getElementById("clearWorth");


/* =========================================================
   CALCULATE KNOW YOUR WORTH
   ========================================================= */

if (worthForm && worthResult) {

  worthForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const startingCurrency =
        document.getElementById(
          "startingCurrency"
        )?.value
        ?.trim()
        ?.toUpperCase();


      const targetCurrency =
        document.getElementById(
          "targetCurrency"
        )?.value
        ?.trim()
        ?.toUpperCase();


      const hourly =
        Number(
          document.getElementById(
            "hourlyAmount"
          )?.value
        );


      const hoursPerDay =
        Number(
          document.getElementById(
            "hoursPerDay"
          )?.value
        );


      const daysPerWeek =
        Number(
          document.getElementById(
            "daysPerWeek"
          )?.value
        );


      const monthsPerYear =
        Number(
          document.getElementById(
            "monthsPerYear"
          )?.value
        );


      /* =====================================================
         VALIDATE INPUTS
         ===================================================== */

      if (
        !startingCurrency ||
        !targetCurrency ||
        !Number.isFinite(hourly) ||
        hourly < 0 ||
        !Number.isFinite(hoursPerDay) ||
        hoursPerDay <= 0 ||
        !Number.isFinite(daysPerWeek) ||
        daysPerWeek <= 0 ||
        !Number.isFinite(monthsPerYear) ||
        monthsPerYear <= 0
      ) {

        worthResult.classList.remove(
          "hidden"
        );


        worthResult.innerHTML = `
          <h3>Please check your numbers.</h3>

          <p>
            Please enter valid values for your currencies,
            hourly rate, hours per day, days per week,
            and months per year.
          </p>
        `;


        return;
      }


      /* =====================================================
         CALCULATE BASE EARNINGS
         ===================================================== */

      const daily =
        hourly * hoursPerDay;


      const weekly =
        daily * daysPerWeek;


      /*
        Monthly estimate uses 52 weeks / 12 months.
      */

      const monthly =
        weekly * 52 / 12;


      const annual =
        weekly * 52;


      /* =====================================================
         SAME CURRENCY
         ===================================================== */

      if (
        startingCurrency === targetCurrency
      ) {

        const symbol =
          getCurrencySymbol(
            startingCurrency
          );


        displayWorthResults(
          symbol,
          hourly,
          daily,
          weekly,
          monthly,
          annual,
          startingCurrency,
          targetCurrency
        );


        return;
      }


      /* =====================================================
         CHECK EXCHANGE-RATE CONFIGURATION
         ===================================================== */

      if (
        typeof CONFIG === "undefined" ||
        !CONFIG.EXCHANGE_RATES_ENABLED
      ) {

        showConversionUnavailable(
          startingCurrency,
          targetCurrency,
          hourly,
          daily,
          weekly,
          monthly,
          annual
        );


        return;
      }


      /* =====================================================
         SHOW LOADING STATE
         ===================================================== */

      worthResult.classList.remove(
        "hidden"
      );


      worthResult.innerHTML = `
        <h3>Calculating your earnings...</h3>

        <p>
          Getting the latest available exchange rate
          for <strong>${startingCurrency}</strong>
          → <strong>${targetCurrency}</strong>.
        </p>
      `;


      worthResult.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });


      /* =====================================================
         REQUEST REAL EXCHANGE RATE
         ===================================================== */

      try {

        const endpoint =
          (
            typeof CONFIG !== "undefined" &&
            CONFIG.AI_ENDPOINT
          )
            ? CONFIG.AI_ENDPOINT
                .replace("/api/chat", "/api/exchange-rate")
            : "/api/exchange-rate";


        const exchangeUrl =
          `${endpoint}?from=${encodeURIComponent(
            startingCurrency
          )}&to=${encodeURIComponent(
            targetCurrency
          )}`;


        const response =
          await fetch(
            exchangeUrl,
            {
              method: "GET",
              headers: {
                "Accept":
                  "application/json"
              }
            }
          );


        let data = null;


        try {

          data =
            await response.json();

        } catch (jsonError) {

          data = null;

        }


        if (!response.ok) {

          throw new Error(
            data?.error ||
            "The exchange-rate service is unavailable."
          );

        }


        const rate =
          Number(
            data?.rate
          );


        if (
          !Number.isFinite(rate) ||
          rate <= 0
        ) {

          throw new Error(
            "No valid exchange rate was returned."
          );

        }


        /* ===================================================
           APPLY REAL EXCHANGE RATE
           =================================================== */

        const convertedHourly =
          hourly * rate;


        const convertedDaily =
          daily * rate;


        const convertedWeekly =
          weekly * rate;


        const convertedMonthly =
          monthly * rate;


        const convertedAnnual =
          annual * rate;


        const startingSymbol =
          getCurrencySymbol(
            startingCurrency
          );


        const targetSymbol =
          getCurrencySymbol(
            targetCurrency
          );


        /* ===================================================
           DISPLAY CONVERTED RESULTS
           =================================================== */

        worthResult.classList.remove(
          "hidden"
        );


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
              ${targetSymbol}${formatNumber(
                convertedHourly
              )}
            </p>

            <p>
              <strong>Daily Earnings:</strong>
              ${targetSymbol}${formatNumber(
                convertedDaily
              )}
            </p>

            <p>
              <strong>Weekly Earnings:</strong>
              ${targetSymbol}${formatNumber(
                convertedWeekly
              )}
            </p>

            <p>
              <strong>Monthly Earnings:</strong>
              ${targetSymbol}${formatNumber(
                convertedMonthly
              )}
            </p>

            <p>
              <strong>Annual Earnings:</strong>
              ${targetSymbol}${formatNumber(
                convertedAnnual
              )}
            </p>

          </div>

          <p class="small-note">
            Exchange rate used:
            <strong>
              1 ${startingCurrency}
              =
              ${formatNumber(rate, 6)}
              ${targetCurrency}
            </strong>
          </p>

          ${
            data?.date
              ? `
                <p class="small-note">
                  Exchange-rate date:
                  <strong>${data.date}</strong>
                </p>
              `
              : ""
          }

          <p class="small-note">
            Rates are provided by the connected
            exchange-rate service and may change over time.
          </p>
        `;


        /* ===================================================
           GA4 TRACKING
           =================================================== */

        trackEvent(
          "worth_calculated",
          {
            starting_currency:
              startingCurrency,

            target_currency:
              targetCurrency
          }
        );


        trackEvent(
          "currency_conversion_success",
          {
            starting_currency:
              startingCurrency,

            target_currency:
              targetCurrency
          }
        );


        worthResult.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });

      } catch (error) {

        console.error(
          "Currency conversion error:",
          error
        );


        /* ===================================================
           SHOW ORIGINAL-CURRENCY RESULTS
           WITHOUT INVENTING A RATE
           =================================================== */

        const startingSymbol =
          getCurrencySymbol(
            startingCurrency
          );


        worthResult.classList.remove(
          "hidden"
        );


        worthResult.innerHTML = `
          <h3>Live conversion is unavailable.</h3>

          <p>
            We could not retrieve a valid exchange rate
            for <strong>${startingCurrency}</strong>
            → <strong>${targetCurrency}</strong>.
          </p>

          <p>
            Your earnings were calculated safely in your
            starting currency below.
          </p>

          <div class="earnings-list">

            <p>
              <strong>Hourly:</strong>
              ${startingSymbol}${formatNumber(
                hourly
              )}
            </p>

            <p>
              <strong>Daily:</strong>
              ${startingSymbol}${formatNumber(
                daily
              )}
            </p>

            <p>
              <strong>Weekly:</strong>
              ${startingSymbol}${formatNumber(
                weekly
              )}
            </p>

            <p>
              <strong>Monthly:</strong>
              ${startingSymbol}${formatNumber(
                monthly
              )}
            </p>

            <p>
              <strong>Annually:</strong>
              ${startingSymbol}${formatNumber(
                annual
              )}
            </p>

          </div>

          <p class="small-note">
            No exchange rate has been estimated or invented.
            Please try again later.
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


        worthResult.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });

      }

    }
  );

}


/* =========================================================
   DISPLAY SAME-CURRENCY RESULTS
   ========================================================= */

function displayWorthResults(
  symbol,
  hourly,
  daily,
  weekly,
  monthly,
  annual,
  startingCurrency,
  targetCurrency
) {

  worthResult.classList.remove(
    "hidden"
  );


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
        ${symbol}${formatNumber(hourly)}
      </p>

      <p>
        <strong>Daily Earnings:</strong>
        ${symbol}${formatNumber(daily)}
      </p>

      <p>
        <strong>Weekly Earnings:</strong>
        ${symbol}${formatNumber(weekly)}
      </p>

      <p>
        <strong>Monthly Earnings:</strong>
        ${symbol}${formatNumber(monthly)}
      </p>

      <p>
        <strong>Annual Earnings:</strong>
        ${symbol}${formatNumber(annual)}
      </p>

    </div>

    <p class="small-note">
      Starting and target currencies are the same,
      so no conversion was necessary.
    </p>
  `;


  trackEvent(
    "worth_calculated",
    {
      starting_currency:
        startingCurrency,

      target_currency:
        targetCurrency
    }
  );


  worthResult.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });

}


/* =========================================================
   CONVERSION UNAVAILABLE
   ========================================================= */

function showConversionUnavailable(
  startingCurrency,
  targetCurrency,
  hourly,
  daily,
  weekly,
  monthly,
  annual
) {

  const startingSymbol =
    getCurrencySymbol(
      startingCurrency
    );


  worthResult.classList.remove(
    "hidden"
  );


  worthResult.innerHTML = `
    <h3>Conversion is not available yet.</h3>

    <p>
      Your earnings have been calculated in
      <strong>${startingCurrency}</strong>.
    </p>

    <div class="earnings-list">

      <p>
        <strong>Hourly:</strong>
        ${startingSymbol}${formatNumber(hourly)}
      </p>

      <p>
        <strong>Daily:</strong>
        ${startingSymbol}${formatNumber(daily)}
      </p>

      <p>
        <strong>Weekly:</strong>
        ${startingSymbol}${formatNumber(weekly)}
      </p>

      <p>
        <strong>Monthly:</strong>
        ${startingSymbol}${formatNumber(monthly)}
      </p>

      <p>
        <strong>Annually:</strong>
        ${startingSymbol}${formatNumber(annual)}
      </p>

    </div>

    <p>
      <strong>Starting Currency:</strong>
      ${startingCurrency}
    </p>

    <p>
      <strong>Target Currency:</strong>
      ${targetCurrency}
    </p>

    <p class="small-note">
      No exchange rate has been estimated or invented.
      Please try again later.
    </p>
  `;


  trackEvent(
    "currency_conversion_unavailable",
    {
      starting_currency:
        startingCurrency,

      target_currency:
        targetCurrency
    }
  );


  worthResult.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });

}


/* =========================================================
   CLEAR KNOW YOUR WORTH
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
```
