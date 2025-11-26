using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class FixMap : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmployeeSchedule",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TaskId = table.Column<long>(type: "bigint", nullable: false),
                    Discriminator = table.Column<string>(type: "nvarchar(21)", maxLength: 21, nullable: false),
                    DoctorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ScheduleDate = table.Column<DateOnly>(type: "date", nullable: true),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: true),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: true),
                    AvgVisitMinutes = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeSchedule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmployeeSchedule_doctors_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "doctors",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_EmployeeSchedule_employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmployeeSchedule_tasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_schedule_slots_DoctorScheduleId",
                table: "schedule_slots",
                column: "DoctorScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_DoctorScheduleId",
                table: "appointments",
                column: "DoctorScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeSchedule_DoctorId",
                table: "EmployeeSchedule",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeSchedule_EmployeeId",
                table: "EmployeeSchedule",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeSchedule_TaskId",
                table: "EmployeeSchedule",
                column: "TaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_EmployeeSchedule_DoctorScheduleId",
                table: "appointments",
                column: "DoctorScheduleId",
                principalTable: "EmployeeSchedule",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_EmployeeSchedule_DoctorScheduleId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_schedule_slots_EmployeeSchedule_DoctorScheduleId",
                table: "schedule_slots");

            migrationBuilder.DropTable(
                name: "EmployeeSchedule");

            migrationBuilder.DropIndex(
                name: "IX_schedule_slots_DoctorScheduleId",
                table: "schedule_slots");

            migrationBuilder.DropIndex(
                name: "IX_appointments_DoctorScheduleId",
                table: "appointments");
        }
    }
}
