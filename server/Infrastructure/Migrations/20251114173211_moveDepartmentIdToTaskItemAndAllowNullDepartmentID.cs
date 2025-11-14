using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class moveDepartmentIdToTaskItemAndAllowNullDepartmentID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_task_requirements_departments_DepartmentId",
                table: "task_requirements");

            migrationBuilder.DropIndex(
                name: "IX_task_requirements_DepartmentId",
                table: "task_requirements");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "task_requirements");

            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "tasks",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_tasks_DepartmentId",
                table: "tasks",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_tasks_departments_DepartmentId",
                table: "tasks",
                column: "DepartmentId",
                principalTable: "departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tasks_departments_DepartmentId",
                table: "tasks");

            migrationBuilder.DropIndex(
                name: "IX_tasks_DepartmentId",
                table: "tasks");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "tasks");

            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "task_requirements",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_task_requirements_DepartmentId",
                table: "task_requirements",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_task_requirements_departments_DepartmentId",
                table: "task_requirements",
                column: "DepartmentId",
                principalTable: "departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
