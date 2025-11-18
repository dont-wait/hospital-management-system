using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class RoomNameInEmployeeSchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ScheduleDate",
                table: "doctor_schedules");

            migrationBuilder.AddColumn<int>(
                name: "RoomId",
                table: "employee_schedules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ScheduleStatus",
                table: "employee_schedules",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "StartTime",
                table: "doctor_schedules",
                type: "datetimeoffset",
                nullable: false,
                oldClrType: typeof(TimeOnly),
                oldType: "time");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "EndTime",
                table: "doctor_schedules",
                type: "datetimeoffset",
                nullable: false,
                oldClrType: typeof(TimeOnly),
                oldType: "time");

            migrationBuilder.CreateIndex(
                name: "IX_employee_schedules_RoomId",
                table: "employee_schedules",
                column: "RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_employee_schedules_rooms_RoomId",
                table: "employee_schedules",
                column: "RoomId",
                principalTable: "rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_employee_schedules_rooms_RoomId",
                table: "employee_schedules");

            migrationBuilder.DropIndex(
                name: "IX_employee_schedules_RoomId",
                table: "employee_schedules");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "employee_schedules");

            migrationBuilder.DropColumn(
                name: "ScheduleStatus",
                table: "employee_schedules");

            migrationBuilder.AlterColumn<TimeOnly>(
                name: "StartTime",
                table: "doctor_schedules",
                type: "time",
                nullable: false,
                oldClrType: typeof(DateTimeOffset),
                oldType: "datetimeoffset");

            migrationBuilder.AlterColumn<TimeOnly>(
                name: "EndTime",
                table: "doctor_schedules",
                type: "time",
                nullable: false,
                oldClrType: typeof(DateTimeOffset),
                oldType: "datetimeoffset");

            migrationBuilder.AddColumn<DateOnly>(
                name: "ScheduleDate",
                table: "doctor_schedules",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));
        }
    }
}
