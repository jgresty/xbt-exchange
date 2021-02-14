import { LitElement, html, property, css } from "lit-element";
import {
  RemoteData,
  notAsked,
  loading,
  isSuccess,
  success,
  failure,
  assertExhaustive,
  SECOND,
  isLoading,
} from "./utils";

const url = "https://blockchain.info/ticker?cors=true";
const refreshInterval = 30 * SECOND;

type Rate = {
  "15m": number;
  last: number;
  buy: number;
  sell: number;
  symbol: string;
};
type TickerData = { [currencyCode: string]: Rate };

export class Ticker extends LitElement {
  @property({ attribute: false })
  tickerData: RemoteData<TickerData> = notAsked;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #f1f1f1;
    }
    main {
      width: 80%;
      max-width: 100rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
    }
    * {
      color: #353535;
      font-family: sans;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.refreshData();
    setInterval(this.refreshData, refreshInterval);
  }

  private refreshData = async () => {
    const prevData = isSuccess(this.tickerData)
      ? this.tickerData.data
      : undefined;
    this.tickerData = loading(prevData);

    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      this.tickerData = success(json);
    } else {
      const error = await response.text();
      this.tickerData = failure(error);
    }
  };

  private renderTicker = (data: TickerData) =>
    Object.entries(data).map(
      ([code, rate]) =>
        html`<xbt-rate
          currencyCode=${code}
          symbol=${rate.symbol}
          fifteen=${rate["15m"]}
          last=${rate.last}
          buy=${rate.buy}
          sell=${rate.sell}
        ></xbt-rate>`
    );

  private renderTickerData = () => {
    // Split this out of main render because switch isn't an expression so can't be used in template strings
    switch (this.tickerData.type) {
      case "NotAsked":
        return html``;
      case "Loading":
        if (this.tickerData.oldData !== undefined) {
          return this.renderTicker(this.tickerData.oldData);
        }
        return html``;
      case "Failure":
        return html`Failed to load`;
      case "Success":
        return this.renderTicker(this.tickerData.data);
      default:
        assertExhaustive(this.tickerData);
        return html``;
    }
  };

  render() {
    const loadingData = isLoading(this.tickerData);
    return html` <h2>XBT Ticker</h2>
      <button @click="${this.refreshData}" .disabled=${loadingData}>
        ${loadingData ? "Loading..." : "Update"}
      </button>
      <main>${this.renderTickerData()}</main>`;
  }
}
