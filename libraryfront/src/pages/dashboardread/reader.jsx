import { useEffect, useState } from "react";

export default function Reader() {
  const [blobUrl, setBlobUrl] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let urlToRevoke = null;

    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const res = await fetch("/api/dashboard/read/pdf", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }

        const blob = await res.blob();
        urlToRevoke = URL.createObjectURL(blob);
        setBlobUrl(urlToRevoke);
      } catch (e) {
        setErr(e.message);
      }
    };

    load();

    return () => {
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
    };
  }, []);

  if (err) return <div style={{ padding: 20 }}>Error: {err}</div>;
  if (!blobUrl) return <div style={{ padding: 20 }}>Loading…</div>;

  return (
    <div style={{ height: "90vh" }}>
      <iframe
        src={blobUrl}
        style={{ width: "100%", height: "100%", border: "none" }}
        title="Reader"
      />
    </div>
  );
}
