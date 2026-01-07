import React, { useState, useEffect } from "react";
import { FiCpu, FiWifiOff, FiClock, FiMapPin, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import { Line } from "react-chartjs-2";
import { fetchDevices, addDevice, editDevice, deleteDevice } from "../lib/crud";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const OFFLINE_THRESHOLD = 90000; // 90 seconds
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newDeviceState, setNewDeviceState] = useState({ name: "", channelId: "", readApiKey: "", location: "" });
  const [editDeviceState, setEditDeviceState] = useState({ originalId: "", name: "", channelId: "", readApiKey: "", location: "" });

  // Clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load devices
  const loadDevices = async () => {
    try {
      const data = await fetchDevices();
      setDevices(data);
      fetchThingSpeakData(data);
    } catch (err) {
      console.error("Failed to fetch devices:", err);
    }
  };

  useEffect(() => {
    loadDevices();
    const interval = setInterval(loadDevices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Thingspeak data
  const fetchThingSpeakData = async (deviceList) => {
    const updated = await Promise.all(
      deviceList.map(async (device) => {
        try {
          const res = await fetch(
            `https://api.thingspeak.com/channels/${device.channelId}/feeds.json?api_key=${device.readApiKey}&results=20`
          );
          const data = await res.json();
          if (!data.feeds?.length) return { ...device, online: false };

          const history = data.feeds.map((feed) => ({
            time: new Date(feed.created_at).toLocaleTimeString(),
            smoke1: Number(feed.field1),
            smoke2: Number(feed.field2),
            flame1: Number(feed.field3),
            flame2: Number(feed.field4),
          }));

          const latest = history[history.length - 1];
          const feedTime = new Date(data.feeds[data.feeds.length - 1].created_at).getTime();
          const now = Date.now();

          return {
            ...device,
            ...latest,
            lastUpdated: feedTime,
            history,
            online: now - feedTime <= OFFLINE_THRESHOLD,
          };
        } catch {
          return { ...device, online: false };
        }
      })
    );
    setDevices(updated);
  };

  const timeAgo = (timestamp) => {
    if (!timestamp) return "No data";
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds} sec ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    return `${Math.floor(minutes / 60)} hr ago`;
  };

  const displayFlame = (val) => (val === 0 ? "🔥 Detected" : "Normal");

  // Add device
  const handleAddDevice = async (e) => {
    e.preventDefault();
    try {
      await addDevice(newDeviceState);
      setNewDeviceState({ name: "", channelId: "", readApiKey: "", location: "" });
      setShowAddModal(false);
      loadDevices();
    } catch {
      alert("Failed to add device");
    }
  };

  // Edit device
  const handleEditDevice = async (e) => {
    e.preventDefault();
    try {
      await editDevice(editDeviceState.originalId, {
        name: editDeviceState.name,
        channel_id: editDeviceState.channelId,
        read_api_key: editDeviceState.readApiKey,
        location: editDeviceState.location,
      });
      setShowEditModal(false);
      setSelectedDevice(null);
      loadDevices();
    } catch {
      alert("Failed to edit device");
    }
  };

  // Delete device
  const handleDeleteDevice = async (id) => {
    const device = devices.find((d) => d.id === id);
    if (!device) return alert("Device not found");
    if (!confirm(`Are you sure you want to delete "${device.name}"? This cannot be undone.`)) return;

    try {
      await deleteDevice(id);
      setSelectedDevice(null);
      loadDevices();
      alert(`Device "${device.name}" deleted successfully`);
    } catch (err) {
      console.error(err);
      alert("Failed to delete device: " + err.message);
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-black via-gray-900 to-red-900 text-white min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-6 overflow-y-auto">
        {/* Top stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard>
            <div className="flex items-center space-x-4">
              <FiCpu className="text-2xl text-green-400" />
              <div>
                <h2 className="text-lg font-semibold">Devices Online</h2>
                <p className="text-xl">{devices.filter((d) => d.online).length}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center space-x-4">
              <FiWifiOff className="text-2xl text-red-400" />
              <div>
                <h2 className="text-lg font-semibold">Devices Offline</h2>
                <p className="text-xl">{devices.filter((d) => !d.online).length}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center space-x-4">
              <FiClock className="text-2xl text-blue-400" />
              <div>
                <h2 className="text-lg font-semibold">Current Time</h2>
                <p className="text-sm">{currentTime.toLocaleString()}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="cursor-pointer" onClick={() => setShowAddModal(true)}>
            <div className="flex items-center space-x-4">
              <FiPlus className="text-2xl text-yellow-400" />
              <div>
                <h2 className="text-lg font-semibold">Add Device</h2>
                <p className="text-sm">Click to add new</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Device cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device, i) => (
            <GlassCard key={i} onClick={() => setSelectedDevice(device)} className="cursor-pointer transition">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiCpu className="text-red-400" />
                  <h2 className="font-bold text-lg">{device.name}</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${device.online ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {device.online ? "Online" : "Offline"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 mb-4">
                <FiMapPin /> {device.location}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-black/30 rounded-xl p-3">
                  <p className="text-gray-400">Smoke 1</p>
                  <p className="text-lg font-bold">{device.smoke1}</p>
                </div>
                <div className="bg-black/30 rounded-xl p-3">
                  <p className="text-gray-400">Smoke 2</p>
                  <p className="text-lg font-bold">{device.smoke2}</p>
                </div>
                <div className="bg-black/30 rounded-xl p-3">
                  <p className="text-gray-400">Flame 1</p>
                  <p className="text-lg font-bold">{displayFlame(device.flame1)}</p>
                </div>
                <div className="bg-black/30 rounded-xl p-3">
                  <p className="text-gray-400">Flame 2</p>
                  <p className="text-lg font-bold">{displayFlame(device.flame2)}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-400">Last Updated: {timeAgo(device.lastUpdated)}</p>
            </GlassCard>
          ))}
        </div>
      </main>

      {/* Modals */}
      {selectedDevice && (
        <DeviceModal
          device={selectedDevice}
          setSelectedDevice={setSelectedDevice}
          setEditDeviceState={setEditDeviceState}
          setShowEditModal={setShowEditModal}
          handleDeleteDevice={handleDeleteDevice}
          displayFlame={displayFlame}
          timeAgo={timeAgo}
        />
      )}
      {showAddModal && (
        <AddDeviceModal
          newDeviceState={newDeviceState}
          setNewDeviceState={setNewDeviceState}
          handleAddDevice={handleAddDevice}
          setShowAddModal={setShowAddModal}
        />
      )}
      {showEditModal && (
        <EditDeviceModal
          editDeviceState={editDeviceState}
          setEditDeviceState={setEditDeviceState}
          handleEditDevice={handleEditDevice}
          setShowEditModal={setShowEditModal}
        />
      )}
    </div>
  );
}


function GlassCard({ children, className = "", onClick }) {
  return (
    <div onClick={onClick} className={`p-5 rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg border border-white/20 ${className}`}>
      {children}
    </div>
  );
}

function DeviceModal({ device, setSelectedDevice, setEditDeviceState, setShowEditModal, handleDeleteDevice, displayFlame, timeAgo }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <GlassCard className="max-w-3xl w-full p-6 relative">
        <button onClick={() => setSelectedDevice(null)} className="absolute top-3 right-3 text-gray-400 hover:text-white">✖</button>
        <h2 className="text-2xl font-bold mb-4">{device.name} Details</h2>
        <p>Status: {device.online ? "Online ✅" : "Offline ❌"}</p>
        <p>Location: {device.location}</p>
        <p>Smoke Sensor 1: {device.smoke1}</p>
        <p>Smoke Sensor 2: {device.smoke2}</p>
        <p>Flame Sensor 1: {displayFlame(device.flame1)}</p>
        <p>Flame Sensor 2: {displayFlame(device.flame2)}</p>
        <p className="mb-4">Last Updated: {timeAgo(device.lastUpdated)}</p>
        <div className="mt-6 h-[300px]">
          {device.history?.length > 0 ? (
            <Line
              data={{
                labels: device.history.map((h) => h.time),
                datasets: [
                  { label: "Smoke 1", data: device.history.map((h) => h.smoke1), borderColor: "orange", tension: 0.3 },
                  { label: "Smoke 2", data: device.history.map((h) => h.smoke2), borderColor: "red", tension: 0.3 },
                  { label: "Flame 1", data: device.history.map((h) => 200 - h.flame1 * 200), borderColor: "yellow", tension: 0.3 },
                  { label: "Flame 2", data: device.history.map((h) => 200 - h.flame2 * 200), borderColor: "purple", tension: 0.3 },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { labels: { color: "white" } } } }}
            />
          ) : (
            <p className="text-center text-gray-400">No graph data available</p>
          )}
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditDeviceState({
                originalId: device.id,
                name: device.name,
                channelId: device.channelId,
                readApiKey: device.readApiKey,
                location: device.location,
              });
              setShowEditModal(true);
            }}
            className="flex items-center gap-1 bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
          >
            <FiEdit2 /> Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteDevice(device.id);
            }}
            className="flex items-center gap-1 bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

