import { html, fixture, expect } from "@open-wc/testing";
import sinon from "sinon";

import { Convert } from "../src/Convert";
import "../src/xbt-exchange";

function mockApiResponse(body = "123") {
  return new window.Response(body, {
    status: 200,
    headers: { "Content-type": "application/json" },
  });
}
const fetchStub = sinon.stub(window, "fetch");

describe("Convert", () => {
  let element: Convert;
  const currencyCodes = ["ABC", "DEF"];

  beforeEach(async () => {
    fetchStub.resolves(mockApiResponse());
    element = await fixture(
      html`<xbt-convert
        currencyCodes=${JSON.stringify(currencyCodes)}
      ></xbt-convert>`
    );
  });

  it("shows given currencies as options in select", async () => {
    const selectElement = element.shadowRoot!.querySelector("select");
    const options = selectElement!.children;
    await expect(<HTMLOptionElement>options[0]).to.have.value("ABC");
    await expect(<HTMLOptionElement>options[1]).to.have.value("DEF");
  });

  it("calls out to api when form is submitted", async () => {
    const selectElement = element.shadowRoot!.querySelector("select");
    selectElement!.value = "ABC";
    const amountElement = <HTMLInputElement>(
      element.shadowRoot!.querySelector("#amount")
    );
    amountElement!.value = "123";
    const form = element.shadowRoot!.querySelector("form");
    form!.dispatchEvent(new Event("submit"));

    await expect(fetchStub).to.have.been.called;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
