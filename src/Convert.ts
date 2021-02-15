/**
 * Convert - form to convert a single amount from a given currency.
 */

import { LitElement, html, property, css } from "lit-element";
import {
  assertExhaustive,
  failure,
  loading,
  notAsked,
  RemoteData,
  success,
} from "./utils";

const url = "https://blockchain.info/tobtc";

export class Convert extends LitElement {
  @property({ type: Array })
  currencyCodes: string[] = [];

  @property({ attribute: false })
  startingValue: number = 0;

  @property({ attribute: false })
  startingCurrency: string = "";

  @property({ attribute: false })
  result: RemoteData<number> = notAsked;

  static styles = css`
    :host {
      display: flex;
      margin: 2rem 0rem;
      width: 50%;
      min-width: 100px;
      flex-direction: column;
      align-items: center;
      color: #353535;
      background-color: white;
      filter: drop-shadow(0 0.2rem 0.25rem rgba(0, 0, 0, 0.2));
      padding: 1rem 3rem;
      border-radius: 0.7rem;
    }

    form {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    label {
      margin-top: 1rem;
    }
    input[type="submit"] {
      margin-top: 1.5rem;
    }

    span {
      margin-top: 1rem;
      font-size: 24pt;
      color: #284b63;
    }

    span.error {
      color: red;
    }
  `;

  private handleSubmit = async (event: Event) => {
    event.preventDefault();
    this.result = loading();

    const currency = (<HTMLSelectElement>(
      this.shadowRoot?.getElementById("currency")
    )).value;
    const amount = (<HTMLInputElement>this.shadowRoot?.getElementById("amount"))
      .value;

    if (!this.currencyCodes.includes(currency)) {
      this.result = failure("unknown currency");
      return;
    }
    const parsedAmount = Number.parseFloat(amount);
    if (Number.isNaN(parsedAmount)) {
      this.result = failure("amount is not numeric");
      return;
    }
    if (parsedAmount < 0 || parsedAmount > 1_000_000) {
      this.result = failure("amount must be between 0 and 1,000,000");
      return;
    }

    const response = await fetch(
      `${url}?cors=true&currency=${currency}&value=${amount}`
    );

    if (response.ok) {
      const body = await response.text();
      this.result = success(Number.parseFloat(body));
      this.startingValue = parsedAmount;
      this.startingCurrency = currency;
    } else {
      this.result = failure("API request failed");
    }
  };

  private renderResult = () => {
    switch (this.result.type) {
      case "NotAsked":
        return html``;
      case "Loading":
        return html`<span>Loading</span>`;
      case "Failure":
        return html`<span class="error">Error: ${this.result.error}</span>`;
      case "Success":
        return html`<span
          >${this.startingValue.toLocaleString(undefined, {
            style: "currency",
            currency: this.startingCurrency,
            minimumSignificantDigits: 5,
          })}
          =
          ${this.result.data.toLocaleString(undefined, {
            style: "currency",
            currency: "XBT",
            minimumSignificantDigits: 5,
          })}</span
        >`;
      default:
        assertExhaustive(this.result);
        return html``;
    }
  };

  render() {
    return html`<form @submit="${this.handleSubmit}">
        <label for="currency">Currency</label>
        <select id="currency" name="currency">
          ${this.currencyCodes.map(
            (code) => html`<option value=${code}>${code}</option>`
          )}
        </select>
        <label for="amount">Amount</label>
        <input type="number" id="amount" name="amount" />
        <input type="submit" value="Convert" />
      </form>
      ${this.renderResult()}`;
  }
}
