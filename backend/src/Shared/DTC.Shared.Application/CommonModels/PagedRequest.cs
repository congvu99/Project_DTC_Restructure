namespace DTC.Shared.Application.CommonModels
{
    public class PagedRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        
        // Offset for database queries
        public int Skip => (PageNumber - 1) * PageSize;
        public int Take => PageSize;
    }
}
