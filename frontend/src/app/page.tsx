"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import * as d3 from "d3";
import { useRouter } from "next/navigation";

import { useAuth } from "react-oidc-context";
import { getExpenses } from "@/api";

export default function Home() {
  const auth = useAuth();
  const router = useRouter();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const d3Ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const expenses = await getExpenses();
      console.log(expenses);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push("/login");
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  useEffect(() => {
    let chartInstance: Chart | null = null;
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [
              {
                label: "Votes",
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      }
    }
    if (d3Ref.current) {
      const svg = d3.select(d3Ref.current);
      svg.selectAll("*").remove();
      const data: number[] = [10, 15, 30, 40, 20];
      const width = 300;
      const height = 100;
      const barWidth = width / data.length;
      svg.attr("width", width).attr("height", height);
      svg
        .selectAll<SVGRectElement, number>("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (_d: number, i: number) => i * barWidth)
        .attr("y", (d: number) => height - d * 2)
        .attr("width", barWidth - 5)
        .attr("height", (d: number) => d * 2)
        .attr("fill", "#6366f1");
    }
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full text-black px-4 gap-8">
      <button
        className="w-full max-w-md px-6 py-3 bg-indigo-700 hover:bg-indigo-600 hover:cursor-pointer font-bold text-white rounded-lg shadow transition"
        onClick={() => router.push("/expenses/upload")}
      >
        Upload
      </button>

      {/* Chart.js Example */}
      <div className="w-full max-w-md bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <h2 className="font-bold mb-2">Chart.js Bar Chart</h2>
        <canvas ref={chartRef} width={300} height={200}></canvas>
      </div>

      {/* D3.js Example */}
      <div className="w-full max-w-md bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <h2 className="font-bold mb-2">D3.js Bar Chart</h2>
        <svg ref={d3Ref}></svg>
      </div>
    </div>
  );
}
