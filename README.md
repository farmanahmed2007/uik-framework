## UIK Framework

[![Keep a Changelog v0.1.5 badge][changelog-badge]][changelog]
[![Version 0.1.4 Badge][version-badge]][changelog]
[![MIT License Badge][license-badge]][license]

Follow Step by Step Integration Below

* Install
* Dependencies
* Modifications
* Build / Compile
* View Compiled Files
* Include Files in your project
* Slack Support

## Install

```render
npm install uik-framework --save
```

## Dependencies

```render
npm install -g webpack
npm install -g webpack-cli
npm install -g Browserify (browserify)
npm install -g Uglify JS (uglify-js)
npm install -g Uglify Css (uglifycss)
```

## Modifications

You can modify which files you want to keep in the dist.
Files can be found in /dist/uik-framework/ folder.

## Build / Compile

Either directly use scss as reuqired
OR
Run this command for each CSS & JS compilation

cd uik-framework/
```render
webpack --config webpack.config.js
```

## View Compiled Files

All files will be added in /dist/uik-framework/ folder

## Include Files in your project

Copy and Paste /dist fromm package inside your project
Add them in your SCSS Production
OR
Add them in our HTML Document

```render
<!-- jQuery -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

<!-- UIK Framework-->
<link rel="stylesheet" type="text/css" href="dist/uik.bundle.min.css">
<script src="dist/uik.bundle.min.js"></script>
</code>
```
OR
```render
"styles": [
	"../node_modules/uik-framework/src/dist/css/uik.bundle.min.css"
],
"scripts": [
	"../node_modules/uik-framework/src/dist/js/uik.bundle.min.js"
],
```

## Slack Support
Free to join my slack #uik-framework

[changelog]: ./CHANGELOG.md
[changelog-badge]: https://img.shields.io/badge/changelog-v0.1.5-%23E05735
[license]: ./LICENSE.md
[version-badge]: https://img.shields.io/badge/version-0.1.5-blue.svg
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg

