using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class refatorColumnFkTaskRegstrationInSlotTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_slot_times_tasks_TaskItemId",
                table: "slot_times");

            migrationBuilder.AlterColumn<long>(
                name: "TaskItemId",
                table: "slot_times",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<long>(
                name: "TaskRegistrationId",
                table: "slot_times",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_slot_times_TaskRegistrationId",
                table: "slot_times",
                column: "TaskRegistrationId");

            migrationBuilder.AddForeignKey(
                name: "FK_slot_times_task_registrations_TaskRegistrationId",
                table: "slot_times",
                column: "TaskRegistrationId",
                principalTable: "task_registrations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_slot_times_tasks_TaskItemId",
                table: "slot_times",
                column: "TaskItemId",
                principalTable: "tasks",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_slot_times_task_registrations_TaskRegistrationId",
                table: "slot_times");

            migrationBuilder.DropForeignKey(
                name: "FK_slot_times_tasks_TaskItemId",
                table: "slot_times");

            migrationBuilder.DropIndex(
                name: "IX_slot_times_TaskRegistrationId",
                table: "slot_times");

            migrationBuilder.DropColumn(
                name: "TaskRegistrationId",
                table: "slot_times");

            migrationBuilder.AlterColumn<long>(
                name: "TaskItemId",
                table: "slot_times",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_slot_times_tasks_TaskItemId",
                table: "slot_times",
                column: "TaskItemId",
                principalTable: "tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
