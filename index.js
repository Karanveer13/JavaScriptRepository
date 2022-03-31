console.log("test");

var PMS = PMS || {};
PMS.vent = _.extend({}, Backbone.Events);
require.config({
  paths: {
    navbar: "components/navbar",
    login: "components/login",
    signup: "components/signup",
    routers: "components/routers",
    groups_list: "components/group_list",
    dashboard: "components/dashboard",
    group: "components/group",
    friend_list: "dummyData/friend_list",
    dummyGroupList: "dummyData/group_list",
    expenseCreate: "components/expense-creator",
    settlePayment: "components/settle-payment",
    expense: "components/expense",
    group_balance: "components/groupbalance",
    add_group: "components/add-group",
    sidebar: "components/sidebar",
    friends: "components/friends",
    member_adder: "components/member-adder",
  },
  shim: {},
});

require(["navbar", "routers", "groups_list", "sidebar", "friends"], function (
  NavView,
  AppRouter,
  GroupObject
) {
  console.log(NavView);
  console.log(AppRouter);
  PMS.appRouter = new PMS.AppRouter();
  Backbone.history.start();
  $(function () {
    //new NavView();
    //new GroupsView();
  });
});
