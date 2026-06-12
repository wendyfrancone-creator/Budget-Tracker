"use client";

import Link from "next/link";
import { useTransactionContext } from "./providers";
import { formatCurrency, formatDate, monthLabel, sortDescending } from "@/lib/utils";
import { Charts } from "@/components/Charts";

export default function DashboardPage() {
  const { transactions, categories, balance } = useTransactionContext();
  const sortedTransactions = sortDescending(transactions).slice(0, 6);
  const incomeTotal = transactions.filter((transaction) => transaction.type === "income").reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenseTotal = transactions.filter((transaction) => transaction.type === "expense").reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div>
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Live analytics for income, expense, categories and chart updates.</p>
        </div>
        <Link href="/transactions" className="button-primary">
          Add transaction
        </Link>
      </header>

      <section className="grid-4" style={{ marginBottom: "24px" }}>
        <div className="kpi-card">
          <h3>Current balance</h3>
          <p>{formatCurrency(balance)}</p>
        </div>
        <div className="kpi-card">
          <h3>Total income</h3>
          <p>{formatCurrency(incomeTotal)}</p>
        </div>
        <div className="kpi-card">
          <h3>Total expenses</h3>
          <p>{formatCurrency(expenseTotal)}</p>
        </div>
        <div className="kpi-card">
          <h3>Categories</h3>
          <p>{categories.length}</p>
        </div>
      </section>

      <section className="section-card" style={{ marginBottom: "24px" }}>
        <Charts transactions={transactions} categories={categories} />
      </section>

      <section className="section-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2>Recent transactions</h2>
            <p>Live updates appear here immediately after any change.</p>
          </div>
          <Link href="/categories" className="button-secondary">
            Manage categories
          </Link>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.category}</td>
                  <td>{formatCurrency(transaction.amount)}</td>
                  <td>
                    <span className={`badge ${transaction.type === "income" ? "status-income" : "status-expense"}`}>
                      {transaction.type}
                    </span>
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
