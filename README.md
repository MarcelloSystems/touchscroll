touchscroll
===========

A standalone and jQuery plugin to handle NATIVE scroll on NATIVE types of mobile web applications

# Features
- Locks your web page scrolling
- Adds native scrolling to whatever element you want
- Supports delegated scrolling
- Prevents any dragging beyond boundaries
- Superfast native scrolling!
- Add touchable elements with delegation

# What to be aware of
**Attach touchscroll** to elements you are going to keep around through the cycle of your application. Backbone view elements is an example of that. If you are changing DOM content, attach the touchscroll to a higher order DOM element, even the body could have the touchscroll, and then use delegation instead.

**Sizing scrollable areas** can be quite difficult. We recommend to use the CSS calc method. See examples below

# How to use

### Add script. Be sure to add it after jQuery, if you want to use jQuery
```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <script src="jquery.js"></script>
    <script src="touchscroll.js"></script>
  </body>
</html>
```

### Attach scroll to a DOM node directly
This will make the content of the DIV natively scrollable
```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <div id="main"></div>
    <script src="jquery.js"></script>
    <script src="touchscroll.js"></script>
    <script>
      $('#main').touchscroll();
    </script>
  </body>
</html>
```
### Attach scroll to DOM node with delegation
In this example it will be safe to empty the content of main and add a new list element inside it.
```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <div id="main">
      <div class=".list"></div>
    </div>
    <script src="jquery.js"></script>
    <script src="touchscroll.js"></script>
    <script>
      $('#main').touchscroll('.list');
    </script>
  </body>
</html>
```

### Listen to touch on elements and trigger method. The second argument is the element that was touched
```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <div id="main">
      <div class=".list"></div>
    </div>
    <script src="jquery.js"></script>
    <script src="touchscroll.js"></script>
    <script>
      var openItem = function (event, item) {
        console.log('My item ' + item);
      };
    
      $('#main').touchscroll('.list', {
        '.item': openItem
      });
    </script>
  </body>
</html>
```

### How to use it on a Backbone view
```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <div id="main">
      <div class=".list"></div>
    </div>
    <script src="jquery.js"></script>
    <script src="touchscroll.js"></script>
    <script src="underscore.js"></script>
    <script src="backbone.js"></script>
    <script>
        var MyView = Backbone.View.extend({
          el: '#main',
          initialize: function () {
            this.$el.touchscroll('.list', {
              '.item': this.openItem.bind(this)
            });
          },
          openItem: function (event, item) {
            // Do something
          }
        
        });
    </script>
  </body>
</html>
```

# TIPS
## Remove all user selection boxes
```stylesheet
* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
```
