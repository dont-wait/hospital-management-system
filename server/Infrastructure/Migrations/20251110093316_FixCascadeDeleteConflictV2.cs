using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class FixCascadeDeleteConflictV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_admins_employees_EmployeeId",
                table: "admins");

            migrationBuilder.DropForeignKey(
                name: "FK_doctors_employees_EmployeeId",
                table: "doctors");

            migrationBuilder.DropForeignKey(
                name: "FK_user_accounts_employees_EmployeeId",
                table: "user_accounts");

            migrationBuilder.DropForeignKey(
                name: "FK_user_accounts_patients_PatientId",
                table: "user_accounts");

            migrationBuilder.AddForeignKey(
                name: "FK_admins_employees_EmployeeId",
                table: "admins",
                column: "EmployeeId",
                principalTable: "employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_doctors_employees_EmployeeId",
                table: "doctors",
                column: "EmployeeId",
                principalTable: "employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_user_accounts_employees_EmployeeId",
                table: "user_accounts",
                column: "EmployeeId",
                principalTable: "employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_user_accounts_patients_PatientId",
                table: "user_accounts",
                column: "PatientId",
                principalTable: "patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_admins_employees_EmployeeId",
                table: "admins");

            migrationBuilder.DropForeignKey(
                name: "FK_doctors_employees_EmployeeId",
                table: "doctors");

            migrationBuilder.DropForeignKey(
                name: "FK_user_accounts_employees_EmployeeId",
                table: "user_accounts");

            migrationBuilder.DropForeignKey(
                name: "FK_user_accounts_patients_PatientId",
                table: "user_accounts");

            migrationBuilder.AddForeignKey(
                name: "FK_admins_employees_EmployeeId",
                table: "admins",
                column: "EmployeeId",
                principalTable: "employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_doctors_employees_EmployeeId",
                table: "doctors",
                column: "EmployeeId",
                principalTable: "employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_accounts_employees_EmployeeId",
                table: "user_accounts",
                column: "EmployeeId",
                principalTable: "employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_user_accounts_patients_PatientId",
                table: "user_accounts",
                column: "PatientId",
                principalTable: "patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
