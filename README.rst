Frontend Technical Exercise
===========================

We have a simple Bitcoin exchange API
(https://www.blockchain.com/api/exchange_rates_api)there are two endpoints that
we would like you to use to complete tasks 1 & 2. N.B. You have 1 hour to
complete as much of this exercise as possible, don’t worry if you don’t
complete it!!. Please use whichever libraries/frameworks you deem appropriate
to complete this exercise.


Task 1
------

Using Javascript GET the ticker information back from the endpoint
(https://blockchain.info/ticker) and in an organised way present this
information back in browser using Semantic HTML, it is expected that you will
also style your markup, the look and feel is left for you, although basic
responsiveness is expected. For the purpose of this exercise the script/styles
should work in the latest copy of Chrome

This information changes every few seconds, please build in a mechanism for
updating and displaying the latest available information.


Task 2
------

Include a basic form to allow a user to perform a currency conversion from one
of the currencies returned from step 1 only and then display the resulting
value. N.B. it is not expected that you calculate this client‑side, instead
please use the API. (https://blockchain.info/tobtc?currency=CUR&value=20)

- I Should not be able to request a currency that does not feature in the
  response from Task 1
- The amount should be numeric only
- The amount that I wish to convert should be greater than 0 and less than
  1,000,000 in the selected currency

If I supply an invalid set of request values,then I should be notified and the API
request should not happen.




Quite simple components, any sort of larger application would be overkill so
let's just manage state locally.

If the focus is on my ability to create components lets put all the opinionated
frameworks aside and stick with *standards complient* web components. Using
lit-element to provide backwards compatibility and templating.
