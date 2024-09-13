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

        [HttpGet]
        public async Task<IActionResult> List()
        {
           List<User> List = await _userData.List();
            return StatusCode(StatusCodes.Status200OK,List);
        }
    }
}
