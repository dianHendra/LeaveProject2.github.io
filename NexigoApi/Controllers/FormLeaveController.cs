using Newtonsoft.Json.Linq;
using NexigoApi.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Script.Serialization;

namespace NexigoApi.Controllers
{
    public class TaskListGrids
    {
        public string TaskId { get; set; }
        public string ProcessId { get; set; }
        public string SubmitterName { get; set; }
        public string Position { get; set; }
        public string CreatedDate { get; set; }
        public string Category { get; set; }
        public string DocumentHolder { get; set; }
        public string Email { get; set; }

    }
    public class Leave
    {
        public string value { get; set; }
        public string text { get; set; }
    }

    public class AddRequest : ListLeaveRequest
    {
        public string comment { get; set; }
        public string Action { get; set; }
        public string TaskId { get; set; }
    }

    public class ReadDB : ListLeaveRequest
    {

    }

    public class ReadData
    {
        public List<ReadDB> data { get; set; }
        public int total { get; set; }
    }

    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class FormLeaveController : ApiController
    {
        private LeaveRequestDataContext context = null;
        public FormLeaveController()
        {
            context = new LeaveRequestDataContext();
        }

        [HttpPost]
        public IHttpActionResult ReadLeave()
        {
            var query = from data in context.Leaves
                        select new Leave
                        {
                            value = data.LeaveType,
                            text = data.LeaveType
                        };
            return Ok(query.ToList());
        }

        [HttpPost]
        public IHttpActionResult ShowData ([FromBody] int ID)
        {
            using (var dc = new LeaveRequestDataContext())
            {
                var JS = new JavaScriptSerializer();
                var user = dc.Employees.Where(d => d.ID == ID).SingleOrDefault();
                var tanggal = user.Joined_date;
                var tgl = Convert.ToString(string.Format("{0:dd/MM/yyyy}", tanggal));
                var spv = dc.Employees.Where(o => o.ID == user.SPV_ID)
                    .Select(a => new { a.Name })
                    .SingleOrDefault();
                //var quota = 12 - user.Balance;
                var location = (from a in dc.Employees join b in dc.Locations on a.Location_Code equals b.ID where a.ID == ID select b.LocationName).SingleOrDefault();
                if (user != null)
                {
                    var result = JS.Serialize(new { JoinDate = tgl, User = user, Spv = spv, LOC = location });
                    return Ok(result);
                }
                //return Ok(Json<string>(result));
                return Ok("");
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> Create([FromBody] AddRequest req)
        {

            var flowId = ConfigurationManager.AppSettings["FlowId"];
            commentHistory comment = new commentHistory();
            ListLeaveRequest leave = new ListLeaveRequest();

            using (var dc = new LeaveRequestDataContext())
            {
                var user = dc.Employees.Where(o => o.Email == req.Email).SingleOrDefault();
                string recordId = string.Empty;
                string processId = string.Empty;

                var bodyCreate = "{ " +
                    "\"data\": { " +
                        " \"definition\": { " +
                            " \"id\": \"" + flowId + "\"" +
                        "}" +
                        "}" +
                    "}";

                JObject jsonCreate = JObject.Parse(bodyCreate);

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://mosaic.dev.nextflow.tech/");
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user.Token);
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var response = await client.PostAsJsonAsync("nextflow/api/records", jsonCreate);
                    var result = await response.Content.ReadAsAsync<dynamic>();
                    recordId = result.data.id;

                    var bodySubmit = "{ " +
                       "\"data\": { " +
                           " \"form_data\": { " +
                               " \"pvInitiator\": \"" + user.Email + "\"," +
                                   " \"pvInitiatorName\": \"" + user.Name + "\"," +
                                   " \"pvAction\": \"Submit\"," +
                                   " \"pvReq\": \"" + user.Email + "\"," +
                                   " \"pvApprover\":\"dianhs@makers.com\"" +
                           "}," +
                           "\"comment\" : \"" + req.comment + "\"" +
                       "}" +
                   "}";

                    JObject jsonSubmit = JObject.Parse(bodySubmit);
                    var responseSubmit = await client.PostAsJsonAsync("nextflow/api/records/" + recordId + "/submit", jsonSubmit);
                    var resultSubmit = await responseSubmit.Content.ReadAsAsync<dynamic>();

                    processId = resultSubmit.data.process_id;

                }

                leave.Name = req.Name;
                leave.Email = req.Email;
                leave.DaysLeave = req.DaysLeave;
                leave.ProcessId = processId;
                leave.RecordId = recordId;
                leave.StartDate = req.StartDate;
                leave.EndDate = req.EndDate;
                leave.DaysLeave = req.DaysLeave;
                leave.Submission = req.Submission;
                leave.status = req.status;
                leave.LeaveType = req.LeaveType;
                leave.status = "pending";


                dc.ListLeaveRequests.InsertOnSubmit(leave);


                comment.Name = req.Name;
                comment.ProcessId = req.ProcessId;
                comment.Action = "Submit";
                comment.Comment = req.comment;
                dc.commentHistories.InsertOnSubmit(comment);

                dc.SubmitChanges();
            }
            return Ok("Sukses");
        }

        [HttpPost]
        public IHttpActionResult DataRequster(string ID)
        {
            using (var dc = new LeaveRequestDataContext())
            {
                try
                {
                    
                    var JS = new JavaScriptSerializer();
                    var user = dc.ListLeaveRequests.Where(d => d.ProcessId.Replace(":", "").Replace("-", "") == ID).SingleOrDefault();
                    var id = (from a in dc.Employees join b in dc.ListLeaveRequests on a.Email equals b.Email where b.ProcessId.Replace(":", "").Replace("-", "") == ID select a.ID).SingleOrDefault();

                    if (user != null)
                    {
                        var result = JS.Serialize(new { User = user, ID = id });
                        return Ok(result);
                    }
                    else
                    {
                        return Ok(" tidak berhasil");
                    }
                    
                }
                catch (Exception ex)
                {
                    return Ok(ex.Message);
                }
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> GetTaskList(int ID)
        {
            using (var context = new LeaveRequestDataContext())
            {
                try
                {
                    var usr = context.Employees.Where(o => o.ID == ID).FirstOrDefault();
                    var token = usr.Token;

                    List<TaskListGrids> grids = new List<TaskListGrids>();
                    using (var client = new HttpClient())
                    {
                        dynamic response;
                        dynamic parseResult;
                        string uri = "https://mosaic.dev.nextflow.tech/nextflow/api/tasks?folder=app:task:all&page[number]=1&page[size]=10";
                        client.DefaultRequestHeaders.Accept.Clear();
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                        response = await client.GetStringAsync(uri);
                        parseResult = JObject.Parse(response);

                        //result = JsonConvert.DeserializeObject<List<dynamic>>(parseResult[0]);

                        foreach (var item in parseResult.data)
                        {
                            TaskListGrids task = new TaskListGrids();
                            string email = item.created_by.Email;
                            task.Email = email;
                            task.CreatedDate = item.created_at.ToString("dd/MM/yyyy");
                            task.DocumentHolder = item.assignee.name;
                            task.Position = context.Employees.Where(o => o.Email == email).Any() ? context.Employees.Where(o => o.Email == email).FirstOrDefault().Staff_Level : "Supervisor";
                            task.ProcessId = item.process_id;
                            task.TaskId = item.id;
                            task.SubmitterName = item.created_by.name;
                            string pid = item.process_id;
                            task.Category = context.ListLeaveRequests.Where(o => o.ProcessId == pid).FirstOrDefault().LeaveType;
                            grids.Add(task);
                        }
                    }

                    return Ok(new { success = true, data = grids });
                }

               catch (Exception ex)
                {
                    return Ok(new { success = false, data = ex.Message });
                }

            }
        }


        [HttpPost]
        public async Task<IHttpActionResult> SubmitTask(AddRequest param)
        {
            try
            {
                using (var context = new LeaveRequestDataContext())
                {

                    var usr = context.Employees.Where(o => o.ID == param.ID).SingleOrDefault();
                    var token = usr.Token;

                    var bodyCreate = "{" +
                                        "\"data\": {" +
                                            "\"form_data\": {" +
                                                "\"pvAction\" : \"" + param.Action + "\"" +
                                            "}," +
                                            "\"comment\": \"blkjsjsjs\"" +
                                        "}" +
                                    "}";

                    JObject jsonCreate = JObject.Parse(bodyCreate);
                    var action = string.Empty;

                    using (var client = new HttpClient())
                    {
                        client.BaseAddress = new Uri("https://mosaic.dev.nextflow.tech/");
                        client.DefaultRequestHeaders.Accept.Clear();
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        var response = await client.PostAsJsonAsync("nextflow/api/tasks/" + param.TaskId + "/submit", jsonCreate);
                        var result = await response.Content.ReadAsAsync<dynamic>();

                    }

                    if (param.Action == "Approve" || param.Action == "Disapprove")
                    {
                        var leaveReq = context.ListLeaveRequests.Where(o => o.ProcessId == param.ProcessId).SingleOrDefault();
                        leaveReq.status = param.Action;
                        context.SubmitChanges();
                    }

                    commentHistory commentHistory = new commentHistory();

                    commentHistory.ProcessId = param.ProcessId;
                    commentHistory.Name = usr.Name;
                    commentHistory.Action = param.Action;
                    commentHistory.Date = DateTime.Now;
                    commentHistory.Comment = "jajajaj";

                    context.commentHistories.InsertOnSubmit(commentHistory);
                    context.SubmitChanges();


                    return Ok(new { success = true, message = "Leave Request " + action });
                }
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }
    }
}
