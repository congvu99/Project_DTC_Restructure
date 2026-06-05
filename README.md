# Project_DTC_Restructure

Dự án Hệ thống Quản lý Đầu tư công (DTC) - Restructure.

## Công nghệ sử dụng
- **Backend:** .NET 9 (Clean Architecture, MediatR, Dapper, Entity Framework Core)
- **Frontend:** React 18 (Vite, KendoReact, Styled Components, TypeScript)

## Kiến trúc
Hệ thống tuân thủ nghiêm ngặt nguyên tắc **Clean Code** và **Clean Architecture**. Giao diện UI được xây dựng không sử dụng Inline CSS, thay vào đó sử dụng `styled-components` để đảm bảo code gọn gàng, dễ bảo trì. 

## Cài đặt
1. Cài đặt CSDL SQL Server và cấu hình chuỗi kết nối trong `appsettings.json`.
2. Khởi chạy Backend qua lệnh `dotnet run`.
3. Chạy Frontend bằng lệnh `npm install` và `npm run dev`.
