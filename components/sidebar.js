var PMS = PMS || {};
define([], function () {
  PMS.SidebarView = Backbone.View.extend({
    el: $("body"),
    template: _.template($("#sidebar-template").html()),

    events: {
      "click .options": "optionClick",
    },
    optionClick: function (e) {
      console.log($(e));
    },
    initialize: function () {
      this.render();
      $(".options").click(function (e) {
        if ($(this).index() === 0) {
          Backbone.history.navigate("/dashboard", true);
        } else {
          $("i").toggleClass("active");
          $("#groups-box").slideToggle();
        }
      });
    },
    selfRemove: function () {
      if ($("#sidebar")) {
        $("#sidebar").remove();
      }
    },
    render: function () {
      if ($("#sidebar")) {
        $("#sidebar").remove();
      }
      this.$el.append(this.template());
    },
  });
  return;
});
