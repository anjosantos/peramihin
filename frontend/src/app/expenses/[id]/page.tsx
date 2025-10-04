"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getExpense, deleteExpense, updateExpense } from "@/api";

type Expense = {
  expenseId: string;
  date: string;
  subtotal: number;
  totalAmount: number;
  userId: string;
  taxes?: Record<string, any>;
  items?: { name: string; price: number }[];
  fileUrl?: string;
};

const ExpenseDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Editable fields
  const [editDate, setEditDate] = useState("");
  const [editTotalAmount, setEditTotalAmount] = useState("");

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        if (!id || typeof id !== "string") {
          setError("Invalid expense ID");
          setLoading(false);
          return;
        }
        const data = await getExpense(id);
        if (data && data.Item) {
          setExpense(data.Item);
          setEditDate(data.Item.date || "");
          setEditTotalAmount(
            typeof data.Item.totalAmount === "number"
              ? data.Item.totalAmount.toString()
              : ""
          );
        } else {
          setExpense(null);
        }
      } catch (err: any) {
        setError("Failed to load expense");
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id]);

  // Delete handler with confirmation
  const handleDelete = async () => {
    if (!expense) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );
    if (!confirmed) return;
    try {
      await deleteExpense(expense.expenseId);
      router.push("/expenses");
    } catch (err) {
      alert("Failed to delete expense.");
    }
  };

  // Update handler
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense) return;
    setUpdateError(null);
    setUpdating(true);
    try {
      // Remove id field if present, and ensure correct Expense shape
      const { id, ...rest } = expense as any;
      const updated = {
        ...rest,
        date: editDate,
        totalAmount: parseFloat(editTotalAmount),
      };
      await updateExpense(expense.expenseId, updated);
      setExpense(updated as Expense);
    } catch (err) {
      setUpdateError("Failed to update expense.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 text-indigo-900">
      <div className="mb-6 flex items-center justify-between">
        <button
          className="hover:text-indigo-500 hover:cursor-pointer text-indigo-900 font-semibold py-2 px-4"
          onClick={() => router.back()}
        >
          &larr; Back
        </button>
        <button
          className="bg-red-700 hover:bg-red-600 hover:cursor-pointer text-white font-semibold py-2 px-4 rounded shadow"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
      {loading ? (
        <div className="text-center text-indigo-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : !expense ? (
        <div className="text-center text-indigo-500">Expense not found.</div>
      ) : (
        <div className="w-full max-w-xl mx-auto">
          {expense.fileUrl && (
            <div className="mb-6">
              <img
                src={`https://peramihin-receipts-bucket.s3.us-east-2.amazonaws.com/${expense.fileUrl}`}
                alt="Expense Attachment"
                className="w-full rounded shadow border border-indigo-200 object-contain"
                style={{ display: "block" }}
              />
            </div>
          )}
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-lg shadow p-6 border border-indigo-200 text-indigo-900"
          >
            <div className="mb-4">
              <span className="font-semibold text-indigo-900">Expense ID:</span>{" "}
              {expense.expenseId}
            </div>
            <div className="mb-4">
              <label className="font-semibold text-indigo-900 block mb-1">
                Date:
              </label>
              <input
                type="text"
                className="w-full border border-indigo-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-indigo-900 placeholder:text-indigo-300"
                value={editDate}
                onChange={e => setEditDate(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="font-semibold text-indigo-900 block mb-1">
                Total Amount:
              </label>
              <input
                type="number"
                className="w-full border border-indigo-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-indigo-900 placeholder:text-indigo-300"
                value={editTotalAmount}
                onChange={e => setEditTotalAmount(e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="mb-4">
              <span className="font-semibold text-indigo-900">Subtotal:</span> $
              {expense.subtotal?.toFixed(2) ?? "-"}
            </div>
            {expense.items && expense.items.length > 0 && (
              <div className="mb-4">
                <span className="font-semibold text-indigo-900">Items:</span>
                <ul className="list-disc list-inside mt-2">
                  {expense.items.map((item, idx) => (
                    <li key={idx} className="ml-4 text-indigo-900">
                      {item.name}: ${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {expense.taxes && (
              <div className="mb-4">
                <span className="font-semibold text-indigo-900">Taxes:</span>
                <pre className="bg-indigo-50 rounded p-2 mt-2 text-sm text-indigo-900 overflow-x-auto">
                  {JSON.stringify(expense.taxes, null, 2)}
                </pre>
              </div>
            )}
            {updateError && (
              <div className="text-red-500 mb-4 text-center">{updateError}</div>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-800 hover:bg-indigo-900 text-white font-semibold py-2 px-4 rounded shadow mt-4"
              disabled={updating}
            >
              {updating ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ExpenseDetailPage;
