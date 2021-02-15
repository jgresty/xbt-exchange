/**
 * Convert - form to convert a single amount from a given currency.
 */

import { LitElement, html, property } from "lit-element";
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
  result: RemoteData<number> = notAsked;

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
    } else {
      this.result = failure("API request failed");
    }
  };

  private renderResult = () => {
    switch (this.result.type) {
      case "NotAsked":
        return html``;
      case "Loading":
        return html`Loading`;
      case "Failure":
        return html`Error: ${this.result.error}`;
      case "Success":
        return html`${this.result.data}`;
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
      <span>${this.renderResult()}</span>`;
  }
}
