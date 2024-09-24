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

        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.Password))
            {
                return BadRequest("Username o password no pueden estar vacíos");
            }

            
            User user = await _userData.Get(loginRequest.Username, loginRequest.Password);

            if (user == null)
            {
                return Unauthorized("Credenciales inválidas");
            }

            
            return Ok(user);
        }


        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetDetails()
        {
            try
            {
                var details = await _userData.GetDetails();

                if (details == null || details.Count == 0)
                {
                    return NotFound("No se encontraron detalles.");
                }

                return Ok(details);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }
    }

   



    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
