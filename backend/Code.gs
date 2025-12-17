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
  // Verifica semplice per evitare di cancellare l'intestazione o righe non valide
  if (rowNumber > 1) {
    sheet.deleteRow(rowNumber);
  }
}

function addTransaction(sheet, data) {
  // data: { date, type, amount, method, category, note }
  // type: 'income' o 'expense'
  // amount: numero positivo
  
  let amount = parseFloat(data.amount);
  if (data.type === 'expense') {
    amount = -Math.abs(amount);
  } else {
    amount = Math.abs(amount);
  }

  sheet.appendRow([
    new Date(), // Timestamp server
    data.type,
    amount,
    data.method,
    data.category,
    data.note
  ]);
}

function getTransactions(sheet) {
  const rows = sheet.getDataRange().getValues();
  // Rimuovi intestazione
  const dataRows = rows.slice(1);
  
  // Calcola saldo
  let balance = 0;
  const transactions = [];

  // Itera dall'ultima alla prima per mostrare le più recenti
  for (let i = dataRows.length - 1; i >= 0; i--) {
    const row = dataRows[i];
    // [Data, Tipo, Importo, Metodo, Categoria, Note]
    const amount = parseFloat(row[2]);
    if (!isNaN(amount)) {
      balance += amount;
    }

      transactions.push({
        rowNumber: i + 2, // Indice riga nel foglio (1-based, +1 header)
        date: row[0],
        type: row[1],
        amount: amount,
        method: row[3],
        category: row[4],
        note: row[5]
      });
  }

  return {
    balance: balance,
    transactions: transactions
  };
}

function response(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
