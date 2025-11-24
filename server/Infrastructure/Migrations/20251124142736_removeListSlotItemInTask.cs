using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class removeListSlotItemInTask : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_slot_times_tasks_TaskItemId",
                table: "slot_times");

            migrationBuilder.DropIndex(
                name: "IX_slot_times_TaskItemId",
                table: "slot_times");

            migrationBuilder.DropColumn(
                name: "TaskItemId",
                table: "slot_times");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "TaskItemId",
                table: "slot_times",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_slot_times_TaskItemId",
                table: "slot_times",
                column: "TaskItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_slot_times_tasks_TaskItemId",
                table: "slot_times",
                column: "TaskItemId",
                principalTable: "tasks",
                principalColumn: "Id");
        }
    }
}
