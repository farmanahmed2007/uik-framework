var uikFormElement = require('./utils/form-elements.js');
var uikTables = require('./utils/tables.js');
var uikButtons = require('./utils/buttons.js');
var uikNavigation = require('./utils/navigation.js');
var uikAccordian = require('./utils/accordian.js');
var uikTabs = require('./utils/tabs.js');
var uikTooltip = require('./utils/tooltip.js');
var uikBackToTop = require('./utils/back-top.js');
var uikCard = require('./utils/card.js');
var uikPopup = require('./utils/popup.js');
var uikUtilsInitialized = require('./utils/global.js');

var wow = require('wow.js');
wow = new wow({
    boxClass: 'wow',
    animateClass: 'animated',
    offset: 0,
    mobile: true,
    live: true,
    scrollContainer: null,
    resetAnimation: true,
});
wow.init();

var jqueryLightSlider = require('./plugins/lightslider.min.js');
var jqueryFancyBox = require('./plugins/jquery.fancybox.js');