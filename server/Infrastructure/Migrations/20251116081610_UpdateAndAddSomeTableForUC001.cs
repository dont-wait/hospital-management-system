using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAndAddSomeTableForUC001 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_employee_schedules_DoctorScheduleId",
                table: "appointments");

            migrationBuilder.DropTable(
                name: "employee_schedules");

            migrationBuilder.DropIndex(
                name: "IX_appointments_DoctorScheduleId",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "RegisteredEmployees",
                table: "tasks");

            migrationBuilder.DropColumn(
                name: "RequiredEmployees",
                table: "tasks");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "tasks",
                newName: "TaskStatus");

            migrationBuilder.AddColumn<int>(
                name: "RegisteredEmployees",
                table: "task_requirements",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RequiredEmployees",
                table: "task_requirements",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CheckInTime",
                table: "appointments",
                type: "datetimeoffset",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RegisteredEmployees",
                table: "task_requirements");

            migrationBuilder.DropColumn(
                name: "RequiredEmployees",
                table: "task_requirements");

            migrationBuilder.DropColumn(
                name: "CheckInTime",
                table: "appointments");

            migrationBuilder.RenameColumn(
                name: "TaskStatus",
                table: "tasks",
                newName: "Status");

            migrationBuilder.AddColumn<int>(
                name: "RegisteredEmployees",
                table: "tasks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RequiredEmployees",
                table: "tasks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "employee_schedules",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TaskId = table.Column<long>(type: "bigint", nullable: false),
                    BookedCount = table.Column<int>(type: "int", nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    DeletedId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ModifiedId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Version = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_employee_schedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_employee_schedules_employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_employee_schedules_tasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_appointments_DoctorScheduleId",
                table: "appointments",
                column: "DoctorScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_employee_schedules_EmployeeId",
                table: "employee_schedules",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_employee_schedules_TaskId",
                table: "employee_schedules",
                column: "TaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_employee_schedules_DoctorScheduleId",
                table: "appointments",
                column: "DoctorScheduleId",
                principalTable: "employee_schedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
