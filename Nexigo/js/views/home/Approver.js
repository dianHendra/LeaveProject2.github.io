nexigo.widget({
    text: 'List Requests',
    toolbars: [

    ],
    views: [
        {
            type: 'row',
            panels: [{
                name: 'panel1',
                offset: 1,
                fields: [
                    {
                        type: 'fieldRow',
                        fields: [{
                            name: 'ID',
                            text: 'ID',
                            cols: 6,
                            readonly: true,
                        }, {
                            name: 'Name',
                            text: 'Name',
                            cols: 6,
                            readonly: true,
                        }]
                    },
                    {
                        type: 'fieldRow',
                        fields: [{
                            name: 'StartDate',
                            text: 'StartDate',
                            cols: 6,
                            readonly: true,
                        }, {
                            name: 'EndDate',
                            text: 'EndDate',
                            cols: 6,
                            readonly: true,
                        }]
                    },
                    {
                        type: 'fieldRow',
                        fields: [{
                            name: 'LeaveType',
                            text: 'LeaveType',
                            cols: 6,
                            readonly: true,
                        }, {
                            name: 'Daysleave',
                            text: 'DaysLeave',
                            cols: 6,
                            readonly: true,
                        }]
                    },
                    {
                        type: 'fieldRow',
                        fields: [{
                            name: 'Submission',
                            text: 'Submission Date',
                            cols: 6,
                            readonly: true,
                        }]
                    },
                    {
                        type: 'grid',
                        text: 'Table',
                        name: 'tasklist-grid',
                        onDblClick: 'doubleClick',
                        options: {
                            sortable: false,
                            editable: false,
                            filterable: true,
                            pageable: true,
                            selectable: 'single',
                        },
                        fields: [
                            {
                                name: 'SubmitterName',
                                text: 'Submitter Name',
                                type: 'text'
                            },
                            {
                                name: 'Email',
                                text: 'Email',
                                type: 'text'
                            },
                            {
                                name: 'ProcessId',
                                text: 'ProcessId',
                                type: 'text'
                            },
                            {
                                name: 'TaskId',
                                text: 'Task Id',
                                type: 'text'
                            },
                            {
                                name: 'CreateDate',
                                text: 'CreateDate',
                                type: 'text'
                            },                            
                            {
                                name: 'DocumentHolder',
                                text: 'Document Holder',
                                type: 'text'
                            },
                            {
                                name: 'Position',
                                text: 'Position',
                                type: 'text'
                            },
                            {
                                name: 'Category',
                                text: 'Category',
                                type: 'text'
                            },
                            {
                                name: 'Approve',
                                text: 'Approve',
                                type: 'fileLink',
                                width: 65,
                                template: '<a href="javascript:void(0);" onclick = "xg.call(\'Approve\',\'#: TaskId #\');" target="_blank">Approve</a>'
                                //template: '<button class="xg-btn has-icon xg-btn-default" onclick = "xg.call(\'All\',\'#: VendorId #\');">Edit</button>'
                            },
                            {
                                name: 'Disapproove',
                                text: 'Disapproove',
                                type: 'fileLink',
                                width: 65,
                                template: '<a href="javascript:void(0);" onclick = "xg.call(\'Disapprove\',\'#: TaskId #\');" target="_blank">Disapprove</a>'
                                //template: '<button class="xg-btn has-icon xg-btn-default" onclick = "xg.call(\'All\',\'#: VendorId #\');">Edit</button>'
                            },
                        ],
                        //data: 'http://localhost:31602/api/FormLeave/ReadAll',
                    }]
            }]
        }
    ],
    functions: {

        doubleClick: function (row) {

            $('.home').removeClass('hide');
            $('.Approver').removeClass('hide');
            $('.Report').removeClass('hide');

            //xg.loading.show();
            console.log(row);
            //xg.populate(row);
            var data = xg.serialize();
            window.ProcessID = row.ProcessID;
            //xg.loading.hide();
            var ProcessId = xg.grid.getSelectedRow('tasklist-grid')[0].ProcessId;
            var ID = ProcessId.replace(/-/g, "").replace(/:/g, "");
            $.get('http://localhost:31602/api/FormLeave/DataRequster?ID=' + ID, function (result) {
                console.log(result);
                var temp = JSON.parse(result);
                if (result.success) {
                    xg.populate({
                        ID: temp.ID,
                        Name: temp.User.Name,
                        LeaveDate: temp.User.LeaveDate,
                        StartDate: temp.User.StartDate,
                        EndDate: temp.User.EndDate,
                        DaysLeave: temp.User.DaysLeave,
                        Submission: temp.User.Submission
                    });
                }
            })
        },

        init: function (xg, callback) {
            if (window.ID) {
                $.get('http://localhost:31602/api/FormLeave/GetTaskList?ID=' + window.ID, function (result) {
                    console.log(result);
                    if (result.success) {
                        xg.each(result.data, function (item, index) {
                            xg.grid.addRow('tasklist-grid', item);
                        });
                    }
                })
            }
            else {
                xg.navigate("home/Login");
            }
            callback();
        },

        Approve: function (value) {
            xg.loading.show();
            var req = xg.serialize();
            req.Action = "Approve";
            req.ID = window.ID;
            req.TaskId = value;
            xg.ajax({
                url: 'http://localhost:31602/api/FormLeave/SubmitTask',
                type: 'POST',
                data: JSON.stringify(req),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    xg.loading.show();
                    console.log(data);
                    console.log('approve');
                    xg.loading.hide();
                },
                complete: function () {
                    console.log("complete");
                    xg.loading.hide();
                    xg.navigate("home/Login");
                }
            });
        },

        Disapprove: function (value) {
            xg.loading.show();
            var req = xg.serialize();
            req.Action = "Disapprove";
            req.Email = window.Email;
            req.TaskId = value;
            xg.ajax({
                url: 'http://localhost:31602/api/FormLeave/SubmitTask',
                type: 'POST',
                data: JSON.stringify(req),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    xg.loading.show();
                    console.log(data);
                    console.log('disapprove');
                    xg.loading.hide();
                },
                complete: function () {
                    console.log("complete");
                    xg.loading.hide();
                    xg.navigate("home/Login");
                }
            });
        }
    }
});