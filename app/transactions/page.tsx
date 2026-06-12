"use client";

import { useMemo, useState } from "react";
import { useTransactionContext } from "../providers";
import { formatCurrency, formatDate, monthKey, monthLabel, sortDescending } from "@/lib/utils";
import { Transaction } from "@/lib/types";

const today = new Date().toISOString().slice(0, 10);

export default function TransactionsPage() {
  const { transactions, categories, addTransaction, updateTransaction, deleteTransaction, balance } = useTransactionContext();
  const [filterMonth, setFilterMonth] = useState("all");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formState, setFormState] = useState({ amount: "", type: "expense", category: categories[0]?.name ?? "Extras", date: today, receiptUrl: "", receiptNote: "" });

  const monthOptions = useMemo(() => {
    const months = Array.from(new Set(transactions.map((transaction) => monthKey(transaction.date))));
    return months.sort().map((value) => ({ value, label: monthLabel(value + "-01") }));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (filterMonth === "all") return sortDescending(transactions);
    return sortDescending(transactions.filter((transaction) => monthKey(transaction.date) === filterMonth));
  }, [transactions, filterMonth]);

  const totalIncome = filteredTransactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = filteredTransactions.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);

  const resetForm = () => {
    setFormState({ amount: "", type: "expense", category: categories[0]?.name ?? "Extras", date: today, receiptUrl: "", receiptNote: "" });
    setIsEditing(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(formState.amount);
    if (!amount || !formState.category || !formState.date) return;

    const payload = {
      amount,
      category: formState.category,
      date: formState.date,
      type: formState.type as Transaction["type"],
      receiptUrl: formState.receiptUrl.trim() || undefined,
      receiptNote: formState.receiptNote.trim() || undefined
    };

    if (isEditing) {
      updateTransaction({ id: isEditing, ...payload });
    } else {
      addTransaction(payload);
    }

    resetForm();
  };

  const handleEdit = (transaction: Transaction) => {
    setIsEditing(transaction.id);
    setFormState({
      amount: String(transaction.amount),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      receiptUrl: transaction.receiptUrl ?? "",
      receiptNote: transaction.receiptNote ?? ""
    });
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>Log income and expense activity, edit entries, delete records, and filter by month.</p>
        </div>
      </header>

      <section className="section-card" style={{ marginBottom: "24px" }}>
        <div className="grid-2" style={{ gap: "20px" }}>
          <div className="kpi-card">
            <h3>Balance</h3>
            <p>{formatCurrency(balance)}</p>
          </div>
          <div className="kpi-card">
            <h3>Showing</h3>
            <p>{filterMonth === "all" ? "All months" : monthLabel(filterMonth + "-01")}</p>
          </div>
        </div>
      </section>

      <section className="section-card" style={{ marginBottom: "24px" }}>
        <div className="forms-grid">
          <form className="card" onSubmit={handleSubmit}>
            <h2>{isEditing ? "Edit transaction" : "Add transaction"}</h2>
            <div className="input-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                value={formState.type}
                onChange={(event) => setFormState((state) => ({ ...state, type: event.target.value }))}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                min="0"
                step="1"
                value={formState.amount}
                onChange={(event) => setFormState((state) => ({ ...state, amount: event.target.value }))}
                placeholder="e.g. 250"
              />
            </div>
            <div className="input-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={formState.category}
                onChange={(event) => setFormState((state) => ({ ...state, category: event.target.value }))}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={formState.date}
                onChange={(event) => setFormState((state) => ({ ...state, date: event.target.value }))}
              />
            </div>
            <div className="input-group">
              <label htmlFor="receiptUrl">Receipt link</label>
              <input
                id="receiptUrl"
                type="url"
                value={formState.receiptUrl}
                onChange={(event) => setFormState((state) => ({ ...state, receiptUrl: event.target.value }))}
                placeholder="https://example.com/receipt"
              />
            </div>
            <div className="input-group">
              <label htmlFor="receiptNote">Receipt note</label>
              <input
                id="receiptNote"
                type="text"
                value={formState.receiptNote}
                onChange={(event) => setFormState((state) => ({ ...state, receiptNote: event.target.value }))}
                placeholder="Add a note about this receipt"
              />
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button type="submit" className="button-primary">
                {isEditing ? "Update transaction" : "Save transaction"}
              </button>
              {isEditing ? (
                <button type="button" className="button-secondary" onClick={resetForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div className="card">
            <div className="input-group">
              <label htmlFor="filterMonth">Filter by month</label>
              <select id="filterMonth" value={filterMonth} onChange={(event) => setFilterMonth(event.target.value)}>
                <option value="all">All months</option>
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="notice" style={{ marginTop: "20px" }}>
              <strong>Totals</strong>
              <p>
                {formatCurrency(totalIncome)} income and {formatCurrency(totalExpense)} expense across selected month.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <h2>Transactions</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Receipt</th>
                <th>Receipt note</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.category}</td>
                  <td>
                    {transaction.receiptUrl ? (
                      <a href={transaction.receiptUrl} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
                        Receipt
                      </a>
                    ) : (
                      <span style={{ color: "#64748b" }}>None</span>
                    )}
                  </td>
                  <td>{transaction.receiptNote ?? ""}</td>
                  <td>{formatCurrency(transaction.amount)}</td>
                  <td>
                    <span className={`badge ${transaction.type === "income" ? "status-income" : "status-expense"}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: "10px" }}>
                    <button className="button-secondary" type="button" onClick={() => handleEdit(transaction)}>
                      Edit
                    </button>
                    <button className="button-secondary" type="button" onClick={() => deleteTransaction(transaction.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
