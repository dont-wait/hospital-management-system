using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingSlotTimeIdInAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "SlotTimeId",
                table: "appointments",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_appointments_SlotTimeId",
                table: "appointments",
                column: "SlotTimeId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_slot_times_SlotTimeId",
                table: "appointments",
                column: "SlotTimeId",
                principalTable: "slot_times",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointments_slot_times_SlotTimeId",
                table: "appointments");

            migrationBuilder.DropIndex(
                name: "IX_appointments_SlotTimeId",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "SlotTimeId",
                table: "appointments");
        }
    }
}
