import { LitElement, html, property } from "lit-element";
import {
  RemoteData,
  notAsked,
  loading,
  isSuccess,
  success,
  failure,
  assertExhaustive,
} from "./utils";

const url = "https://blockchain.info/ticker?cors=true";

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

  connectedCallback() {
    super.connectedCallback();
    this.refreshData();
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

  render() {
    switch (this.tickerData.type) {
      case "NotAsked":
        return html``;
      case "Loading":
        return html`Loading...`;
      case "Failure":
        return html`Failed to load`;
      case "Success":
        return html`<main>
          ${Object.entries(this.tickerData.data).map(
            ([code, rate]) =>
              html`<xbt-rate
                currencyCode=${code}
                symbol=${rate.symbol}
                fifteen=${rate["15m"]}
                last=${rate.last}
                buy=${rate.buy}
                sell=${rate.sell}
              ></xbt-rate>`
          )}
        </main>`;
      default:
        assertExhaustive(this.tickerData);
        return html``;
    }
  }
}
