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
        console.log('index', $(this).index())
        switch ($(this).index()) {
          case 0:
            Backbone.history.navigate("/dashboard", true);
            break;

          case 1:
            $(this).find('i').toggleClass("active");
            $("#groups-box").slideToggle();
            break;

          case 3:
            $(this).find('i').toggleClass("active");
            $("#friends-box").slideToggle();
            break;

          default:
            break;
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
