"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createExpense } from "@/api";

const CreateExpensePage = () => {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [totalAmount, setTotalAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const expense = {
        date,
        totalAmount: parseFloat(totalAmount),
      };
      await createExpense(expense as any);
      router.push("/expenses");
    } catch (err) {
      setError("Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-indigo-900 font-bold">Create Expense</h1>
        <button
          className="self-start hover:text-indigo-500 hover:cursor-pointer text-indigo-900 font-semibold py-2 px-4"
          onClick={() => router.back()}
        >
          &larr; Back
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 border border-indigo-200"
      >
        <div className="mb-4">
          <label className="block text-indigo-900 font-semibold mb-2">
            Date
          </label>
          <input
            type="text"
            className="w-full border text-indigo-900 border-indigo-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div className="mb-6">
          <label className="block text-indigo-900 font-semibold mb-2">
            Total Amount
          </label>
          <input
            type="number"
            className="w-full border text-indigo-900 border-indigo-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={totalAmount}
            onChange={e => setTotalAmount(e.target.value)}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-indigo-800 hover:bg-indigo-900 text-white font-semibold py-2 px-4 rounded shadow"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Expense"}
        </button>
      </form>
    </div>
  );
};

export default CreateExpensePage;
