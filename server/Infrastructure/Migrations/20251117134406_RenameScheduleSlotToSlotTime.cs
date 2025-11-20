using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class RenameScheduleSlotToSlotTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SlotTimes_doctor_schedules_DoctorScheduleId",
                table: "SlotTimes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SlotTimes",
                table: "SlotTimes");

            migrationBuilder.RenameTable(
                name: "SlotTimes",
                newName: "slot_times");

            migrationBuilder.RenameIndex(
                name: "IX_SlotTimes_DoctorScheduleId",
                table: "slot_times",
                newName: "IX_slot_times_DoctorScheduleId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_slot_times",
                table: "slot_times",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_slot_times_doctor_schedules_DoctorScheduleId",
                table: "slot_times",
                column: "DoctorScheduleId",
                principalTable: "doctor_schedules",
                principalColumn: "ScheduleId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_slot_times_doctor_schedules_DoctorScheduleId",
                table: "slot_times");

            migrationBuilder.DropPrimaryKey(
                name: "PK_slot_times",
                table: "slot_times");

            migrationBuilder.RenameTable(
                name: "slot_times",
                newName: "SlotTimes");

            migrationBuilder.RenameIndex(
                name: "IX_slot_times_DoctorScheduleId",
                table: "SlotTimes",
                newName: "IX_SlotTimes_DoctorScheduleId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SlotTimes",
                table: "SlotTimes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SlotTimes_doctor_schedules_DoctorScheduleId",
                table: "SlotTimes",
                column: "DoctorScheduleId",
                principalTable: "doctor_schedules",
                principalColumn: "ScheduleId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
