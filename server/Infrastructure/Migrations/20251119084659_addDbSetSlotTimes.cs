using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class addDbSetSlotTimes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SlotTime_tasks_TaskItemId",
                table: "SlotTime");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SlotTime",
                table: "SlotTime");

            migrationBuilder.RenameTable(
                name: "SlotTime",
                newName: "slot_times");

            migrationBuilder.RenameIndex(
                name: "IX_SlotTime_TaskItemId",
                table: "slot_times",
                newName: "IX_slot_times_TaskItemId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_slot_times",
                table: "slot_times",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_slot_times_tasks_TaskItemId",
                table: "slot_times",
                column: "TaskItemId",
                principalTable: "tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_slot_times_tasks_TaskItemId",
                table: "slot_times");

            migrationBuilder.DropPrimaryKey(
                name: "PK_slot_times",
                table: "slot_times");

            migrationBuilder.RenameTable(
                name: "slot_times",
                newName: "SlotTime");

            migrationBuilder.RenameIndex(
                name: "IX_slot_times_TaskItemId",
                table: "SlotTime",
                newName: "IX_SlotTime_TaskItemId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SlotTime",
                table: "SlotTime",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SlotTime_tasks_TaskItemId",
                table: "SlotTime",
                column: "TaskItemId",
                principalTable: "tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
