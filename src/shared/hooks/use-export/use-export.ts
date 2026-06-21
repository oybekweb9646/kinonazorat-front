import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, TextRun, AlignmentType, HeadingLevel } from 'docx';
import * as XLSX from 'xlsx';

export interface ExportColumn {
  title: string;
  dataIndex?: string;
  render?: (item: any) => string | number | null | undefined;
}

export interface UseExportOptions {
  filename: string;
  columns: ExportColumn[];
  data: any[];
  title?: string;
}

function getCellValue(col: ExportColumn, item: any): string {
  if (col.render) return String(col.render(item) ?? '');
  if (col.dataIndex) return String(item[col.dataIndex] ?? '');
  return '';
}

export function useExport({ filename, columns, data, title }: UseExportOptions) {
  const headers = columns.map((c) => c.title);
  const rows = data.map((item) => columns.map((col) => getCellValue(col, item)));

  function exportXlsx() {
    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Ustun kengligi
    ws['!cols'] = headers.map(() => ({ wch: 20 }));

    // Sarlavha qatori katta harfda
    headers.forEach((_, i) => {
      const cell = XLSX.utils.encode_cell({ r: 0, c: i });
      if (ws[cell]) {
        ws[cell].s = { font: { bold: true } };
      }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ma'lumotlar");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }

  async function exportDocx() {
    const tableRows = [
      new TableRow({
        children: headers.map(
          (h) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: h, bold: true, color: 'FFFFFF' })],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              shading: { fill: '24503E' },
              width: { size: Math.floor(9000 / headers.length), type: WidthType.DXA },
            }),
        ),
        tableHeader: true,
      }),
      ...rows.map(
        (row) =>
          new TableRow({
            children: row.map(
              (cell) =>
                new TableCell({
                  children: [new Paragraph({ text: cell, alignment: AlignmentType.LEFT })],
                  width: { size: Math.floor(9000 / headers.length), type: WidthType.DXA },
                }),
            ),
          }),
      ),
    ];

    const doc = new Document({
      sections: [
        {
          children: [
            ...(title
              ? [
                  new Paragraph({
                    text: title,
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                  }),
                ]
              : []),
            new Table({
              rows: tableRows,
              width: { size: 9000, type: WidthType.DXA },
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${filename}.docx`);
  }

  function exportPdf() {
    const doc = new jsPDF({ orientation: headers.length > 6 ? 'landscape' : 'portrait' });

    if (title) {
      doc.setFontSize(14);
      doc.text(title, doc.internal.pageSize.width / 2, 15, { align: 'center' });
    }

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: title ? 22 : 10,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [36, 80, 62], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 247, 244] },
      margin: { left: 10, right: 10 },
    });

    doc.save(`${filename}.pdf`);
  }

  return { exportXlsx, exportDocx, exportPdf };
}