define([], function () {
  PMS.UserModel = Backbone.Model.extend({
    defaults: {
      name: "",
    },
  });
  PMS.UserView = Backbone.View.extend({
    model: new PMS.UserModel(),
    el: $("#navbar"),
    template: _.template($("#navbar-user-template").html()),
    events: {
      "click #user .fa-arrow-right-from-bracket": "logOut",
    },
    logOut: function (e) {
      console.log("logged out");
      $(e).toggleClass("shocked");
     // $(PMS.friendsView.el).empty();
      PMS.sidebarView.selfRemove();
      //PMS.friendsView.$el ?? PMS.friendsView.$el.empty();
      this.selfRemove();
      localStorage.clear();
      Backbone.history.navigate("/logIn", true);
     
    },
    initialize: function () {
      if (localStorage.getItem("expenser-token")) {
        this.model.set("name", localStorage.getItem("expenser-username"));
        this.render();
      }
    },
    selfRemove: function () {
      if ($("#user")) {
        $("#user").remove();
      }
    },
    render: function () {
      this.selfRemove();
      this.$el.append(this.template(this.model.toJSON()));
    },
  });
});
