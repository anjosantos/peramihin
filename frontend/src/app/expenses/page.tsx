"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getExpenses } from "@/api";

type Expense = {
  expenseId: string;
  date: string;
  subtotal: number;
  totalAmount: number;
  userId: string;
  taxes?: Record<string, any>;
  items?: { name: string; price: number }[];
};

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses();
        // Expecting data.Items as the array of expenses
        if (data && Array.isArray(data.Items)) {
          setExpenses(data.Items);
        } else {
          setExpenses([]);
        }
      } catch (err: any) {
        setError("Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-indigo-900 font-bold">Expenses</h1>
        <div>
          <button
            className="bg-gray-800 hover:bg-gray-600 hover:cursor-pointer mr-2 text-white font-semibold py-2 px-4 rounded shadow"
            onClick={() => router.push("/expenses/upload")}
          >
            Upload
          </button>
          <button
            className="bg-gray-800 hover:bg-gray-600 hover:cursor-pointer text-white font-semibold py-2 px-4 rounded shadow"
            onClick={() => router.push("/expenses/create")}
          >
            Create Expense
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center text-indigo-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-indigo-200 rounded-lg">
            <thead>
              <tr className="bg-indigo-900">
                <th className="px-4 py-2 border-b text-left">Date</th>
                <th className="px-4 py-2 border-b text-left">Expense ID</th>
                <th className="px-4 py-2 border-b text-left">Subtotal</th>
                <th className="px-4 py-2 border-b text-left">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-indigo-500">
                    No expenses found.
                  </td>
                </tr>
              ) : (
                expenses.map(expense => (
                  <tr
                    key={expense.expenseId}
                    className="hover:bg-indigo-200 hover:cursor-pointer text-gray-600"
                    onClick={() =>
                      router.push(`/expenses/${expense.expenseId}`)
                    }
                  >
                    <td className="px-4 py-2 border-b">{expense.date}</td>
                    <td className="px-4 py-2 border-b">{expense.expenseId}</td>
                    <td className="px-4 py-2 border-b">
                      ${expense.subtotal?.toFixed(2) ?? "-"}
                    </td>
                    <td className="px-4 py-2 border-b">
                      ${expense.totalAmount?.toFixed(2) ?? "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
