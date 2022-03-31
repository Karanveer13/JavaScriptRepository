/* global PMS */
define(["expense"], function (expense) {
  PMS.ExpenseModel = Backbone.Model.extend({
    default: {
      name: "expense-name",
      amount: 0,
      owner: "",
      friendList: [],
      divideEqual: false,
      record: [
        {
          name: "",
          amount: 0,
        },
      ],
    },
  });
  PMS.ExpenseView = Backbone.View.extend({
    model: new PMS.ExpenseModel(),
    el: $("#operation-view"),
    initialize: function () {
      console.log(this.model);
      this.template = _.template($("#add-expense-card-template").html());
      this.render();
    },
    handle: new _.extend({}, Backbone.Events),
    events: {
      "click .fa-solid.fa-circle-plus": "addFriend",
      "click .fa-solid.fa-circle-minus": "removeFriend",
      "click #switch": "toggleMethod",
      "input #selected-friends div input": "validate",
      "click .fa-solid.fa-circle-xmark": "close",
      "click #add-expense-btn": "addExpense",
    },
    renderDropDown: function () {
      var owner = "";
      $(".js-example-basic-single").select2({
        placeholder: "Select expense's owner",
        dropdownParent: $("#add-expense-card #form .input-field")[2],
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
    close: function () {
      console.log("closing views");
      $(this.el).empty();
      $(this.el).hide();
      $(this.el).unbind();
    },
    saveData: function () {
      this.model.set("record", []);
      this.model.set(
        "owner",
        $(".js-example-basic-single").select2("data")[0].id
      );
      var self = this;
      $("#selected-friends div").each(function (e) {
        self.model.set("record", [
          ...self.model.get("record"),
          {
            name: $(this).find("span").text(),
            amount: $(this).find("input").val(),
          },
        ]);
      });
    },
    renderGroupBalance: function () {
      PMS.GroupBalanceData = PMS.GroupBalanceData || {};
      PMS.GroupBalanceData.members = [
        {
          name: "Aditya Raj",
          accounts: [],
        },
        {
          name: "Gagan",
          accounts: [],
        },
        {
          name: "Karanveer",
          accounts: [],
        },
      ];
      PMS.expenseCollection.models.forEach((elm) => {
        console.log(elm.attributes);
        PMS.GroupBalanceData.members.forEach((member) => {
          if (elm.attributes.owner !== member.name) {
            elm.attributes.transactions.forEach((trans) => {
              if (member.name === trans.ower) {
                if (member.accounts.find((acc) => acc.name === trans.lender)) {
                  let ref = member.accounts.find(
                    (acc) => acc.name === trans.lender
                  );
                  ref.amount = parseInt(ref.amount) + parseInt(trans.amount);
                } else {
                  member.accounts = [
                    ...member.accounts,
                    {
                      name: trans.lender,
                      amount: parseInt(trans.amount),
                    },
                  ];
                }
              }
            });
          }
        });
      });
      PMS.GroupBalanceData.members.forEach((member) => {
        let otherMembers = PMS.GroupBalanceData.members.filter(
          (_member) => _member.name !== member.name
        );
        member.accounts.forEach((account) => {
          otherMembers.forEach((_member) => {
            if (_member.name === account.name) {
              _member.accounts.forEach((_account) => {
                if (_account.name === member.name) {
                  // let otherAccount = new Object.assign(_account);
                  if (account.amount > _account.amount) {
                    account.amount =
                      parseInt(account.amount) - parseInt(_account.amount);
                    _account.amount = 0;
                  } else {
                    _account.amount =
                      parseInt(_account.amount) - parseInt(account.amount);
                    account.amount = 0;
                  }
                }
              });
            }
          });
        });
      });
      PMS.LoadGroupBalance();
      console.log(PMS.GroupBalanceData);
      PMS.GroupBalanceStatement = [];
      PMS.GroupBalanceData.members.map((member) => {
        member.accounts.forEach((account) => {
          PMS.GroupBalanceStatement.push({
            lender: account.name,
            ower: member.name,
            amount: account.amount,
          });
        });
      });
      PMS.groupBalanceModel = new PMS.GroupBalanceModel({
        transactions: PMS.GroupBalanceStatement.filter((li) => li.amount > 0),
        // transaction: PMS.GroupBalanceData.members.map((member) => ({
        //   lender: "Gagan",
        //   amount: member.accounts[0].amount,
        //   ower: member.accounts[0].name,
        // })),
      });
      PMS.groupBalanceView = new PMS.GroupBalanceView({
        model: PMS.groupBalanceModel,
      }).render();
    },
    addExpenseToStorage: function (expense) {
      let groups = JSON.parse(localStorage.getItem("groups"));
      groups.forEach((group) => {
        if (group.id == Backbone.history.location.hash.split("/")[1]) {
          if (group.hasOwnProperty("expenses")) {
            group.expenses.push(expense);
          } else {
            group.expenses = [expense];
          }
        }
      });
      localStorage.setItem("groups",JSON.stringify(groups));
    },
    addExpense: function (e) {
      e.preventDefault();
      console.log("added expense");
      console.log(3, PMS.expenseCollection);
      this.saveData();
      console.log(4, PMS.expenseCollection);
      var expense = new PMS.ExpenseCardModel({
        month: PMS.MonthNames[new Date().getMonth()],
        date: new Date().getDate(),
        name: this.model.get("name"),
        amount: this.model.get("amount"),
        owner: this.model.get("owner"),
        transactions: this.model
          .get("record")
          .filter((rec) => rec.name !== this.model.get("owner"))
          .map((e) => ({
            ower: e.name,
            amount: e.amount,
            lender: this.model.get("owner"),
          })),
      });

      console.log(5, PMS.expenseCollection);
      PMS.expenseCollection = PMS.expenseCollection || {};
      console.log(6, PMS.expenseCollection);
      PMS.expenseCollection.add(expense);
      console.log(7, PMS.expenseCollection);
      console.log(this.model.attributes);
      this.addExpenseToStorage(this.model.attributes);
      this.renderGroupBalance();
      this.close();
    },

    validate: function (e) {
      let sum = 0;
      $("#selected-friends div input").each(function () {
        sum += parseInt(this.value);
      });
      console.log(sum);
      if (parseInt(sum) > parseInt($("#expense-amount").val())) {
        alert("more than amount");
        e.target.value = 0;
      } else {
      }
      // if(e.target.value > )
    },
    distributeEqual: function () {
      if ($("#selected-friends div").length > 0) {
        let count_of_friends = $(
          "#selected-friends .friend-list-friend"
        ).length;
        let dist = ($("#expense-amount").val() / count_of_friends).toFixed(2);
        $("#selected-friends div input").each(function (e) {
          console.log(this.innerText);
          this.disabled = true;
          this.value = dist;
        });

        this.model.set(
          "record",
          this.model.get("record").map((e) => ({ ...e, amount: dist }))
        );
      }
    },
    toggleMethod: function (e) {
      console.log("distributon toggled");
      console.log(e.target.checked);
      if (e.target.checked) {
        this.distributeEqual();
      } else {
        $("#selected-friends  input").each(function (e) {
          console.log(this.innerText);
          this.disabled = false;
        });
      }
    },
    removeFriend: function (e) {
      console.log("tried to remove friend");
      let friends = this.model.get("friendList");
      friends.push(
        e.target.previousElementSibling.previousElementSibling.innerText
      );
      this.model.set("friendList", friends);
      let record = this.model.get("record");

      this.model.set(
        "record",
        record.filter(
          (elm) =>
            elm.name !==
            e.target.previousElementSibling.previousElementSibling.innerText
        )
      );
      console.log(this.model);
      // this.model
      //   .get("record")
      //   .filter((elm) => elm.name !== e.target.parentElement.innerText)
      this.render(1);
    },
    addFriend: function (e) {
      console.log("tried to add friend");
      console.log(e.target);
      let record = this.model.get("record");
      record.push({
        name: e.target.previousElementSibling.innerText,
        amount: 0,
      });
      this.model.set("record", record);

      let friends = this.model.get("friendList");
      friends.splice(
        friends.indexOf(e.target.previousElementSibling.innerText),
        1
      );
      this.model.set("friendList", friends);

      console.log(this.model);
      this.render(1);
    },
    render: function (e = 0) {
      console.log("e", e);
      this.$el.show();
      if (e == 1) {
        let checked = $("#switch")[0].checked;
        let values = [];
        $("#selected-friends div input").each(function (e) {
          values.push(this.value);
        });
        this.$el.html(this.template(this.model.toJSON()));
        if (checked) {
          $("#switch")[0].checked = true;
          this.distributeEqual();
        } else {
          $("#selected-friends div input").each(function (e) {
            this.value = values[e];
          });
          $("#switch")[0].checked = false;
        }
      } else {
        this.$el.html(this.template(this.model.toJSON()));
      }
      this.renderDropDown();
      return this;
    },
  });
});
