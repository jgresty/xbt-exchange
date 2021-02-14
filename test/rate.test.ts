import { html, fixture, expect } from "@open-wc/testing";

import { Rate } from "../src/Rate";
import "../src/xbt-exchange";

describe("Rate", () => {
  let element: Rate;
  beforeEach(async () => {
    element = await fixture(html`<xbt-rate></xbt-rate>`);
  });

  it("renders the given attributes", async () => {
    const code = "USD";
    const symbol = "$";
    const fifteen = 123;
    const last = 456;
    const buy = 789;
    const sell = 248;
    element = await fixture(
      html`<xbt-rate
        currencyCode=${code}
        symbol=${symbol}
        fifteen=${fifteen}
        last=${last}
        buy=${buy}
        sell=${sell}
      ></xbt-rate>`
    );
    const content = element.shadowRoot!.textContent;
    expect(content).to.include(code);
    expect(content).to.include(symbol);
    expect(content).to.include(fifteen);
    expect(content).to.include(last);
    expect(content).to.include(buy);
    expect(content).to.include(sell);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
