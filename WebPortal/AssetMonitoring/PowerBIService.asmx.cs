using AssetMonitoring.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;


namespace AssetMonitoring
{
    /// <summary>
    /// Summary description for PowerBIService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class PowerBIService : System.Web.Services.WebService
    {

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]

        public void GetAccessToken()
        {
            var token = GetToken();

            System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            this.Context.Response.ContentType = "application/json; charset=utf-8";
            this.Context.Response.Write(serializer.Serialize(new { tokens = token.Result }));
        }

        public async Task<PowerBIToken> GetToken()
        {
            try
            {
                string pBiUser = ConfigurationManager.AppSettings["Username"];
                string pBiPwd = ConfigurationManager.AppSettings["Password"];
                string pBiClientId = ConfigurationManager.AppSettings["ClientId"];
                string pBiSecret = ConfigurationManager.AppSettings["ClientSecret"];
                if (string.IsNullOrEmpty(pBiUser) || string.IsNullOrEmpty(pBiPwd) || string.IsNullOrEmpty(pBiClientId) || string.IsNullOrEmpty(pBiSecret))
                {
                    return new PowerBIToken()
                    {
                        AccessToken = null,
                        RefreshToken = null,
                        StatusCode = HttpStatusCode.BadRequest.ToString(),
                        Message = "Authentication Credentials missing"
                    };
                }
                string tokenEndpointUri = "https://login.microsoftonline.com/common/oauth2/token";

                var content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("grant_type", "password"),
                    new KeyValuePair<string, string>("username", pBiUser),
                    new KeyValuePair<string, string>("password", pBiPwd),
                    new KeyValuePair<string, string>("client_id", pBiClientId),
                    new KeyValuePair<string, string>("client_secret", pBiSecret),
                    new KeyValuePair<string, string>("resource", "https://analysis.windows.net/powerbi/api")
                });
                AzureResponse tokenRes = new AzureResponse();
                HttpStatusCode statusCode;
                string message;
                using (var client = new HttpClient())
                {
                    HttpResponseMessage res = client.PostAsync(tokenEndpointUri, content).Result;
                    statusCode = res.StatusCode;
                    message = res.IsSuccessStatusCode == true ? "Success" : "failure";
                    string json = await res.Content.ReadAsStringAsync();
                    tokenRes = JsonConvert.DeserializeObject<AzureResponse>(json);
                }
                PowerBIToken token = new PowerBIToken()
                {
                    AccessToken = tokenRes.access_token,
                    RefreshToken = tokenRes.refresh_token,
                    StatusCode = statusCode.ToString(),
                    Message = message
                };

                return token;
            }
            catch (Exception ex)
            {
                return new PowerBIToken()
                {
                    AccessToken = null,
                    RefreshToken = null,
                    StatusCode = HttpStatusCode.InternalServerError.ToString(),
                    Message = ex.Message
                };
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void GetTileURL()
        {
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");
            PowerBIURL embedURL = new PowerBIURL();

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            this.Context.Response.ContentType = "application/json; charset=utf-8";
            this.Context.Response.Write(serializer.Serialize(new { urls = embedURL }));
        }



        [WebMethod]
        public string updateConfig()
        {
            try
            {
                var configs = LoadAllConfig();
                var json = JsonConvert.SerializeObject(configs);
                File.WriteAllText(HttpContext.Current.Server.MapPath("~\\config.json"), json);
                return "Updated General Config";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [WebMethod]
        public string updateFirebaseConfig(FirebaseConfig config)
        {
            try
            {
                var json = JsonConvert.SerializeObject(config);
                File.WriteAllText(HttpContext.Current.Server.MapPath("~\\firebaseConfig.json"), json);
                return "Updated Firebase Config";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [WebMethod]
        public string updatePowerBiCredentials(String ClientId, String ClientSecret, String Username, String Password)
        {
            try
            {
                Configuration objConfig = System.Web.Configuration.WebConfigurationManager.OpenWebConfiguration("~");
                AppSettingsSection objAppsettings = (AppSettingsSection)objConfig.GetSection("appSettings");
                if (objAppsettings != null)
                {
                    objAppsettings.Settings["ClientId"].Value = ClientId;
                    objAppsettings.Settings["ClientSecret"].Value = ClientSecret;
                    objAppsettings.Settings["Username"].Value = Username;
                    objAppsettings.Settings["Password"].Value = Password;
                    objConfig.Save();
                    return "Power BI Credentials updated";
                }
                else
                    return "App settings section not found";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        Dictionary<string, string> LoadAllConfig()
        {
            Dictionary<string, string> configs = new Dictionary<string, string>();
            configs.Add("restServer", System.Configuration.ConfigurationManager.AppSettings["restServer"]);
            configs.Add("restServerAnalytics", System.Configuration.ConfigurationManager.AppSettings["restServerAnalytics"]);
            configs.Add("b2cApplicationId", System.Configuration.ConfigurationManager.AppSettings["b2cApplicationId"]);
            configs.Add("tenantName", System.Configuration.ConfigurationManager.AppSettings["tenantName"]);
            configs.Add("signInPolicyName", System.Configuration.ConfigurationManager.AppSettings["signInPolicyName"]);
            configs.Add("redirect_uri", System.Configuration.ConfigurationManager.AppSettings["redirect_uri"]);
            configs.Add("nodeserver", System.Configuration.ConfigurationManager.AppSettings["nodeserver"]);
            return configs;
        }
        
        [WebMethod]
        public string SavePowerBIUrl(string data)
        {
            try
            {
                File.WriteAllText(HttpContext.Current.Server.MapPath("~\\powerBI.json"), data);
                return "Power BI URLs saved successfully";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }


        public ResponseUrlModel GetData()
        {
            var data = File.ReadAllText(HttpContext.Current.Server.MapPath("~\\powerBI.json"));
            return JsonConvert.DeserializeObject<ResponseUrlModel>(data);
        }
    }
}
