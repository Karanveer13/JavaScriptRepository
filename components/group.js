var PMS = PMS || {};
PMS.view = PMS.view || {};
define([
  "friend_list",
  "settlePayment",
  "expense",
  "member_adder",
  "group_balance",
], function (friends, settlePayment, load) {
  // var expense = {};
  // expense.collection = Backbone.Collection.extend({});
  // expense.view = Backbone.View.extend({
  //   el: $("#expense-content"),
  //   initialize: function () {
  //     console.log(this.model);
  //     var self = this;
  //     this.$el.html(""),
  //       _.each(this.model.toArray(), function (transaction) {

  //       });
  //   },
  //   render: function () {},
  // });  
  PMS.view.GroupView = Backbone.View.extend({
    el: $(".app"),
    tagName: "div",
    initialize: function () {
      this.template = _.template($("#group-card-template").html());

    },
    handle: new _.extend({}, Backbone.Events),
    events: {
      "click #add-expense": "addExpenseCard",
      "click #settle-payment-card-btn": "settlePayment",
      "click #add-member": "addMember",
    },
    addMember: function () {
      var current_group_id = parseInt(Backbone.history.location.hash.split("/")[1]);
      console.log(current_group_id);
      PMS.memberAdderModel = new PMS.MemberAdderModel({
        admin: PMS.groupsCollection.where({ id: current_group_id })[0].get('creator'),
        memberList: _.map(PMS.groupsCollection.where({ id: current_group_id })[0].get('group_friends'), function (profile_friend) {
          console.log(profile_friend);
          var resource_uri = profile_friend.resource_uri;
          var username = profile_friend.friend.user.username;
          console.log('username', profile_friend);
          return {
            resource_uri: resource_uri,
            username: username,
          }
        }),
        friendList: _.map(_.reject(PMS.globals.profile.attributes.profile_friends, function (friend) {
          console.log('friend', friend);
          return (_.contains(_.mapObject(PMS.fn.getCurrentGroupFriends(), (obj) => obj.friend.resource_uri), friend.resource_uri));
        }), function (friend) { return { resource_uri: friend.resource_uri, username: friend.user.username ?? "" } }),


      });




      // friendList: JSON.parse(localStorage.getItem("friends")).filter(
      //   (friend) =>
      //     !JSON.parse(localStorage.getItem("groups"))
      //       .filter(
      //         (group) =>
      //           group.id == Backbone.history.location.hash.split("/")[1]
      //       )[0]
      //       .members.find((mem) => mem === friend)
      // ),
      // memberList: JSON.parse(localStorage.getItem("groups")).filter(
      //   (group) => group.id == Backbone.history.location.hash.split("/")[1]
      // )[0].members,

      PMS.memberAdderView = new PMS.MemberAdderView({
        model: PMS.memberAdderModel,
        el: $("#operation-view"),
      });
    },
    settlePayment: function (e) {
      e.preventDefault();
      console.log("settle Payment card");

      var currentReceiver = PMS.groupBalanceModel.attributes.transactions.filter((transaction) => transaction.ower == PMS.fn.getUsername()).length ? PMS.groupBalanceModel.attributes.transactions.filter((transaction) => transaction.ower == PMS.fn.getUsername())[0] : {};
      var settlement_info = new settlePayment.model({
        name: PMS.groupsCollection.where({ resource_uri: `/group/${PMS.fn.getCurrentGroupId()}/` })[0].attributes.name,
        amount: PMS.groupBalanceModel.attributes.transactions.filter((transaction) => transaction.ower == PMS.fn.getUsername()).length ? PMS.groupBalanceModel.attributes.transactions.filter((transaction) => transaction.ower == PMS.fn.getUsername())[0].amount : 0,
        payer: PMS.fn.getUsername(),
        currentReceiver: currentReceiver === {} ? {} : {
          lender: currentReceiver.lender,
          lender_profile: currentReceiver.lender_profile,
          amount: currentReceiver.amount,
        },
        receivers: _.filter(PMS.groupBalanceModel.attributes.transactions, (transaction) => transaction.ower === PMS.fn.getUsername()),
        //statements: [...PMS.GroupBalanceStatement.filter((stat) => true)],
        statements: [
          // ...PMS.GroupBalanceStatement.filter((stat) => stat.ower === "Gagan"),
        ],
      });
      var view = new settlePayment.view({
        model: settlement_info,
        el: $("#operation-view"),
      });
      view.render();
    },
    addExpenseCard: function (e) {
      e.preventDefault();
      console.log("adding expense card");
      PMS.ExpenseCreationView = new PMS.ExpenseView({
        model: new PMS.ExpenseModel({
          name: "Pizza",
          amount: 850,
          friendList: _.map(PMS.fn.getCurrentGroupFriends(), function (friend) {
            return {
              resource_uri: friend.resource_uri,
              username: friend.friend.user.username,
            }
          }),
          owner: "",
          divideEqual: "false",
          record: [],
        }),
        el: $("#operation-view"),
      });
      // this.listenTo(PMS.ExpenseCreationView, "closing", () => {
      //   PMS.ExpenseCreationView.remove();
      //   $("#group-card").append(`
      //   <div id="operation-view" ></div>
      //   `);
      //  // PMS.ExpenseCreationView.unbindAll();
      // });
    },

    renderExpenses: function () {

      _.map(PMS.globals.expenses.models, (expense) => {

      })
      // PMS.expenseCollection = PMS.expenseCollection || {};
      // let groups = JSON.parse(localStorage.getItem("groups"));
      // groups.map((group) => {
      //   if (group.id == Backbone.history.location.hash.split("/")[1]) {
      //     if (group.hasOwnProperty("expenses")) {
      //       group.expenses.map((expense) => {
      //         PMS.expenseCollection.add(
      //           new PMS.ExpenseCardModel({ ...expense })
      //         );
      //       });
      //     }
      //   }
      // });
    },

    render: function () {
      this.$el.html("");
      this.$el.html(this.template(this.model.toJSON()));
      PMS.LoadExpense();

      PMS.expenseCollectionView = PMS.expenseCollectionView || new PMS.ExpenseCollectionView({
        model: PMS.globals.expenses,

      });
      console.log(2, PMS.expenseCollection);


      return this;
    },
  });
  // var GroupViewObj = {
  //   model: PMS.models.group,
  //   view: GroupView,
  // };
  // return GroupViewObj;
});
