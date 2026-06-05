# Nguyên tắc viết code sạch cho dự án .NET + React

> Tài liệu này tổng hợp các nguyên tắc viết code sạch, cấu trúc project rõ ràng, dễ maintain, dễ mở rộng và phù hợp cho team phát triển dự án `.NET + React`.

---

## 1. Mục tiêu của code sạch

Code sạch không chỉ là code chạy đúng, mà còn phải:

- Dễ đọc.
- Dễ hiểu.
- Dễ sửa.
- Dễ test.
- Dễ review.
- Dễ mở rộng.
- Ít gây bug khi thay đổi.
- Người mới vào team vẫn có thể nắm được flow.

Một câu hỏi nên luôn tự hỏi khi viết code:

> Sau 6 tháng nữa, mình hoặc người khác đọc lại đoạn code này có hiểu nhanh không?

---

## 2. Nguyên tắc tư duy khi viết code

### 2.1. Code cho người đọc trước, cho máy chạy sau

Máy chỉ cần code hợp lệ để chạy. Nhưng team cần code rõ ràng để maintain.

Không nên:

```csharp
var x = a.Where(b => b.St == 1 && b.Tp == 2).ToList();
```

Nên:

```csharp
var activeOnlinePaymentRequests = paymentRequests
    .Where(request => request.Status == PaymentStatus.Active
                   && request.Type == PaymentType.Online)
    .ToList();
```

### 2.2. Mỗi đoạn code phải có trách nhiệm rõ ràng

Không nên để một hàm vừa validate, vừa xử lý nghiệp vụ, vừa lưu database, vừa gửi email, vừa ghi log.

Nên chia trách nhiệm theo từng layer hoặc từng hàm nhỏ.

---

## 3. Nguyên tắc đặt tên

### 3.1. Tên biến phải rõ nghĩa

Không nên:

```csharp
var data = GetData();
var list = GetList();
var item = result.FirstOrDefault();
```

Nên:

```csharp
var activeUsers = GetActiveUsers();
var pendingPaymentRequests = GetPendingPaymentRequests();
var currentProject = projects.FirstOrDefault();
```

### 3.2. Tên hàm nên bắt đầu bằng động từ

Ví dụ tốt:

```csharp
GetUserByIdAsync()
CreateOrderAsync()
UpdateProjectStatusAsync()
ValidatePaymentRequest()
CalculateTotalAmount()
SendNotificationAsync()
```

### 3.3. Tên boolean nên đọc như một câu hỏi

Nên:

```csharp
bool isActive;
bool hasPermission;
bool canApprove;
bool shouldSendNotification;
bool isExpired;
```

Không nên:

```csharp
bool check;
bool flag;
bool status;
bool result;
```

### 3.4. Tên class thể hiện đúng vai trò

Ví dụ:

```csharp
ProjectService
ProjectRepository
ProjectValidator
ProjectDto
CreateProjectRequest
UpdateProjectCommand
ApproveProjectHandler
```

Không nên đặt tên chung chung:

```csharp
CommonService
DataService
ProcessService
HelperService
```

---

## 4. Nguyên tắc viết hàm sạch

### 4.1. Một hàm chỉ nên làm một việc

Không nên:

```csharp
public async Task<IActionResult> CreateOrder(OrderRequest request)
{
    // Validate request
    // Calculate total
    // Save order
    // Send email
    // Write log
    // Return response
}
```

Nên:

```csharp
public async Task<IActionResult> CreateOrder(OrderRequest request)
{
    var result = await _orderService.CreateOrderAsync(request);
    return Ok(result);
}
```

Trong service:

```csharp
public async Task<OrderDto> CreateOrderAsync(CreateOrderRequest request)
{
    await _orderValidator.ValidateCreateRequestAsync(request);

    var order = Order.Create(request.CustomerId, request.Items);

    await _orderRepository.AddAsync(order);

    await _notificationService.SendOrderCreatedEmailAsync(order);

    return _mapper.Map<OrderDto>(order);
}
```

### 4.2. Hàm không nên quá dài

Nếu một hàm dài hơn khoảng 30–50 dòng, cần xem xét tách nhỏ.

Dấu hiệu nên tách hàm:

- Có nhiều khối `if/else`.
- Có nhiều cấp lồng nhau.
- Có nhiều comment giải thích từng bước.
- Có nhiều nghiệp vụ khác nhau trong một hàm.
- Khó đặt tên ngắn gọn cho hàm.

### 4.3. Tránh nested quá sâu

Không nên:

```csharp
if (user != null)
{
    if (user.IsActive)
    {
        if (user.HasPermission)
        {
            // Do something
        }
    }
}
```

Nên dùng guard clause:

```csharp
if (user == null)
{
    throw new NotFoundException("Không tìm thấy người dùng");
}

if (!user.IsActive)
{
    throw new BusinessException("Người dùng không hoạt động");
}

if (!user.HasPermission)
{
    throw new ForbiddenException("Người dùng không có quyền");
}

// Do something
```

