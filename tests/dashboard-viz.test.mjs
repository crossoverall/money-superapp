import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { createContext, Script } from 'node:vm';

function loadDashboardViz() {
  const code = readFileSync(resolve('js/engines/dashboard-viz.js'), 'utf8');
  const sandbox = {
    console,
    Math,
    document: {
      getElementById: () => null,
    },
    window: {},
  };
  sandbox.global = sandbox;
  sandbox.window = sandbox;
  const context = createContext(sandbox);
  new Script(code).runInContext(context);
  return sandbox.MoneyApp?.DashboardViz;
}

describe('MoneyApp.DashboardViz Engine Suite', () => {
  it('exports cleanly to MoneyApp namespace and exposes expected functions', () => {
    const viz = loadDashboardViz();
    assert.ok(viz, 'DashboardViz must be defined');
    assert.equal(typeof viz.buildSmoothSvgPath, 'function');
    assert.equal(typeof viz.calculateDonutSegments, 'function');
    assert.equal(typeof viz.generateFanChartGeometry, 'function');
    assert.equal(typeof viz.renderMonteCarloFanChart, 'function');
    assert.equal(typeof viz.calculateGrowthMetrics, 'function');
    assert.equal(typeof viz.renderHistoricalSvgChart, 'function');
  });

  describe('buildSmoothSvgPath', () => {
    it('handles empty and small point sequences', () => {
      const viz = loadDashboardViz();
      assert.equal(viz.buildSmoothSvgPath([]), '');
      assert.equal(viz.buildSmoothSvgPath(null), '');
      assert.equal(viz.buildSmoothSvgPath(undefined), '');
      assert.equal(viz.buildSmoothSvgPath([{ x: 10, y: 20 }]), 'M 10 20');
      assert.equal(
        viz.buildSmoothSvgPath([
          { x: 10, y: 20 },
          { x: 50, y: 60 },
        ]),
        'M 10 20 L 50 60',
      );
    });

    it('generates smooth cubic bezier path for 3+ points', () => {
      const viz = loadDashboardViz();
      const points = [
        { x: 10, y: 50 },
        { x: 30, y: 80 },
        { x: 60, y: 40 },
        { x: 90, y: 70 },
      ];
      const path = viz.buildSmoothSvgPath(points);
      assert.ok(path.startsWith('M 10 50 C'));
      assert.ok(path.includes(', 60 40'));
      assert.ok(path.includes(', 90 70'));
    });
  });

  describe('calculateDonutSegments', () => {
    it('returns empty segments when assets are zero or percentages all 0', () => {
      const viz = loadDashboardViz();
      const segs = viz.calculateDonutSegments(0, 0, 0, 60);
      assert.equal(segs.circumference.toFixed(2), '376.99');
      assert.equal(segs.cash.dasharray, '0 376.99');
      assert.equal(segs.cash.dashoffset, '0');
      assert.equal(segs.invest.dasharray, '0 376.99');
      assert.equal(segs.invest.dashoffset, '0');
      assert.equal(segs.gold.dasharray, '0 376.99');
      assert.equal(segs.gold.dashoffset, '0');
    });

    it('accurately calculates stroke-dasharray and sequential stroke-dashoffset for asset mix', () => {
      const viz = loadDashboardViz();
      // 20% Cash, 50% Investments, 30% Gold
      const segs = viz.calculateDonutSegments(20, 50, 30, 60);
      const C = 2 * Math.PI * 60;
      assert.equal(segs.circumference.toFixed(2), C.toFixed(2));

      // Cash: 20% of 376.99 ≈ 75.40
      assert.equal(segs.cash.dasharray, '75.40 301.59');
      assert.equal(segs.cash.dashoffset, '0');

      // Invest: 50% of 376.99 ≈ 188.50, offset = -75.40
      assert.equal(segs.invest.dasharray, '188.50 188.50');
      assert.equal(segs.invest.dashoffset, '-75.40');

      // Gold: 30% of 376.99 ≈ 113.10, offset = -(75.40 + 188.50) = -263.89
      assert.equal(segs.gold.dasharray, '113.10 263.89');
      assert.equal(segs.gold.dashoffset, '-263.89');
    });

    it('supports custom radius', () => {
      const viz = loadDashboardViz();
      const segs = viz.calculateDonutSegments(50, 50, 0, 100);
      const C = 2 * Math.PI * 100;
      assert.equal(segs.circumference.toFixed(2), C.toFixed(2));
      assert.equal(segs.cash.dashoffset, '0');
      assert.equal(segs.invest.dashoffset, `-${(C * 0.5).toFixed(2)}`);
    });
  });

  describe('generateFanChartGeometry and renderMonteCarloFanChart', () => {
    it('returns null for empty trajectory', () => {
      const viz = loadDashboardViz();
      assert.equal(viz.generateFanChartGeometry([]), null);
      assert.equal(viz.generateFanChartGeometry(null), null);
    });

    it('generates confidence fan polygon and median polyline coordinates', () => {
      const viz = loadDashboardViz();
      const trajectory = [
        { p10: 500000, p50: 600000, p90: 750000 },
        { p10: 600000, p50: 800000, p90: 1200000 },
        { p10: 700000, p50: 1000000, p90: 1800000 },
      ];
      const geom = viz.generateFanChartGeometry(trajectory, {
        width: 400,
        height: 130,
        padL: 35,
        padR: 15,
        padT: 15,
        padB: 25,
      });

      assert.ok(geom, 'Geometry should be returned');
      assert.equal(geom.width, 400);
      assert.equal(geom.height, 130);
      assert.equal(geom.n, 2);
      assert.equal(geom.maxVal, 1800000);
      assert.equal(geom.maxValLabel, '1.8M');
      assert.ok(geom.fanAreaPath.length > 0);
      assert.ok(geom.medianPath.length > 0);
      assert.ok(geom.svgHtml.includes('<polygon points='));
      assert.ok(geom.svgHtml.includes('<polyline points='));
      assert.ok(geom.svgHtml.includes('Yr 0'));
      assert.ok(geom.svgHtml.includes('Yr 2'));
    });

    it('formats values under 1M with k suffix', () => {
      const viz = loadDashboardViz();
      const trajectory = [
        { p10: 10000, p50: 20000, p90: 50000 },
        { p10: 20000, p50: 40000, p90: 90000 },
      ];
      const geom = viz.generateFanChartGeometry(trajectory);
      assert.equal(geom.maxValLabel, '90k');
    });

    it('renderMonteCarloFanChart sets innerHTML into target SVG', () => {
      const viz = loadDashboardViz();
      const mockSvg = { innerHTML: '' };
      const trajectory = [
        { p10: 10000, p50: 20000, p90: 50000 },
        { p10: 20000, p50: 40000, p90: 90000 },
      ];
      viz.renderMonteCarloFanChart(mockSvg, trajectory);
      assert.ok(mockSvg.innerHTML.includes('<polygon'));
      assert.ok(mockSvg.innerHTML.includes('<polyline'));
    });
  });

  describe('calculateGrowthMetrics', () => {
    it('returns zero defaults for empty snapshots', () => {
      const viz = loadDashboardViz();
      const res = viz.calculateGrowthMetrics([]);
      assert.equal(res.firstVal, 0);
      assert.equal(res.lastVal, 0);
      assert.equal(res.totalDelta, 0);
      assert.equal(res.totalPct, 0);
      assert.equal(res.momDelta, 0);
      assert.equal(res.momPct, 0);
      assert.equal(res.count, 0);
    });

    it('computes total growth and MoM growth metrics accurately', () => {
      const viz = loadDashboardViz();
      const snapshots = [
        { date: '2026-01-01', netWorth: 100000, savingsRate: 20, totalDebt: 50000, emergencyReserve: 60000 },
        { date: '2026-02-01', netWorth: 120000, savingsRate: 25, totalDebt: 45000, emergencyReserve: 70000 },
        { date: '2026-03-01', netWorth: 150000, savingsRate: 30, totalDebt: 40000, emergencyReserve: 90000 },
      ];

      const nwMetrics = viz.calculateGrowthMetrics(snapshots, 'networth');
      assert.equal(nwMetrics.firstVal, 100000);
      assert.equal(nwMetrics.lastVal, 150000);
      assert.equal(nwMetrics.totalDelta, 50000);
      assert.equal(nwMetrics.totalPct, 50);
      assert.equal(nwMetrics.momDelta, 30000);
      assert.equal(nwMetrics.momPct, 25);
      assert.equal(nwMetrics.count, 3);

      const debtMetrics = viz.calculateGrowthMetrics(snapshots, 'debt');
      assert.equal(debtMetrics.firstVal, 50000);
      assert.equal(debtMetrics.lastVal, 40000);
      assert.equal(debtMetrics.totalDelta, -10000);
      assert.equal(debtMetrics.totalPct, -20);
      assert.equal(debtMetrics.momDelta, -5000);

      const savingsMetrics = viz.calculateGrowthMetrics(snapshots, 'savings');
      assert.equal(savingsMetrics.firstVal, 20);
      assert.equal(savingsMetrics.lastVal, 30);
      assert.equal(savingsMetrics.totalDelta, 10);
      assert.equal(savingsMetrics.totalPct, 50);

      const emergMetrics = viz.calculateGrowthMetrics(snapshots, 'emergency');
      assert.equal(emergMetrics.firstVal, 60000);
      assert.equal(emergMetrics.lastVal, 90000);
      assert.equal(emergMetrics.totalDelta, 30000);
    });
  });

  describe('renderHistoricalSvgChart', () => {
    it('handles null svg element without error', () => {
      const viz = loadDashboardViz();
      assert.equal(viz.renderHistoricalSvgChart({ svg: null }), null);
    });

    it('renders empty message when snapshots array is empty', () => {
      const viz = loadDashboardViz();
      const mockSvg = { innerHTML: '' };
      const mockLegend = { innerHTML: 'existing' };
      let trajectoryCalledWith;

      const res = viz.renderHistoricalSvgChart({
        svg: mockSvg,
        legend: mockLegend,
        snapshots: [],
        chartMode: 'networth',
        isEn: true,
        updateTrajectoryUI: (metrics, mode, isCurrency) => {
          trajectoryCalledWith = { metrics, mode, isCurrency };
        },
      });

      assert.ok(mockSvg.innerHTML.includes('No snapshot data available yet'));
      assert.equal(mockLegend.innerHTML, '');
      assert.deepEqual(trajectoryCalledWith, { metrics: null, mode: 'networth', isCurrency: true });
      assert.equal(res.count, 0);
    });

    it('renders empty message in Thai when isEn is false', () => {
      const viz = loadDashboardViz();
      const mockSvg = { innerHTML: '' };
      viz.renderHistoricalSvgChart({
        svg: mockSvg,
        snapshots: [],
        isEn: false,
      });
      assert.ok(mockSvg.innerHTML.includes('ยังไม่มีข้อมูลประวัติสแนปช็อต'));
    });

    it('renders no-data message when all snapshot values are zero', () => {
      const viz = loadDashboardViz();
      const mockSvg = { innerHTML: '' };
      const mockLegend = { innerHTML: 'existing' };
      const snapshots = [
        { date: '2026-01-01', netWorth: 0 },
        { date: '2026-02-01', netWorth: 0 },
      ];

      const res = viz.renderHistoricalSvgChart({
        svg: mockSvg,
        legend: mockLegend,
        snapshots,
        chartMode: 'networth',
        isEn: true,
      });

      assert.ok(mockSvg.innerHTML.includes('No data to display'));
      assert.equal(mockLegend.innerHTML, '');
      assert.equal(res.count, 2);
    });

    it('renders complete SVG chart with spline, area, grid, dots and legend for networth', () => {
      const viz = loadDashboardViz();
      const mockSvg = { innerHTML: '', onmouseover: null, onmouseout: null };
      const mockLegend = { innerHTML: '' };
      let trajectoryMetrics = null;

      const snapshots = [
        { date: '2026-01-01', netWorth: 100000 },
        { date: '2026-02-01', netWorth: 125000 },
        { date: '2026-03-01', netWorth: 160000 },
      ];

      const res = viz.renderHistoricalSvgChart({
        svg: mockSvg,
        legend: mockLegend,
        snapshots,
        chartMode: 'networth',
        unit: 'บาท',
        isEn: false,
        updateTrajectoryUI: (metrics) => {
          trajectoryMetrics = metrics;
        },
      });

      assert.ok(res, 'Render result should be returned');
      assert.equal(res.points.length, 3);
      assert.equal(res.minVal, 100000);
      assert.equal(res.maxVal, 160000);

      // SVG markup verification
      assert.ok(mockSvg.innerHTML.includes('<linearGradient id="chartAreaGrad"'));
      assert.ok(mockSvg.innerHTML.includes('<path d="M'));
      assert.ok(mockSvg.innerHTML.includes('fill="url(#chartAreaGrad)"'));
      assert.ok(mockSvg.innerHTML.includes('<circle cx='));
      assert.ok(mockSvg.innerHTML.includes('class="cursor-pointer chart-dot"'));
      assert.ok(mockSvg.innerHTML.includes('data-date="2026-01-01"'));

      // Legend markup verification
      assert.ok(mockLegend.innerHTML.includes('ความมั่งคั่งสุทธิ (บาท)'));
      assert.ok(mockLegend.innerHTML.includes('ล่าสุด:'));

      // Event listener verification
      assert.equal(typeof mockSvg.onmouseover, 'function');
      assert.equal(typeof mockSvg.onmouseout, 'function');

      // Trajectory callback verification
      assert.ok(trajectoryMetrics);
      assert.equal(trajectoryMetrics.totalDelta, 60000);
    });

    it('renders percentage mode correctly for savings chartMode', () => {
      const viz = loadDashboardViz();
      const mockSvg = { innerHTML: '' };
      const mockLegend = { innerHTML: '' };
      let passedCurrency = null;

      const snapshots = [
        { date: '2026-01-01', savingsRate: 20 },
        { date: '2026-02-01', savingsRate: 35 },
      ];

      viz.renderHistoricalSvgChart({
        svg: mockSvg,
        legend: mockLegend,
        snapshots,
        chartMode: 'savings',
        isEn: true,
        updateTrajectoryUI: (_m, _mode, isCurrency) => {
          passedCurrency = isCurrency;
        },
      });

      assert.equal(passedCurrency, false);
      assert.ok(mockSvg.innerHTML.includes('stroke="#2F8B76"'));
      assert.ok(mockLegend.innerHTML.includes('Savings Rate (%)'));
      assert.ok(mockLegend.innerHTML.includes('Latest:'));
      assert.ok(mockLegend.innerHTML.includes('35%'));
    });

    it('attaches interactive tooltip hover events with closest delegation', () => {
      const viz = loadDashboardViz();
      const mockSvg = { innerHTML: '', onmouseover: null, onmouseout: null };
      let tooltipShown = null;
      let tooltipHidden = false;

      const snapshots = [
        { date: '2026-01-01', netWorth: 50000 },
        { date: '2026-02-01', netWorth: 80000 },
      ];

      viz.renderHistoricalSvgChart({
        svg: mockSvg,
        snapshots,
        chartMode: 'networth',
        showTooltip: (_e, date, val) => {
          tooltipShown = { date, val };
        },
        hideTooltip: () => {
          tooltipHidden = true;
        },
      });

      // Simulate mouseover on a dot
      const mockDot = {
        classList: ['chart-dot'],
        dataset: { date: '2026-02-01', val: '80,000 THB' },
        closest: (sel) => (sel === '.chart-dot' ? mockDot : null),
      };

      mockSvg.onmouseover({ target: mockDot });
      assert.deepEqual(tooltipShown, { date: '2026-02-01', val: '80,000 THB' });

      // Simulate mouseout on the dot
      mockSvg.onmouseout({ target: mockDot });
      assert.equal(tooltipHidden, true);
    });
  });
});
