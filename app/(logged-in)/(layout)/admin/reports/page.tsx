"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Download,
  BarChart3,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

// Types
interface SalesData {
  date?: string;
  week?: string;
  weekStart?: string;
  weekEnd?: string;
  revenue: number;
  orders: number;
  customers: number;
  avgOrderValue: number;
  growth?: number;
}

interface SummaryData {
  totalRevenue: number;
  totalOrders: number;
  uniqueCustomers: number;
  avgOrderValue: number;
  growth?: {
    revenue: number;
    orders: number;
    customers: number;
    avgOrder: number;
  };
}

export default function SalesReports() {
  const [reportType, setReportType] = useState<"daily" | "weekly">("daily");
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalRevenue: 0,
    totalOrders: 0,
    uniqueCustomers: 0,
    avgOrderValue: 0,
  });

  // Fetch sales data from API
  const fetchSalesData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/admin/sales?type=${reportType}&days=30`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sales data");
      }

      const result = await response.json();

      if (result.success) {
        setSalesData(result.data.salesData);
        setSummaryData(result.data.summary);
      } else {
        throw new Error(result.error || "Failed to fetch sales data");
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
      toast.error("Failed to fetch sales data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch summary data with growth comparison
  const fetchSummaryData = async () => {
    try {
      const response = await fetch("/api/admin/sales/summary?period=30");

      if (!response.ok) {
        throw new Error("Failed to fetch summary data");
      }

      const result = await response.json();

      if (result.success) {
        setSummaryData(result.data);
      }
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  // Load data on component mount and when report type changes
  useEffect(() => {
    fetchSalesData();
  }, [reportType]);

  useEffect(() => {
    fetchSummaryData();
  }, []);

  // Generate PDF report
  const generatePDFReport = async () => {
    try {
      setIsExporting(true);

      // Calculate date range (last 30 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      // Fetch export data
      const response = await fetch("/api/admin/sales/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: reportType,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate export data");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to generate export data");
      }

      const { summary, reportData } = result.data;
      const reportTitle =
        reportType === "daily" ? "Daily Sales Report" : "Weekly Sales Report";

      // Generate HTML content for PDF
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${reportTitle} - Restaurant Management</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #ea580c;
            padding-bottom: 20px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #ea580c;
            margin-bottom: 10px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 30px 0;
        }
        .summary-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e5e7eb;
        }
        .summary-value {
            font-size: 24px;
            font-weight: bold;
            color: #ea580c;
            margin-bottom: 5px;
        }
        .summary-label {
            font-size: 14px;
            color: #666;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .table th,
        .table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        .table th {
            background: #ea580c;
            color: white;
            font-weight: bold;
        }
        .table tr:nth-child(even) {
            background: #f9f9f9;
        }
        .section {
            margin: 40px 0;
        }
        .section h2 {
            color: #ea580c;
            border-bottom: 1px solid #ea580c;
            padding-bottom: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🍽️ RESTAURANT MANAGEMENT</div>
        <h1>${reportTitle}</h1>
        <p>Generated on ${format(new Date(), "MMMM dd, yyyy 'at' HH:mm")}</p>
    </div>

    <div class="summary">
        <div class="summary-card">
            <div class="summary-value">Rp ${summary.totalRevenue.toLocaleString(
              "id-ID"
            )}</div>
            <div class="summary-label">Total Revenue</div>
        </div>
        <div class="summary-card">
            <div class="summary-value">${summary.totalOrders}</div>
            <div class="summary-label">Total Orders</div>
        </div>
        <div class="summary-card">
            <div class="summary-value">${summary.uniqueCustomers}</div>
            <div class="summary-label">Unique Customers</div>
        </div>
        <div class="summary-card">
            <div class="summary-value">Rp ${summary.avgOrderValue.toLocaleString(
              "id-ID"
            )}</div>
            <div class="summary-label">Avg Order Value</div>
        </div>
    </div>

    <div class="section">
        <h2>${reportType === "daily" ? "Daily" : "Weekly"} Sales Breakdown</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>${reportType === "daily" ? "Date" : "Week"}</th>
                    <th>Revenue</th>
                    <th>Orders</th>
                    <th>Customers</th>
                    <th>Avg Order Value</th>
                    ${reportType === "weekly" ? "<th>Growth %</th>" : ""}
                </tr>
            </thead>
            <tbody>
                ${reportData
                  .map(
                    (item: SalesData) => `
                    <tr>
                        <td>${
                          reportType === "daily" && item.date
                            ? format(new Date(item.date), "MMM dd, yyyy")
                            : item.week || "N/A"
                        }</td>
                        <td>Rp ${item.revenue.toLocaleString("id-ID")}</td>
                        <td>${item.orders}</td>
                        <td>${item.customers}</td>
                        <td>Rp ${item.avgOrderValue.toLocaleString(
                          "id-ID"
                        )}</td>
                        ${
                          reportType === "weekly"
                            ? `<td>${(item.growth || 0) > 0 ? "+" : ""}${(
                                item.growth || 0
                              ).toFixed(1)}%</td>`
                            : ""
                        }
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>This report was automatically generated by Restaurant Management System</p>
        <p>For questions or support, contact: admin@restaurant.com</p>
    </div>