---

## 5. Nguyên tắc cấu trúc project .NET

Một cấu trúc backend sạch nên chia theo layer:

```txt
src/
 ├── Company.Project.Api/
 │    ├── Controllers/
 │    ├── Middlewares/
 │    ├── Filters/
 │    └── Program.cs
 │
 ├── Company.Project.Application/
 │    ├── Services/
 │    ├── DTOs/
 │    ├── Interfaces/
 │    ├── Validators/
 │    └── UseCases/
 │
 ├── Company.Project.Domain/
 │    ├── Entities/
 │    ├── Enums/
 │    ├── ValueObjects/
 │    └── DomainRules/
 │
 ├── Company.Project.Infrastructure/
 │    ├── Persistence/
 │    ├── Repositories/
 │    ├── ExternalServices/
 │    └── Configurations/
 │
 └── Company.Project.Shared/
      ├── Constants/
      ├── Exceptions/
      ├── Helpers/
      ├── Extensions/
      └── CommonModels/
```

### 5.1. Vai trò từng layer

| Layer | Vai trò |
|---|---|
| Api | Nhận request, trả response, xác thực, middleware |
| Application | Xử lý use case, workflow nghiệp vụ |
| Domain | Entity, enum, value object, rule cốt lõi |
| Infrastructure | Database, repository, external API, file, email |
| Shared | Thành phần dùng chung như constant, exception, helper |

### 5.2. Luồng xử lý khuyến nghị

```txt
Controller
   ↓
Application Service / Use Case
   ↓
Domain Entity / Domain Rule
   ↓
Repository Interface
   ↓
Repository Implementation
   ↓
Database
```

Controller không nên gọi thẳng `DbContext` để xử lý nghiệp vụ.

---

## 6. Nguyên tắc Controller trong .NET

Controller nên mỏng, chỉ làm nhiệm vụ nhận request và trả response.

Không nên:

```csharp
[HttpPost]
public async Task<IActionResult> Create(ProjectCreateRequest request)
{
    if (string.IsNullOrWhiteSpace(request.Name))
    {
        return BadRequest("Tên dự án không được để trống");
    }

    var project = new Project
    {
        Name = request.Name,
        CreatedDate = DateTime.Now
    };

    _context.Projects.Add(project);
    await _context.SaveChangesAsync();

    return Ok(project);
}
```

Nên:

```csharp
[HttpPost]
public async Task<IActionResult> Create(ProjectCreateRequest request)
{
    var result = await _projectService.CreateAsync(request);
    return Ok(result);
}
```

---

## 7. Nguyên tắc Service

### 7.1. Service chứa nghiệp vụ, không biến thành class quá lớn

Không nên:

```txt
ProjectService.cs // 3000 dòng
```

Nên chia nhỏ theo nhóm nghiệp vụ:

```txt
Services/
 ├── ProjectQueryService.cs
 ├── ProjectCommandService.cs
 ├── ProjectApprovalService.cs
 ├── ProjectImportService.cs
 └── ProjectExportService.cs
```

Hoặc theo CQRS/use case:

```txt
Features/
 └── Projects/
      ├── CreateProject/
      │    ├── CreateProjectCommand.cs
      │    ├── CreateProjectHandler.cs
      │    └── CreateProjectValidator.cs
      ├── UpdateProject/
      ├── ApproveProject/
      └── GetProjectDetail/
```

### 7.2. Service không nên chứa query database quá phức tạp

Nếu query phức tạp, nên tách sang:

- Repository.
- Query service.
- Specification.
- Stored procedure nếu cần tối ưu đặc biệt.

---

## 8. Nguyên tắc Repository

Repository chỉ nên làm việc với database.

Không nên để rule nghiệp vụ trong repository.

Không nên:

```csharp
public async Task ApproveProjectAsync(int projectId)
{
    var project = await _context.Projects.FindAsync(projectId);

    if (project.Status != 1)
    {
        throw new Exception("Không được duyệt");
    }

    project.Status = 2;

    await _context.SaveChangesAsync();
}
```

Nên:

```csharp
public async Task ApproveProjectAsync(int projectId)
{
    var project = await _projectRepository.GetByIdAsync(projectId);

    project.Approve();

    await _projectRepository.UpdateAsync(project);
}
```

Entity xử lý rule:

```csharp
public void Approve()
{
    if (Status != ProjectStatus.WaitingApproval)
    {
        throw new BusinessException("Chỉ dự án chờ duyệt mới được phê duyệt");
    }

    Status = ProjectStatus.Approved;
}
```

---

## 9. Nguyên tắc Entity và Domain

Entity không nên chỉ là class chứa property.

Không nên:

```csharp
public class Project
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Status { get; set; }
}
```

