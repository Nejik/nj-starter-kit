# nj-starter-kit
New project starter kit powered by gulp, webpack and friends.

## Project start
### Clone project template and go inside
```
git clone https://github.com/Nejik/nj-starter-kit.git new-project && cd new-project
```
### Install modules
```
npm i
```
### Run
```
npm start
```
## Commands
### Start in development mode with hot reloading
```
npm start
```
### Production build
```
npm run prod
```
### Run on other port
```
PORT=9000 npm start
```
### Open in browser on start
```
OPEN=true npm start
```
### Remove dist and prod folders
```
gulp clean
```


## Html
[EJS](http://ejs.co/) used for building HTML
## CSS
[PostCSS](https://github.com/postcss/postcss) used for building CSS
## JS
[Babel](https://github.com/babel/babel) and [Webpack2](https://github.com/webpack/webpack) used for building JavaScript
## Images

For usual images such as background you don't need to do something special.

### Images sprites
1) vector icons (.svg) *(preferred way)*
* If our icons shouldn't save their colors, and we want to style tem via css, we remove all fill/stroke styles from svg file 
    and put icons in ```src/img/sprites/svg/``` and they will be processed to ```dist/img/icons.svg```
    
    Then use it in html:
          
    ```html
    <svg class='icon'>
        <use xlink:href='img/icons.svg#down'></use>
    </svg> 
    ```

* If our icons should save their colors *(logo for example)*, we should transfer all styles from ```<style>``` tag to attributes:       example ```<path style="fill:red>```
    and put icons in ```src/img/sprites/svgColored/``` and they will be processed to ```dist/img/iconsColored.svg```
    
    Then use it in html:
    ```html
    <svg class='icon'>
        <use xlink:href='img/iconsColored.svg#logo'></use>
    </svg> 
    ```
    Powered by [gulp-svg-sprite](https://github.com/jkphl/gulp-svg-sprite)
          
    *Difference between ```icons.svg``` and ```iconsColored.svg``` is that in ```iconsColored.svg``` styles are not cutted.*
 
2) raster icons (.png)
* just put your raster icons in ```src/img/sprites/``` and use them in usual way (images automatically will be processed to sprites by postcss plugins)
    ```css
    .test:before {
        content:'';
        width:10px;
        height:15px;
        background-image:url('img/sprites/icon.png');
    }
    ```
    Powered by [postcss-sprites](https://github.com/2createStudio/postcss-sprites)
          
    *Difference between ```icons.svg``` and ```iconsColored.svg``` is that in ```iconsColored.svg``` styles are not cutted.*
    
### Images inline
If for some reason we want to [inline](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) images, we have 2 ways:

1) svg icons can be inlined and styled like this:
```css
.up {
    background: svg-load('img/arrow-up.svg', fill: #000, stroke: #fff);

    &:hover {
        background: svg-load('img/arrow-up.svg', fill: red, stroke: #fff);
    }
}
```
Powered by [postcss-inline-svg](https://github.com/TrySound/postcss-inline-svg)

2) raster icons can be inlined like this: 
```css
.foobar {
  background: inline('img/foobar.png');
}
```
Powered by [postcss-assets](https://github.com/borodean/postcss-assets)


All images optimized by [gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin)

## License

MIT ©
