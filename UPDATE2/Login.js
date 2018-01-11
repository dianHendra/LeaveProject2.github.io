var string = "url('http://ak6.picdn.net/shutterstock/videos/4805756/thumb/1.jpg')"

xg.widget({
    // text: 'Login Vendor',
    clas: 'login',
    views: [{
        text: 'Login Employee',
        icon: 'fa-',
        cols: 4,
        offset: 9,
        clasContent: 'login',
        fields: [
            { name: 'ID', text: 'Employee ID' },
            { name: 'Password', text: 'Password', type: 'password' },
        ]
    }, {
        cols: 6,
        offset: 10,
       
        fields: [
            { type: 'button', text: 'Login',  cssClass: 'xg-btn', offset: 2, stretch: true, cols: 4, action: 'login' },
            { type: 'button', text: 'Change password', offset: 2, stretch: true, cols: 4 },
        ]

    }],


    functions: {
        init: function (xg, callback) {
            callback();
        },
        login: function () {
            var tempString = "";
            var req = xg.serialize();
            window.ID = req.ID;
            xg.ajax({
                url: 'http://localhost:31602/api/Login/Log',
                type: 'POST',
                data: JSON.stringify(req),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    console.log(result);
                    tempString = result;
                },

                complete: function () {

                    if (tempString === "Ga ada di database") {
                        alert("gabisa");
                    }
                    else {
                        xg.navigate('home/formLeave');
                        console.log("complete Login");
                    }

                }
            });

        },

        logout: function () {
            window.loginId = '';
        }
    }
})