</body>
</html>
      `;

      // Create and download the report
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportType}-sales-report-${format(
        new Date(),
        "yyyy-MM-dd"
      )}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Report exported successfully!");
    } catch (error) {
      console.error("Error generating PDF report:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsExporting(false);
    }
  };

  const refreshData = async () => {
    await Promise.all([fetchSalesData(), fetchSummaryData()]);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-3 w-3 inline mr-1" />
    ) : (
      <TrendingDown className="h-3 w-3 inline mr-1" />
    );
  };

  const formatGrowth = (growth: number) => {
    return `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}% from last period`;
  };

  // Type-safe handler for report type change
  const handleReportTypeChange = (value: string) => {
    if (value === "daily" || value === "weekly") {
      setReportType(value);
    }
  };

  // Type-safe handler for tabs change
  const handleTabsChange = (value: string) => {
    if (value === "daily" || value === "weekly") {
      setReportType(value);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Sales Reports</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={reportType} onValueChange={handleReportTypeChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={generatePDFReport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {summaryData.totalRevenue.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground">
              {summaryData.growth && (
                <>
                  {getGrowthIcon(summaryData.growth.revenue)}
                  {formatGrowth(summaryData.growth.revenue)}
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {summaryData.growth && (
                <>
                  {getGrowthIcon(summaryData.growth.orders)}
                  {formatGrowth(summaryData.growth.orders)}
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryData.uniqueCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              {summaryData.growth && (
                <>
                  {getGrowthIcon(summaryData.growth.customers)}
                  {formatGrowth(summaryData.growth.customers)}
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Order Value
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {summaryData.avgOrderValue.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground">
              {summaryData.growth && (
                <>
                  {getGrowthIcon(summaryData.growth.avgOrder)}
                  {formatGrowth(summaryData.growth.avgOrder)}
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs
        value={reportType}
        onValueChange={handleTabsChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily">Daily Reports</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          {/* Daily Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Sales Trend (Last 14 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData.slice(-14)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      try {
                        return value ? format(new Date(value), "MMM dd") : "";
                      } catch {
                        return "";
                      }
                    }}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#ea580c"
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#fb923c"
                    strokeWidth={2}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Sales Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Sales Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-right p-2">Revenue</th>
                      <th className="text-right p-2">Orders</th>
                      <th className="text-right p-2">Customers</th>
                      <th className="text-right p-2">Avg Order Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.slice(-10).map((day) => (
                      <tr
                        key={day.date || day.week || Math.random()}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-2">
                          {day.date
                            ? format(new Date(day.date), "MMM dd, yyyy")
                            : "N/A"}
                        </td>
                        <td className="text-right p-2 font-medium">
                          Rp {day.revenue.toLocaleString("id-ID")}
                        </td>
                        <td className="text-right p-2">{day.orders}</td>
                        <td className="text-right p-2">{day.customers}</td>
                        <td className="text-right p-2">
                          Rp {day.avgOrderValue.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          {/* Weekly Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Sales Trend (Last 8 Weeks)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData.slice(-8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Bar dataKey="revenue" fill="#ea580c" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Sales Table */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Sales Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Week</th>
                      <th className="text-right p-2">Revenue</th>
                      <th className="text-right p-2">Orders</th>
                      <th className="text-right p-2">Customers</th>
                      <th className="text-right p-2">Avg Order Value</th>
                      <th className="text-right p-2">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.slice(-8).map((week) => (
                      <tr
                        key={week.weekStart || week.week || Math.random()}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-2">{week.week}</td>
                        <td className="text-right p-2 font-medium">
                          Rp {week.revenue.toLocaleString("id-ID")}
                        </td>
                        <td className="text-right p-2">{week.orders}</td>
                        <td className="text-right p-2">{week.customers}</td>
                        <td className="text-right p-2">
                          Rp {week.avgOrderValue.toLocaleString("id-ID")}
                        </td>
                        <td className="text-right p-2">
                          <Badge
                            className={
                              (week.growth || 0) >= 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {(week.growth || 0) >= 0 ? "+" : ""}
                            {(week.growth || 0).toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
