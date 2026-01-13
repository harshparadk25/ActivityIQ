import { useMemo, useState } from "react";
import API from "../../api/axios";
import { toast } from "sonner";
import { Check, X, Edit3, Search } from "lucide-react";

const RecordTable = ({ records: initialRecords }) => {
  const [records, setRecords] = useState(initialRecords);
  const [editingId, setEditingId] = useState(null);
  const [noteValue, setNoteValue] = useState("");
  const [search, setSearch] = useState("");

  const columns = useMemo(() => {
    if (!records || records.length === 0) return [];
    return Object.keys(records[0].data);
  }, [records]);

  const startEdit = (record) => {
    setEditingId(record._id);
    setNoteValue(record.note || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNoteValue("");
  };

  const saveNote = async (recordId) => {
    try {
      await API.put(`/records/${recordId}/note`, { note: noteValue });

      setRecords((prev) =>
        prev.map((r) =>
          r._id === recordId ? { ...r, note: noteValue } : r
        )
      );

      toast.success("Note updated");
      setEditingId(null);
    } catch (err) {
      toast.error("Failed to update note");
    }
  };

  const formatCell = (key, value) => {
    if (key.toLowerCase().includes("date")) {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }

    if (key.toLowerCase() === "status") {
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value === "completed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {value}
        </span>
      );
    }

    return String(value ?? "");
  };

  const filteredRecords = useMemo(() => {
    if (!search.trim()) return records;

    const q = search.toLowerCase();

    return records.filter((record) => {
      const values = [
        ...Object.values(record.data || {}),
        record.note || "",
      ];

      return values.some((v) =>
        String(v).toLowerCase().includes(q)
      );
    });
  }, [records, search]);

  if (!records || records.length === 0) {
    return (
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold text-slate-700 mb-4">📋 Task Records</h2>
        <p className="text-slate-500">No records found</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-700">📋 Task Records</h2>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search records..."
            className="border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-auto max-h-[500px]">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-left border-b">
              {columns.map((col) => (
                <th key={col} className="py-2 px-2 capitalize">
                  {col.replace(/([A-Z])/g, " $1")}
                </th>
              ))}
              <th className="py-2 px-2">Note</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.map((record) => (
              <tr
                key={record._id}
                className="border-b hover:bg-slate-50 transition"
              >
                {columns.map((col) => (
                  <td key={col} className="py-2 px-2">
                    {formatCell(col, record.data[col])}
                  </td>
                ))}

                <td className="py-2 px-2">
                  {editingId === record._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        className="border rounded px-2 py-1 text-sm w-40"
                        value={noteValue}
                        onChange={(e) => setNoteValue(e.target.value)}
                        autoFocus
                      />
                      <button
                        onClick={() => saveNote(record._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 text-sm">
                        {record.note || "Add note"}
                      </span>
                      <button
                        onClick={() => startEdit(record)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRecords.length === 0 && (
          <div className="text-center text-slate-500 py-6">
            No matching records found
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordTable;
