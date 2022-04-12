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
      "input #search-bar-input": "handleSearch",
    },
    handleSearch: function (e) {
      console.log('searched', e.target.value);
      console.log(this.model);
      this.model.set('friendList',this.model.get('original').filter((user) => user.username.toLowerCase().includes(e.target.value.toLowerCase())));
      this.render();
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
      var memberList = this.model.get('memberList');
      console.log('memberList');
      console.log(memberList);

      if (memberList.length) {
        
          PMS.fn.addGroupMember(memberList, parseInt(Backbone.history.location.hash.split("/")[1]))
          .then((res) =>
          {
            console.log('members_added');
            PMS.groupsCollection.fetch();
          })
     
      }
      else {
         
      }

      // _.map(memberList,(member) =>
      // {
      //   addGroupMember()
      //   .then((res) => console.log(res));
      //   member.resource_uri,
      //   member.username,
      // })
      // this.model.set(
      //   "admin",
      //   $(".js-example-basic-single").select2("data")[0].id
      // );
      // let groups = JSON.parse(localStorage.getItem("groups"));
      // groups.forEach((group) => {
      //   if (group.id == Backbone.history.location.hash.split("/")[1]) {
      //     group.members = this.model.get("memberList");
      //   }
      // });
      // localStorage.setItem("groups", JSON.stringify(groups));
      PMS.vent.trigger("friends:refresh");
    },
    close: function () {
      console.log("closing views");
      $(this.el).empty();
      $(this.el).hide();
      $(this.el).unbind();
      this.undelegateEvents();
    },
    addMembers: function () {
      this.saveData();
      console.log(this.model);
      this.close();
    },
    addFriend: function (e) {
      console.log("adding friends");
      let members = this.model.get("memberList");
      console.log(e.target);
      console.log(e.target.parentElement.dataset.uri, e.target.previousElementSibling.innerText);
      members.push({ resource_uri: e.target.parentElement.dataset.uri, username: e.target.previousElementSibling.innerText });
      this.model.set("memberList", members);
      let friends = this.model.get("friendList");
      friends.splice(friends.indexOf(_.findWhere(friends, { resource_uri: e.target.parentElement.dataset.uri })), 1);
      this.model.set("friendList", friends);
      this.render();
    },
    removeFriend: function (e) {
      console.log("tried to remove friend");
      let friends = this.model.get("friendList");
      friends.push({ resource_uri: e.target.parentElement.dataset.uri, username: e.target.previousElementSibling.innerText });
      this.model.set("friendList", friends);
      let members = this.model.get("memberList");
      this.model.set(
        "memberList",
        members.filter(
          (elm) => elm.resource_uri !== e.target.parentElement.dataset.uri
        )
      );
      this.render();
    },
    initialize: function () {
      
      this.model.bind("change", this.render, this);
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
    },
      this.template = _.template($("#member-adder-template").html());
      this.model.set("original",this.model.get('friendList'));     
      this.render();
    },
    render: function () {
      var searchString = $('#search-bar-input').val();
      this.$el.show();
      this.$el.html(this.template(this.model.toJSON()));
      this.renderDropDown();
      var self = this;
      $('#search-bar-input').val(searchString);
      $('#search-bar-input').setCursorPosition(searchString.length);
      $('#search-bar-input').focus();
      return this;
    },
  });
});
