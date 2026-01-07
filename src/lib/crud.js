import { supabase } from "./supabaseClient";

// ---------- FETCH ----------
export async function fetchDevices() {
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;

  // snake_case → camelCase
  return data.map((d) => ({
    id: d.id,
    name: d.name,
    channelId: d.channel_id,
    readApiKey: d.read_api_key,
    location: d.location,
    createdAt: d.created_at,
  }));
}

// ---------- ADD ----------
export async function addDevice(device) {
  const { data, error } = await supabase
    .from("devices")
    .insert([
      {
        name: device.name,
        channel_id: device.channelId,
        read_api_key: device.readApiKey,
        location: device.location,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    channelId: data.channel_id,
    readApiKey: data.read_api_key,
    location: data.location,
  };
}

// ---------- EDIT ----------
export async function editDevice(id, updatedData) {
  // Example with Supabase
  const { data, error } = await supabase
    .from("devices")
    .update(updatedData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data; // return updated device
}

// ---------- DELETE ----------
export async function deleteDevice(id) {
  const { error } = await supabase
    .from("devices")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
