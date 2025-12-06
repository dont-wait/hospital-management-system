using ClosedXML.Excel;

public class ExcelExporter : IExcelExporter
{
    public byte[] ExportDepartmentRevenue(List<ResponseDeparmentRevenueStatisticsDTO> data)
    {
        using var workbook = new XLWorkbook();
        var ws = workbook.Worksheets.Add("Revenue Report");

        ws.Cell(1, 1).Value = "Department ID";
        ws.Cell(1, 2).Value = "Department Name";
        ws.Cell(1, 3).Value = "Total Appointments";
        ws.Cell(1, 4).Value = "Revenue";
        ws.Cell(1, 5).Value = "Growth (%)";

        int row = 2;
        foreach (var item in data)
        {
            ws.Cell(row, 1).Value = item.Id;
            ws.Cell(row, 2).Value = item.Name;
            ws.Cell(row, 3).Value = item.TotalAppointments;
            ws.Cell(row, 4).Value = item.Revenue;
            ws.Cell(row, 5).Value = item.RevenueGrowthPercentage ?? 0;
            row++;
        }

        ws.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }
}
