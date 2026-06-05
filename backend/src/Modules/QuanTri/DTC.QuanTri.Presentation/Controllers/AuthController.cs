using DTC.QuanTri.Application.Features.Auth;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DTC.QuanTri.Presentation.Controllers
{
    [ApiController]
    [Route("api/quan-tri/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginCommand command)
        {
            var result = await _mediator.Send(command);

            if (!result.Success)
            {
                return BadRequest(new { success = false, message = result.ErrorMessage });
            }

            return Ok(new 
            { 
                success = true,
                token = result.Token, 
                fullName = result.FullName, 
                userId = result.UserId 
            });
        }
    }
}
