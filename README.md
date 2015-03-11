[![Build Status](https://travis-ci.org/philsawicki/GoogleAnalytics-WebTester.svg?branch=master)](https://travis-ci.org/philsawicki/GoogleAnalytics-WebTester)

# Google Analytics Web Tester — Live testing of GA Events

Testing proper tracking of Google Analytics Events on a website can be a tricky thing to do. But it doesn't have to be that way.

Automating the process of validating that Events are fired when the user interacts with the page can ease the development process and speed up the delivery of new features. It can also contribute to the sharing of Analytics knowledge by empowering everyone on the team with particular responsibilities:

* Digital Marketers spend less time working out the implementation details ;
* Business Analysts can formulate proper Acceptance Criterias for their User Stories ;
* Developers can gain a better understanding of the business goals ;
* QAs can spend more time testing other parts of the application.

This library eases the process of writing automated tests by providing a set of easy to use utility methods. It comes with an AngularJS demo application to show how to validate that the `ga()` snippet receives the expected data when the user interacts with the page.


Wheter using the **Google Analytics** tracking snippet directly (`ga()`) or **Google Tag Manager** (GTM), all Events can be recorded the exact same way.

Just set the URL of your website, write a couple of specs and run the app, or set it to run after each build/deployment. Easy!

## Preview

Here's what the demo Application looks like:
![Google Analytics Web Tester Demo Application](http://i.imgur.com/NY39cmV.png "Google Analytics Web Tester Demo Application")

And here's what a set of successful tests looks like:
![Google Analytics Web Tester Demo Console Output](http://i.imgur.com/teMEopO.png "Google Analytics Web Tester Demo Console Output")

## How does it work?

The library uses the [Protractor](http://angular.github.io/protractor/#/ "Protractor") test runner and [Jasmine](http://jasmine.github.io/ "Jasmine")'s BDD notation to execute End-to-End (E2) tests in real browsers (Chrome, Firefox, Safari, IE, PhantomJS, etc.). 

It's fast, lightweight, easy to configure, and integrates beautifully with existing build systems, providing nice integration reports with Jenkins, Travis CI and many others.

### Sample Spec file
```javascript
describe('Google Analytics "click" tracking', function () {
   it('should fire an Event when clicking on the Jumbotron CTA', function (done) {
      // Click on the "Jumbotron" CTA:
      element( by.css('#jumbotronCTA') ).click();
  
      // Get the "gaLastEventData" object back from the browser:
      browser.driver.executeScript(function () {
         return window.gaLastEventData;
      })
      .then(
         // Validate the content of the "gaLastEventData" object:
         function successCallback (gaLastEventData) {
            expect(gaLastEventData).toEqual(['send', 'event', 'Button', 'Click', 'Jumbotron CTA']);
         },
         // If there was an error getting back the "gaLastEventData" object from the browser, fail the test:
         function errorCallback (error) {
            fail('Should not have received Error: ' + JSON.stringify(error));
         }
      )
      .then(done);
   });
});
```

Or, if you find the syntax too verbose and you feel confident, you can always use the condensed version:
```javascript
describe('Google Analytics "click" tracking', function () {
   it('should fire an Event when clicking on the Jumbotron CTA', function (done) {
      // Click on the "Jumbotron" CTA:
      element( by.css('#jumbotronCTA') ).click();

      // Get the "gaLastEventData" object back from the browser and validate its data:
      browser.driver.executeScript(function () { return window.gaLastEventData; })
      .then(function (gaLastEventData) {
         expect(gaLastEventData).toEqual(['send', 'event', 'Button', 'Click', 'Jumbotron CTA']);
         done();
      });
   });
});
```

### How to get the Event data?

Simple. 

Let's say your standard `ga()` call looks like this when clicking on the _Jumbotron CTA_ of the demo application (will be the same if Event Tracking is set through GTM*):
```javascript
ga('send', 'event', 'Button', 'Click', 'Jumbotron CTA');
    │       │        │         │        └──> 5. Event Label
    │       │        │         └───────────> 4. Event Action
    │       │        └─────────────────────> 3. Event Category
    │       └──────────────────────────────> 2. (Standard Google Analytics parameter)
    └──────────────────────────────────────> 1. (Standard Google Analytics parameter)
```
Then, after the `ga()` is executed, the value of `window.gaLastEventData` will be:
```javascript
  ['send', 'event', 'Button', 'Click', 'Jumbotron CTA']
    │       │        │         │        └──> 5. Event Label
    │       │        │         └───────────> 4. Event Action
    │       │        └─────────────────────> 3. Event Category
    │       └──────────────────────────────> 2. (Standard Google Analytics parameter)
    └──────────────────────────────────────> 1. (Standard Google Analytics parameter)
```
You then just need to use the Jasmine-provided matchers to make sure that the actual value of `window.gaLastEventData` is the same as the expected one.

*: _If using Event tracking through Google Tag Manager (GTM), then the Container will generate some JavaScript exactly matching the pattern of the `ga()` call above. Just add the `send` and `event` values to the Array._

## Installing the Library

To get started, simply clone this repository and install the dependencies:

```
git clone https://github.com/philsawicki/GoogleAnalytics-WebTester.git
npm install
```

## Running the Demo Application

The project comes preconfigured with a simple web server. If you want, you can check the demo by opening up a browser and heading over to `http://localhost:8000/app/index.html#/`.

```
npm start
npm run protractor
```

The tests should now run, and the calls to Google Analytics' `ga()` method should be intercepted and logged to the console.

## Contact

For more information, please check out [http://philippesawicki.com](http://philippesawicki.com "Philippe Sawicki - Fullstack Developer and Digital Analyst")



