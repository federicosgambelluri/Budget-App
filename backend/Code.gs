// Configurazione
// Non c'è più un nome fisso, viene generato dinamicamente: "MESE ANNO" (es. "GENNAIO 25")
const CORRECT_TOKEN = "qwqw"; // CAMBIA QUESTA PASSWORD!

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // Verifica Token
    let token = "";
    let data = null;
    let requestYear = null;
    let requestMonth = null;

    // Se è POST con body JSON
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
      token = data.token;
      // Per le operazioni di scrittura, usiamo la data corrente o quella specificata (se servisse in futuro)
      // Ma per ora l'addTransaction usa new Date() quindi va sul mese corrente reale
      // Se volessimo aggiungere transazioni nel passato, dovremmo passare la data nel payload
    } else {
      // Se è GET o POST form-encoded
      token = e.parameter.token;
      requestYear = e.parameter.year;
      requestMonth = e.parameter.month;
    }

    if (token !== CORRECT_TOKEN) {
       return response({ success: false, error: "Invalid token" });
    }

    // Determina la data target per la lettura/scrittura foglio
    let targetDate = new Date();
    if (requestYear && requestMonth !== undefined) {
        targetDate = new Date(parseInt(requestYear), parseInt(requestMonth), 1);
    }

    const sheet = getSheet(targetDate);
    
    // Se abbiamo già parsato i dati (POST)
    if (data) {
      if (data.action === 'delete') {
        deleteTransaction(sheet, data.rowNumber);
        return response({ success: true, message: "Transazione eliminata" });
      } else {
        // Default: aggiungi (o se action='add')
        // NOTA: addTransaction usa new Date() internamente per la data della transazione (quindi oggi)
        // Se volessimo scrivere nel passato bisognerebbe passare la data corretta a getSheet dentro addTransaction
        // Per ora manteniamo la logica che scrive sul mese corrente reale
         const currentSheet = getSheet(new Date()); 
         addTransaction(currentSheet, data);
         return response({ success: true, message: "Transazione aggiunta" });
      }
    }

    // Altrimenti restituisci i dati (GET)
    const result = getTransactions(sheet, targetDate);
    return response(result);

  } catch (error) {
    return response({ success: false, error: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function getSheet(date) {
  const d = date || new Date();
  const months = ["GENNAIO", "FEBBRAIO", "MARZO", "APRILE", "MAGGIO", "GIUGNO", "LUGLIO", "AGOSTO", "SETTEMBRE", "OTTOBRE", "NOVEMBRE", "DICEMBRE"];
  const monthName = months[d.getMonth()];
  const year = d.getFullYear().toString().substr(-2); // Ultime 2 cifre dell'anno
  const sheetName = `${monthName} ${year}`; // Es. "GENNAIO 25"

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Intestazioni
    sheet.appendRow(["Data", "Tipo", "Importo", "Metodo", "Categoria", "Note"]);
  }
  return sheet;
}

function deleteTransaction(sheet, rowNumber) {
    // Verifiche eliminazione riga
    if (rowNumber > 1) {
      // PRIMA di cancellare, leggiamo la riga per aggiornare il saldo contanti se necessario
      // [Data, Tipo, Importo, Metodo, Categoria, Note]
      const rowData = sheet.getRange(rowNumber, 1, 1, 6).getValues()[0];
      const method = rowData[3];
      const amount = parseFloat(rowData[2]);
      
      if (method === 'contanti' && !isNaN(amount)) {
         updateCashBalance(-amount); // Sottraiamo l'importo (inversione operazione)
      }

      sheet.deleteRow(rowNumber);
    }
}

function addTransaction(sheet, data) {
  // ... (recupero parametri)
  let amount = parseFloat(data.amount);
  
  if (data.type === 'expense' || data.type === 'cash_expense') {
    amount = -Math.abs(amount);
  } else {
    amount = Math.abs(amount);
  }

  // Aggiorna Global Cash Balance immediately
  // Indipendente dal foglio/mese
  if (data.method === 'contanti') {
    updateCashBalance(amount);
  }

  sheet.appendRow([
    new Date(),
    data.type,
    amount,
    data.method,
    data.category,
    data.note
  ]);
}

function getTransactions(sheet, currentDate) {
  const rows = sheet.getDataRange().getValues();
  const dataRows = rows.slice(1);
  
  let balance = 0;
  
  // LEGGI SALDO CONTANTI GLOBALE
  // Se non esiste, lo inizializza a 1080
  let cashBalance = getCashBalance();

  // CALCOLO RISPARMIO TOTALE (Mesi precedenti)
  let totalSavings = calculateTotalSavings(currentDate);

  const transactions = [];

  for (let i = dataRows.length - 1; i >= 0; i--) {
    const row = dataRows[i];
    const type = row[1];
    const amount = parseFloat(row[2]);
    const method = row[3];
    
    // Calcolo saldo "Mese Corrente" (Main Budget)
    if (!isNaN(amount) && (type === 'income' || type === 'expense')) {
        balance += amount;
    }

    transactions.push({
      rowNumber: i + 2,
      date: row[0],
      type: type,
      amount: amount,
      method: method,
      category: row[4],
      note: row[5]
    });
  }

  return {
    balance: balance,
    cashBalance: cashBalance,
    totalSavings: totalSavings,
    transactions: transactions
  };
}

// Calcola il risparmio accumulato dai mesi precedenti dell'anno corrente
// Itera da Gennaio fino al mese precedente a targetDate
function calculateTotalSavings(targetDate) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const months = ["GENNAIO", "FEBBRAIO", "MARZO", "APRILE", "MAGGIO", "GIUGNO", "LUGLIO", "AGOSTO", "SETTEMBRE", "OTTOBRE", "NOVEMBRE", "DICEMBRE"];
  
  const targetMonthIndex = targetDate.getMonth();
  const targetYearFull = targetDate.getFullYear();
  const targetYearShort = targetYearFull.toString().substr(-2);
  
  // Assumiamo che il risparmio si calcoli solo sui mesi dell'anno corrente o eventualmente anche anni passati?
  // La richiesta dice "a partire da gennaio". Assumiamo Gennaio dell'anno richiesto.
  
  let savings = 0;
  
  for (let i = 0; i < targetMonthIndex; i++) {
    const sheetName = `${months[i]} ${targetYearShort}`;
    const sheet = ss.getSheetByName(sheetName);
    
    if (sheet) {
      const rows = sheet.getDataRange().getValues();
      const dataRows = rows.slice(1); // Salta header
      
      let sheetBalance = 0;
      dataRows.forEach(row => {
          const type = row[1];
          const amount = parseFloat(row[2]);
           if (!isNaN(amount) && (type === 'income' || type === 'expense')) {
              sheetBalance += amount;
          }
      });
      savings += sheetBalance;
    }
  }
  
  return savings;
}

// --- HELPER FUNCTIONS PER SALDO PERSISTENTE ---

function getCashBalance() {
  const props = PropertiesService.getScriptProperties();
  let stored = props.getProperty('CASH_BALANCE');
  
  // Se è la prima volta assoluta che usiamo questa logica, partiamo da 1080
  if (stored === null) {
    stored = 1080;
    props.setProperty('CASH_BALANCE', stored.toString());
  }
  return parseFloat(stored);
}

function updateCashBalance(delta) {
  const props = PropertiesService.getScriptProperties();
  let current = getCashBalance(); // Assicura init se null
  let newBalance = current + delta;
  props.setProperty('CASH_BALANCE', newBalance.toString());
}

function response(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
