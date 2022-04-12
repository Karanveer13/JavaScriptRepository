define(["dummyGroupList", "add_group"], function ( addGroup) {
  //Group Model 
  // groupList.forEach((group) => {
  //   console.log(group);
  // });
  
  //Group Collection 

  //Instantiating a group
  // var college_friends = new GroupModel({
  //   title: "College Friends",
  //   active: true,
  // });

  //Adding group to collection
  //var Groups = new GroupsCollection([]);
  // groupList.forEach((group) => {
  //   Groups.add(new GroupModel(group));
  // });
  //View for One Group
  PMS.GroupView = Backbone.View.extend({
    tagName: "div",
    className: "groups",
    initialize: function () {
      this.template = _.template($("#groups-list-template").html());
      this.render();
    },
    events: {
      click: "setActive",
    },

    setActive: function () {
      $(".groups").removeClass("active");
      this.$el.toggleClass("active");
      console.log(this.model.get("id"));
      Backbone.history.navigate(`/group/${this.model.get("id")}`, true);
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
  });
  //View for All Groups or Group List View
  PMS.GroupsView = Backbone.View.extend({
    model: PMS.groupsCollection,
    createGroup: function (e) {
      PMS.LoadGroupCreationModel();
      PMS.groupCreationModel = new PMS.GroupCreationModel({
        name : null,
        creator : null,
      });
      PMS.groupCreationView = new PMS.GroupCreationView({
        model: PMS.groupCreationModel,
      });
    }, 
    initialize: function () {
      this.model.on(
        "add",
        (change) => {
          console.log("new group added");
          console.log(change); 
          this.render();
        },
        this
      );
      $("#add-group").click(this.createGroup);
      this.render();
    },
    render: function () { 
      var self = this;
      this.$el.html(``);
      console.log(this.model);
      _.each(this.model.toArray(), function (group) {
        self.$el.append(new PMS.GroupView({ model: group }).render().$el);
      });
    },
  });
  return;
});
