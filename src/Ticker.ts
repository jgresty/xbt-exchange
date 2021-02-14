import { LitElement, html } from "lit-element";

export class Ticker extends LitElement {
  render() {
    return html`<main>
      <xbt-rate
        currencyCode="USD"
        fifteen="123.456"
        last="123.456"
        buy="123.456"
        sell="123.456"
        symbol="$"
      ></xbt-rate>
    </main>`;
  }
}
