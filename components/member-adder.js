var PMS = PMS || {};
define([], function () {
  PMS.MemberAdderModel = Backbone.Model.extend({
    defaults: {
      admin: "",
      friendList: [],
      memberList: [],
    },
  });
  PMS.MemberAdderView = Backbone.View.extend({
    model: new PMS.MemberAdderModel(),
    events: {
      "click .fa-solid.fa-circle-plus": "addFriend",
      "click .fa-solid.fa-circle-minus": "removeFriend",
      "click .fa-solid.fa-circle-xmark": "close",
      "click #add-member-btn": "addMembers",
    },
    renderDropDown: function () {
      var owner = "";
      $(".js-example-basic-single").select2({
        placeholder: "Select admin",
        dropdownParent: $("#add-member-card #form .input-field")[0],
        containerCssClass: "error",
        dropdownCssClass: "test",
        width: "resolve",
      });
      $(".js-example-basic-single").on("select2:select", function (e) {
        var data = e.params.data;
        console.log(data.id);
        owner = data.id;
      });
      this.model.set("owner", owner);
    },
    saveData: function () {
      this.model.set(
        "admin",
        $(".js-example-basic-single").select2("data")[0].id
      );
      let groups = JSON.parse(localStorage.getItem("groups"));
      groups.forEach((group) => {
        if (group.id == Backbone.history.location.hash.split("/")[1]) {
          group.members = this.model.get("memberList");
        }
      });
      localStorage.setItem("groups", JSON.stringify(groups));
	  PMS.vent.trigger("friends:refresh",this.model.get("memberList"));
    },
    close: function () {
      console.log("closing views");
      $(this.el).empty();
      $(this.el).hide();
      $(this.el).unbind();
    },
    addMembers: function () {
      this.saveData();
      console.log(this.model);
      this.close();
    },
    addFriend: function (e) {
      console.log("adding friends");
      let members = this.model.get("memberList");
      members.push(e.target.previousElementSibling.innerText);
      this.model.set("memberList", members);
      let friends = this.model.get("friendList");
      friends.splice(
        friends.indexOf(e.target.previousElementSibling.innerText),
        1
      );
      this.model.set("friendList", friends);
      this.render();
    },
    removeFriend: function (e) {
      console.log("tried to remove friend");
      let friends = this.model.get("friendList");
      friends.push(e.target.previousElementSibling.innerText);
      this.model.set("friendList", friends);
      let members = this.model.get("memberList");

      this.model.set(
        "memberList",
        members.filter(
          (elm) => elm !== e.target.previousElementSibling.innerText
        )
      );
      this.render();
    },
    initialize: function () {
      this.model.bind("change", this.render, this);
      this.template = _.template($("#member-adder-template").html());
      this.render();
    },
    render: function () {
      this.$el.show();
      this.$el.html(this.template(this.model.toJSON()));
      this.renderDropDown();
      return this;
    },
  });
});
