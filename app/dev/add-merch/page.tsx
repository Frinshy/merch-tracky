"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

export default function AddMerchPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ message: string; item: any } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [existingTypes, setExistingTypes] = useState<string[]>(["CD", "Vinyl", "Apparel", "Accessory", "Other"]);
  const [isCustomType, setIsCustomType] = useState(false);

  const [existingEras, setExistingEras] = useState<string[]>(["HDWG", "After Hours", "Live Tour", "Latest"]);
  const [isCustomEra, setIsCustomEra] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    type: "CD",
    era: "HDWG",
    author: "Jeff",
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const fetchMetadata = () => {
    fetch("/data/merch-items.json")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.MerchItems) {
          const typesSet = new Set<string>(["CD", "Vinyl", "Apparel", "Accessory", "Other"]);
          const erasSet = new Set<string>(["HDWG", "After Hours", "Live Tour", "Latest"]);

          data.MerchItems.forEach((item: any) => {
            if (item.type) typesSet.add(item.type);
            if (item.era) erasSet.add(item.era);
          });

          const typesList = Array.from(typesSet);
          const erasList = Array.from(erasSet);

          setExistingTypes(typesList);
          setExistingEras(erasList);

          setFormData((prev) => ({
            ...prev,
            type: prev.type || typesList[0],
            era: prev.era || erasList[0],
          }));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "typeSelect") {
      if (value === "CUSTOM_NEW") {
        setIsCustomType(true);
        setFormData((prev) => ({ ...prev, type: "" }));
      } else {
        setIsCustomType(false);
        setFormData((prev) => ({ ...prev, type: value }));
      }
    } else if (name === "eraSelect") {
      if (value === "CUSTOM_NEW") {
        setIsCustomEra(true);
        setFormData((prev) => ({ ...prev, era: "" }));
      } else {
        setIsCustomEra(false);
        setFormData((prev) => ({ ...prev, era: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessData(null);
    setErrorMsg(null);

    try {
      const data = new FormData();
      data.append("id", formData.id);
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("type", formData.type.trim());
      data.append("era", formData.era.trim());
      data.append("author", formData.author);

      if (images) {
        for (let i = 0; i < images.length; i++) {
          data.append("images", images[i]);
        }
      }

      const res = await fetch("/api/dev/add-merch", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to add merch");
      }

      setSuccessData({ message: result.message, item: result.item });
      
      // Reset form fields completely
      setFormData({
        id: "",
        name: "",
        description: "",
        type: existingTypes[0] || "CD",
        era: existingEras[0] || "HDWG",
        author: "Jeff",
      });
      setIsCustomType(false);
      setIsCustomEra(false);
      setImages(null);
      setFileInputKey(Date.now()); // Reset file input element

      // Refresh router and metadata
      router.refresh();
      fetchMetadata();

      // Scroll to top to see success banner
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 pb-24">
      <h1 className="text-3xl font-bold mb-2">Dev Tools: Add New Merch</h1>
      <p className="text-default-500 mb-6">
        Available only in development mode (`/dev/*`). Adding an item here updates `data/merch-items.json` and saves images to `public/items/`. Run `git commit` and `git push` when ready to deploy.
      </p>

      {successData && (
        <div className="p-6 mb-6 rounded-xl bg-success-50 dark:bg-success-950/30 border border-success-200 dark:border-success-800 text-success-800 dark:text-success-200 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
            </span>
            <h3 className="font-bold text-lg">Merch Successfully Added & Uploaded!</h3>
          </div>
          <p className="text-sm mb-3">{successData.message}</p>
          <div className="bg-white dark:bg-content2 p-3 rounded-lg text-xs font-mono space-y-1 border border-success-100 dark:border-success-900">
            <div><strong className="text-success-700 dark:text-success-300">ID:</strong> {successData.item.id}</div>
            <div><strong className="text-success-700 dark:text-success-300">Name:</strong> {successData.item.name}</div>
            <div><strong className="text-success-700 dark:text-success-300">Type:</strong> {successData.item.type} | <strong className="text-success-700 dark:text-success-300">Era:</strong> {successData.item.era}</div>
            <div><strong className="text-success-700 dark:text-success-300">Images Saved:</strong> {successData.item.images.length} file(s)</div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 mb-6 rounded-xl bg-danger-50 text-danger-700 border border-danger-200 text-sm">
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-content1 p-6 rounded-xl shadow-sm border border-default-200">
        <div>
          <label className="block text-sm font-medium mb-1">Item ID (slug, e.g. `limited-vinyl-2026`)</label>
          <input
            type="text"
            name="id"
            required
            value={formData.id}
            onChange={handleChange}
            placeholder="e.g. deluxe-edition-cd"
            className="w-full px-3 py-2 rounded-lg border border-default-300 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Deluxe Edition CD"
            className="w-full px-3 py-2 rounded-lg border border-default-300 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Description of the merch item..."
            className="w-full px-3 py-2 rounded-lg border border-default-300 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            {!isCustomType ? (
              <select
                name="typeSelect"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-default-300 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {existingTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                <option value="CUSTOM_NEW" className="font-semibold text-primary">
                  + Add New Type...
                </option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="Enter new type name"
                  className="w-full px-3 py-2 rounded-lg border border-default-300 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomType(false);
                    setFormData((prev) => ({ ...prev, type: existingTypes[0] || "CD" }));
                  }}
                  className="px-3 py-2 text-xs border border-default-300 rounded-lg hover:bg-default-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Era</label>
            {!isCustomEra ? (
              <select
                name="eraSelect"
                value={formData.era}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-default-300 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {existingEras.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
                <option value="CUSTOM_NEW" className="font-semibold text-primary">
                  + Add New Era...
                </option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  name="era"
                  required
                  value={formData.era}
                  onChange={handleChange}
                  placeholder="Enter new era name"
                  className="w-full px-3 py-2 rounded-lg border border-default-300 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomEra(false);
                    setFormData((prev) => ({ ...prev, era: existingEras[0] || "HDWG" }));
                  }}
                  className="px-3 py-2 text-xs border border-default-300 rounded-lg hover:bg-default-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Author / Credit</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-default-300 bg-default-50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Images</label>
          <input
            key={fileInputKey}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          <p className="text-xs text-default-400 mt-1">You can select multiple images.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg shadow hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
        >
          {loading ? "Adding & Uploading..." : "Add Merch Item"}
        </button>
      </form>
    </div>
  );
}
