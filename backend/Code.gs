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

    // Se è POST con body JSON
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
      token = data.token;
    } else {
      // Se è GET o POST form-encoded
      token = e.parameter.token;
    }

    if (token !== CORRECT_TOKEN) {
       return response({ success: false, error: "Invalid token" });
    }

    // Usa la data corrente per determinare il foglio attivo
    const sheet = getSheet();
    
    // Se abbiamo già parsato i dati (POST)
    if (data) {
      if (data.action === 'delete') {
        deleteTransaction(sheet, data.rowNumber);
        return response({ success: true, message: "Transazione eliminata" });
      } else {
        // Default: aggiungi (o se action='add')
        addTransaction(sheet, data);
        return response({ success: true, message: "Transazione aggiunta" });
      }
    }

    // Altrimenti restituisci i dati (GET)
    const result = getTransactions(sheet);
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

function getTransactions(sheet) {
  const rows = sheet.getDataRange().getValues();
  const dataRows = rows.slice(1);
  
  let balance = 0;
  
  // LEGGI SALDO CONTANTI GLOBALE
  // Se non esiste, lo inizializza a 1080
  let cashBalance = getCashBalance();

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
    transactions: transactions
  };
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