Nên:

```csharp
public class Project
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public ProjectStatus Status { get; private set; }

    public Project(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new BusinessException("Tên dự án không hợp lệ");
        }

        Name = name;
        Status = ProjectStatus.Draft;
    }

    public void Submit()
    {
        if (Status != ProjectStatus.Draft)
        {
            throw new BusinessException("Chỉ dự án nháp mới được trình duyệt");
        }

        Status = ProjectStatus.WaitingApproval;
    }

    public void Approve()
    {
        if (Status != ProjectStatus.WaitingApproval)
        {
            throw new BusinessException("Chỉ dự án chờ duyệt mới được phê duyệt");
        }

        Status = ProjectStatus.Approved;
    }
}
```

Ưu điểm:

- Rule nghiệp vụ nằm gần dữ liệu.
- Hạn chế sửa trạng thái sai.
- Dễ test logic domain.
- Dễ mở rộng khi nghiệp vụ thay đổi.

---

## 10. Nguyên tắc DTO, Request, Response

Không nên trả thẳng Entity ra API.

Không nên:

```csharp
return Ok(project);
```

Nên dùng DTO:

```csharp
return Ok(new ProjectDetailDto
{
    Id = project.Id,
    Name = project.Name,
    Status = project.Status.ToString()
});
```

### 10.1. Phân biệt rõ các model

| Loại | Mục đích |
|---|---|
| Entity | Đại diện bảng/domain trong hệ thống |
| Request | Dữ liệu client gửi lên |
| Response | Dữ liệu API trả về |
| DTO | Dữ liệu trung gian giữa các layer |
| ViewModel | Dữ liệu phục vụ UI, nếu dùng MVC/Razor |
| Command | Yêu cầu thay đổi dữ liệu |
| Query | Yêu cầu lấy dữ liệu |

Ví dụ:

```txt
CreateProjectRequest
UpdateProjectRequest
ProjectDetailDto
ProjectListItemDto
ApproveProjectCommand
GetProjectDetailQuery
```

---

## 11. Nguyên tắc validate

### 11.1. Backend luôn phải validate

Không được chỉ validate ở frontend.

Frontend validate để UX tốt hơn. Backend validate để bảo vệ hệ thống.

### 11.2. Tách validate ra khỏi Controller

Nên:

```txt
Validators/
 ├── CreateProjectValidator.cs
 ├── UpdateProjectValidator.cs
 └── ApproveProjectValidator.cs
```

Ví dụ:

```csharp
public void Validate(ProjectCreateRequest request)
{
    if (string.IsNullOrWhiteSpace(request.Name))
    {
        throw new BusinessException("Tên dự án không được để trống");
    }

    if (request.StartDate > request.EndDate)
    {
        throw new BusinessException("Ngày bắt đầu không được lớn hơn ngày kết thúc");
    }
}
```

### 11.3. Validate phải rõ loại lỗi

Nên phân biệt:

- Lỗi thiếu dữ liệu.
- Lỗi sai định dạng.
- Lỗi không có quyền.
- Lỗi không tìm thấy dữ liệu.
- Lỗi sai trạng thái nghiệp vụ.
- Lỗi xung đột dữ liệu.

---

## 12. Nguyên tắc xử lý exception

Không nên `try-catch` ở mọi controller/action.

Nên có `GlobalExceptionMiddleware`.

Ví dụ:

```csharp
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public GlobalExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (BusinessException ex)
        {
            await WriteErrorResponseAsync(context, StatusCodes.Status400BadRequest, ex.Message);
        }
        catch (NotFoundException ex)
        {
            await WriteErrorResponseAsync(context, StatusCodes.Status404NotFound, ex.Message);
        }
        catch (Exception)
        {
            await WriteErrorResponseAsync(
                context,
                StatusCodes.Status500InternalServerError,
                "Có lỗi hệ thống xảy ra"
            );
        }
    }
}
```

### 12.1. Response lỗi nên thống nhất

Ví dụ:

```json
{
  "success": false,
  "message": "Tên dự án không được để trống",
  "errorCode": "PROJECT_NAME_REQUIRED",
  "traceId": "00-abc..."
}
```

---

## 13. Nguyên tắc const, biến dùng chung, enum, config

Đây là phần rất quan trọng trong code sạch. Nếu không quản lý tốt, hệ thống sẽ đầy `magic number`, `magic string`, biến trùng lặp và rule bị phân tán.

---

### 13.1. Không dùng magic number, magic string

Không nên:

```csharp
if (project.Status == 2)
{
    // Approved
}

if (user.Role == "ADMIN")
{
    // Allow
}
```

Nên:

```csharp
if (project.Status == ProjectStatus.Approved)
{
    // Approved
}

if (user.Role == SystemRoles.Admin)
{
    // Allow
}
```

---

### 13.2. Khi nào dùng const?

