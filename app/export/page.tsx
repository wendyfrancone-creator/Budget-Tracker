"use client";

import { useTransactionContext } from "../providers";
import { formatCurrency } from "@/lib/utils";

export default function ExportPage() {
  const { transactions, categories } = useTransactionContext();

  const csvRows = [
    ["Date", "Type", "Category", "Receipt URL", "Receipt note", "Amount"],
    ...transactions.map((transaction) => [
      transaction.date,
      transaction.type,
      transaction.category,
      transaction.receiptUrl ?? "",
      transaction.receiptNote ?? "",
      String(transaction.amount)
    ])
  ];
  const csv = csvRows.map((row) => row.map((item) => `"${item.replace(/"/g, '""')}"`).join(",")).join("\n");

  const handleExport = () => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transactions-export.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1>Export</h1>
          <p>Download your transaction history and category list for reporting or backup.</p>
        </div>
      </header>

      <section className="section-card" style={{ marginBottom: "24px" }}>
        <div className="grid-2">
          <div className="kpi-card">
            <h3>Transactions</h3>
            <p>{transactions.length}</p>
          </div>
          <div className="kpi-card">
            <h3>Categories</h3>
            <p>{categories.length}</p>
          </div>
        </div>
      </section>

      <section className="section-card">
        <h2>Export options</h2>
        <p style={{ marginBottom: "20px" }}>
          Download a CSV file with each transaction row. Custom categories are included in the data exports.
        </p>
        <button className="button-primary" onClick={handleExport}>
          Download CSV
        </button>
        <div className="notice" style={{ marginTop: "20px" }}>
          <strong>How to use</strong>
          <p>
            Open the CSV in a spreadsheet or import into another budgeting tool. The file contains date, type, category, receipt URL, and amount.
          </p>
        </div>
      </section>
    </div>
  );
}
