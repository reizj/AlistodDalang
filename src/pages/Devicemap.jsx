import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Sidebar from "../components/Sidebar";
import { Flame, Cloud, MapPin, Clock } from "lucide-react";
import { fetchDevices } from "../lib/crud";

const DeviceMap = ({ refreshTrigger }) => {
  const [devicesData, setDevicesData] = useState([]);
  const defaultPosition = [15.978, 120.569]; // fallback coordinates

  const loadMapDevices = async () => {
    try {
      const dbDevices = await fetchDevices(); // fetch from your DB
      const results = await Promise.all(
        dbDevices.map(async (device) => {
          try {
            const channelRes = await fetch(
              `https://api.thingspeak.com/channels/${device.channelId}.json`
            );
            const channelData = await channelRes.json();
            const feedRes = await fetch(
              `https://api.thingspeak.com/channels/${device.channelId}/feeds/last.json`
            );
            const feedData = await feedRes.json();
            return { ...device, channelData, feedData };
          } catch {
            return { ...device, channelData: null, feedData: null };
          }
        })
      );
      setDevicesData(results);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMapDevices();
  }, [refreshTrigger]); // reload map when trigger changes

  const getFlameStatus = (value) => {
    if (value === "1") return { text: "Normal", color: "text-green-600" };
    if (value === "0") return { text: "🔥 Detected", color: "text-red-600 font-semibold" };
    return { text: "N/A", color: "text-gray-500" };
  };

  return (
    <div className="flex bg-gradient-to-br from-black via-gray-900 to-red-950 text-white min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-6">
        <h1 className="text-3xl font-bold mb-4">🛰️ Device Map</h1>

        <div className="rounded-2xl overflow-hidden shadow-2xl border border-red-500/10 bg-white/5 backdrop-blur-xl">
          <MapContainer center={defaultPosition} zoom={16} style={{ height: "80vh", width: "100%" }}>
            <TileLayer
              url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
              subdomains={["mt0", "mt1", "mt2", "mt3"]}
              attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
            />

            {devicesData.map((device, i) => {
              const pos =
                device.channelData?.latitude && device.channelData?.longitude
                  ? [parseFloat(device.channelData.latitude), parseFloat(device.channelData.longitude)]
                  : defaultPosition;

              const isOnline =
                device.feedData &&
                (device.feedData.field1 !== null ||
                  device.feedData.field2 !== null ||
                  device.feedData.field3 !== null ||
                  device.feedData.field4 !== null) &&
                device.feedData.created_at &&
                (new Date() - new Date(device.feedData.created_at)) / 1000 / 60 < 5;

              const markerIcon = L.divIcon({
                className: "custom-marker",
                html: `<div style="
                  width:20px;
                  height:20px;
                  background: ${isOnline
                    ? 'radial-gradient(circle, #ff4d4d 0%, #b30000 100%)'
                    : 'radial-gradient(circle, #aaa 0%, #555 100%)'};
                  border-radius:50%;
                  box-shadow:0 0 15px 6px rgba(${isOnline ? "255,77,77,0.7" : "170,170,170,0.7"});
                "></div>`,
                iconSize: [25, 25],
                iconAnchor: [12, 12],
              });

              return (
                <Marker key={i} position={pos} icon={markerIcon}>
                  <Popup>
                    <div className="p-3 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl border border-gray-300 text-black w-60">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-full ${isOnline ? "bg-red-100" : "bg-gray-300"}`}>
                          <Flame className={`w-5 h-5 ${isOnline ? "text-red-500" : "text-gray-600"}`} />
                        </div>
                        <h2 className={`font-bold text-base ${isOnline ? "text-red-600" : "text-gray-600"}`}>
                          {device.name || device.id}
                        </h2>
                      </div>

                      <div className="text-xs text-gray-700 mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>Lat: <span className="font-medium">{device.channelData?.latitude || "N/A"}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500 rotate-90" />
                          <span>Lon: <span className="font-medium">{device.channelData?.longitude || "N/A"}</span></span>
                        </div>
                      </div>

                      {isOnline ? (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-100/80 p-2 rounded-lg backdrop-blur-sm shadow-sm">
                            <div className="flex items-center gap-1 mb-1"><Cloud className="w-4 h-4 text-gray-500" /><p className="text-gray-600 text-xs">Smoke 1</p></div>
                            <p className="text-sm font-semibold text-gray-800">{device.feedData.field1 || "N/A"}</p>
                          </div>
                          <div className="bg-gray-100/80 p-2 rounded-lg backdrop-blur-sm shadow-sm">
                            <div className="flex items-center gap-1 mb-1"><Cloud className="w-4 h-4 text-gray-500" /><p className="text-gray-600 text-xs">Smoke 2</p></div>
                            <p className="text-sm font-semibold text-gray-800">{device.feedData.field2 || "N/A"}</p>
                          </div>
                          {["field3", "field4"].map((field, idx) => {
                            const status = getFlameStatus(device.feedData[field]);
                            return (
                              <div key={idx} className="bg-gray-100/80 p-2 rounded-lg backdrop-blur-sm shadow-sm">
                                <div className="flex items-center gap-1 mb-1"><Flame className="w-4 h-4 text-gray-500" /><p className="text-gray-600 text-xs">Flame {idx + 1}</p></div>
                                <p className={`text-sm ${status.color}`}>{status.text}</p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 mt-2">Device Offline / No sensor data.</p>
                      )}

                      <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-600 border-t border-gray-300 pt-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span>
                          Last Updated: {device.feedData?.created_at
                            ? new Date(device.feedData.created_at).toLocaleString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </main>
    </div>
  );
};

export default DeviceMap;
