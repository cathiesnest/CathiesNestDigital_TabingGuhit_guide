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


if (worthForm && worthResult) {

  worthForm.addEventListener(
    "submit",
    function (event) {

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
        SAME CURRENCY

        If the user selects the same starting and target
        currency, no exchange-rate service is required.
      */

      if (
        startingCurrency === targetCurrency
      ) {

        const symbol =
          getCurrencySymbol(
            startingCurrency
          );


        displayWorthResults(
          symbol,
          symbol,
          hourly,
          daily,
          weekly,
          monthly,
          annual,
          startingCurrency,
          targetCurrency,
          true
        );


        return;
      }


      /*
        DIFFERENT CURRENCIES

        We do NOT invent or estimate an exchange rate.

        Until a real exchange-rate API is connected,
        show the calculated earnings in the original
        starting currency.
      */

      if (
        !CONFIG.EXCHANGE_RATES_ENABLED
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
            <strong>${startingCurrency}</strong>,
            but a live exchange-rate service has not been configured.
          </p>

          <div class="earnings-list">

            <p>
              <strong>Estimated earnings:</strong>
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

          <p>
            No exchange rate has been estimated or invented.
            Please try again later or select the same
            starting and target currency.
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


        return;
      }


      /*
        IMPORTANT:

        EXCHANGE_RATES_ENABLED is true, but no actual
        exchange-rate API is currently connected.

        Therefore we still must not invent a conversion.

        Show the earnings in the starting currency and
        clearly explain that live conversion is pending.
      */

      const startingSymbol =
        getCurrencySymbol(
          startingCurrency
        );


      worthResult.classList.remove(
        "hidden"
      );


      worthResult.innerHTML = `
        <h3>Earnings Estimate</h3>

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
          Live currency conversion is not available yet.
          No exchange rate has been estimated or invented.
        </p>
      `;


      trackEvent(
        "currency_conversion_pending",
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
  );

}


/* =========================================================
   DISPLAY SAME-CURRENCY WORTH RESULTS
   ========================================================= */

function displayWorthResults(
  startingSymbol,
  targetSymbol,
  hourly,
  daily,
  weekly,
  monthly,
  annual,
  startingCurrency,
  targetCurrency,
  sameCurrency
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
        ${startingSymbol}${formatNumber(hourly)}
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


  trackEvent(
    "worth_calculated",
    {
      currency: startingCurrency
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
```
