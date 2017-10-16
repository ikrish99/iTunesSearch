using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace iTunesSearch.Controllers
{
    public class AnalyticsController : ApiController
    {
        //Static object to store my button click values. Used as DB
        private static Dictionary<string, int> data = new Dictionary<string, int>();

        public AnalyticsController()
        {
            if(data.Count == 0)
            {
                data.Add("search", 0);
                data.Add("preview", 0);
                data.Add("collection", 0);
                data.Add("artist", 0);
            }
        }

        [HttpPost]
        public IHttpActionResult PostButton(String buttonName)
        {
            if (buttonName == "search")
            {
                data["search"] = data["search"] + 1;
            }
            else if (buttonName == "preview")
            {
                data["preview"] = data["preview"] + 1;
            }
            else if(buttonName == "collection")
            {
                data["collection"] = data["collection"] + 1;
            }
            else if(buttonName == "artist")
            {
                data["artist"] = data["artist"] + 1;
            }
            else
            {
               return Ok("Button Name Not Found");
            }

            return Ok("Done");
        }

        [HttpGet]
        public IHttpActionResult GetCount()
        {
            return Ok(data);
        }

    }
}
