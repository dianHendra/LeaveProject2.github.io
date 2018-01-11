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
                        type: 'grid',
                        text: 'Table',
                        name: 'gridCustomer',
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
                                name: 'Username',
                                text: 'Username',
                                type: 'text'
                            },
                            {
                                name: 'Email',
                                text: 'Email',
                                type: 'text'
                            },
                            {
                                name: 'TaskId',
                                text: 'Task Id',
                                type: 'text'
                            },
                            {
                                name: 'Request',
                                text: 'Request',
                                type: 'text'
                            },
                            {
                                name: 'Jumlah_Cuti',
                                text: 'Jumlah Cuti',
                                type: 'text'
                            },
                            {
                                name: 'Comment',
                                text: 'Comment',
                                type: 'text'
                            },
                            {
                                name: 'Approved',
                                text: 'Approved',
                                type: 'fileLink',
                                width: 65,
                                template: '<a href="javascript:void(0);" onclick = "xg.call(\'Approved\',\'#: TaskId #\');" target="_blank">Approved</a>'
                                //template: '<button class="xg-btn has-icon xg-btn-default" onclick = "xg.call(\'All\',\'#: VendorId #\');">Edit</button>'
                            },
                            {
                                name: 'Disapprooved',
                                text: 'Disapprooved',
                                type: 'fileLink',
                                width: 65,
                                template: '<a href="javascript:void(0);" onclick = "xg.call(\'Disapproved\',\'#: TaskId #\');" target="_blank">Disapproved</a>'
                                //template: '<button class="xg-btn has-icon xg-btn-default" onclick = "xg.call(\'All\',\'#: VendorId #\');">Edit</button>'
                            },
                        ],
                        data: 'http://localhost:31602/api/Nextflow/ReadAll',
                    }]
            }]
        }
    ],
    functions: {

        doubleClick: function (row) {
            xg.loading.show();
            console.log(row);
            xg.populate(row);
            var data = xg.serialize();
            window.ProcessID = row.ProcessID;
            xg.loading.hide();
        },

        Approved: function (value) {
            //var req = xg.serialize();
            //req.Action = "Approved";
            //xg.ajax({
            //    url: 'http://localhost:31602/api/CRUD/Approver',
            //    type: 'POST',
            //    data: JSON.stringify(req),
            //    contentType: "application/json; charset=utf-8",
            //    success: function (data) {
            //        xg.loading.show();
            //        console.log(data);
            //        xg.loading.hide();
            //    },
            //    complete: function () {
            //        console.log("complete");
            //    }
            //});
            alert(value);
        },

        Disapproved: function (value) {
            //var req = xg.serialize();
            //req.Action = "Disapproved";
            //xg.ajax({
            //    url: 'http://localhost:31602/api/Nextflow/Approver',
            //    type: 'POST',
            //    data: JSON.stringify(req),
            //    contentType: "application/json; charset=utf-8",
            //    success: function (data) {
            //        xg.loading.show();
            //        console.log(data);
            //        xg.loading.hide();
            //    },
            //    complete: function () {
            //        console.log("complete");
            //    }
            //});
            alert(value);
        },


        init: function (xg, callback) {
            //alert('test');

            //xg.ajax({
            //    url: 'http://localhost:31602/api/employee/EmployeeList',
            //    data: {},
            //    type: 'POST',
            //    //dataType: 'json',
            //    contentType: "application/json; charset=utf-8",
            //    success: function (data) {
            //        console.log(data);
            //    },
            //    complete: function () {
            //        console.log("complete");
            //    }
            //});
            $('[xg-field="save"]').hide();
            callback();
        }
    }
});