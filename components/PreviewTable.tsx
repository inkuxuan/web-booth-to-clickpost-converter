import React from 'react';
import { ClickPostRow } from '../types';

interface PreviewTableProps {
  data: ClickPostRow[];
}

const PreviewTable: React.FC<PreviewTableProps> = ({ data }) => {
  if (data.length === 0) return null;

  return (
    <div className="w-full overflow-hidden border border-slate-200 rounded-lg shadow-sm bg-white">
      <div className="overflow-x-auto max-h-[400px]">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Zip Code</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Honorific</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Prefecture</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">City/Block</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Building</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Content</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2 whitespace-nowrap font-mono text-slate-600">{row["お届け先郵便番号"]}</td>
                <td className="px-4 py-2 whitespace-nowrap font-medium text-slate-800">{row["お届け先氏名"]}</td>
                <td className="px-4 py-2 whitespace-nowrap text-slate-500">{row["お届け先敬称"]}</td>
                <td className="px-4 py-2 whitespace-nowrap text-slate-600">{row["お届け先住所1行目"]}</td>
                <td className="px-4 py-2 text-slate-600 max-w-xs truncate" title={row["お届け先住所2行目"]}>{row["お届け先住所2行目"]}</td>
                <td className="px-4 py-2 text-slate-600 max-w-xs truncate" title={row["お届け先住所3行目"]}>{row["お届け先住所3行目"]}</td>
                <td className="px-4 py-2 whitespace-nowrap text-slate-600 font-medium">{row["内容品"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 px-4 py-2 text-xs text-slate-500 border-t border-slate-200 flex justify-between items-center">
        <span>Showing {data.length} entries</span>
        <span>Scroll for more</span>
      </div>
    </div>
  );
};

export default PreviewTable;