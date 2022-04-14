define([], function () {
  var dashboardView = Backbone.View.extend({
    el: $(".app"),
    tagName: "div",
    events: {

    },
    dashboard: function () {

    },
    initialize: function () {
      this.template = _.template($("#dashboard-template").html());
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
  });
  return dashboardView;
});