Dùng `const` cho giá trị:

- Không thay đổi.
- Biết chắc tại thời điểm compile.
- Không phụ thuộc config môi trường.
- Không cần lấy từ database.
- Không cần thay đổi theo deploy.

Ví dụ:

```csharp
public static class SystemConstants
{
    public const int DefaultPageSize = 20;
    public const int MaxPageSize = 100;
    public const string DefaultDateFormat = "dd/MM/yyyy";
    public const string SystemUser = "SYSTEM";
}
```

Không nên dùng `const` cho dữ liệu có thể thay đổi theo môi trường như:

- Connection string.
- API URL.
- Secret key.
- Token.
- File path deploy.
- Email config.
- Payment config.

Những giá trị này nên đặt trong `appsettings.json`, environment variables hoặc secret manager.

---

### 13.3. Khi nào dùng static readonly?

Dùng `static readonly` khi giá trị không đổi sau khi khởi tạo nhưng không phù hợp với `const`.

Ví dụ:

```csharp
public static class DateTimeConstants
{
    public static readonly TimeSpan DefaultTimeout = TimeSpan.FromSeconds(30);
}
```

Hoặc danh sách cố định:

```csharp
public static class FileConstants
{
    public static readonly string[] AllowedImageExtensions =
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    };
}
```

---

### 13.4. Khi nào dùng enum?

Dùng `enum` cho các trạng thái hoặc loại dữ liệu có tập giá trị cố định.

Ví dụ:

```csharp
public enum ProjectStatus
{
    Draft = 0,
    WaitingApproval = 1,
    Approved = 2,
    Rejected = 3,
    Cancelled = 4
}
```

Nên dùng enum cho:

- Trạng thái hồ sơ.
- Loại thanh toán.
- Loại người dùng.
- Loại thông báo.
- Trạng thái duyệt.
- Loại hành động log.

Không nên dùng số trực tiếp:

```csharp
if (status == 3)
{
    // Không rõ 3 là gì
}
```

Nên:

```csharp
if (status == ProjectStatus.Rejected)
{
    // Rõ nghĩa
}
```

---

### 13.5. Khi nào dùng class Constants?

Dùng class constants cho các giá trị dùng chung trong code.

Ví dụ cấu trúc:

```txt
Shared/
 └── Constants/
      ├── SystemConstants.cs
      ├── CacheKeys.cs
      ├── ClaimTypes.cs
      ├── PermissionCodes.cs
      ├── ErrorCodes.cs
      ├── RegexPatterns.cs
      ├── FileConstants.cs
      └── DateTimeConstants.cs
```

Ví dụ:

```csharp
public static class CacheKeys
{
    public const string UserPermission = "USER_PERMISSION";
    public const string SystemConfig = "SYSTEM_CONFIG";
}
```

```csharp
public static class ErrorCodes
{
    public const string ProjectNotFound = "PROJECT_NOT_FOUND";
    public const string ProjectNameRequired = "PROJECT_NAME_REQUIRED";
    public const string PermissionDenied = "PERMISSION_DENIED";
}
```

```csharp
public static class PermissionCodes
{
    public const string ProjectView = "PROJECT_VIEW";
    public const string ProjectCreate = "PROJECT_CREATE";
    public const string ProjectUpdate = "PROJECT_UPDATE";
    public const string ProjectApprove = "PROJECT_APPROVE";
}
```

---

### 13.6. Khi nào không nên dùng Constants?

Không nên nhét mọi thứ vào một file `Constants.cs` khổng lồ.

Không nên:

```txt
Constants.cs // 2000 dòng
```

Nên chia theo domain hoặc mục đích:

```txt
Constants/
 ├── AuthConstants.cs
 ├── FileConstants.cs
 ├── CacheKeys.cs
 ├── ErrorCodes.cs
 ├── PermissionCodes.cs
 └── PaymentConstants.cs
```

Hoặc theo feature:

```txt
Features/
 └── Projects/
      ├── ProjectConstants.cs
      ├── ProjectErrors.cs
      └── ProjectPermissions.cs
```

### 13.7. Const thuộc domain nào thì để gần domain đó

Nếu constant chỉ dùng cho `Project`, không nên để ở `Shared`.

Nên:

```txt
Features/
 └── Projects/
      ├── ProjectConstants.cs
      ├── ProjectErrors.cs
      └── ProjectPermissions.cs
```

Chỉ đưa vào `Shared` khi thật sự dùng chung nhiều module.

---

### 13.8. Config khác Constants

Constants là giá trị cố định trong code.

Config là giá trị có thể thay đổi theo môi trường.

Ví dụ nên để trong `appsettings.json`:

```json
{
  "Jwt": {
    "Issuer": "Company.Project",
    "Audience": "Company.Project.Client",
    "ExpireMinutes": 60
  },
  "FileStorage": {
    "MaxUploadSizeMb": 10,
    "BasePath": "/uploads"
  },
  "Payment": {
    "StripeApiUrl": "https://api.stripe.com",
    "WebhookSecret": ""
  }
}
```

