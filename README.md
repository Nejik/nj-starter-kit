# nj-starter-kit
New project starter kit powered by gulp, webpack and friends.

## Project start
### Clone project template and go inside
```
git clone https://github.com/Nejik/nj-starter-kit.git new-project && cd new-project
```
### Install modules
```
npm i -g gulpjs/gulp#4.0 && npm i
```
## Commands
### Start in development mode with hot reloading
```
npm start
```
### Production build
```
npm run build
```
### Run on other port
```
PORT=9000 npm start
```
### Open in browser on start
```
OPEN=true npm start
```
### Remove build(development) and dist(production) folders
```
gulp clean
```


## Html
[EJS](http://ejs.co/) used for building HTML

Mainly ejs using just for importing component files.
```
<!-- simple include -->
<%- include('/components/header/header.html') %>

<!-- pass variables in included file -->
<%- include('/components/header/header.html', {active: 'main'}) %>
```
P.S. All variables saved in `locals` object inside template, you can acces variables without `locals.*` , but it brings more errors in some situations, just use `locals.variable` inside templates.

Also you can use some other constructions like (more in documentation: [EJS](http://ejs.co/)):
```
<%= locals.title || "New project" %>

<% if (locals.title) { %>
  <%= locals.title %>
<% } %>

<% if (locals.title) { %>
  <%= locals.title %>
<% } else { %>
  <%- "Default title" %>
<% } %>

<% if (locals.title) { %>
  <%= locals.title %>
<% } else if (locals.title2 === 'success') { %>
  <%- locals.title2 %>
<% } %>
```
## CSS
[PostCSS](https://github.com/postcss/postcss) used for building CSS
## JS
[Babel](https://github.com/babel/babel) and [Webpack](https://github.com/webpack/webpack) used for building JavaScript

## Images

For usual images such as background you don't need to do something special.

### Images sprites
1) vector icons (.svg) *(preferred way)*

    All your *.svg files from src/img/sprites/svg folder will be merged into one icons.svg sprite, so you can use it in your html like this
    ```html
    <svg class='icon'>
      <use xlink:href='img/icons.svg#down'></use>
    </svg>
    ```
    Some notes about svg icons:

    1. how to [SVG `<use>` article](https://css-tricks.com/svg-use-with-external-reference-take-2/)
    2. polyfill for IE already included in this template - [svg4everybody](https://github.com/jonathantneal/svg4everybody)
    3. in ```icons.svg``` all colors(fill, stroke) will be deleted, but you can style them via css! [SVG `<use>` article](https://css-tricks.com/svg-use-with-external-reference-take-2/) (can be changed in configuration)
    4. you still have access to original(non-sprited) svg files in ```build(dist)/img/*.svg```, they just copied with all other images

    Powered by [gulp-svg-sprite](https://github.com/jkphl/gulp-svg-sprite)

2) raster icons (.png)
* just put your raster icons in ```src/img/sprites/``` and use them in usual way (images automatically will be processed to sprites by postcss plugin)
    ```css
    .test:before {
        content:'';
        width:10px;
        height:15px;
        background-image:url('/img/sprites/icon.png');
    }
    ```
    P.S. paths should start from `/` for sprite creating.

    Powered by [postcss-sprites](https://github.com/2createStudio/postcss-sprites)


### Images inline
If for some reason you want to [inline](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) images, we have 2 ways:

1) svg icons can be inlined and styled like this:
    ```css
    .test {
        background: svg-load('img/arrow-up.svg', fill: #000, stroke: #fff);

        &:hover {
            background: svg-load('img/arrow-up.svg', fill: red, stroke: #fff);
        }
    }
    ```
    P.S. paths should **NOT** start from `/`

    Powered by [postcss-inline-svg](https://github.com/TrySound/postcss-inline-svg)

2) raster icons can be inlined like this:
    ```css
    .foobar {
      background: inline('img/foobar.png');
    }
    ```
    P.S. paths should **NOT** start from `/`

    Powered by [postcss-assets](https://github.com/borodean/postcss-assets)


In production mode all images optimized by [gulp-image](https://github.com/1000ch/gulp-image)

## License

MIT ©
