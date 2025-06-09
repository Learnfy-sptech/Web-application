import ExcelJS from 'exceljs';

// Função para obter todos os cabeçalhos únicos do conjunto de dados
function getAllHeaders(data) {
  const headers = new Set();
  data.forEach(item => {
    Object.keys(item).forEach(key => headers.add(key));
  });
  return Array.from(headers);
}

// Função principal para exportar dados para Excel
async function exportToExcel(data, filename = `dados.xlsx`) {
  try {
    // Validar se existem dados
    if (!data || data.length === 0) {
      console.warn('Nenhum dado fornecido para exportar');
      return;
    }

    // Criar nova planilha
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Dados');

    // Obter todos os cabeçalhos possíveis
    const headers = getAllHeaders(data);

    // Adicionar cabeçalhos
    worksheet.addRow(headers);

    // Estilizar cabeçalhos
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Adicionar dados
    data.forEach(item => {
      const rowData = headers.map(header => item[header] !== undefined ? item[header] : '');
      worksheet.addRow(rowData);
    });

    // Ajustar largura das colunas automaticamente
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const columnLength = cell.value ? cell.value.toString().length : 0;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = Math.min(Math.max(maxLength + 2, 10), 50); // Limite entre 10 e 50
    });

    // Gerar arquivo Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Criar e disparar download
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Erro ao gerar arquivo Excel:', error);
  }
}