fetch("https://expenser-app-django-heroku.herokuapp.com/expense/49/", {
    "headers": {        
        "authorization": "ApiKey gb2002@gmail.com:dfdb72b8aeb9ffe251d727826f889ccbab0c38a1",
        "content-type": "application/json",
 
    },
  
    body: JSON.stringify({
        settled_by: [{
            "friend": {
                "id": 50,
                "p_friend": {
                    "resource_uri": "/user/98/",
                    "username": "sushant"
                },
                "profile": "/profile/38/",
                "resource_uri": "/profile_friend/50/",
            },
            "group": "/group/23/",
            "id": 20,
            "resource_uri": "/group_friend/20/"
           
        }]
    }),
    "method": "PUT",
    "mode": "cors",
    "credentials": "include"
})
    .then((res) => res.json())
    .then((res) => console.log(res));