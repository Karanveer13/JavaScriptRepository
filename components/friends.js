var PMS = PMS || {};
define([], function () {
  PMS.FriendsModel = Backbone.Model.extend({
    defaults: {
      friends: [],
    },
  });
  PMS.FriendsView = Backbone.View.extend({
    el: $("#sidebar-right"),
    model: new PMS.FriendsModel(),
    template: _.template($("#friends-card-template").html()),
    events: {},
    initialize: function () {
      var self = this;
      PMS.vent.on("friends:refresh", function (members) {
        console.log("some event was fired");
        self.model.set("friends", members);
        self.render();
      });
      PMS.appRouter.on("route", function (route, params) {
        if (route === "openGroup") {
          console.log("params", params);
          let members = JSON.parse(localStorage.getItem("groups")).filter(
            (group) => group.id == params[0]
          )[0].members;
          self.model.set("friends", members);
          self.render();
        } else if (route === "dashboard") {
          let friends = JSON.parse(localStorage.getItem("friends"));
          self.model.set("friends", friends);
          self.render();
        }
        console.log("Different Page: " + route);
      });
      this.render();
    },
    render: function () {
      if ($("#friends")) {
        $("#friends").remove();
      }
      this.$el.append(this.template(this.model.toJSON()));
    },
  });
  return;
});
