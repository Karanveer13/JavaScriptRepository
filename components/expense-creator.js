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
      var self = this;
      this.model.on('change', function (change) {
        console.log(change);
        if (change.changed.hasOwnProperty('record')) {
          if (self.model.get('record').length) {
            self.model.set('owner', self.model.get('record')[0].resource_uri)
          }
          else {
            self.model.set('owner', null);
          }
        }
      })
      $.fn.setCursorPosition = function (pos) {
        this.each(function (index, elem) {
          if (elem.setSelectionRange) {
            elem.setSelectionRange(pos, pos);
          } else if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
          }
        });
        return this;
      };
      this.model.set("original", this.model.get('friendList'));
      this.template = _.template($("#add-expense-card-template").html());
      this.render();
    },
    contentChanged: function (e) {
      console.log(e.target.value);
      switch (e.target.id) {
        case 'expense-name':
          this.model.set('name', e.target.value);

          break;
        case 'expense-amount':
          this.model.set('amount', e.target.value);

          break;
        case 'search-bar-input':
          console.log('searched', e.target.value);
          console.log(this.model);
          this.model.set('friendList', this.model.get('original').filter((user) => user.username.toLowerCase().includes(e.target.value.toLowerCase())));
          this.render();
          break;

        default:
          break;
      }
      console.log(e.target.id);
    },
    handle: new _.extend({}, Backbone.Events),
    events: {
      "input input": "contentChanged",
      "click .fa-solid.fa-circle-plus": "addFriend",
      "click .fa-solid.fa-circle-minus": "removeFriend",
      "click #switch": "toggleMethod",
      "input #selected-friends div input": "validate",
      "click .fa-solid.fa-circle-xmark": "close",
      "click #add-expense-btn": "addExpense",
    },
    renderDropDown: function () {
      var owner = "";
      var self = this;
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
        console.log(self.model);
        self.model.set("owner", data.id);
      });
    },
    close: function () {
      console.log("closing views");
      $(this.el).empty();
      $(this.el).hide();
      $(this.el).unbind();
      this.undelegateEvents();
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

    addExpense: function (e) {
      e.preventDefault();
      console.log(this.model);
      var self = this;
      var splitters = [];
      PMS.fn.get

      _.map(self.model.get('record'), function (record) {
        splitters.push({
          resource_uri: record.resource_uri,
          amount: record.amount
        })
      });
      PMS.globals.expenses.add({
        amount: self.model.get('amount'),
        group: `/group/${PMS.fn.getCurrentGroupId()}/`,
        payer: this.model.get('owner'),
        reason: self.model.get('name'),
        splitters: [],
        created_at: new Date(),
      });
      _.first(PMS.globals.expenses.models).save()
        .then(function (res) {
          console.log('saved');
          console.log(res);
          PMS.fn.addSplitterForGroup(res.resource_uri, splitters)
            .then((res) => {
              console.log('all request fetched');
              PMS.globals.splitters.fetch()
                .then((res) => PMS.globals.expenses.fetch())
                .then((res) => {
                  PMS.expenseCollectionView.render();
                  self.close()
                });
            });

        });
      // PMS.fn.getAllGroupMembers()
      //   .then((res) => res.json())
      //   .then(function (res) {
      //     console.log(res.objects.find((friend) => friend.friend.resource_uri === self.model.get('owner')));

      //     _.map(self.model.get('record'), function (record) {
      //       console.log('record', record);
      //       console.log('resource_uri', res.objects.find(function (friend) {
      //         return friend.friend.resource_uri === record.resource_uri
      //       }));
      //       splitters.push({
      //         resource_uri: res.objects.find(function (friend) {
      //           return friend.friend.resource_uri === record.resource_uri
      //         }).resource_uri, amount: record.amount
      //       });
      //     });

      //     return res.objects.find(function (friend) { return friend.friend.resource_uri === self.model.get('owner') }).resource_uri;

      //   })
      //   .then(function (group_friend_owner) {
      //     console.log('splitters', splitters);
      //     PMS.globals.expenses.add({
      //       amount: self.model.get('amount'),
      //       group: `/group/${PMS.fn.getCurrentGroupId()}/`,
      //       payer: group_friend_owner,
      //       reason: self.model.get('name'),
      //       splitters: [],
      //       created_at: new Date(),
      //     });
      //     _.first(PMS.globals.expenses.models).save()
      //       .then(function (res) {
      //         console.log('saved');
      //         console.log(res);
      //         PMS.fn.addSplitterForGroup(res.resource_uri, splitters)
      //           .then((res) => {
      //             console.log('all request fetched');
      //             PMS.globals.splitters.fetch()
      //               .then((res) => PMS.globals.expenses.fetch())
      //               .then((res) => {
      //                 PMS.expenseCollectionView.render();
      //                 self.close()
      //               });
      //           });

      //       });

      //   })

      // console.log("added expense");
      // console.log(3, PMS.expenseCollection);
      // this.saveData();
      // console.log(4, PMS.expenseCollection);
      // var expense = new PMS.ExpenseCardModel({
      //   month: PMS.MonthNames[new Date().getMonth()],
      //   date: new Date().getDate(),
      //   name: this.model.get("name"),
      //   amount: this.model.get("amount"),
      //   owner: this.model.get("owner"),
      //   transactions: this.model
      //     .get("record")
      //     .filter((rec) => rec.name !== this.model.get("owner"))
      //     .map((e) => ({
      //       ower: e.name,
      //       amount: e.amount,
      //       lender: this.model.get("owner"),
      //     })),
      // });

      // console.log(5, PMS.expenseCollection);
      // PMS.expenseCollection = PMS.expenseCollection || {};
      // console.log(6, PMS.expenseCollection);
      // PMS.expenseCollection.add(expense);
      // console.log(7, PMS.expenseCollection);
      // console.log(this.model.attributes);
      // this.addExpenseToStorage(this.model.attributes);
      PMS.fn.renderGroupBalance();
      // this.close();
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
      console.log(e);
      friends.push({
        resource_uri: e.target.dataset.resource_uri,
        username: e.target.previousElementSibling.previousElementSibling.innerText
      })

      this.model.set("friendList", friends);
      let record = this.model.get("record");

      this.model.set(
        "record",
        record.filter(
          (elm) =>
            elm.resource_uri !==
            e.target.dataset.resource_uri
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
        username: e.target.previousElementSibling.innerText,
        amount: 0,
        resource_uri: e.target.dataset.resource_uri,
      });
      this.model.set("record", record);

      let friends = this.model.get("friendList");
      console.log(_.findWhere(friends, { username: e.target.previousElementSibling.innerText }));
      friends.splice(
        friends.indexOf(_.findWhere(friends, { username: e.target.previousElementSibling.innerText })),
        1
      );
      this.model.set("friendList", friends);

      console.log(this.model);
      this.render(1);
    },
    render: function (e = 0) {
      console.log("e", e);
      this.$el.show();
      var searchString = $('#search-bar-input').val();
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
      $('#search-bar-input').val(searchString);
      $('#search-bar-input').setCursorPosition(searchString.length);
      $('#search-bar-input').focus();
      this.renderDropDown();
      return this;
    },
  });
});
