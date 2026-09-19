"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, ImageIcon, X, Upload } from "lucide-react";
import NextImage from "next/image";

interface GalleryImage {
  id: string;
  src: string;
  caption: string;
  category: string;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState({
    src: "",
    caption: "",
    category: "Products",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setForm((prev) => ({ ...prev, src: result }));
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.src.trim() || !form.caption.trim()) return;

    const newImage: GalleryImage = {
      id: editingImage ? editingImage.id : `gallery_${Date.now()}`,
      src: form.src,
      caption: form.caption,
      category: form.category,
      createdAt: editingImage ? editingImage.createdAt : new Date().toISOString(),
    };

    const updatedImages = editingImage
      ? images.map((img) => (img.id === editingImage.id ? newImage : img))
      : [...images, newImage];

    setImages(updatedImages);
    localStorage.setItem("gallery_images", JSON.stringify(updatedImages));

    setForm({ src: "", caption: "", category: "Products" });
    setPreview(null);
    setIsCreating(false);
    setEditingImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id);
    setImages(updatedImages);
    localStorage.setItem("gallery_images", JSON.stringify(updatedImages));
  };

  const startEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setForm({
      src: image.src,
      caption: image.caption,
      category: image.category,
    });
    setPreview(image.src);
    setIsCreating(true);
  };

  const resetForm = () => {
    setForm({ src: "", caption: "", category: "Products" });
    setPreview(null);
    setIsCreating(false);
    setEditingImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-chocolate">Photo Gallery</h1>
            <p className="text-chocolate/60 mt-1">Manage your cafe gallery</p>
          </div>
          <button
            onClick={() => {
              setIsCreating(true);
              setEditingImage(null);
              setForm({ src: "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/ab9f22c5-29b3-4c4f-823c-26d8b99db369.jpg?width=600&height=600", caption: "", category: "Products" });
            }}
            className="bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add Photo
          </button>
        </div>

        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8"
          >
            <h2 className="font-semibold text-chocolate mb-4">{editingImage ? "Edit Photo" : "Add Photo"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-chocolate mb-1">Upload Photo</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-chocolate/20 rounded-lg px-4 py-6 text-center hover:border-truffle transition-colors"
                >
                  <Upload className="mx-auto text-chocolate/40 mb-2" size={24} />
                  <p className="text-sm text-chocolate/60">Click to upload an image</p>
                </button>
                {preview && (
                  <div className="mt-4 relative inline-block">
                    <NextImage src={preview} alt="Preview" width={200} height={200} className="rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setForm((prev) => ({ ...prev, src: "" }));
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-chocolate mb-1">Caption</label>
                <input
                  type="text"
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  className="w-full border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
                  placeholder="Photo caption"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-chocolate mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
                >
                  <option value="Products">Products</option>
                  <option value="Interior">Interior</option>
                  <option value="Events">Events</option>
                  <option value="Team">Team</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} className="bg-truffle text-white px-6 py-2 rounded-full font-semibold hover:bg-chocolate transition-colors">
                  {editingImage ? "Update" : "Add"}
                </button>
                <button
                  onClick={resetForm}
                  className="border border-chocolate/20 text-chocolate px-6 py-2 rounded-full font-semibold hover:bg-chocolate/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group relative"
            >
              <div className="aspect-square">
                <NextImage src={image.src} alt={image.caption} fill className="object-cover" />
              </div>
              <div className="p-3">
                <p className="font-medium text-chocolate text-sm truncate">{image.caption}</p>
                <p className="text-xs text-chocolate/50">{image.category}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(image)}
                  className="bg-white p-1.5 rounded-full shadow-md text-chocolate hover:text-truffle"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="bg-white p-1.5 rounded-full shadow-md text-chocolate hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {images.length === 0 && !isCreating && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <ImageIcon size={48} className="text-chocolate/20 mx-auto mb-4" />
            <p className="text-chocolate/60">No gallery images yet. Add your first photo above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
