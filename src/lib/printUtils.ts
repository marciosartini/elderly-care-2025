
import { Professional } from "./professionalStore";

export const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export const printProfessionalSchedule = (professional: Professional, professionName: string) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita popups para imprimir a rotina de trabalho.');
    return;
  }

  // HTML content for the print window
  const scheduleHtml = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rotina de Trabalho - ${professional.name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 10px;
          border-bottom: 1px solid #ddd;
        }
        .professional-info {
          display: flex;
          margin-bottom: 30px;
        }
        .photo {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 60px;
          margin-right: 20px;
          border: 1px solid #ddd;
        }
        .info {
          flex: 1;
        }
        .info h3 {
          margin: 0 0 5px 0;
          color: #444;
        }
        .info p {
          margin: 5px 0;
          color: #666;
        }
        .schedule-title {
          font-size: 18px;
          margin-top: 30px;
          margin-bottom: 15px;
          padding-bottom: 5px;
          border-bottom: 1px solid #eee;
          color: #2563eb;
        }
        .schedule-item {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 4px;
        }
        .schedule-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .day {
          font-weight: bold;
        }
        .time {
          color: #666;
        }
        .activities {
          white-space: pre-line;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 12px;
          color: #999;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Rotina de Trabalho</h1>
        </div>
        
        <div class="professional-info">
          <img src="${professional.photo}" alt="${professional.name}" class="photo" onerror="this.src='/placeholder.svg'">
          <div class="info">
            <h3>${professional.name}</h3>
            <p><strong>Cargo:</strong> ${professionName}</p>
            <p><strong>Especialidade:</strong> ${professional.specialty || 'Não especificada'}</p>
            <p><strong>Registro:</strong> ${professional.registration}</p>
            <p><strong>Contato:</strong> ${professional.contact.phone} | ${professional.contact.email}</p>
          </div>
        </div>
        
        <h2 class="schedule-title">Rotina Semanal de Atividades</h2>
        
        ${professional.schedule.map(schedule => `
        <div class="schedule-item">
          <div class="schedule-header">
            <span class="day">${schedule.dayOfWeek}</span>
            <span class="time">${schedule.startTime} - ${schedule.endTime}</span>
          </div>
          <div class="activities">${schedule.activities}</div>
        </div>
        `).join('')}
        
        <div class="footer">
          <p>Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        </div>
        
        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background-color: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Imprimir Rotina
          </button>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Write the HTML content to the new window and print
  printWindow.document.write(scheduleHtml);
  printWindow.document.close();
  
  // Allow the window to load before printing
  setTimeout(() => {
    printWindow.focus();
  }, 300);
};
