define([], function () {
  var signUpModel = Backbone.Model.extend({
    defaults: {
      email: "",
      password: "",
      username: "",
      first_name: "",
      last_name: "",
      valid: {
        email: false,
        password: false,
      },
    },
  });
  var signUpView = Backbone.View.extend({
    el: $(".app"),
    model: new signUpModel(),
    tagName: "div",
    id: "sign-up",
    events: {
      "click #sign-up-btn": "signUp",
      "input input[name=email]": "checkEmail",
      "input input[name=password]": "checkPassword",
      "input input[name=first_name]": "handleChange",
      "input input[name=last_name]": "handleChange",
      "input input[name=username]": "handleChange",
      "click a": "getBackToLogin",
    },
    handleChange: function (e) {
      this.model.set(e.target.name, e.target.value);
    },
    createProfile: function (id) {
      fetch(`https://expenser-app.onrender.com/profile`, {
        method: "POST",
        headers: PMS.fn.getAuthHeaders(),
        body: JSON.stringify({
          profile_user: `/user/${id}/`
        })
      })
        .then((res) => res.json())
        .then((res))
    },

    signUp: function () {
      let validity = this.model.get("valid");
      if (validity.email || validity.password) {
        let email = this.model.get("email");
        let password = this.model.get("password");
        let username = this.model.get("username");
        let first_name = this.model.get("first_name");
        let last_name = this.model.get("last_name");
        fetch("https://expenser-app.onrender.com/signup/", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({
            username: username,
            password: password,
            email: email,
            first_name: first_name,
            last_name: last_name,

          }),
        })
          .then((res) => res.json())
          .then((data) => {
            localStorage.setItem("expenser-token", data.token);
            localStorage.setItem("expenser-username", data.username);
            localStorage.setItem("expenser-resource_url", `/user/${data.id}/`);
            PMS.globals.profile = PMS.globals.profile || new PMS.models.profile();
            PMS.globals.profile.set("profile_user", PMS.fn.getResourceUri());
            PMS.globals.profile.save({ parse: false })
              .then((res) => {
                PMS.globals.profile.fetch();
              });
            Backbone.history.navigate("/dashboard", true);
          })


          .catch((err) => console.log(err));
      } else {
        alert("invalid email or password");
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
    checkPassword: function (e) {
      this.model.set("password", e.target.value);
      if (e.target.value.length > 7) {
        this.$el.find(".fa-solid.fa-circle-exclamation.password").hide();
        this.$el.find(".fa-solid.fa-circle-check.password").show();
        this.model.set("valid", { ...this.model.get("valid"), password: true });
      }
    },
    getBackToLogin: function () {
      Backbone.history.navigate("/logIn", true);
    },
    initialize: function () {
      this.template = _.template($("#sign-up-template").html());
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
  });
  return { signUpView: signUpView, signUpModel: signUpModel };
});
