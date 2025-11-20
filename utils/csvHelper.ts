import Papa from 'papaparse';
import Encoding from 'encoding-japanese';
import { BoothOrderRow, ClickPostRow } from '../types';

export const parseBoothCSV = (file: File): Promise<BoothOrderRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Basic validation to check if it looks like a BOOTH CSV
        const headers = results.meta.fields || [];
        const requiredHeaders = ["注文番号", "郵便番号", "氏名", "都道府県"];
        
        const missing = requiredHeaders.filter(h => !headers.includes(h));
        if (missing.length > 0) {
          reject(new Error(`Invalid CSV format. Missing columns: ${missing.join(', ')}`));
          return;
        }
        
        resolve(results.data as BoothOrderRow[]);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const generateClickPostData = (sourceRows: BoothOrderRow[], contentDescription: string, honorific: string = "様"): ClickPostRow[] => {
  return sourceRows.map(row => {
    // Clean Postal Code (remove hyphens for ClickPost safety, though often they accept them, standardized is better)
    const cleanZip = row["郵便番号"] ? row["郵便番号"].replace(/-/g, '') : "";

    return {
      "お届け先郵便番号": cleanZip,
      "お届け先氏名": row["氏名"] || "",
      "お届け先敬称": honorific,
      "お届け先住所1行目": row["都道府県"] || "",
      "お届け先住所2行目": row["市区町村・丁目・番地"] || "",
      "お届け先住所3行目": row["マンション・建物名・部屋番号"] || "",
      "お届け先住所4行目": "",
      "内容品": contentDescription
    };
  });
};

export const downloadShiftJisCSV = (data: ClickPostRow[], filename: string) => {
  // 1. Convert data to CSV string using PapaParse
  const csvString = Papa.unparse(data, {
    quotes: false, // Click Post usually prefers minimal quoting, but we might need it for safety. Papa handles standard.
    newline: "\r\n", // Windows line endings for Japan legacy systems
  });

  // 2. Convert Unicode string to array of codes
  const unicodeArray = Encoding.stringToCode(csvString);

  // 3. Convert Unicode array to Shift_JIS array
  const sjisArray = Encoding.convert(unicodeArray, {
    to: 'SJIS',
    from: 'UNICODE'
  });

  // 4. Create Blob and Trigger Download
  const uint8Array = new Uint8Array(sjisArray);
  const blob = new Blob([uint8Array], { type: 'text/csv;charset=Shift_JIS' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};