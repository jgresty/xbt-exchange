/**
 * Rate - pure view containing a single currencies exchange rate information.
 */

import { LitElement, html, property, css } from "lit-element";

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

  static styles = css`
    :host {
      display: block;
      background-color: white;
      padding: 1rem 3rem;
      border-radius: 0.7rem;
      margin: 1rem;
      width: 10rem;
      filter: drop-shadow(0 0.2rem 0.25rem rgba(0, 0, 0, 0.2));
    }
    h3 {
      color: #284b63;
    }
    dt {
      text-transform: capitalize;
      margin-top: 0.6rem;
    }
    * {
      color: #353535;
      font-family: sans;
    }
  `;

  render() {
    return html`<section>
      <h3>${this.currencyCode} (${this.symbol})</h3>
      <dl>
        <dt>15m</dt>
        <dd>${this.fifteen?.toLocaleString()}</dd>
        <dt>last</dt>
        <dd>${this.last?.toLocaleString()}</dd>
        <dt>buy</dt>
        <dd>${this.buy?.toLocaleString()}</dd>
        <dt>sell</dt>
        <dd>${this.sell?.toLocaleString()}</dd>
      </dl>
    </section>`;
  }
}
