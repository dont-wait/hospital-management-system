using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class removeFKServiceIdInBilling : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_billings_services_ServiceId",
                table: "billings");

            migrationBuilder.DropIndex(
                name: "IX_billings_ServiceId",
                table: "billings");

            migrationBuilder.DropColumn(
                name: "ServiceId",
                table: "billings");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ServiceId",
                table: "billings",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_billings_ServiceId",
                table: "billings",
                column: "ServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_billings_services_ServiceId",
                table: "billings",
                column: "ServiceId",
                principalTable: "services",
                principalColumn: "Id");
        }
    }
}