Map sang options class:

```csharp
public class JwtOptions
{
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int ExpireMinutes { get; set; }
}
```

Đăng ký:

```csharp
builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection("Jwt")
);
```

Sử dụng:

```csharp
public class TokenService
{
    private readonly JwtOptions _jwtOptions;

    public TokenService(IOptions<JwtOptions> jwtOptions)
    {
        _jwtOptions = jwtOptions.Value;
    }
}
```

---

### 13.9. Không hard-code thông tin nhạy cảm

Tuyệt đối không hard-code:

- Password.
- Token.
- API key.
- Secret key.
- Webhook secret.
- Connection string production.
- Private key.

Không nên:

```csharp
public const string StripeSecretKey = "sk_live_xxx";
```

Nên dùng:

- Environment variables.
- Secret Manager.
- Azure Key Vault.
- AWS Secrets Manager.
- Docker secrets.
- CI/CD variables.

---

### 13.10. Biến dùng chung trong React

Không nên hard-code string, route, role, status rải rác trong component.

Không nên:

```tsx
if (user.role === 'ADMIN') {
  // allow
}

navigate('/projects/create');
```

Nên:

```tsx
if (user.role === USER_ROLES.ADMIN) {
  // allow
}

navigate(APP_ROUTES.PROJECT_CREATE);
```

Cấu trúc đề xuất:

```txt
src/
 ├── shared/
 │    ├── constants/
 │    │    ├── appRoutes.ts
 │    │    ├── userRoles.ts
 │    │    ├── permissions.ts
 │    │    ├── errorCodes.ts
 │    │    ├── dateFormats.ts
 │    │    └── storageKeys.ts
 │    └── config/
 │         └── appConfig.ts
```

Ví dụ:

```ts
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PROJECT_LIST: '/projects',
  PROJECT_CREATE: '/projects/create',
  PROJECT_DETAIL: (id: number | string) => `/projects/${id}`,
} as const;
```

```ts
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF',
} as const;
```

```ts
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  CURRENT_USER: 'current_user',
} as const;
```

```ts
export const DATE_FORMATS = {
  DATE: 'DD/MM/YYYY',
  DATE_TIME: 'DD/MM/YYYY HH:mm',
  API_DATE: 'YYYY-MM-DD',
} as const;
```

---

### 13.11. Config trong React

Các giá trị thay đổi theo môi trường nên để trong `.env`.

Ví dụ:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=Company Project
```

Đọc config:

```ts
export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  appName: import.meta.env.VITE_APP_NAME,
};
```

Không nên hard-code API base URL trong service:

```ts
axios.get('https://api.example.com/projects');
```

Nên:

```ts
axiosClient.get('/projects');
```

Axios client:

```ts
export const axiosClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 30000,
});
```

---

### 13.12. Quy tắc đặt biến dùng chung

| Loại dữ liệu | Nên đặt ở đâu |
|---|---|
| Route | `shared/constants/appRoutes.ts` |
| Role | `shared/constants/userRoles.ts` |
| Permission | `shared/constants/permissions.ts` |
| Error code | `shared/constants/errorCodes.ts` |
| Date format | `shared/constants/dateFormats.ts` |
| LocalStorage key | `shared/constants/storageKeys.ts` |
| API base URL | `.env` + `appConfig.ts` |
| API endpoint | `api/endpoints.ts` |
| Theme config | `shared/constants/theme.ts` |
| Status cố định | `features/<feature>/constants.ts` |
| Rule riêng module | Gần feature/module đó |

---

## 14. Nguyên tắc Helpers, Utils, Extensions

### 14.1. Helper không phải nơi chứa nghiệp vụ

Không nên đưa rule nghiệp vụ vào helper chung.

Không nên:

```csharp
public static class ProjectHelper
{
    public static bool CanApprove(Project project)
    {
        return project.Status == ProjectStatus.WaitingApproval;
    }
}
```

Nên để trong domain:

```csharp
public bool CanApprove()
{
    return Status == ProjectStatus.WaitingApproval;
}
```

### 14.2. Helper chỉ nên xử lý logic kỹ thuật dùng chung

Ví dụ helper hợp lý:

- Format ngày.
- Convert file size.
- Generate slug.
- Mask phone/email.
- Normalize string.
- Parse enum an toàn.

Cấu trúc:

```txt
Shared/
 ├── Helpers/
 │    ├── FileHelper.cs
 │    ├── StringHelper.cs
 │    └── DateTimeHelper.cs
 └── Extensions/
      ├── StringExtensions.cs
      ├── DateTimeExtensions.cs
      └── QueryableExtensions.cs
