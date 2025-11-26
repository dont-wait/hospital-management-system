using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class fixFKAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_doctors_DoctorId1",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_appointments_patients_PatientId1",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_appointments_services_ServiceId",
                table: "appointments");

            migrationBuilder.DropIndex(
                name: "IX_appointments_DoctorId1",
                table: "appointments");

            migrationBuilder.DropIndex(
                name: "IX_appointments_PatientId1",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "DoctorId1",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "PatientId1",
                table: "appointments");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_services_ServiceId",
                table: "appointments",
                column: "ServiceId",
                principalTable: "services",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_services_ServiceId",
                table: "appointments");

            migrationBuilder.AddColumn<Guid>(
                name: "DoctorId1",
                table: "appointments",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PatientId1",
                table: "appointments",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_appointments_DoctorId1",
                table: "appointments",
                column: "DoctorId1");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_PatientId1",
                table: "appointments",
                column: "PatientId1");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_doctors_DoctorId1",
                table: "appointments",
                column: "DoctorId1",
                principalTable: "doctors",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_patients_PatientId1",
                table: "appointments",
                column: "PatientId1",
                principalTable: "patients",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_services_ServiceId",
                table: "appointments",
                column: "ServiceId",
                principalTable: "services",
                principalColumn: "Id");
        }
    }
}
