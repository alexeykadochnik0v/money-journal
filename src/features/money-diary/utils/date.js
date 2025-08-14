export const toISODate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");
export const fromISODate = (s) => (s ? new Date(`${s}T00:00:00`) : undefined);