```

---

## 15. Nguyên tắc React Component

### 15.1. Component chỉ nên tập trung render UI

Không nên để component vừa xử lý API, vừa validate, vừa transform data, vừa render bảng lớn.

Không nên:

```tsx
export function ProjectPage() {
  // state
  // call API
  // validate
  // transform data
  // handle permission
  // render toolbar
  // render filter
  // render table
  // render pagination
}
```

Nên:

```tsx
export function ProjectPage() {
  const {
    projects,
    filters,
    loading,
    onSearch,
    onChangeFilter,
  } = useProjectList();

  return (
    <>
      <ProjectToolbar />
      <ProjectFilter
        filters={filters}
        onChangeFilter={onChangeFilter}
        onSearch={onSearch}
      />
      <ProjectTable
        data={projects}
        loading={loading}
      />
    </>
  );
}
```

### 15.2. Tách logic vào custom hook

```tsx
export function useProjectList() {
  const [filters, setFilters] = useState<ProjectFilter>({});
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(false);

  const onSearch = async () => {
    setLoading(true);

    try {
      const result = await projectService.getProjects(filters);
      setProjects(result.items);
    } finally {
      setLoading(false);
    }
  };

  return {
    filters,
    projects,
    loading,
    onSearch,
    onChangeFilter: setFilters,
  };
}
```

---

## 16. Cấu trúc React project sạch

```txt
src/
 ├── app/
 │    ├── routes/
 │    ├── providers/
 │    └── store/
 │
 ├── pages/
 │    ├── ProjectListPage.tsx
 │    └── ProjectDetailPage.tsx
 │
 ├── features/
 │    └── projects/
 │         ├── components/
 │         ├── hooks/
 │         ├── services/
 │         ├── types/
 │         ├── constants/
 │         └── utils/
 │
 ├── shared/
 │    ├── components/
 │    ├── hooks/
 │    ├── utils/
 │    ├── constants/
 │    └── config/
 │
 ├── api/
 │    ├── axiosClient.ts
 │    └── endpoints.ts
 │
 └── assets/
```

### 16.1. Khi nào để trong `shared`?

Chỉ để vào `shared` nếu nó thật sự dùng chung nhiều nơi.

Ví dụ:

- Button chung.
- Modal chung.
- Date utils.
- API client.
- Constants dùng toàn app.
- Hooks dùng toàn app.

Không nên đưa mọi thứ vào `shared`, vì sẽ làm `shared` biến thành nơi chứa rác.

### 16.2. Khi nào để trong `features`?

Nếu code chỉ phục vụ một module, nên đặt gần module đó.

Ví dụ:

```txt
features/projects/
 ├── components/
 ├── hooks/
 ├── services/
 ├── constants/
 ├── types/
 └── utils/
```

---

## 17. Nguyên tắc gọi API trong React

Không nên gọi API trực tiếp trong component.

Không nên:

```tsx
useEffect(() => {
  axios.get('/api/projects').then(res => setData(res.data));
}, []);
```

Nên tách service:

```ts
export const projectService = {
  getProjects: async (filters: ProjectFilter) => {
    const response = await axiosClient.get('/projects', { params: filters });
    return response.data;
  },

  getProjectDetail: async (id: number) => {
    const response = await axiosClient.get(`/projects/${id}`);
    return response.data;
  },
};
```

Hoặc quản lý endpoint riêng:

```ts
export const API_ENDPOINTS = {
  PROJECTS: '/projects',
  PROJECT_DETAIL: (id: number | string) => `/projects/${id}`,
  PROJECT_APPROVE: (id: number | string) => `/projects/${id}/approve`,
} as const;
```

---

## 18. Nguyên tắc quản lý state trong React

| Loại state | Nên dùng |
|---|---|
| State local trong component | `useState` |
| Logic state phức tạp | `useReducer` |
| Logic dùng lại | Custom hook |
| Server state | TanStack Query / React Query |
| Global state nhỏ | Zustand / Context |
| Form state | React Hook Form |
| Derived state | Tính trực tiếp hoặc `useMemo` |
| URL state | Query params |
| Auth state | Auth provider / store |

### 18.1. Không lưu derived state nếu không cần

Không nên:

```tsx
const [total, setTotal] = useState(0);

useEffect(() => {
  setTotal(items.reduce((sum, item) => sum + item.amount, 0));
}, [items]);
```

Nên:

```tsx
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.amount, 0);
}, [items]);
```

---

## 19. Nguyên tắc xử lý async/await trong .NET

Nên dùng async cho:

- Database.
- File.
- HTTP request.
- Email.
- Queue.
- External service.

Không nên dùng:

```csharp
var result = GetDataAsync().Result;
```

Hoặc:

```csharp
GetDataAsync().Wait();
```

Nên:

```csharp
var result = await GetDataAsync();
```

### 19.1. Tên hàm async nên có hậu tố Async

Nên:

```csharp
GetUserByIdAsync()
CreateProjectAsync()
SendEmailAsync()
```

Không nên:

```csharp
GetUserById()
CreateProject()
SendEmail()
```

nếu bên trong thực sự là async.

---

## 20. Nguyên tắc query database

### 20.1. Filter ở database, không filter sau khi lấy hết dữ liệu

Không nên:

```csharp
var projects = await _context.Projects.ToListAsync();

