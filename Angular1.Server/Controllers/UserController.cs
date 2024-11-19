using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Angular1.Server.Data;
using Angular1.Server.Models;
using System.Diagnostics;

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

            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Username))
            {
                return BadRequest("Username o password no pueden estar vacíos");
            }


            User user = await _userData.Get(loginRequest.Username);

            if (user == null)
            {
                return Unauthorized("Credenciales inválidas");
            }

            if (loginRequest.IsLocal == false)
            {
                //Acceso
                return Ok(user);
            }
            else
            {
                var passwordEncrypted = Hash.ComputeSaltedHash(loginRequest.Password, user.PasswordSalt);
                if (passwordEncrypted.Equals(user.Password))
                {
                    //Acceso
                    return Ok(user);
                }
                else
                {
                    Console.WriteLine("The password = " + passwordEncrypted);
                    //usuario incorrecto
                    return Unauthorized("Los password no corresponden");

                }
            }
        }


        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetDetails(int userId)
        {
            try
            {
                var user = await _userData.GetDetails(userId);

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        [HttpPost("GetRO")]
        public async Task<IActionResult> GetRODetails([FromBody] UserRequest request)
        {
            try
            {
                var userOR = await _userData.GetRODetails(request.userId.ToString());
                if (userOR == null || userOR.Count == 0)
                {
                    return NotFound("No se encontraron datos del usuario especificado");
                }
                return Ok(userOR);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error del servidor: {ex.Message}");
            }
        }

        [HttpPost("GetUsersByOrganization")]
        public async Task<IActionResult> GetUsersByOrganization([FromBody] OrganizationRequest request)
        {
            try
            {
                var detailsOrg = await _userData.GetUsersByOrganization(request.organizationId.ToString());

                if (detailsOrg == null || detailsOrg.Count == 0)
                {
                    return NotFound("No se encontraron detalles.");
                }

                return Ok(detailsOrg);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        [HttpGet("GetOrganizations")]
        public async Task<IActionResult> GetOrganizations()
        {
            try
            {
                var orgs = await _userData.GetOrganizations();

                if (orgs == null || orgs.Count == 0)
                {
                    return NotFound("No se encontraron organizaciones.");
                }

                return Ok(orgs);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }


        [HttpGet("GetOrphanUsers")]
        public async Task<IActionResult> GetOrphanUsers()
        {
            try
            {
                var details = await _userData.GetOrphanUsers();

                if (details == null || details.Count == 0)
                {
                    return NotFound("No se encontraron usuarios.");
                }

                return Ok(details);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        [HttpPost("AddOrphanUser")]
        public async Task<IActionResult> AddOrphanUserToOrganization([FromBody] AddUserToOrganizationRequest request)
        {
            try
            {
                bool result = await _userData.AddOrphanUserToOrganization(request.UserId, request.OrganizationId);

                if (result)
                {
                    return Ok(new { Message = "Usuario agregado correctamente" });
                }
                else 
                {
                    return BadRequest(new { Message = "No se pudo agregar al usuario" });
                }
            }catch  (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }


        [HttpPost("OAuth")]
        public async Task<IActionResult> OAuthLogin([FromBody] OAuthLoginRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _userData.OAuthLogin(model.FirstName, model.LastName, model.Email, model.ProviderUserId, model.Provider);

            return Ok(result);
        }

        [HttpPost("UpdateProfile")]
        public async Task<IActionResult> UpdateProfileUser([FromBody] UpdateProfileRequest request)
        {
            try
            {
                bool result = await _userData.UpdateProfileUser(request.UserId, request.FirstName, request.LastName, request.Email , request.Username);

                if (result)
                {
                    return Ok(new { Message = "Usuario actualizado correctamente" });
                }
                else
                {
                    return BadRequest(new { Message = "No se pudieron actualizar los datos del usuario" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        [HttpPost("ValidateUserProfile")]
        public async Task<IActionResult> ValidateUserProfile([FromBody] ValidateProfileRequest request)
        {
            try
            {
                if (request == null || request.UserId <= 0)
                {
                    return BadRequest(new { Message = "Datos inválidos para la validación" });
                }

                var (isUserNameTaken, isEmailTaken) = await _userData.ValidateUserProfile(request.UserId, request.Username, request.Email);

                return Ok(new
                {
                    Message = "Validación completada",
                    IsUserNameTaken = isUserNameTaken,
                    IsEmailTaken = isEmailTaken
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error del servidor: {ex.Message}");
            }
        }

    }

}
