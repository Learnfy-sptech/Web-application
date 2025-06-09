// excelExport.js
const ExcelJS = require('exceljs');

function exportToExcel(data, filename = 'relatorio.xlsx') {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório');

    // Adiciona cabeçalhos
    if (data.length > 0) {
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);

        // Adiciona dados
        data.forEach(item => {
            worksheet.addRow(Object.values(item));
        });
    }

    // Retorna a promise para ser usada com .then()
    return workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// Exporte no formato CommonJS
module.exports = { exportToExcel };