var activeProjects = projects
    .Where(x => x.Status == ProjectStatus.Active)
    .ToList();
```

Nên:

```csharp
var activeProjects = await _context.Projects
    .Where(x => x.Status == ProjectStatus.Active)
    .ToListAsync();
```

### 20.2. Màn danh sách phải nghĩ tới paging

Nên:

```csharp
var items = await _context.Projects
    .Where(x => x.Status == ProjectStatus.Active)
    .OrderByDescending(x => x.CreatedDate)
    .Skip((pageIndex - 1) * pageSize)
    .Take(pageSize)
    .Select(x => new ProjectListItemDto
    {
        Id = x.Id,
        Name = x.Name,
        Status = x.Status,
        CreatedDate = x.CreatedDate
    })
    .ToListAsync();
```

### 20.3. Không Include thừa

Không nên:

```csharp
var projects = await _context.Projects
    .Include(x => x.Users)
    .Include(x => x.Attachments)
    .Include(x => x.Comments)
    .ToListAsync();
```

nếu màn hình chỉ cần `Id`, `Name`, `Status`.

Nên dùng `Select` sang DTO.

---

## 21. Nguyên tắc comment

Comment không dùng để giải thích code rối.

Không nên:

```csharp
// Kiểm tra user active
if (user.Status == 1)
{
    // Login
}
```

Nên sửa code rõ nghĩa:

```csharp
if (user.IsActive)
{
    SignIn(user);
}
```

Comment nên dùng để giải thích:

- Rule nghiệp vụ đặc biệt.
- Workaround.
- Lý do kỹ thuật.
- Lý do phải xử lý khác thường.
- Liên kết tới ticket/tài liệu nghiệp vụ nếu cần.

Ví dụ tốt:

```csharp
// Theo quy định nghiệp vụ, hồ sơ đã nộp quá 3 ngày không được phép thu hồi.
if (submissionDate.AddDays(3) < DateTime.Today)
{
    throw new BusinessException("Hồ sơ đã quá hạn thu hồi");
}
```

---

## 22. Nguyên tắc tránh duplicate code

Nếu code giống nhau xuất hiện từ 3 lần trở lên, nên cân nhắc tách.

Có thể tách thành:

- Function.
- Extension method.
- Helper.
- Service.
- Component.
- Custom hook.
- Constant.
- Enum.
- Shared utility.

Nhưng không nên tách quá sớm khi chưa rõ pattern lặp lại.

> Duplicate code xấu, nhưng abstraction sai còn xấu hơn.

---

## 23. Nguyên tắc bảo mật cơ bản

| Vấn đề | Nguyên tắc |
|---|---|
| SQL Injection | Dùng parameter, không nối chuỗi SQL bừa |
| XSS | Không render HTML chưa kiểm soát |
| Auth | Check quyền ở backend |
| Upload file | Check extension, size, content type |
| Log | Không log password, token, secret |
| API | Validate input ở backend |
| Token | Không lưu token bừa nếu hệ thống nhạy cảm |
| Permission | Không tin dữ liệu role/permission từ frontend |
| CORS | Không mở `*` bừa bãi ở production |
| Secret | Không commit secret lên Git |

---

## 24. Nguyên tắc logging

Log phải giúp debug, không làm lộ dữ liệu nhạy cảm.

Nên log:

- TraceId / CorrelationId.
- UserId nếu có.
- API endpoint.
- Thời gian xử lý.
- Lỗi hệ thống.
- Input quan trọng đã được mask.
- External API request/response đã loại bỏ secret.

Không nên log:

- Password.
- Access token.
- Refresh token.
- API secret.
- Thông tin thẻ.
- Dữ liệu cá nhân nhạy cảm.

Ví dụ:

```csharp
_logger.LogError(
    ex,
    "Approve project failed. ProjectId: {ProjectId}, UserId: {UserId}, TraceId: {TraceId}",
    projectId,
    currentUserId,
    traceId
);
```

---

## 25. Nguyên tắc phân quyền

Frontend có thể ẩn nút, nhưng backend mới là nơi quyết định quyền thật sự.

Không đủ nếu chỉ làm:

```tsx
{hasPermission('PROJECT_APPROVE') && <ApproveButton />}
```

Backend vẫn phải check:

```csharp
if (!currentUser.HasPermission(PermissionCodes.ProjectApprove))
{
    throw new ForbiddenException("Bạn không có quyền phê duyệt dự án");
}
```

---

## 26. Nguyên tắc test

Code sạch là code có thể test được.

Nên test:

- Domain rule.
- Service nghiệp vụ.
- Validator.
- Permission rule.
- Query quan trọng.
- API quan trọng.
- Function tiện ích dùng chung.

Ví dụ unit test domain:

```csharp
[Fact]
public void Approve_Should_Throw_When_Project_Is_Not_WaitingApproval()
{
    var project = new Project("Test project");

    Assert.Throws<BusinessException>(() => project.Approve());
}
```

---

## 27. Nguyên tắc Git commit

Commit nên rõ mục đích.

Không nên:

```txt
update code
fix bug
done
test
```

Nên:

```txt
fix(project): validate required fields before approval
refactor(payment): extract webhook handling service
feat(auth): add permission check for project approval
perf(project): optimize project list query with paging
```

Format gợi ý:

```txt
<type>(<scope>): <short description>
```

Ví dụ type:

| Type | Ý nghĩa |
|---|---|
| feat | Thêm chức năng |
| fix | Sửa lỗi |
| refactor | Tái cấu trúc code |
| perf | Tối ưu hiệu năng |
| docs | Sửa tài liệu |
| test | Thêm/sửa test |
| chore | Việc phụ trợ |
| style | Format code, không đổi logic |

---

## 28. Checklist review code cho .NET + React

### 28.1. Checklist chung

| Câu hỏi | Đạt |
|---|---|
| Tên biến/hàm/class rõ nghĩa chưa? | ☐ |
| Hàm có làm một việc không? | ☐ |
| Có magic number/string không? | ☐ |
| Có duplicate code không? | ☐ |
| Có comment thừa không? | ☐ |
| Có xử lý null/case biên chưa? | ☐ |
| Có validate backend chưa? | ☐ |
| Có xử lý exception thống nhất không? | ☐ |
| Có log đủ để debug không? | ☐ |
| Có lộ thông tin nhạy cảm không? | ☐ |

### 28.2. Checklist backend .NET

| Câu hỏi | Đạt |
|---|---|
| Controller có mỏng không? | ☐ |
| Service có quá lớn không? | ☐ |
| Repository có chứa nghiệp vụ không? | ☐ |
| Entity có bảo vệ trạng thái không? | ☐ |
| DTO có tách khỏi Entity không? | ☐ |
| Query có paging/filter/sort không? | ☐ |
| Có dùng async/await đúng không? | ☐ |
| Có dùng enum/constant thay magic value không? | ☐ |
| Config có để đúng `appsettings`/env không? | ☐ |
| Secret có bị hard-code không? | ☐ |

### 28.3. Checklist frontend React

| Câu hỏi | Đạt |
|---|---|
| Component có quá dài không? | ☐ |
| Logic có được tách vào hook/service không? | ☐ |
| API có gọi qua service/client chung không? | ☐ |
| Route/role/status có hard-code không? | ☐ |
| State có đặt đúng chỗ không? | ☐ |
| Derived state có bị lưu dư không? | ☐ |
| Có re-render không cần thiết không? | ☐ |
| Có tách component dùng lại không? | ☐ |
| Có xử lý loading/error/empty state không? | ☐ |
| Permission có check ở backend không? | ☐ |

---

## 29. Công thức nhớ nhanh

```txt
Rõ tên
+ Nhỏ hàm
+ Đúng layer
+ Ít phụ thuộc
+ Không lặp
+ Không hard-code
+ Quản lý const/config rõ
+ Dễ test
+ Dễ sửa
= Code sạch
```

---

## 30. Quy tắc thực chiến cho Senior/Lead

Khi viết hoặc review code, hãy luôn hỏi:

1. Code này có dễ đọc không?
2. Code này có đúng trách nhiệm layer không?
3. Code này có dễ test không?
4. Code này có dễ mở rộng không?
5. Code này có làm module khác bị ảnh hưởng không?
6. Có magic number/string nào không?
7. Const/config/enum đặt đúng chỗ chưa?
8. Có duplicate logic nghiệp vụ không?
9. Có bảo mật dữ liệu nhạy cảm không?
10. Người mới vào team có hiểu flow này trong thời gian ngắn không?

---

## 31. Kết luận

Với dự án `.NET + React`, code sạch cần tập trung vào ba điểm lớn:

1. Backend rõ nghiệp vụ.
2. Frontend rõ trạng thái.
3. Const, config, enum, biến dùng chung được quản lý tập trung và đúng phạm vi.

Code tốt không phải là code dùng kỹ thuật phức tạp nhất, mà là code:

- Đúng nghiệp vụ.
- Dễ đọc.
- Dễ sửa.
- Dễ test.
- Dễ mở rộng.
- Ít gây lỗi dây chuyền.

> Senior/Lead không chỉ viết code chạy được, mà phải thiết kế code để cả team có thể đi đường dài.
