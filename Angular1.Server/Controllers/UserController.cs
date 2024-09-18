using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Angular1.Server.Data;
using Angular1.Server.Models;


namespace Angular1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserData _userData;
        public UserController(UserData userData)
        {
            _userData = userData;
        }

        [HttpGet ("{username}, {password}")]
        public async Task<IActionResult> Get(string username, string password)
        {
            User thing = await _userData.Get(username, password);
            return StatusCode(StatusCodes.Status200OK, thing);
        }
    }
}
