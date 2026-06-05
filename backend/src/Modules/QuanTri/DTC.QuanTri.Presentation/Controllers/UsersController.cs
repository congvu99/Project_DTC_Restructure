using DTC.QuanTri.Application.Features.Users;
using DTC.QuanTri.Presentation.Authorization;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DTC.QuanTri.Presentation.Controllers
{
    [ApiController]
    [Route("api/quan-tri/users")]
    [Authorize] // Tạm thời dùng Authorize cơ bản để test giao diện phân trang
    public class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UsersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] GetUsersQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}
