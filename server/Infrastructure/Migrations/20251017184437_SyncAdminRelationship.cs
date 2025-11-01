using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class SyncAdminRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_admins_EmployeeId",
                table: "admins");

            migrationBuilder.CreateIndex(
                name: "IX_admins_EmployeeId",
                table: "admins",
                column: "EmployeeId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_admins_EmployeeId",
                table: "admins");

            migrationBuilder.CreateIndex(
                name: "IX_admins_EmployeeId",
                table: "admins",
                column: "EmployeeId");
        }
    }
}
