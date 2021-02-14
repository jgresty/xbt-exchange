import { html, fixture, expect } from "@open-wc/testing";

import { Ticker } from "../src/Ticker";
import "../src/xbt-exchange";

describe("Ticker", () => {
  let element: Ticker;
  beforeEach(async () => {
    element = await fixture(html`<xbt-ticker></xbt-ticker>`);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