function AddDeviceModal({ newDeviceState, setNewDeviceState, handleAddDevice, setShowAddModal }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg border border-white/20 text-white">
        {/* Close Button */}
        <button
          onClick={() => setShowAddModal(false)}
          className="absolute top-4 right-4 text-gray-300 hover:text-white text-xl font-bold"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Add New Device</h2>

        <form className="space-y-4" onSubmit={handleAddDevice}>
          {[
            { label: "Device Name", field: "name" },
            { label: "Channel ID", field: "channelId" },
            { label: "Read API Key", field: "readApiKey" },
            { label: "Location", field: "location" },
          ].map(({ label, field }) => (
            <div key={field} className="flex flex-col">
              <label className="mb-1 text-gray-300">{label}</label>
              <input
                type="text"
                placeholder={label}
                value={newDeviceState[field]}
                onChange={(e) => setNewDeviceState({ ...newDeviceState, [field]: e.target.value })}
                className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg transition"
          >
            Add Device
          </button>
        </form>
      </div>
    </div>
  );
}

function EditDeviceModal({ editDeviceState, setEditDeviceState, handleEditDevice, setShowEditModal }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg border border-white/20 text-white">
        {/* Close Button */}
        <button
          onClick={() => setShowEditModal(false)}
          className="absolute top-4 right-4 text-gray-300 hover:text-white text-xl font-bold"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Edit Device</h2>

        <form className="space-y-4" onSubmit={handleEditDevice}>
          {[
            { label: "Device Name", field: "name" },
            { label: "Channel ID", field: "channelId" },
            { label: "Read API Key", field: "readApiKey" },
            { label: "Location", field: "location" },
          ].map(({ label, field }) => (
            <div key={field} className="flex flex-col">
              <label className="mb-1 text-gray-300">{label}</label>
              <input
                type="text"
                placeholder={label}
                value={editDeviceState[field]}
                onChange={(e) =>
                  setEditDeviceState({ ...editDeviceState, [field]: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
