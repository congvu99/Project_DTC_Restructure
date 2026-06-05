using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using DTC.QuanTri.Domain.Repositories;
using DTC.Shared.Application.CommonModels;

namespace DTC.QuanTri.Application.Features.Users
{
    public class GetUsersQuery : PagedRequest, IRequest<PagedResponse<object>>
    {
        public string? Keyword { get; set; }
        public bool? Hieuluc { get; set; }
    }

    public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, PagedResponse<object>>
    {
        private readonly IUserRepository _userRepository;

        public GetUsersQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<PagedResponse<object>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
        {
            var (items, totalCount) = await _userRepository.GetUserRolesReportAsync(request.Skip, request.Take, request.Keyword, request.Hieuluc);
            return new PagedResponse<object>(items, totalCount, request.PageNumber, request.PageSize);
        }
    }
}
