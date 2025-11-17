using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class alterEmployeeScheduleToAddDepartmentId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_employee_schedules_employees_EmployeeId",
                table: "employee_schedules");

            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "employee_schedules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_employee_schedules_DepartmentId",
                table: "employee_schedules",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_employee_schedules_departments_DepartmentId",
                table: "employee_schedules",
                column: "DepartmentId",
                principalTable: "departments",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_employee_schedules_employees_EmployeeId",
                table: "employee_schedules",
                column: "EmployeeId",
                principalTable: "employees",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_employee_schedules_departments_DepartmentId",
                table: "employee_schedules");

            migrationBuilder.DropForeignKey(
                name: "FK_employee_schedules_employees_EmployeeId",
                table: "employee_schedules");

            migrationBuilder.DropIndex(
                name: "IX_employee_schedules_DepartmentId",
                table: "employee_schedules");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "employee_schedules");

            migrationBuilder.AddForeignKey(
                name: "FK_employee_schedules_employees_EmployeeId",
                table: "employee_schedules",
                column: "EmployeeId",
                principalTable: "employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
