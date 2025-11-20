using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEmployeeSchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_EmployeeSchedule_DoctorScheduleId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeSchedule_doctors_DoctorId",
                table: "EmployeeSchedule");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeSchedule_employees_EmployeeId",
                table: "EmployeeSchedule");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeSchedule_tasks_TaskId",
                table: "EmployeeSchedule");

            migrationBuilder.DropForeignKey(
                name: "FK_schedule_slots_EmployeeSchedule_DoctorScheduleId",
                table: "schedule_slots");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EmployeeSchedule",
                table: "EmployeeSchedule");

            migrationBuilder.DropIndex(
                name: "IX_EmployeeSchedule_DoctorId",
                table: "EmployeeSchedule");

            migrationBuilder.DropColumn(
                name: "AvgVisitMinutes",
                table: "EmployeeSchedule");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "EmployeeSchedule");

            migrationBuilder.DropColumn(
                name: "DoctorId",
                table: "EmployeeSchedule");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "EmployeeSchedule");

            migrationBuilder.DropColumn(
                name: "ScheduleDate",
                table: "EmployeeSchedule");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "EmployeeSchedule");

            migrationBuilder.RenameTable(
                name: "EmployeeSchedule",
                newName: "employee_schedules");

            migrationBuilder.RenameIndex(
                name: "IX_EmployeeSchedule_TaskId",
                table: "employee_schedules",
                newName: "IX_employee_schedules_TaskId");

            migrationBuilder.RenameIndex(
                name: "IX_EmployeeSchedule_EmployeeId",
                table: "employee_schedules",
                newName: "IX_employee_schedules_EmployeeId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_employee_schedules",
                table: "employee_schedules",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "doctor_schedules",
                columns: table => new
                {
                    ScheduleId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DoctorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ScheduleDate = table.Column<DateOnly>(type: "date", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    AvgVisitMinutes = table.Column<int>(type: "int", nullable: false),
                    EmployeeScheduleId = table.Column<long>(type: "bigint", nullable: false)
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

            migrationBuilder.CreateIndex(
                name: "IX_doctor_schedules_DoctorId",
                table: "doctor_schedules",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_schedules_EmployeeScheduleId",
                table: "doctor_schedules",
                column: "EmployeeScheduleId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_doctor_schedules_DoctorScheduleId",
                table: "appointments",
                column: "DoctorScheduleId",
                principalTable: "doctor_schedules",
                principalColumn: "ScheduleId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_employee_schedules_employees_EmployeeId",
                table: "employee_schedules",
                column: "EmployeeId",
                principalTable: "employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_employee_schedules_tasks_TaskId",
                table: "employee_schedules",
                column: "TaskId",
                principalTable: "tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_schedule_slots_doctor_schedules_DoctorScheduleId",
                table: "schedule_slots",
                column: "DoctorScheduleId",
                principalTable: "doctor_schedules",
                principalColumn: "ScheduleId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_doctor_schedules_DoctorScheduleId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_employee_schedules_employees_EmployeeId",
                table: "employee_schedules");

            migrationBuilder.DropForeignKey(
                name: "FK_employee_schedules_tasks_TaskId",
                table: "employee_schedules");

            migrationBuilder.DropForeignKey(
                name: "FK_schedule_slots_doctor_schedules_DoctorScheduleId",
                table: "schedule_slots");

            migrationBuilder.DropTable(
                name: "doctor_schedules");

            migrationBuilder.DropPrimaryKey(
                name: "PK_employee_schedules",
                table: "employee_schedules");

            migrationBuilder.RenameTable(
                name: "employee_schedules",
                newName: "EmployeeSchedule");

            migrationBuilder.RenameIndex(
                name: "IX_employee_schedules_TaskId",
                table: "EmployeeSchedule",
                newName: "IX_EmployeeSchedule_TaskId");

            migrationBuilder.RenameIndex(
                name: "IX_employee_schedules_EmployeeId",
                table: "EmployeeSchedule",
                newName: "IX_EmployeeSchedule_EmployeeId");

            migrationBuilder.AddColumn<int>(
                name: "AvgVisitMinutes",
                table: "EmployeeSchedule",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "EmployeeSchedule",
                type: "nvarchar(21)",
                maxLength: 21,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "DoctorId",
                table: "EmployeeSchedule",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "EndTime",
                table: "EmployeeSchedule",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "ScheduleDate",
                table: "EmployeeSchedule",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "StartTime",
                table: "EmployeeSchedule",
                type: "time",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_EmployeeSchedule",
                table: "EmployeeSchedule",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeSchedule_DoctorId",
                table: "EmployeeSchedule",
                column: "DoctorId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_EmployeeSchedule_DoctorScheduleId",
                table: "appointments",
                column: "DoctorScheduleId",
                principalTable: "EmployeeSchedule",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeSchedule_doctors_DoctorId",
                table: "EmployeeSchedule",
                column: "DoctorId",
                principalTable: "doctors",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeSchedule_employees_EmployeeId",
                table: "EmployeeSchedule",
                column: "EmployeeId",
                principalTable: "employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeSchedule_tasks_TaskId",
                table: "EmployeeSchedule",
                column: "TaskId",
                principalTable: "tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_schedule_slots_EmployeeSchedule_DoctorScheduleId",
                table: "schedule_slots",
                column: "DoctorScheduleId",
                principalTable: "EmployeeSchedule",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
