using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeUsernameColumnToCitizenID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Username",
                table: "user_accounts");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "patients");

            migrationBuilder.AddColumn<string>(
                name: "CitizenID",
                table: "user_accounts",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CitizenID",
                table: "user_accounts");

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "user_accounts",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "patients",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }
    }
}
