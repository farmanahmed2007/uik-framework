require('./utils/form-elements.js');
require('./utils/tables.js');
require('./utils/buttons.js');
require('./utils/navigation.js');
require('./utils/accordian.js');
require('./utils/tabs.js');
require('./utils/tooltip.js');
require('./utils/back-top.js');
require('./utils/card.js');
require('./utils/popup.js');
require('./utils/global.js');

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

require('./plugins/lightslider.min.js');
require('./plugins/jquery.fancybox.js');
require('./plugins/jquery.fancybox-thumbs.js');
require('./plugins/jquery.fancybox-buttons.js');