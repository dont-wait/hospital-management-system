using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class FixRelation11EmployeeScheduleAndDoctorSchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_doctor_schedules_EmployeeScheduleId",
                table: "doctor_schedules");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_schedules_EmployeeScheduleId",
                table: "doctor_schedules",
                column: "EmployeeScheduleId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_doctor_schedules_EmployeeScheduleId",
                table: "doctor_schedules");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_schedules_EmployeeScheduleId",
                table: "doctor_schedules",
                column: "EmployeeScheduleId");
        }
    }
}
