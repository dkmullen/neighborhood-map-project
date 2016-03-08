# Neighborhood Map Project
A [Udacity](http://udacity.com) class project

### Purpose

To build a map of any neighborhood using [Google Maps API](https://developers.google.com/maps/documentation/javascript/), adding markers of notable places and connecting them with info from other APIs. This project uses [Yelp](https://www.yelp.com/developers) and [Zomato](https://developers.zomato.com/api) (formerly Urban Spoon).

This app can be modified for any location simply by changing location data in the Model in `app.js`. 

### View

View a live demo of this project [here](https://cdn.rawgit.com/dkmullen/udacity_fe5_map/master/dist/index.html).

### Installation

Simply clone this respository and you can run the app by opening `neighborhood_map.html`. The needed JS files are included in the js directory. HOWEVER, you will also need credentials from the three APIS mentioned above. 
- Your **Google Maps** key goes into the Google maps script at the bottom of neighborhood_map.html, right between `key=` and `&callback`.
- Your **Zomato** key and **Yelp** credentials go between the empty quotes (`''`) in `app.js` at the bottom of the data model.

###  Dependencies
- `knockout.js` - Delcarative bindings, separation of concerns, etc. [KnockoutJS.com](http://knockoutjs.com/)
- `oauth-signature.js` - [Oauth Signature Generator](https://github.com/bettiolo/oauth-signature-js) by Marco Bettiolo
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/)
- `jquery` (uses Google's [hosted jquery](https://developers.google.com/speed/libraries/))
- [EasyAutoComplete](http://easyautocomplete.com/), a really nice JQuery plugin for auto-filling forms. Requires: `jquery.easy-autocomplete.js`, `easy-autocomplete.css` 


### Other Credits

The replay, checkmark, circle and knife graphics are by [Freepik](http://www.freepik.com/) from [Flaticon](http://www.flaticon.com/) and are licensed under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/). Made with [Logo Maker](http://logomakr.com).

The pizza graphic is by [Miu Icons (Linh Pham)](http://linhpham.me/miu) from [Flaticon](http://www.flaticon.com/) and is licensed under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/). Made with [Logo Maker](http://logomakr.com).

The barber pole, X, info and cannon graphics come from [Icons8.com](https://icons8.com/). [Licence](https://icons8.com/license/)