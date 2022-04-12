define([], function () {
  var logInModel = Backbone.Model.extend({
    defaults: {
      email: "",
      password: "",
      valid: {
        email: false,
        password: false,
      },
    },
  });
  var logInView = Backbone.View.extend({
    el: $(".app"),
    model: new logInModel(),
    tagName: "div",
    events: {
      "click #log-in-btn": "verifyCreds",
      "input input[name=email]": "checkEmail",
      "input input[name=password]": "checkPassword",
      "click a": "toSignUp",
    },
    toSignUp: function () {
      Backbone.history.navigate("/signUp", true);
    },
    checkPassword: function (e) {
      this.model.set("password", e.target.value);
      if (e.target.value.length > 7) {
        this.$el.find(".fa-solid.fa-circle-exclamation.password").hide();
        this.$el.find(".fa-solid.fa-circle-check.password").show();
        this.model.set("valid", { ...this.model.get("valid"), password: true });
      }
    },
    checkEmail: function (e) {
      this.model.set("email", e.target.value);
      if (
        String(e.target.value)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
      ) {
        this.$el.find(".fa-solid.fa-circle-exclamation.email").hide();
        this.$el.find(".fa-solid.fa-circle-check.email").show();
        this.model.set("valid", { ...this.model.get("valid"), email: true });
      }
    },

    verifyCreds: function () {
      let validity = this.model.get("valid");
      if (true) {
        let email = this.model.get("email");
        let password = this.model.get("password");
        fetch("https://expenser-app-django-heroku.herokuapp.com/signin/", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({
            username: email,
            password: password,
          }),
        })
          .then((res) => {
            if (res.status === 404) {
              alert("there is something wrong");
            } else {
              res.json().then((data) => {
                if (data.hasOwnProperty("error")) {
                  alert(`Error : ${data.error}`);
                } else {
                  console.log(data);
                  localStorage.setItem("expenser-token", data.token);
                  localStorage.setItem("expenser-username", data.username);
                  localStorage.setItem("expenser-resource_url", `/user/${data.id}/`);
                  PMS.globals.profile = new PMS.models.profile();
                  PMS.globals.profile.fetch()
                  Backbone.history.navigate("/dashboard", true);
                }
              });
            }
          })

          .catch((err) => console.log(err));
      } else {
        alert("invalid email or password");
      }
    },
    openDashboard: function () {
      console.log("opening dashboard");
      Backbone.history.navigate("/dashboard", true);
    },
    initialize: function () {
      this.model.on(
        "change",
        (change) => {
          console.log(change);
        },
        this
      );
      this.template = _.template($("#log-in-template").html());
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
  });
  return { logInView: logInView, logInModel: logInModel };
});
