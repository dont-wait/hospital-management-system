using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class romveFKPatientInMedicalVisit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_medical_visits_patients_PatientId",
                table: "medical_visits");

            migrationBuilder.DropIndex(
                name: "IX_medical_visits_PatientId",
                table: "medical_visits");

            migrationBuilder.DropColumn(
                name: "PatientId",
                table: "medical_visits");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PatientId",
                table: "medical_visits",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_medical_visits_PatientId",
                table: "medical_visits",
                column: "PatientId");

            migrationBuilder.AddForeignKey(
                name: "FK_medical_visits_patients_PatientId",
                table: "medical_visits",
                column: "PatientId",
                principalTable: "patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
