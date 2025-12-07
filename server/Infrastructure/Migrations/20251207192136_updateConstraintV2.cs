using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class updateConstraintV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "patients",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Slot_Current",
                table: "slot_times",
                sql: "[CurrentAppointments] >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Slot_Max",
                table: "slot_times",
                sql: "[MaxAppointments] >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Slot_Range",
                table: "slot_times",
                sql: "[CurrentAppointments] <= [MaxAppointments]");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Room_Capacity",
                table: "rooms",
                sql: "[Capacity] >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_PD_Dosage",
                table: "prescription_details",
                sql: "[Dosage] >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_PD_Duration",
                table: "prescription_details",
                sql: "[Duration] >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_PD_Frequency",
                table: "prescription_details",
                sql: "[Frequency] >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_PD_Quantity",
                table: "prescription_details",
                sql: "[Quantity] >= 0");

            migrationBuilder.CreateIndex(
                name: "IX_patients_Email",
                table: "patients",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_patients_PhoneNumber",
                table: "patients",
                column: "PhoneNumber",
                unique: true);

            migrationBuilder.AddCheckConstraint(
                name: "CK_Patient_Gender",
                table: "patients",
                sql: "[Gender] IN ('M','F','O')");

            migrationBuilder.CreateIndex(
                name: "IX_employees_Email",
                table: "employees",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_employees_PhoneNumber",
                table: "employees",
                column: "PhoneNumber",
                unique: true);

            migrationBuilder.AddCheckConstraint(
                name: "CK_Emp_Experience",
                table: "employees",
                sql: "[ExperienceYears] >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Billing_Discount",
                table: "billings",
                sql: "[DiscountAmount] >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Billing_PayAmount",
                table: "billings",
                sql: "[PaymentAmount] >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Billing_PaymentStatus",
                table: "billings",
                sql: "[PaymentMethod] IN ('PayAtCounter','EWallet')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Slot_Current",
                table: "slot_times");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Slot_Max",
                table: "slot_times");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Slot_Range",
                table: "slot_times");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Room_Capacity",
                table: "rooms");

            migrationBuilder.DropCheckConstraint(
                name: "CK_PD_Dosage",
                table: "prescription_details");

            migrationBuilder.DropCheckConstraint(
                name: "CK_PD_Duration",
                table: "prescription_details");

            migrationBuilder.DropCheckConstraint(
                name: "CK_PD_Frequency",
                table: "prescription_details");

            migrationBuilder.DropCheckConstraint(
                name: "CK_PD_Quantity",
                table: "prescription_details");

            migrationBuilder.DropIndex(
                name: "IX_patients_Email",
                table: "patients");

            migrationBuilder.DropIndex(
                name: "IX_patients_PhoneNumber",
                table: "patients");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Patient_Gender",
                table: "patients");

            migrationBuilder.DropIndex(
                name: "IX_employees_Email",
                table: "employees");

            migrationBuilder.DropIndex(
                name: "IX_employees_PhoneNumber",
                table: "employees");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Emp_Experience",
                table: "employees");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Billing_Discount",
                table: "billings");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Billing_PayAmount",
                table: "billings");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Billing_PaymentStatus",
                table: "billings");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "patients",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
