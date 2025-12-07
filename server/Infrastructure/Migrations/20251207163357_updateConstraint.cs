using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class updateConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "CK_Task_Status",
                table: "tasks",
                sql: "[TaskStatus] IN ('Opened', 'Closed', 'Cancelled', 'Completed')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Slot_Status",
                table: "slot_times",
                sql: "[SlotStatus] IN ('Opened', 'Closed', 'Full')");

            migrationBuilder.CreateIndex(
                name: "IX_departments_Name",
                table: "departments",
                column: "Name",
                unique: true);

            migrationBuilder.AddCheckConstraint(
                name: "CK_Appointment_Status",
                table: "appointments",
                sql: "[AppointmentStatus] IN ('Pending','Unpaid','Paid','Confirmed','CheckIn','Completed','Cancelled','NoShow')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Task_Status",
                table: "tasks");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Slot_Status",
                table: "slot_times");

            migrationBuilder.DropIndex(
                name: "IX_departments_Name",
                table: "departments");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Appointment_Status",
                table: "appointments");
        }
    }
}
