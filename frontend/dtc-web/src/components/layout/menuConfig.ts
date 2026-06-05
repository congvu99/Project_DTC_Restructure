export interface MenuItemType {
  id: string;
  text: string;
  path?: string;
  code?: string;
  icon?: string;
  children?: MenuItemType[];
}

export const MAIN_MENU: MenuItemType[] = [
  {
    id: "he-thong",
    text: "Hệ thống Quản trị",
    children: [
      { id: "dashboard", text: "Bảng điều khiển", path: "/" },
      { id: "quan-tri-nguoi-dung", text: "Quản lý Người dùng", path: "/admin/users", code: "Quantri_User" },
      { id: "phan-quyen", text: "Phân quyền hệ thống", path: "/admin/roles", code: "Quantri_Role" },
      { id: "danh-muc", text: "Danh mục hệ thống", path: "/admin/danh-muc", code: "Quantri_Menu" },
    ]
  },
  {
    id: "kh-trung-han",
    text: "Kế hoạch Trung hạn",
    children: [
      {
        id: "th-nstw",
        text: "Kế hoạch Trung hạn nguồn NSTW",
        children: [
          { id: "th-nstw-lap", text: "Tổng hợp nhu cầu vốn", path: "/KeHoachTrungHan/NguonNSTW/LapNhuCau", code: "qlv_thncv_th" },
          { id: "th-nstw-phan-bo", text: "Phân bổ vốn Trung hạn", path: "/KeHoachTrungHan/NguonNSTW/PhanBoVon", code: "qlv_pbv_th" }
        ]
      },
      {
        id: "th-nsdp",
        text: "Kế hoạch Trung hạn nguồn NSDP",
        children: [
          { id: "th-nsdp-lap", text: "Xây dựng kế hoạch NSDP", path: "/KeHoachTrungHan/NguonNSDP/LapNhuCau", code: "qlv_thncv_nsdp" }
        ]
      }
    ]
  },
  {
    id: "kh-hang-nam",
    text: "Kế hoạch Hằng năm",
    children: [
      {
        id: "hn-nstw",
        text: "Nguồn Ngân sách Trung ương (NSTW)",
        children: [
          { id: "hn-nstw-lap", text: "Xây dựng kế hoạch dự án trong nước", path: "/KeHoachHangNam/NguonNSTW/XayDungKeHoach/DuAnTrongNuoc", code: "qlv_xdkh_tn" },
          { id: "hn-nstw-oda", text: "Xây dựng kế hoạch dự án ODA", path: "/KeHoachHangNam/NguonNSTW/XayDungKeHoach/DuAnODA", code: "DeXuatDuAn" },
          { id: "hn-nstw-giaovon", text: "Quyết định giao vốn NSTW", path: "/KeHoachHangNam/NguonNSTW/GiaoVon", code: "qlv_gv_nstw" }
        ]
      },
      {
        id: "hn-nsdp",
        text: "Nguồn Ngân sách Địa phương (NSDP)",
        children: [
          { id: "hn-nsdp-lap", text: "Xây dựng kế hoạch dự án vốn NSDP", path: "/KeHoachHangNam/NguonNSTW/XayDungKeHoach/NguonNSDP", code: "qlv_xdkh_nsdp" }
        ]
      }
    ]
  },
  {
    id: "quan-tri-du-an",
    text: "Quản trị Dự án",
    children: [
      { id: "da-danh-muc", text: "Danh mục Dự án", path: "/QuanTriDuAn/DanhMucDuAn", code: "CTMTQG_TTDA_List" }
    ]
  }
];
