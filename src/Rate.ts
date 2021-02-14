/**
 * Rate - pure view containing a single currencies exchange rate information.
 */

import { LitElement, html, property } from "lit-element";

export class Rate extends LitElement {
  @property({ type: String })
  currencyCode: string = "";

  @property({ type: Number })
  fifteen?: number = undefined;

  @property({ type: Number })
  last?: number = undefined;

  @property({ type: Number })
  buy?: number = undefined;

  @property({ type: Number })
  sell?: number = undefined;

  @property({ type: String })
  symbol?: string = undefined;

  render() {
    return html`<section>
      <h3>${this.currencyCode} (${this.symbol})</h3>
      <dl>
        <dt>15m</dt>
        <dd>${this.fifteen}</dd>
        <dt>last</dt>
        <dd>${this.last}</dd>
        <dt>buy</dt>
        <dd>${this.buy}</dd>
        <dt>sell</dt>
        <dd>${this.sell}</dd>
      </dl>
    </section>`;
  }
}
