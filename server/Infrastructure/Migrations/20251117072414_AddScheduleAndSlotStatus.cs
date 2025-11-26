using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddScheduleAndSlotStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "schedule_slots");

            migrationBuilder.CreateTable(
                name: "SlotTimes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DoctorScheduleId = table.Column<long>(type: "bigint", nullable: false),
                    SlotStartTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    SlotEndTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    MaxRegistrations = table.Column<int>(type: "int", nullable: false),
                    CurrentRegistrations = table.Column<int>(type: "int", nullable: false),
                    SlotStatus = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SlotTimes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SlotTimes_doctor_schedules_DoctorScheduleId",
                        column: x => x.DoctorScheduleId,
                        principalTable: "doctor_schedules",
                        principalColumn: "ScheduleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SlotTimes_DoctorScheduleId",
                table: "SlotTimes",
                column: "DoctorScheduleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SlotTimes");

            migrationBuilder.CreateTable(
                name: "schedule_slots",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DoctorScheduleId = table.Column<long>(type: "bigint", nullable: false),
                    CurrentRegistrations = table.Column<int>(type: "int", nullable: false),
                    MaxRegistrations = table.Column<int>(type: "int", nullable: false),
                    SlotEndTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    SlotStartTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_schedule_slots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_schedule_slots_doctor_schedules_DoctorScheduleId",
                        column: x => x.DoctorScheduleId,
                        principalTable: "doctor_schedules",
                        principalColumn: "ScheduleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_schedule_slots_DoctorScheduleId",
                table: "schedule_slots",
                column: "DoctorScheduleId");
        }
    }
}
