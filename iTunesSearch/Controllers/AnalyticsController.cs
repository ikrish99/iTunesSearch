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
        private static Dictionary<string, int> _data = new Dictionary<string, int>();

        public AnalyticsController()
        {
            if(_data.Count == 0)
            {
                _data.Add("search", 0);
                _data.Add("preview", 0);
                _data.Add("collection", 0);
                _data.Add("artist", 0);
            }
        }

        [HttpPost]
        public IHttpActionResult PostButton(String buttonName)
        {
            if (buttonName == "search")
            {
                _data["search"] = _data["search"] + 1;
            }
            else if (buttonName == "preview")
            {
                _data["preview"] = _data["preview"] + 1;
            }
            else if(buttonName == "collection")
            {
                _data["collection"] = _data["collection"] + 1;
            }
            else if(buttonName == "artist")
            {
                _data["artist"] = _data["artist"] + 1;
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
            return Ok(_data);
        }

    }
}
