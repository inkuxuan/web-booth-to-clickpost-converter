// Columns from BOOTH.pm export
export interface BoothOrderRow {
  "注文番号": string;
  "ユーザー識別コード": string;
  "お支払方法": string;
  "注文状況": string;
  "注文日時": string;
  "支払い日時": string;
  "発送日時": string;
  "合計金額": string;
  "郵便番号": string;
  "都道府県": string;
  "市区町村・丁目・番地": string;
  "マンション・建物名・部屋番号": string;
  "氏名": string;
  "電話番号": string;
  "商品ID / 数量 / 商品名": string;
}

// Columns for Japan Post Click Post import
export interface ClickPostRow {
  "お届け先郵便番号": string;
  "お届け先氏名": string;
  "お届け先敬称": string;
  "お届け先住所1行目": string; // Prefecture
  "お届け先住所2行目": string; // City/Block
  "お届け先住所3行目": string; // Building/Room
  "お届け先住所4行目": string; // Empty
  "内容品": string;
}

export interface ParsedDataState {
  fileName: string;
  rows: BoothOrderRow[];
  valid: boolean;
  error?: string;
}