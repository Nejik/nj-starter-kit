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
PostCSS used for building CSS
## JS
Babel and Webpack2 used for building JavaScript
## Images
Images optimized by gulp-imagemin.

SVG sprites builded by [https://github.com/jkphl/svg-sprite](https://github.com/jkphl/svg-sprite)

All files from ```from src/img/sprites/svg``` processed to sprite ```dist/img/icons.svg```

All files from ```from src/img/sprites/svgColored``` processed to sprite ```dist/img/iconsColored.svg```

Difference between ```icons.svg and iconsColored.svg``` is that in iconsColored.svg styles are not cutted.

Than you can use svg sprite in html:
```html
<svg class='icon'>
    <use xlink:href='img/icons.svg#down'></use>
</svg> 
<svg>
    <use xlink:href='img/iconsColored.svg#logo'></use>
</svg>
```


