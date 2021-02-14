import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import sinon from "sinon";

import { Ticker } from "../src/Ticker";
import "../src/xbt-exchange";

function mockApiResponse(body = { USD: { last: 123 } }) {
  return new window.Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-type": "application/json" },
  });
}
const fetchStub = sinon.stub(window, "fetch");

describe("Ticker", () => {
  let element: Ticker;
  beforeEach(async () => {
    fetchStub.resolves(mockApiResponse());
    element = await fixture(html`<xbt-ticker></xbt-ticker>`);
  });

  it("renders rate from api response", async () => {
    await waitUntil(
      () => element.shadowRoot!.querySelector("xbt-rate") != null,
      "Element did not render a rate"
    );
    const rate = element.shadowRoot!.querySelector("xbt-rate");
    await expect(rate).to.have.property("last").equal(123);
  });

  it("passes the a11y audit", async () => {
    // initial render
    await expect(element).shadowDom.to.be.accessible();
    await waitUntil(
      () => element.shadowRoot!.querySelector("xbt-rate") != null,
      "Element did not render a rate"
    );
    // after first api call
    await expect(element).shadowDom.to.be.accessible();
  });
});
