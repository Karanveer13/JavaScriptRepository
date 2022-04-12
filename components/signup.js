define([], function () {
  var signUpModel = Backbone.Model.extend({
    defaults: {
      email: "",
      password: "",
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
      "click a": "getBackToLogin",
    },
    createProfile : function(id){
      fetch(`https://expenser-app-django-heroku.herokuapp.com/profile`,{
      method : "POST",
      headers : {
        "Authorization" : `ApiKey ${localStorage.getItem("expenser-username")}:${localStorage.getItem("expenser-token")}` ,
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
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
        fetch("https://expenser-app-django-heroku.herokuapp.com/signup/", {
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
                if(data.hasOwnProperty("error"))
                {
                  alert(`Error : ${data.error}`)
                }
                else{
                  console.log(data); 
                  localStorage.setItem("expenser-token",data.token);
                  localStorage.setItem("expenser-username",data.username);
                  localStorage.setItem("expenser-resource_url",`/user/${data.id}/`);
                  PMS.globals.profile = PMS.globals.profile || new PMS.models.profile();
                  PMS.globals.profile.set("profile_user",PMS.fn.getResourceUri());
                  PMS.globals.profile.save({parse : false});
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
