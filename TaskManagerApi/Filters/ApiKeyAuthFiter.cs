using Microsoft.AspNetCore.Mvc.Filters;

namespace TaskManagerApi.Filters
{
    public class ApiKeyAuthFiter  : Attribute, IAuthorizationFilter
    {
        private const string APIKEYHEADERNAME = "X-API-KEY";
        private readonly IConfiguration _configuration;

        public ApiKeyAuthFiter(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (!context.HttpContext.Request.Headers.TryGetValue(APIKEYHEADERNAME, out var extractedApiKey))
            {
                context.HttpContext.Response.StatusCode = 401;
                context.Result = new Microsoft.AspNetCore.Mvc.JsonResult("API Key was not provided.");
                return;
            }
            var apiKey = _configuration.GetValue<string>("Authentication:ApiKey");
            if (!apiKey.Equals(extractedApiKey))
            {
                context.HttpContext.Response.StatusCode = 401;
                context.Result = new Microsoft.AspNetCore.Mvc.JsonResult("Unauthorized client.");
                return;
            }
        }
    }
}
