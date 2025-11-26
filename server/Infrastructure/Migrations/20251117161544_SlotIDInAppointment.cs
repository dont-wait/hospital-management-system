using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class SlotIDInAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CheckInTime",
                table: "appointments");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "slot_times",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedId",
                table: "slot_times",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedAt",
                table: "slot_times",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedId",
                table: "slot_times",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ModifiedId",
                table: "slot_times",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "UpdatedAt",
                table: "slot_times",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "slot_times",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "employee_schedules",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedId",
                table: "employee_schedules",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedAt",
                table: "employee_schedules",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedId",
                table: "employee_schedules",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ModifiedId",
                table: "employee_schedules",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "UpdatedAt",
                table: "employee_schedules",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "employee_schedules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "doctor_schedules",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedId",
                table: "doctor_schedules",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedAt",
                table: "doctor_schedules",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedId",
                table: "doctor_schedules",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ModifiedId",
                table: "doctor_schedules",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "UpdatedAt",
                table: "doctor_schedules",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "doctor_schedules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "SlotTimeId",
                table: "appointments",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_appointments_SlotTimeId",
                table: "appointments",
                column: "SlotTimeId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_slot_times_SlotTimeId",
                table: "appointments",
                column: "SlotTimeId",
                principalTable: "slot_times",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_slot_times_SlotTimeId",
                table: "appointments");

            migrationBuilder.DropIndex(
                name: "IX_appointments_SlotTimeId",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "slot_times");

            migrationBuilder.DropColumn(
                name: "CreatedId",
                table: "slot_times");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "slot_times");

            migrationBuilder.DropColumn(
                name: "DeletedId",
                table: "slot_times");

            migrationBuilder.DropColumn(
                name: "ModifiedId",
                table: "slot_times");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "slot_times");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "slot_times");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "employee_schedules");

            migrationBuilder.DropColumn(
                name: "CreatedId",
                table: "employee_schedules");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "employee_schedules");

            migrationBuilder.DropColumn(
                name: "DeletedId",
                table: "employee_schedules");

            migrationBuilder.DropColumn(
                name: "ModifiedId",
                table: "employee_schedules");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "employee_schedules");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "employee_schedules");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "doctor_schedules");

            migrationBuilder.DropColumn(
                name: "CreatedId",
                table: "doctor_schedules");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "doctor_schedules");

            migrationBuilder.DropColumn(
                name: "DeletedId",
                table: "doctor_schedules");

            migrationBuilder.DropColumn(
                name: "ModifiedId",
                table: "doctor_schedules");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "doctor_schedules");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "doctor_schedules");

            migrationBuilder.DropColumn(
                name: "SlotTimeId",
                table: "appointments");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CheckInTime",
                table: "appointments",
                type: "datetimeoffset",
                nullable: true);
        }
    }
}
