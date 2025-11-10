using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDeleteCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_user_accounts_employees_EmployeeId",
                table: "user_accounts");

            migrationBuilder.DropForeignKey(
                name: "FK_user_accounts_patients_PatientId",
                table: "user_accounts");

            migrationBuilder.AddForeignKey(
                name: "FK_user_accounts_employees_EmployeeId",
                table: "user_accounts",
                column: "EmployeeId",
                principalTable: "employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_accounts_patients_PatientId",
                table: "user_accounts",
                column: "PatientId",
                principalTable: "patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_user_accounts_employees_EmployeeId",
                table: "user_accounts");

            migrationBuilder.DropForeignKey(
                name: "FK_user_accounts_patients_PatientId",
                table: "user_accounts");

            migrationBuilder.AddForeignKey(
                name: "FK_user_accounts_employees_EmployeeId",
                table: "user_accounts",
                column: "EmployeeId",
                principalTable: "employees",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_user_accounts_patients_PatientId",
                table: "user_accounts",
                column: "PatientId",
                principalTable: "patients",
                principalColumn: "Id");
        }
    }
}
