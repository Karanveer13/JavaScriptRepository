
define([
  "friend_list",
  "settlePayment",
  "expense",
  "member_adder",
  "group_balance",
], function (friends, settlePayment, load) {
  PMS.view = {};  // var expense = {};
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
          var username = profile_friend.user.username;
          console.log('username', profile_friend);
          return {
            resource_uri: resource_uri,
            username: username,
          }
        }),
        friendList: _.map(_.reject(PMS.globals.profile_friends.models, function (friend) {
          console.log('friend',friend);
          return (_.contains(_.pluck(PMS.fn.getCurrentGroupFriends(), 'resource_uri'), friend.get('resource_uri')));
        }), function (friend) { return { resource_uri: friend.get('resource_uri'), username: friend.attributes.user.username ?? ""} }),


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
      var settlement_info = new settlePayment.model({
        name: "College Friends",
        amount: 0,
        payer: "Gagan",
        receiver: "",
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
              username: friend.user.username,
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
    renderGroupBalance: function () {
      PMS.LoadGroupBalance();

      PMS.groupBalanceModel = new PMS.GroupBalanceModel({
        transactions: [
          {
            ower: "Aditya",
            lender: "Gagan",
            amount: 0,
          },
        ],
      });
      PMS.groupBalanceView = new PMS.GroupBalanceView({
        model: PMS.groupBalanceModel,
      }).render();
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

      PMS.expenseCollectionView = PMS.expenseCollectionView ||  new PMS.ExpenseCollectionView({
        model: PMS.globals.expenses,
      
      });
      console.log(2, PMS.expenseCollection);
      //this.renderExpenses();
      this.renderGroupBalance();
      return this;
    },
  });
  // var GroupViewObj = {
  //   model: PMS.models.group,
  //   view: GroupView,
  // };
  // return GroupViewObj;
});
