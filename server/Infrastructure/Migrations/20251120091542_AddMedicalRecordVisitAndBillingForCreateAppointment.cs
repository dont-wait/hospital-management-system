using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddMedicalRecordVisitAndBillingForCreateAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "BillingId",
                table: "appointments",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "MedicalVisitId",
                table: "appointments",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "billings",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppointmentId = table.Column<long>(type: "bigint", nullable: false),
                    DiscountAmount = table.Column<double>(type: "float", nullable: false),
                    TotalAmount = table.Column<double>(type: "float", nullable: false),
                    BillingStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ServiceId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_billings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_billings_appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "appointments",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_billings_services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "medical_records",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DiagnosisSummary = table.Column<string>(type: "NVARCHAR(MAX)", nullable: false),
                    TreatmentSummary = table.Column<string>(type: "NVARCHAR(MAX)", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PatientId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Version = table.Column<int>(type: "int", nullable: false),
                    CreatedId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ModifiedId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletedId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
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

            migrationBuilder.CreateTable(
                name: "medical_visits",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Symptoms = table.Column<string>(type: "NVARCHAR(MAX)", nullable: false),
                    PhysicalExamination = table.Column<string>(type: "NVARCHAR(MAX)", nullable: false),
                    Diagnosis = table.Column<string>(type: "NVARCHAR(MAX)", nullable: false),
                    Treatment = table.Column<string>(type: "NVARCHAR(MAX)", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageResult = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AppointmentId = table.Column<long>(type: "bigint", nullable: false),
                    MedicalRecordId = table.Column<long>(type: "bigint", nullable: false),
                    Version = table.Column<int>(type: "int", nullable: false),
                    CreatedId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ModifiedId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletedId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_medical_visits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_medical_visits_appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "appointments",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_medical_visits_medical_records_MedicalRecordId",
                        column: x => x.MedicalRecordId,
                        principalTable: "medical_records",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_billings_AppointmentId",
                table: "billings",
                column: "AppointmentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_billings_ServiceId",
                table: "billings",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_medical_records_PatientId",
                table: "medical_records",
                column: "PatientId",
                unique: true,
                filter: "[PatientId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_medical_visits_AppointmentId",
                table: "medical_visits",
                column: "AppointmentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_medical_visits_MedicalRecordId",
                table: "medical_visits",
                column: "MedicalRecordId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "billings");

            migrationBuilder.DropTable(
                name: "medical_visits");

            migrationBuilder.DropTable(
                name: "medical_records");

            migrationBuilder.DropColumn(
                name: "BillingId",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "MedicalVisitId",
                table: "appointments");
        }
    }
}
