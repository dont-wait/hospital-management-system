using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class FixTypoEmployeeSchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_doctor_schedules_DoctorScheduleId",
                table: "appointments");

            migrationBuilder.DropTable(
                name: "doctor_schedules");

            migrationBuilder.CreateTable(
                name: "employee_schedules",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TaskId = table.Column<long>(type: "bigint", nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    BookedCount = table.Column<int>(type: "int", nullable: false),
                    Version = table.Column<int>(type: "int", nullable: false),
                    CreatedId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ModifiedId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletedId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_employee_schedules_DoctorScheduleId",
                table: "appointments");

            migrationBuilder.DropTable(
                name: "employee_schedules");

            migrationBuilder.CreateTable(
                name: "doctor_schedules",
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
                    table.PrimaryKey("PK_doctor_schedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_doctor_schedules_employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_doctor_schedules_tasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_doctor_schedules_EmployeeId",
                table: "doctor_schedules",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_schedules_TaskId",
                table: "doctor_schedules",
                column: "TaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_doctor_schedules_DoctorScheduleId",
                table: "appointments",
                column: "DoctorScheduleId",
                principalTable: "doctor_schedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
