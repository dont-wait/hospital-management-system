import "server-only";
import { ApiResponse, Department } from "@/types";

export class DepartmentService {
  public static async getDepartment(): Promise<ApiResponse<Department[]>> {
    const departments: ApiResponse<Department[]> = {
      status: 200,
      message: "Lấy danh sách phòng ban thành công",
      data: [
        {
          departmentId: 1,
          departmentName: "Khoa Khám Bệnh",
          departmentLocation: "Tầng trệt, Khu A",
          departmentDescription:
            "Tiếp nhận khám ngoại trú và sàng lọc bệnh nhân. Điều phối khám chuyên khoa.",
        },
        {
          departmentId: 2,
          departmentName: "Khoa Cấp Cứu",
          departmentLocation: "Tầng trệt, Khu A (Gần cổng chính)",
          departmentDescription:
            "Tiếp nhận và xử lý 24/7 các trường hợp bệnh nhân nặng, nguy kịch.",
        },
        {
          departmentId: 3,
          departmentName: "Khoa Nội - Nhiễm",
          departmentLocation: "Lầu 2, Khu A",
          departmentDescription:
            "Điều trị bệnh nội khoa và nhiễm khuẩn cho người lớn và trẻ em.",
        },
        {
          departmentId: 4,
          departmentName: "Khoa Ngoại Tổng Quát",
          departmentLocation: "Lầu 3, Khu B",
          departmentDescription:
            "Điều trị bằng phẫu thuật các bệnh lý ổ bụng, tiêu hóa, chấn thương.",
        },
        {
          departmentId: 5,
          departmentName: "Khoa Sản - Phụ Khoa",
          departmentLocation: "Lầu 4, Khu B",
          departmentDescription:
            "Chăm sóc sức khỏe sinh sản, thai sản và điều trị các bệnh phụ khoa.",
        },
        {
          departmentId: 6,
          departmentName: "Khoa Nhi",
          departmentLocation: "Lầu 2, Khu C",
          departmentDescription:
            "Chuyên khoa điều trị và chăm sóc sức khỏe cho trẻ em từ sơ sinh đến 16 tuổi.",
        },
        {
          departmentId: 7,
          departmentName: "Khoa Chẩn Đoán Hình Ảnh",
          departmentLocation: "Tầng trệt, Khu C",
          departmentDescription:
            "Thực hiện các xét nghiệm X-quang, CT, MRI, siêu âm để chẩn đoán bệnh.",
        },
        {
          departmentId: 8,
          departmentName: "Khoa Xét Nghiệm",
          departmentLocation: "Lầu 1, Khu C",
          departmentDescription:
            "Thực hiện các xét nghiệm máu, nước tiểu, vi sinh và hóa sinh lâm sàng.",
        },
        {
          departmentId: 9,
          departmentName: "Khoa Phục Hồi Chức Năng",
          departmentLocation: "Lầu 1, Khu B",
          departmentDescription:
            "Phục hồi chức năng vận động, trị liệu vật lý cho bệnh nhân sau phẫu thuật và chấn thương.",
        },
      ],
    };
    return departments;
  }
}
