import React, { useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import mockData from './data/mock_company_cash_flow.json';

const CashFlowChart = () => {
  // Extract month and cash flow data for each series
  const months = mockData.monthly_cash_flow.map((item) => item.month);
  const inflows = mockData.monthly_cash_flow.map((item) => item.inflow);
  const outflows = mockData.monthly_cash_flow.map((item) => item.outflow);
  const netCashFlows = mockData.monthly_cash_flow.map((item) => item.net_cash_flow);
  const comingOutflows = mockData.monthly_cash_flow.map((item) => item.going_outflow);
  const comingInflows = mockData.monthly_cash_flow.map((item) => item.coming_inflow);

  // Calculate actual new cash flow
  const actualNetCashFlows = netCashFlows.map((netCashFlow, index) => {
    return netCashFlow + comingInflows[index] - comingOutflows[index];
  });

  // Calculate cumulative actual cash flow over the year
  let cumulativeActualCashFlow = 0;
  const cumulativeActualCashFlows: number[] = [];

  actualNetCashFlows.forEach((value) => {
    cumulativeActualCashFlow += value;
    cumulativeActualCashFlows.push(cumulativeActualCashFlow);
  });


  let inCashFlowTotal = 0;
  const inCashFlowTotalArr: number[] = [];

  inflows.forEach((value) => {
    inCashFlowTotal += value;
    inCashFlowTotalArr.push(inCashFlowTotal);
  });

  let outCashFlowTotal = 0;
  const outCashFlowTotalArr: number[] = [];

  outflows.forEach((value) => {
    outCashFlowTotal += value;
    outCashFlowTotalArr.push(outCashFlowTotal);
  });

  // Set up state to track the selected month
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Click handler for surrounding div
  const handleChartClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const boundingRect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - boundingRect.left;

    // Calculate index based on click position (approximate for demonstration)
    const barIndex = Math.floor((clickX / boundingRect.width) * months.length);

    if (barIndex >= 0 && barIndex < months.length) {
      setSelectedMonth(months[barIndex]);
    }
  };

  return (
    <div>
      <h1>Kassavirta</h1>
      {/* Link to go back to the year view */}
      {selectedMonth && (
        <button onClick={() => setSelectedMonth(null)}>Takaisin</button>
      )}

      {/* Monthly Bar Chart */}
      {!selectedMonth ? (
        <div onClick={handleChartClick} style={{ width: 1200, height: 600, cursor: 'pointer', padding: '20px 40px' }}>
          <BarChart
            width={1200}
            height={600}
            xAxis={[
              { data: months, scaleType: 'band' },
            ]}
            margin={{ left: 100 }}
            series={[
              { data: inCashFlowTotalArr, label: 'Tulot', color: 'green', stack: 'inflowStack' },
              { data: comingInflows, label: 'Tulevat Tulot', color: 'lightgreen', stack: 'inflowStack' },
              { data: outCashFlowTotalArr, label: 'Menot', color: 'red', stack: 'outflowStack' },
              { data: comingOutflows, label: 'Tulevat menot', color: 'pink', stack: 'outflowStack' },
              { data: actualNetCashFlows, label: 'Netto', color: 'blue', stack: 'netflowStack' },
            ]}
          />
        </div>
      ) : (
        // Display specific month data
        <BarChart
        width={600}
        height={600}
        xAxis={[
          { data: [selectedMonth], scaleType: 'band' },
        ]}
        series={[
          { data: [inflows[months.indexOf(selectedMonth)]], label: 'Tulot', color: 'green', stack: 'inflowStack' },
          { data: [comingInflows[months.indexOf(selectedMonth)]], label: 'Tulevat Tulot', color: 'lightgreen', stack: 'inflowStack' },
          { data: [outflows[months.indexOf(selectedMonth)]], label: 'Menot', color: 'red', stack: 'outflowStack' },
          { data: [comingOutflows[months.indexOf(selectedMonth)]], label: 'Tulevat Menot', color: 'pink', stack: 'outflowStack' },
          { data: [actualNetCashFlows[months.indexOf(selectedMonth)]], label: 'Netto', color: 'blue' },
        ]}
      />
      )}
    </div>
  );
};

export default CashFlowChart;