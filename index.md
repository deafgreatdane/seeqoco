# Seeqoco 
This site contains a userscript for Tamper Monkey that modifies Sococo with some fun additions.

Pull requests for new configs and additional features are welcome.

This only affects _your_ view of the app. So any customizations are only viewable by other people that use seeqoco.

## One time setup
You probably want a site-specific browser, see [epichrome](https://github.com/dmarmor/epichrome). This doesn't work with the Sococo native app.

Install [Tampermonkey](https://tampermonkey.net) plugin

Import the user script with the following url:

https://deafgreatdane.github.io/seeqoco/seeqoco.user.js

## Customizations
Configuration is done directly in the user script. 

Images are referenced from the user script, and must be hosted publicly. For now, we can check these in with the user script storage.  Images should be small, since they'll be loaded often. Offices are only 60x70px, so a piece of furniture can't be too big.

Each person is configured in the `officeConfiguration` object. Required elements:

* email - This isn't used for anything yet, so we can assign fake emails to non-offices
* room - This is the ID of your sococo office. Get this from the inspector

# Features
## Office Decorations
This config goes in the `officeDecorations` object. It is an array of objects with the following attributes:

* type - one of "carpet" "furniture"
* css - The css that describes the object. You probably want at least the following:
 * background-image
 * width, height
 * top, left

## Pets
Of course you can bring your pets to work! But pets have a tendency to wander, so some locations might need to be off limits.
 
Adding the `animals` option to your office indicates you're a pet-friendly  location.

A suboption is the `pets` array. Each pet is configured with:

* url - the full url to an image. Pets are automatically constrained to 25x25. Recommended to use faces only - there's not enough resolution to make recognizable full body shots.
* name - Maybe you you don't know everyone's animal, so this enables you to hover over the image to learn their name. 