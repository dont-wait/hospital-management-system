using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingEntityInheritBaseEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "roles",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedId",
                table: "roles",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedAt",
                table: "roles",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedId",
                table: "roles",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ModifiedId",
                table: "roles",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "UpdatedAt",
                table: "roles",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "roles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "role_permission",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedId",
                table: "role_permission",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedAt",
                table: "role_permission",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedId",
                table: "role_permission",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ModifiedId",
                table: "role_permission",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "UpdatedAt",
                table: "role_permission",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "role_permission",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "permissions",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedId",
                table: "permissions",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedAt",
                table: "permissions",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedId",
                table: "permissions",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ModifiedId",
                table: "permissions",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "UpdatedAt",
                table: "permissions",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "permissions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "CreatedId",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "DeletedId",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "ModifiedId",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "role_permission");

            migrationBuilder.DropColumn(
                name: "CreatedId",
                table: "role_permission");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "role_permission");

            migrationBuilder.DropColumn(
                name: "DeletedId",
                table: "role_permission");

            migrationBuilder.DropColumn(
                name: "ModifiedId",
                table: "role_permission");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "role_permission");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "role_permission");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "permissions");

            migrationBuilder.DropColumn(
                name: "CreatedId",
                table: "permissions");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "permissions");

            migrationBuilder.DropColumn(
                name: "DeletedId",
                table: "permissions");

            migrationBuilder.DropColumn(
                name: "ModifiedId",
                table: "permissions");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "permissions");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "permissions");
        }
    }
}
