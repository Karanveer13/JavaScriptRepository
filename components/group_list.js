define(["dummyGroupList", "add_group"], function (groupList, addGroup) {
  //Group Model
  console.log(groupList);
  // groupList.forEach((group) => {
  //   console.log(group);
  // });
  PMS.GroupModel = Backbone.Model.extend({
    defaults: {
      id: 0,
      title: "",
      active: false,
    },
  });
  //Group Collection
  PMS.GroupsCollection = Backbone.Collection.extend({});

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
    model: new PMS.GroupModel(),
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
    model: new PMS.GroupsCollection(),
    createGroup: function (e) {
      PMS.LoadGroupCreationModel();
      PMS.groupCreationModel = new PMS.GroupCreationModel({
        title: "",
        id: 0,
        description: "",
      });
      PMS.groupCreationView = new PMS.GroupCreationView({
        model: PMS.groupCreationModel,
      });
    },
    addGroupInStorage: function (change) {
      let groups = JSON.parse(localStorage.getItem("groups"));
      groups.push({
        title: change.attributes.title,
        active: change.attributes.active,
        id: change.attributes.id,
      });
      localStorage.setItem("groups", JSON.stringify(groups));
    },
    initialize: function () {
      this.model.on(
        "add",
        (change) => {
          console.log("new group added");
          console.log(change);
          this.addGroupInStorage(change);
          this.render();
        },
        this
      );
      $("#add-group").click(this.createGroup);
      this.render();
    },
    render: function () {
      console.log(this.model);
      var self = this;
      this.$el.html(``);
      _.each(this.model.toArray(), function (group) {
        self.$el.append(new PMS.GroupView({ model: group }).render().$el);
      });
    },
  });
  return;
});
