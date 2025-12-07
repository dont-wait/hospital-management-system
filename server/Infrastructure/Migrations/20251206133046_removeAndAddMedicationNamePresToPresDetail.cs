using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class removeAndAddMedicationNamePresToPresDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MedicationName",
                table: "prescriptions");

            migrationBuilder.AddColumn<string>(
                name: "MedicationName",
                table: "prescription_details",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MedicationName",
                table: "prescription_details");

            migrationBuilder.AddColumn<string>(
                name: "MedicationName",
                table: "prescriptions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
