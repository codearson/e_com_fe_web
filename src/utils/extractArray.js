export function extractArray(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.responseDto && Array.isArray(data.responseDto)) return data.responseDto;
  if (data.payload && Array.isArray(data.payload)) return data.payload;
  return [];
} 