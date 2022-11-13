/* Custom UI settings and UI initialization.
 */

/* This script is NOT referenced in _includes/scripts.html.
 * You should make changes here, and then run the command
 * npm run build:js 
 * defined in package.json to minify this file to main.min.js.
 * This requires installing node.js and the npm packages first.
 */

$(document).ready(function () {
    // Sticky footer, (Borrowed from minimal mistakes theme code)
    var bumpIt = function () {
        $(".page-content").css("padding-bottom", $(".page-footer").outerHeight(true));
    },
    didResize = false;
    bumpIt();
    $(window).resize(function () {
        didResize = true;
    });
    setInterval(function () {
        if (didResize) {
            didResize = false;
            bumpIt();
        }
    }, 250);
});