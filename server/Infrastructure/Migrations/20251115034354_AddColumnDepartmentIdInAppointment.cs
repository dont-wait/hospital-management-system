using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddColumnDepartmentIdInAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "appointments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_appointments_DepartmentId",
                table: "appointments",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_departments_DepartmentId",
                table: "appointments",
                column: "DepartmentId",
                principalTable: "departments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_departments_DepartmentId",
                table: "appointments");

            migrationBuilder.DropIndex(
                name: "IX_appointments_DepartmentId",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "appointments");
        }
    }
}
