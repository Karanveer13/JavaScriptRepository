var PMS = PMS || {};
define([
  "login",
  "signup",
  "dashboard",
  "group",
  "dummyGroupList",
  "expenseCreate",
  "friend_list",
], function (
  logIn,
  signUp,
  dashboardView,
  GroupViewObj,
  groupList,
  Expense,
  friends
) {
  // var appCollection = Backbone.Collection.extend({});
  // var appInstance = new appCollection();
  // var appView = Backbone.View.extend({
  //   model: appInstance,
  //   el: $(".app"),
  //   initialize: function () {
  //     this.render();
  //     //this.model.on("add", this.render, this);

  //   },

  //   render: function () {
  //     var self = this;
  //     this.$el.html("");
  //     _.each(this.model.toArray(), function (menu) {
  //       self.$el.append(new signUpView({ model: menu }).render().$el);
  //     });
  //   },
  // });
  PMS.AppRouter = Backbone.Router.extend({
    initialize: function () {},
    routes: {
      logIn: "logIn",
      signUp: "signUp",
      dashboard: "dashboard",
      "group/:id": "openGroup",
      "*other": "defaultRoute",
    },
    createExpense: function () {
      console.log("we are at create expense page");
      // var expense = new Expense.model({
      //   name: "Pizza",
      //   amount: 850,
      //   addedFriends: [],
      //   friendList : friends.map(f => f.name),
      //   divideEqual : "false",
      // });
      // new Expense.view({ model: expense }).render();
    },
    logIn: function () {
      console.log("we are at login");
      var logInModel = new logIn.logInModel();
      new logIn.logInView({ model: logInModel }).render();
      // appInstance.reset();
      // appInstance.add(logInView);
    },
    signUp: function () {
      console.log("we are at Sign Up");
      var signUpModel = new signUp.signUpModel();
      new signUp.signUpView({ model: signUpModel }).render();
      // appInstance.reset();
      // appInstance.add(signUpView);
      // new appView();
    },
    openGroup: function (id) {
      if (this.checkIfLogin()) {
        this.initializeModels();
        console.log("group opened", id);
        console.log(PMS.groupsCollection);
        if (PMS.hasOwnProperty("groupView")) {
          $(PMS.groupView.el).empty();
          $(PMS.groupView.el).unbind();
        }
        PMS.groupView = new GroupViewObj.view();
        PMS.groupsCollection.models.forEach((e) => {
          if (e.attributes.id == id) {
            PMS.groupView.model.set("title", e.attributes.title);
            PMS.groupView.render();
          }
        });
        PMS.groupView.render();
      } else {
        this.redirectToLogin();
      }
    },

    checkIfLogin: function () {
      if (localStorage.getItem("expenser-token")) {
        return true;
      } else {
        return false;
      }
    },
    initializeModels: function () {
      localStorage.setItem(
        "friends",
        JSON.stringify(friends.map((friend) => friend.name))
      );
      if (!localStorage.getItem("groups")) {
        localStorage.setItem(
          "groups",
          JSON.stringify([
            {
              title: "College Friends",
              id: 0,
              active: false,
              members: [],
              expenses: [],
            },
          ])
        );
      }
      PMS.sidebarView = PMS.sidebarView || new PMS.SidebarView();
      PMS.groupsCollection = PMS.groupsCollection || new PMS.GroupsCollection();
      JSON.parse(localStorage.getItem("groups")).map((group) => {
        PMS.groupsCollection.add(
          new PMS.GroupModel({
            id: group.id,
            title: group.title,
            active: group.active,
          })
        );
      });
      PMS.userView = PMS.userView || new PMS.UserView({});
      PMS.friendsModel =
        PMS.friendsModel ||
        new PMS.FriendsModel({
          friends: JSON.parse(localStorage.getItem("friends")),
        });
      PMS.friendsView =
        PMS.friendsView ||
        new PMS.FriendsView({
          model: PMS.friendsModel,
        });
      PMS.groupsView =
        PMS.groupsView ||
        new PMS.GroupsView({
          model: PMS.groupsCollection,
          el: $("#group-list"),
        });
    },

    redirectToLogin: function () {
      Backbone.history.navigate("/logIn", true);
    },

    dashboard: function () {
      if (this.checkIfLogin()) {
        console.log("you are at dashboard");
        new dashboardView().render();
        this.initializeModels();
      } else {
        this.redirectToLogin();
      }
    },
    defaultRoute: function () {
      // if (localStorage.getItem("expenser-token")) {
      //   Backbone.history.navigate("/dashboard", true);
      // } else {
      //   this.redirectToLogin();
      // }
    },
  });
  return PMS.AppRouter;
});
