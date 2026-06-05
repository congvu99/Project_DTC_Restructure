# Project_DTC_Restructure

Dự án Hệ thống Quản lý Đầu tư công (DTC) - Restructure.

## Công nghệ sử dụng
- **Backend:** .NET 9 (Clean Architecture, MediatR, Dapper, Entity Framework Core)
- **Frontend:** React 18 (Vite, KendoReact, Styled Components, TypeScript)

## Kiến trúc
Hệ thống tuân thủ nghiêm ngặt nguyên tắc **Clean Code** và **Clean Architecture**. Giao diện UI được xây dựng không sử dụng Inline CSS, thay vào đó sử dụng `styled-components` để đảm bảo code gọn gàng, dễ bảo trì. 

## Hướng dẫn chạy dự án

### 1. Khởi chạy Backend (.NET 9)
Di chuyển vào thư mục API của Backend và chạy lệnh:
```bash
cd backend/src/API/DTC.API
dotnet run
```
*(Lưu ý: Hãy đảm bảo đã cấu hình chuỗi kết nối SQL Server đúng trong file `appsettings.json` tại thư mục này)*

### 2. Khởi chạy Frontend (React + Vite)
Di chuyển vào thư mục Frontend, cài đặt các thư viện và chạy máy chủ phát triển (dev server):
```bash
cd frontend/dtc-web
npm install
npm run dev
```
