// import UploadForm from '../components/UploadForm'
// import '../styles/Dashboard.css'
// import Sidebar from '../components/Sidebar'

// export default function Dashboard() {
//   return (
//     <div className="dashboard">
//       <Sidebar />
//       <div className="dashboard-content">
//         <h1>Welcome to your Dashboard</h1>
//         <UploadForm />
//       </div>
//     </div>
//   )
// }
import UploadForm from '../components/UploadForm'
import '../styles/Dashboard.css'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/Layout'

import React, { useEffect, useState } from 'react';


import "../styles/Dashboard.css";

// Modal for PDF preview
function PdfReportModal({ show, onClose }) {
  if (!show) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content pdf-modal" onClick={e => e.stopPropagation()}>
        <h2>Task Report (PDF Preview)</h2>
        <iframe
          src="public/reports/report.pdf"
          title="PDF Report"
          style={{ width: "100%", height: "400px", border: 0 }}
        />
        <button className="modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// Modal for day summary
function SummaryModal({ show, onClose, summary, dayIndex, presentDayIndex }) {
  if (!show) return null;
  const curr = summary.daySplits[dayIndex];
  // Only sum actuals up to selected day or present day, whichever is less (never beyond present)
  const completedToDay = summary.daySplits
    .slice(0, Math.min(dayIndex + 1, presentDayIndex + 1))
    .reduce((sum, d) => sum + (d.actual ?? 0), 0);
  const percentToDay = Math.round(
    (completedToDay / summary.totalTarget) * 100
  );

  // For present day, show next estimation for coming days
  let nextEstimationBlock = null;
  if (dayIndex === presentDayIndex && dayIndex < summary.daySplits.length - 1) {
    nextEstimationBlock = (
      <div style={{ margin: "12px 0" }}>
        <b>Estimation for Remaining Days:</b>
        <ul>
          {summary.daySplits.slice(dayIndex + 1).map((d, idx) => (
            <li key={d.day}>
              {d.day} ({d.date}): Planned Target: {d.target}
              {idx === 0 && (
                <span style={{ color: "#666" }}> (includes today's carry over)</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content summary-modal" onClick={e => e.stopPropagation()}>
        <h2>
          Day Summary - {curr.day} ({curr.date})
        </h2>
        <div>
          <div>
            <b>Total Target:</b> {summary.totalTarget} units
          </div>
          <div>
            <b>Task Completion:</b> {completedToDay} / {summary.totalTarget} ({percentToDay}%)
          </div>
        </div>
        <hr />
        <div>
          <b>Daily Breakdown:</b>
        </div>
        <ul>
          {summary.daySplits.map((d, i) => {
            // Past days: show actual and delay reason
            if (i < presentDayIndex) {
              return (
                <li key={i} style={i === dayIndex ? { fontWeight: "bold" } : {}}>
                  {d.day} ({d.date}): Target: {d.target} | Actual: {d.actual} | Carry Over: {d.carryOver}
                  {d.delayReason && (
                    <div style={{ color: "#b00", marginLeft: 10 }}>
                      <i>Delay Reason: {d.delayReason}</i>
                    </div>
                  )}
                </li>
              );
            }
            // Present day: show actual, carry over, and any delay
            if (i === presentDayIndex) {
              return (
                <li key={i} style={{ fontWeight: "bold" }}>
                  {d.day} ({d.date}): Planned Target: {d.target} | Actual: {d.actual} | Carry Over: {d.carryOver}
                  {d.delayReason && (
                    <div style={{ color: "#b00", marginLeft: 10 }}>
                      <i>Delay Reason: {d.delayReason}</i>
                    </div>
                  )}
                </li>
              );
            }
            // Future day: only show planned target and carry over
            return (
              <li key={i}>
                {d.day} ({d.date}): Planned Target: {d.target} | Carry Over: {d.carryOver} (planned)
              </li>
            );
          })}
        </ul>
        {nextEstimationBlock}
        <div>
          <b>Delay Reason for this day:</b>
        </div>
        <div style={{ color: curr.delayReason ? "#b00" : "#111" }}>
          {curr.delayReason ? curr.delayReason : "No delay reported"}
        </div>
        <button className="modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// Get week dates and names
function getWeek(startDateStr) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const startDate = new Date(startDateStr);
  return days.map((day, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return {
      day,
      date: d.toISOString().slice(0, 10),
    };
  });
}

export default function Dashboard() {
  const weekStart = "2025-07-21";
  const mainTask = {
    taskNumber: "CAT-100",
    instruction: "Install foundation",
    totalTarget: 40,
  };

  // ----- Set present day (0=Monday, 1=Tuesday, ...)
  const presentDayIndex = 1; // e.g., Tuesday

  // Only up to present day will have actuals/delays; future days are undefined
  const [dailyActuals] = useState([6, 8, undefined, undefined, undefined]);
  const dummyReasons = [
    "Heavy rain caused delay.",
    "",
    "",
    "",
    "",
  ];

  const [pdfModalDay, setPdfModalDay] = useState(null);
  const [summaryModalDay, setSummaryModalDay] = useState(null);

  const week = getWeek(weekStart);
  let remaining = mainTask.totalTarget;
  let remainingDays = 5;
  let prevCarryOver = 0;
  let daySplits = [];

  for (let i = 0; i < 5; i++) {
    // Only use actuals if day is <= present day
    let actual = i <= presentDayIndex ? (dailyActuals[i] ?? 0) : undefined;
    let target = Math.round((remaining / remainingDays) * 10) / 10;
    let carry = actual !== undefined ? Math.max(0, target - actual) : undefined;

    daySplits.push({
      ...week[i],
      target,
      actual,
      carryOver: carry, // <- show the current day's carry over!
      delayReason: dummyReasons[i],
    });

    if (actual !== undefined) {
      remaining -= actual;
      remainingDays -= 1;
      if (carry > 0 && i < 4) {
        remaining += carry;
      }
      prevCarryOver = carry;
    }
  }

  // Only count completed up to present day
  const totalCompleted = daySplits
    .slice(0, presentDayIndex + 1)
    .reduce((a, d) => a + (d.actual ?? 0), 0);
  const completionPercent = Math.round(
    (totalCompleted / mainTask.totalTarget) * 100
  );

  const getStatus = (i, actual, target) => {
    if (i < presentDayIndex) return actual >= target ? "completed" : "carryover";
    if (i === presentDayIndex) return actual < target ? "ongoing" : "completed";
    return "pending";
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "ongoing":
        return "#FFCD00";
      case "carryover":
        return "#f39c12";
      case "pending":
        return "#666";
      default:
        return "#666";
    }
  };

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        <h1>Caterpillar Work Schedule - Week of July 21, 2025</h1>
        <div style={{ marginBottom: "18px" }}>
          <b>Total Distributed Target:</b> {Math.round(daySplits.reduce((sum, d) => sum + d.target, 0))} units
          <br />
          <b>Completed (up to today):</b> {totalCompleted} units
        </div>
        <div className="schedule-cards-container">
          {daySplits.map((d, i) => {
            const status = getStatus(i, d.actual, d.target);
            const progress =
              d.actual !== undefined
                ? Math.round((d.actual / d.target) * 100)
                : 0;
            return (
              <div
                key={d.date}
                className={`schedule-card ${status}`}
                style={{ borderColor: getStatusColor(status) }}
              >
                <div className="card-header">
                  <h3>{d.day}</h3>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(status),
                      color: status === "ongoing" ? "#000" : "#fff",
                    }}
                  >
                    {status.toUpperCase()}
                  </span>
                </div>
                <div className="card-date">
                  <span>{d.date}</span>
                </div>
                <div className="progress-section">
                  <div className="progress-header">
                    <span>Progress: {progress}%</span>
                    <span>
                      {d.actual !== undefined
                        ? `${d.actual} / ${d.target} units`
                        : `0 / ${d.target} units`}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: getStatusColor(status),
                      }}
                    />
                  </div>
                </div>
                <div className="tasks-section">
                  <h4>Task</h4>
                  <div className="tasks-list">
                    <div className="task-item">
                      <div className="task-number">{mainTask.taskNumber}</div>
                      <div className="task-instruction">{mainTask.instruction}</div>
                      <div className="task-hours">
                        <span className="target">Target: {d.target} units</span>
                        <span className="actual">
                          Actual:{" "}
                          {d.actual !== undefined ? `${d.actual} units` : "-"}
                        </span>
                        <span className="carryover">
                          Carry Over: {d.carryOver !== undefined ? d.carryOver : "-"} units
                        </span>
                      </div>
                      {d.delayReason && (
                        <div className="delay-reason" style={{ color: "#b00" }}>
                          <i>Delay: {d.delayReason}</i>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-actions">
                  <button
                    className="dashboard-btn primary"
                    onClick={() => setPdfModalDay(i)}
                  >
                    View Report (PDF)
                  </button>
                  <button
                    className="dashboard-btn secondary"
                    onClick={() => setSummaryModalDay(i)}
                  >
                    View Summary
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <PdfReportModal show={pdfModalDay !== null} onClose={() => setPdfModalDay(null)} />
        <SummaryModal
          show={summaryModalDay !== null}
          onClose={() => setSummaryModalDay(null)}
          summary={{
            totalTarget: mainTask.totalTarget,
            totalCompleted,
            completionPercent,
            daySplits,
          }}
          dayIndex={summaryModalDay}
          presentDayIndex={presentDayIndex}
        />
      </div>
    </DashboardLayout>
  );
}