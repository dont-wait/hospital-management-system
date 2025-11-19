using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class removeUnUseTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_doctor_schedules_DoctorScheduleId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_appointments_slot_times_SlotTimeId",
                table: "appointments");

            migrationBuilder.DropTable(
                name: "slot_times");

            migrationBuilder.DropTable(
                name: "doctor_schedules");

            migrationBuilder.DropTable(
                name: "employee_schedules");

            migrationBuilder.DropIndex(
                name: "IX_appointments_DoctorScheduleId",
                table: "appointments");

            migrationBuilder.DropIndex(
                name: "IX_appointments_SlotTimeId",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "DoctorScheduleId",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "SlotTimeId",
                table: "appointments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "DoctorScheduleId",
                table: "appointments",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "SlotTimeId",
                table: "appointments",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateTable(
                name: "employee_schedules",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DepartmentId = table.Column<int>(type: "int", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoomId = table.Column<int>(type: "int", nullable: false),
                    TaskId = table.Column<long>(type: "bigint", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    DeletedId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ModifiedId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ScheduleStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Version = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_employee_schedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_employee_schedules_departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "departments",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_employee_schedules_employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "employees",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_employee_schedules_rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "rooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_employee_schedules_tasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "doctor_schedules",
                columns: table => new
                {
                    ScheduleId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DoctorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EmployeeScheduleId = table.Column<long>(type: "bigint", nullable: false),
                    AvgVisitMinutes = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    DeletedId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    EndTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    StartTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Version = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_doctor_schedules", x => x.ScheduleId);
                    table.ForeignKey(
                        name: "FK_doctor_schedules_doctors_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "doctors",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_doctor_schedules_employee_schedules_EmployeeScheduleId",
                        column: x => x.EmployeeScheduleId,
                        principalTable: "employee_schedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "slot_times",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DoctorScheduleId = table.Column<long>(type: "bigint", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CurrentRegistrations = table.Column<int>(type: "int", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    DeletedId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    MaxRegistrations = table.Column<int>(type: "int", nullable: false),
                    ModifiedId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SlotEndTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    SlotStartTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    SlotStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Version = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_slot_times", x => x.Id);
                    table.ForeignKey(
                        name: "FK_slot_times_doctor_schedules_DoctorScheduleId",
                        column: x => x.DoctorScheduleId,
                        principalTable: "doctor_schedules",
                        principalColumn: "ScheduleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_appointments_DoctorScheduleId",
                table: "appointments",
                column: "DoctorScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_SlotTimeId",
                table: "appointments",
                column: "SlotTimeId");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_schedules_DoctorId",
                table: "doctor_schedules",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_schedules_EmployeeScheduleId",
                table: "doctor_schedules",
                column: "EmployeeScheduleId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_employee_schedules_DepartmentId",
                table: "employee_schedules",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_employee_schedules_EmployeeId",
                table: "employee_schedules",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_employee_schedules_RoomId",
                table: "employee_schedules",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_employee_schedules_TaskId",
                table: "employee_schedules",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_slot_times_DoctorScheduleId",
                table: "slot_times",
                column: "DoctorScheduleId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_doctor_schedules_DoctorScheduleId",
                table: "appointments",
                column: "DoctorScheduleId",
                principalTable: "doctor_schedules",
                principalColumn: "ScheduleId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_slot_times_SlotTimeId",
                table: "appointments",
                column: "SlotTimeId",
                principalTable: "slot_times",
                principalColumn: "Id");
        }
    }
}
