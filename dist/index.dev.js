"use strict";

console.log("test");

require.config({
  // your configuration key/values here
  //baseUrl: "",
  // generally the same directory as the script used in a data-main attribute
  // for the top level script
  paths: {},
  // set up custom paths to libraries, or paths to RequireJS plug-ins
  shim: {
    "components/navbar.js": {
      exports: "NavView"
    }
  } // used for setting up all Shims (see below for more detail)

});

require(["components/navbar"], function (NavView) {
  console.log(NavView);
  $(function () {
    new NavView();
  });
});