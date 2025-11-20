using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class refactorMedicalVisitAndSomeTableHasRelationalWithIt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_departments_DepartmentId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_billings_appointments_AppointmentId",
                table: "billings");

            migrationBuilder.DropForeignKey(
                name: "FK_billings_services_ServiceId",
                table: "billings");

            migrationBuilder.DropForeignKey(
                name: "FK_medical_visits_medical_records_MedicalRecordId",
                table: "medical_visits");

            migrationBuilder.DropTable(
                name: "medical_records");

            migrationBuilder.DropIndex(
                name: "IX_medical_visits_MedicalRecordId",
                table: "medical_visits");

            migrationBuilder.DropIndex(
                name: "IX_billings_AppointmentId",
                table: "billings");

            migrationBuilder.DropIndex(
                name: "IX_appointments_DepartmentId",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "MedicalRecordId",
                table: "medical_visits");

            migrationBuilder.DropColumn(
                name: "AppointmentId",
                table: "billings");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "appointments");

            migrationBuilder.RenameColumn(
                name: "TotalAmount",
                table: "billings",
                newName: "PaymentAmount");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "DateOfBirth",
                table: "patients",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DiagnosisSummary",
                table: "patients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "patients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TreatmentSummary",
                table: "patients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Treatment",
                table: "medical_visits",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "NVARCHAR(MAX)");

            migrationBuilder.AlterColumn<string>(
                name: "Symptoms",
                table: "medical_visits",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "NVARCHAR(MAX)");

            migrationBuilder.AlterColumn<string>(
                name: "PhysicalExamination",
                table: "medical_visits",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "NVARCHAR(MAX)");

            migrationBuilder.AlterColumn<string>(
                name: "Diagnosis",
                table: "medical_visits",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "NVARCHAR(MAX)");

            migrationBuilder.AddColumn<Guid>(
                name: "PatientId",
                table: "medical_visits",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<DateOnly>(
                name: "DateOfBirth",
                table: "employees",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<int>(
                name: "ServiceId",
                table: "billings",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                table: "billings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "RoomId",
                table: "appointments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_medical_visits_PatientId",
                table: "medical_visits",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_BillingId",
                table: "appointments",
                column: "BillingId",
                unique: true,
                filter: "[BillingId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_RoomId",
                table: "appointments",
                column: "RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_billings_BillingId",
                table: "appointments",
                column: "BillingId",
                principalTable: "billings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_rooms_RoomId",
                table: "appointments",
                column: "RoomId",
                principalTable: "rooms",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_billings_services_ServiceId",
                table: "billings",
                column: "ServiceId",
                principalTable: "services",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_medical_visits_patients_PatientId",
                table: "medical_visits",
                column: "PatientId",
                principalTable: "patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_billings_BillingId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_appointments_rooms_RoomId",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_billings_services_ServiceId",
                table: "billings");

            migrationBuilder.DropForeignKey(
                name: "FK_medical_visits_patients_PatientId",
                table: "medical_visits");

            migrationBuilder.DropIndex(
                name: "IX_medical_visits_PatientId",
                table: "medical_visits");

            migrationBuilder.DropIndex(
                name: "IX_appointments_BillingId",
                table: "appointments");

            migrationBuilder.DropIndex(
                name: "IX_appointments_RoomId",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "DiagnosisSummary",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "TreatmentSummary",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "PatientId",
                table: "medical_visits");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "billings");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "appointments");

            migrationBuilder.RenameColumn(
                name: "PaymentAmount",
                table: "billings",
                newName: "TotalAmount");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateOfBirth",
                table: "patients",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Treatment",
                table: "medical_visits",
                type: "NVARCHAR(MAX)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Symptoms",
                table: "medical_visits",
                type: "NVARCHAR(MAX)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "PhysicalExamination",
                table: "medical_visits",
                type: "NVARCHAR(MAX)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Diagnosis",
                table: "medical_visits",
                type: "NVARCHAR(MAX)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<long>(
                name: "MedicalRecordId",
                table: "medical_visits",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateOfBirth",
                table: "employees",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AlterColumn<int>(
                name: "ServiceId",
                table: "billings",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<long>(
                name: "AppointmentId",
                table: "billings",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "appointments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "medical_records",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    DeletedId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DiagnosisSummary = table.Column<string>(type: "NVARCHAR(MAX)", nullable: false),
                    ModifiedId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TreatmentSummary = table.Column<string>(type: "NVARCHAR(MAX)", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Version = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_medical_records", x => x.Id);
                    table.ForeignKey(
                        name: "FK_medical_records_patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_medical_visits_MedicalRecordId",
                table: "medical_visits",
                column: "MedicalRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_billings_AppointmentId",
                table: "billings",
                column: "AppointmentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_appointments_DepartmentId",
                table: "appointments",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_medical_records_PatientId",
                table: "medical_records",
                column: "PatientId",
                unique: true,
                filter: "[PatientId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_departments_DepartmentId",
                table: "appointments",
                column: "DepartmentId",
                principalTable: "departments",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_billings_appointments_AppointmentId",
                table: "billings",
                column: "AppointmentId",
                principalTable: "appointments",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_billings_services_ServiceId",
                table: "billings",
                column: "ServiceId",
                principalTable: "services",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_medical_visits_medical_records_MedicalRecordId",
                table: "medical_visits",
                column: "MedicalRecordId",
                principalTable: "medical_records",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
