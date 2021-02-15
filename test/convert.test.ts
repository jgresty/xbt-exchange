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
    fetchStub.reset();
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

  it("does not call the api if the currency is not in the supplied list", async () => {
    const selectElement = element.shadowRoot!.querySelector("select");
    selectElement!.value = "QWE";
    const amountElement = <HTMLInputElement>(
      element.shadowRoot!.querySelector("#amount")
    );
    amountElement!.value = "123";
    const form = element.shadowRoot!.querySelector("form");
    form!.dispatchEvent(new Event("submit"));

    await expect(fetchStub).to.not.have.been.called;

    const content = element.shadowRoot!.textContent;
    await expect(content).to.include("Error: unknown currency");
  });

  it("does not call the api if the amount is not numeric", async () => {
    const selectElement = element.shadowRoot!.querySelector("select");
    selectElement!.value = "ABC";
    const amountElement = <HTMLInputElement>(
      element.shadowRoot!.querySelector("#amount")
    );
    amountElement!.value = "one hundred";
    const form = element.shadowRoot!.querySelector("form");
    form!.dispatchEvent(new Event("submit"));

    await expect(fetchStub).to.not.have.been.called;

    const content = element.shadowRoot!.textContent;
    await expect(content).to.include("Error: amount is not numeric");
  });

  it("only calls the api if the amount is between 0 and 1,000,000", async () => {
    const selectElement = element.shadowRoot!.querySelector("select");
    selectElement!.value = "ABC";
    const amountElement = <HTMLInputElement>(
      element.shadowRoot!.querySelector("#amount")
    );
    const form = element.shadowRoot!.querySelector("form");

    amountElement!.value = "-1";
    form!.dispatchEvent(new Event("submit"));
    await expect(fetchStub).to.not.have.been.called;

    amountElement!.value = "1000001";
    form!.dispatchEvent(new Event("submit"));
    await expect(fetchStub).to.not.have.been.called;

    const content = element.shadowRoot!.textContent;
    await expect(content).to.include(
      "Error: amount must be between 0 and 1,000,000"
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
