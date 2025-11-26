using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class addRoomIdInTask : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RoomId",
                table: "tasks",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_tasks_RoomId",
                table: "tasks",
                column: "RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_tasks_rooms_RoomId",
                table: "tasks",
                column: "RoomId",
                principalTable: "rooms",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tasks_rooms_RoomId",
                table: "tasks");

            migrationBuilder.DropIndex(
                name: "IX_tasks_RoomId",
                table: "tasks");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "tasks");
        }
    }
}
