"use client";

import { useState } from "react";
import { useTransactionContext } from "../providers";

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useTransactionContext();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addCategory(name);
    setName("");
  };

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    updateCategory(editingId, editingName);
    setEditingId(null);
    setEditingName("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Create custom categories and assign them to transactions in the app.</p>
        </div>
      </header>

      <section className="section-card" style={{ marginBottom: "24px" }}>
        <form className="forms-grid" onSubmit={handleSubmit}>
          <div className="card">
            <h2>Add a category</h2>
            <div className="input-group">
              <label htmlFor="categoryName">Category name</label>
              <input
                id="categoryName"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Freelance"
              />
            </div>
            <button type="submit" className="button-primary" disabled={!name.trim()}>
              Save category
            </button>
          </div>
        </form>
      </section>

      <section className="section-card">
        <h2>Category list</h2>
        <div className="grid-2" style={{ marginTop: "20px" }}>
          {categories.map((category) => (
            <div key={category.id} className="kpi-card" style={{ display: "grid", gap: "12px", alignItems: "center" }}>
              {editingId === category.id ? (
                <>
                  <div className="input-group">
                    <label htmlFor={`edit-${category.id}`}>Edit name</label>
                    <input
                      id={`edit-${category.id}`}
                      type="text"
                      value={editingName}
                      onChange={(event) => setEditingName(event.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button className="button-primary" type="button" onClick={handleSaveEdit} disabled={!editingName.trim()}>
                      Save
                    </button>
                    <button className="button-secondary" type="button" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{category.name}</span>
                    <span className="badge" style={{ backgroundColor: category.color || "#f8fafc" }}>
                      {category.name.slice(0, 1).toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button className="button-secondary" type="button" onClick={() => handleStartEdit(category.id, category.name)}>
                      Edit
                    </button>
                    <button className="button-secondary" type="button" onClick={() => deleteCategory(category.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
