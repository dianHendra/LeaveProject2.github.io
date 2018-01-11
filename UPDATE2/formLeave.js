var nowDate = new Date();
var date = nowDate.getDate() + '/' + (nowDate.getMonth() + 1) + '/' +  nowDate.getFullYear();


nexigo.widget({
    text: 'Form Input Leave Request',
    views: [{
        type: 'panel',
        inline: true,
        name: 'SinglePanel',
        text: 'Employee Information',
        offset: 1,
        collapsible: true,
        fields: [{
            type: 'fieldRow',
            fields: [{
                name: 'Name',
                text: 'Name',
                cols: 6,
                readonly: true,
            }, {
                name: 'Staff_id',
                text: 'Staff Id',
                cols: 6,
                readonly: true,
            }]
        }, {
            type: 'fieldRow',
            fields: [{
                name: 'Supervisor',
                text: 'Supervisor',
                readonly: true,
                cols: 6
            }, {
                name: 'Email',
                text: 'Email',
                cols: 6,
                readonly: true,
            }]
        }, {
            type: 'fieldRow',
            fields: [{
                name: 'Location_Code',
                text: 'Location',
                cols: 6,
                readonly: true,
            }, {
                name: 'Joined_date',
                text: 'Joined Date',
                cols: 6,
                readonly: true,
            }]
        }]
    }, {
        type: 'panel',
        inline: true,
        name: 'SinglePanel',
        text: 'Leave Details',
        offset: 1,
        collapsible: true,
        fields: [
            {
                type: 'fieldRow',
                fields: [
                    {
                        name: 'LeaveType',
                        text: 'Leave Type',
                        type: 'select',
                        cols: 5,
                        tooltip: 'Media list',
                       // data: 'http://localhost:31602/api/User/rcname',
                        data: [{
                            value: 'type1',
                            text: 'Marriage',
                        }, {
                            value: 'type2',
                            text: 'Maternity',
                        }, {
                            value: 'type3',
                            text: 'Demise',
                        }
                        ],
                        onChange: function (val, text) {
                            xg.call('Log', 'Value changed - ' + val + ' - ' + text);
                        }
                    },
                    { name: 'Balance', text: 'Balance', cols: 2, disabled: true },
                ]
            },
            //ROW 2
            {
                type: 'fieldRow',
                fields: [
                    { name: 'StartDate', text: 'Start Date', type: 'picker', cols: 5 },
                    { name: 'EndDate', text: 'End Date', type: 'picker', cols: 5 },
                ]
            },
            //ROW 3
            {
                type: 'fieldRow',
                fields: [
                    {
                        name: 'select_normal2',
                        text: 'Days',
                        type: 'select',
                        cols: 3,
                        placeholder: 'Please Select Day',
                        data: [{
                            value: 'days1',
                            text: '1 Day',
                        }, {
                            value: 'days2',
                            text: '0.5 Day',
                        }, {
                            value: 'days3',
                            text: '0.25 Day',
                        }
                        ],
                        onChange: function (val, text) {
                            xg.call('Log', 'Value changed - ' + val + ' - ' + text);
                        }
                    },
                ]
            },
            ////////////////////////-------------------------- ROW 4 --------------------------////////////////////////
            { name: 'DaysLeave', text: 'Number Of Days Leave', cols: 2, disabled: true },
            ////////////////////////-------------------------- ROW 5 --------------------------////////////////////////
            { name: 'Remarks', text: 'Remarks', type: 'textarea' },
            ////////////////////////-------------------------- ROW 5 --------------------------////////////////////////
            { name: 'Balance', text: 'Submission Date', cols: 6, disabled: true, value: date },
            ////////////////////////-------------------------- Button--------------------------////////////////////////
            {
                type: 'buttons',
                offset: 5,
                buttons: [
                    { name: 'Submit', text: 'Submit', icon: 'fa-save', cssClass: 'xg-btn', action: 'Submit'  },
                    { name: 'undo', text: 'Reset', icon: 'fa-undo', cssClass: 'xg-btn-danger' },
                ]
            }
        ]

    }],
    functions: {
        init: function (xg, callback) {
            xg.ajax({
                url: 'http://localhost:31602/api/User/GetEmployeeName',
                data: window.ID,
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    //if (res === null) {
                    //    xg.navigate('PR/Login');
                    //}
                    alert(window.ID);
                    console.log("ini getname harusnya steffane " + result);
                    var temp = JSON.parse(result);
                    xg.populate({ Name: temp.User.Name, Supervisor: temp.SPV.Name, Location_Code: temp.LOC, Staff_id: temp.User.ID, Email: temp.User.Email, Joined_date: temp.JOIN });
                },
                complete: function () {
                    console.log("Complete GetemployeeName");
                    xg.loading.hide();
                }
            });
        },

        Submit: function () {
            xg.loading.show();
            var res = xg.serialize();
            xg.ajax({
                url: 'http://localhost:31602/api/User/CreateJobEvaluation',
                data: JSON.stringify(res),
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    console.log(data);
                },
                complete: function () {
                    console.log("complete");
                    xg.notify({ type: 'success', text: 'Submit success' });
                    xg.loading.hide();
                    xg.navigate('makers/home');
                }
            });
        },
    
    }

            //xg.ajax({
            //    url: 'http://localhost:31602/api/User/GetIDspv',
            //    data: window.ID,
            //    type: 'POST',
            //    contentType: "application/json; charset=utf-8",
            //    success: function (resultspv) {
            //        console.log(window.ID);
            //        console.log(resultspv);
            //        xg.populate({ Supervisor: resultspv });
            //        alert(resultspv);
            //        console.log("ini getidsup harusnya blane " + resultspv);

            //    },
            //    complete: function () {
            //        console.log("Complete getIdSup");
            //        xg.loading.hide();
            //    }
            //});

        
    
});