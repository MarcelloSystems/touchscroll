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

**Sizing scrollable areas** can be quite difficult. We recommend to use the CSS calc method. See examples below. We also recommend to use box-sizing: border-box, when adding borders and padding to elements that are part of the calculated areas. Also example below.

# How to use

**jQuery**: $('#myEl').touchscroll(ARGS);

**normal**: touchscroll(document.getElementById('myEl'), ARGS);

*Examples will be with jQuery.*

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

### Sizing a scrollable area
Note that if you are using LESS, it will compile the calculations in the calc method, which means the final output will be "calc(0)" in this case. To avoid LESS to do the calculation, you can escape it like this: "height: ~"calc(100% - 100px)";
```html
<!DOCTYPE html>
<html>
  <head>
    <style>
        html, body {
          height: 100%;
          margin: 0;
        }
        #header {
          height: 100px;
        }
        .list {
          height: calc(100% - 100px);
        }
    </style>
  </head>
  <body>
    <div id="main">
      <div id="header">Header</div>
      <div class=".list"></div>
    </div>
  </body>
</html>
```

> Never use border or padding on scroll elements themselves. Do that in a wrapper. This has to do with calculations of the scroll.

### Handling border and padding
In this example we use the css property "box-sizing: border-box" to safely still use 100% -100px since both the border and the padding will be part of the headers total height.
```html
<!DOCTYPE html>
<html>
  <head>
    <style>
        html, body {
          height: 100%;
          margin: 0;
        }
        #header {
          height: 100px;
          border: 2px solid #000;
          padding: 10px;
          box-sizing: border-box;
        }
        .list {
          height: calc(100% - 100px);
        }
    </style>
  </head>
  <body>
    <div id="main">
      <div id="header">Header</div>
      <div class=".list"></div>
    </div>
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

## META tags to display content correctly
```html
<!DOCTYPE html>
<html>
  <head>
      <meta name="viewport" content="width=device-width, user-scalable=0, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="msapplication-tap-highlight" content="no"/>
    <meta name="apple-mobile-web-app-capable" content="yes">
  </head>
  <body>
  
  </body>
</html>
```
