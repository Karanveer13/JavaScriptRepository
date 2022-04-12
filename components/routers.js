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
    initialize: function () { },
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
        this.initializeModels()
          .then((res) => {
            console.log("group opened", id);
            PMS.groupsCollection.fetch()
              .then((res) => {


                PMS.groupView = PMS.groupView || new PMS.view.GroupView();
                
                console.log(PMS.groupsCollection.models);
                PMS.vent.trigger("friends:refresh");
                _.map(PMS.groupsCollection.models, function (group) {
                  console.log('test1');
                  if (group.get('id') == id) {
                    console.log('test');
                    console.log(group);
                    PMS.groupView.model = group;
                    PMS.globals.expenses = PMS.globals.expenses || new PMS.collections.expenses();

                    PMS.groupView.render();
                    PMS.expenseCollectionView = new PMS.ExpenseCollectionView({ model: PMS.globals.expenses });
                    PMS.expenseCollectionView.render();
                    PMS.friendsView =
                      PMS.friendsView ||
                      new PMS.FriendsView({
                        model: new PMS.FriendsModel({
                          friends: _.pluck(PMS.fn.getCurrentGroupFriends(PMS.fn.getCurrentGroupId()), 'user'),
                        })
                    });


                    // if (PMS.hasOwnProperty('expenseCollectionView')) {
                    //   PMS.globals.expenses.fetch()
                    //     .then((res) => {
                    //       PMS.expenseCollectionView.$el.empty();
                    //       PMS.expenseCollectionView.render();
                    //     })
                    // }
                    // else {
                    //   PMS.globals.expenses.fetch()
                    //     .then((res) => {

                    //     })

                    // }






                  }
                })
              })


          })


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
      // localStorage.setItem(
      //   "friends",
      //   JSON.stringify(friends.map((friend) => friend.name))
      // );
      // if (!localStorage.getItem("groups")) {
      //   localStorage.setItem(
      //     "groups",
      //     JSON.stringify([
      //       {
      //         title: "College Friends",
      //         id: 0,
      //         active: false,
      //         members: [],
      //         expenses: [],
      //       },
      //     ])
      //   );
      // }

      PMS.sidebarView = PMS.sidebarView || new PMS.SidebarView();
      PMS.groupsCollection = PMS.groupsCollection || new PMS.collections.groups(null);
      PMS.groupsView =
        PMS.groupsView ||
        new PMS.GroupsView({
          model: PMS.groupsCollection,
          el: $("#group-list"),
        });
      PMS.globals.group_friends = PMS.globals.group_friends || new PMS.collections.group_friends();
      PMS.globals.profile = PMS.globals.profile || new PMS.models.profile();
      PMS.globals.public_users = PMS.globals.public_users || new PMS.collections.users();
      PMS.globals.profile_friends = PMS.globals.profile_friends || new PMS.collections.profile_friends();
      PMS.globals.splitters = PMS.globals.splitters || new PMS.collections.splitters();
      PMS.globals.friendsView = PMS.globals.friendsView || new PMS.views.friendsView({
        model: PMS.globals.profile_friends,
        el: $("#friends-list"),
      });

      // JSON.parse(localStorage.getItem("groups")).map((group) => {
      //   PMS.groupsCollection.add(
      //     new PMS.GroupModel({
      //       id: group.id,
      //       title: group.title,
      //       active: group.active,
      //     })
      //   );
      // });
      PMS.view.userView = PMS.view.userView || new PMS.UserView({});

      // PMS.groupsView =
      //   PMS.groupsView ||
      //   new PMS.GroupsView({
      //     model: PMS.groupsCollection,
      //     el: $("#group-list"),
      //   });

      return Promise.all([PMS.groupsCollection.fetch()]);
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
