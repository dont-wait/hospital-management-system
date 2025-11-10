using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddBaseEntityForTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "user_accounts",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedId",
                table: "user_accounts",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedAt",
                table: "user_accounts",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedId",
                table: "user_accounts",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ModifiedId",
                table: "user_accounts",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "UpdatedAt",
                table: "user_accounts",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "user_accounts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "RegistrationDate",
                table: "patients",
                type: "datetimeoffset",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "patients",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedId",
                table: "patients",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedAt",
                table: "patients",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedId",
                table: "patients",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ModifiedId",
                table: "patients",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "UpdatedAt",
                table: "patients",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "patients",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "employees",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedId",
                table: "employees",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedAt",
                table: "employees",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedId",
                table: "employees",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ModifiedId",
                table: "employees",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "UpdatedAt",
                table: "employees",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "employees",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "doctors",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedId",
                table: "doctors",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedAt",
                table: "doctors",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedId",
                table: "doctors",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ModifiedId",
                table: "doctors",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "UpdatedAt",
                table: "doctors",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "doctors",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "admins",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedId",
                table: "admins",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedAt",
                table: "admins",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedId",
                table: "admins",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ModifiedId",
                table: "admins",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "UpdatedAt",
                table: "admins",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "admins",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "user_accounts");

            migrationBuilder.DropColumn(
                name: "CreatedId",
                table: "user_accounts");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "user_accounts");

            migrationBuilder.DropColumn(
                name: "DeletedId",
                table: "user_accounts");

            migrationBuilder.DropColumn(
                name: "ModifiedId",
                table: "user_accounts");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "user_accounts");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "user_accounts");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "CreatedId",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "DeletedId",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "ModifiedId",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "employees");

            migrationBuilder.DropColumn(
                name: "CreatedId",
                table: "employees");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "employees");

            migrationBuilder.DropColumn(
                name: "DeletedId",
                table: "employees");

            migrationBuilder.DropColumn(
                name: "ModifiedId",
                table: "employees");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "employees");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "employees");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "doctors");

            migrationBuilder.DropColumn(
                name: "CreatedId",
                table: "doctors");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "doctors");

            migrationBuilder.DropColumn(
                name: "DeletedId",
                table: "doctors");

            migrationBuilder.DropColumn(
                name: "ModifiedId",
                table: "doctors");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "doctors");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "doctors");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "admins");

            migrationBuilder.DropColumn(
                name: "CreatedId",
                table: "admins");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "admins");

            migrationBuilder.DropColumn(
                name: "DeletedId",
                table: "admins");

            migrationBuilder.DropColumn(
                name: "ModifiedId",
                table: "admins");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "admins");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "admins");

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegistrationDate",
                table: "patients",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTimeOffset),
                oldType: "datetimeoffset");
        }
    }
}
