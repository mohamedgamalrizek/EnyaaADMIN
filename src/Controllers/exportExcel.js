const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatCell = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  return value;
};

const buildWorkbook = ({ title, columns, rows }) => {
  const generatedAt = new Date().toLocaleString();
  const headerCells = columns
    .map(({ label }) => `<th>${escapeHtml(label)}</th>`)
    .join("");
  const bodyRows = rows
    .map(
      (row) =>
        `<tr>${columns
          .map(({ key }) => `<td>${escapeHtml(formatCell(row[key]))}</td>`)
          .join("")}</tr>`
    )
    .join("");

  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
      caption { font-size: 18px; font-weight: 700; padding: 12px; text-align: left; }
      th { background: #1f4e79; color: #ffffff; font-weight: 700; border: 1px solid #d9e2f3; padding: 8px; }
      td { border: 1px solid #d9e2f3; padding: 8px; mso-number-format: "\\@"; }
      tr:nth-child(even) td { background: #f7fbff; }
      .meta { color: #666666; font-size: 12px; font-weight: 400; }
    </style>
  </head>
  <body>
    <table>
      <caption>${escapeHtml(title)} <span class="meta">Generated: ${escapeHtml(
    generatedAt
  )}</span></caption>
      <thead><tr>${headerCells}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  </body>
</html>`;
};

const slugify = (value) =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const exportExcel = ({ title, columns, rows, filename }) => {
  const workbook = buildWorkbook({ title, columns, rows });
  const blob = new Blob(["\ufeff", workbook], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${filename || slugify(title)}-${new Date()
    .toISOString()
    .slice(0, 10)}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default exportExcel;
