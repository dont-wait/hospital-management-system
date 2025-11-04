import api from "@/axios";

class DoctorService { 
    public static async getAllDoctors() {
        return api.get("/admin/doctors").then((response) => response.data);
    }

    public static async getDoctorById(doctorId: string) {
        return api.get(`/employee/${doctorId}`).then((response) => response.data);
    }
}