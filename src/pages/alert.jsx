import React, { useState, useEffect } from "react"; 
import Sidebar from "../components/Sidebar";
import { FiAlertTriangle } from "react-icons/fi";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default function Alerts() {
  const devices = [
    { id: "Device-01", channelId: "3099295", readApiKey: "E75DP2RRWNDAOUGC" },
    { id: "Device-02", channelId: "3125011", readApiKey: "2V8MDOD92TLCN4M6" },
    { id: "Device-03", channelId: "3146046", readApiKey: "Z3UZ2A1VBUHN3F39" },
  ];

  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null); // 🔥 selected alert for modal

  // Load alerts from Supabase
  const loadAlertsFromDB = async () => {
    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error loading alerts:", error);
      setIsLoading(false);
      return;
    }

    // Remove duplicate timestamps
    const seenTimestamps = new Set();
    const uniqueAlerts = [];
    for (const alert of data) {
      if (!seenTimestamps.has(alert.created_at)) {
        seenTimestamps.add(alert.created_at);
        uniqueAlerts.push(alert);
      }
    }

    setAlerts(uniqueAlerts);
    setIsLoading(false);
  };

  // Fetch alerts from ThingSpeak and store in Supabase
  const fetchAndStoreAlerts = async () => {
    try {
      for (const deviceInfo of devices) {
        const { id: device, channelId, readApiKey } = deviceInfo;

        const res = await fetch(
          `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${readApiKey}&results=5`
        );
        if (!res.ok) continue;

        const data = await res.json();
        const feeds = data.feeds || [];
        if (feeds.length === 0) continue;

        const firstFeed = feeds[0];
        const baseSmoke1 = parseInt(firstFeed.field1) || 0;
        const baseSmoke2 = parseInt(firstFeed.field2) || 0;
        const sharedThreshold = Math.round((baseSmoke1 + baseSmoke2) / 2) + 40;

        const { data: recentLogs } = await supabase
          .from("logs")
          .select("device, type, created_at")
          .order("created_at", { ascending: false })
          .limit(20);

        for (const feed of feeds) {
          const smoke1 = parseInt(feed.field1) || 0;
          const smoke2 = parseInt(feed.field2) || 0;
          const flame1 = parseInt(feed.field3) || 0;
          const flame2 = parseInt(feed.field4) || 0;
          const entryId = parseInt(feed.entry_id);
          const createdAt = feed.created_at;

          // Detect triggers
          const triggered = [];
          if (smoke1 > sharedThreshold) triggered.push("Smoke 1");
          if (smoke2 > sharedThreshold) triggered.push("Smoke 2");
          if (flame1 === 0) triggered.push("Flame 1");
          if (flame2 === 0) triggered.push("Flame 2");
          if (triggered.length === 0) continue;

          const devicesToInsert = [{ device, triggered }];
          if (device === "Device-01" && triggered.length > 0) {
            devicesToInsert.push({ device: "Device-03", triggered });
          }

          for (const { device: dev, triggered: trigList } of devicesToInsert) {
            for (const type of trigList) {
              const duplicate = recentLogs?.some(
                (a) => a.device === dev && a.type === type && a.created_at === createdAt
              );

              if (!duplicate) {
                const { error: insertError } = await supabase
                  .from("logs")
                  .insert([{
                    entry_id: entryId,
                    device: dev,
                    type,
                    smoke1,
                    smoke2,
                    flame1,
                    flame2,
                    threshold: sharedThreshold,
                    created_at: createdAt,
                  }]);
                if (insertError) console.error(insertError.message);
              }
            }
          }
        }
      }

      await loadAlertsFromDB();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAlertsFromDB();
    fetchAndStoreAlerts();
    const interval = setInterval(fetchAndStoreAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const toReadablePHTime = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      hour12: true,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 text-white">
      <Sidebar />
      <main className="ml-64 flex-1 p-6 overflow-hidden">
        <h1 className="text-2xl font-bold mb-4">Alerts History</h1>
        <div className="rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg border border-white/20 h-[80vh] flex flex-col">
          <div className="overflow-y-auto flex-1 rounded-2xl">
            {isLoading ? (
              <p className="text-gray-400 text-center p-4">Loading alerts...</p>
            ) : (
              <table className="w-full text-left text-sm border-collapse">
                <thead className="sticky top-0 bg-black text-white z-10">
                  <tr className="border-b border-red-500/40">
                    <th className="p-3">Device</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Timestamp (PH)</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-3 text-gray-400 text-center">No alerts yet</td>
                    </tr>
                  ) : (
                    alerts.map((alert) => (
                      <tr
                        key={alert.id}
                        className="border-b border-white/10 hover:bg-white/10 cursor-pointer"
                        onClick={() => setSelectedAlert(alert)} // 🔥 click to open modal
                      >
                        <td className="p-3">{alert.device}</td>
                        <td className="p-3 flex items-center gap-2">
                          <FiAlertTriangle className="text-red-400" /> {alert.type}
                        </td>
                        <td className="p-3">{toReadablePHTime(alert.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Alert Details Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 w-full max-w-md text-white relative">
              <button
                className="absolute top-3 right-3 text-gray-300 hover:text-white text-xl font-bold"
                onClick={() => setSelectedAlert(null)}
              >
                ✖
              </button>
              <h2 className="text-2xl font-bold mb-4">Alert Details</h2>
              <p><strong>Device:</strong> {selectedAlert.device}</p>
              <p><strong>Type:</strong> {selectedAlert.type}</p>
              <p><strong>Smoke 1:</strong> {selectedAlert.smoke1}</p>
              <p><strong>Smoke 2:</strong> {selectedAlert.smoke2}</p>
              <p><strong>Flame 1:</strong> {selectedAlert.flame1}</p>
              <p><strong>Flame 2:</strong> {selectedAlert.flame2}</p>
              <p><strong>Threshold:</strong> {selectedAlert.threshold}</p>
              <p><strong>Timestamp:</strong> {toReadablePHTime(selectedAlert.created_at)}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
