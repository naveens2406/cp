import React, { useState, useEffect } from 'react';
import mockApi from '../../services/mockApi';
import { Image, Plus, Trash2, Upload, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['wedding', 'visiting', 'offset', 'flex', 'sticker', 'poster', 'other'];

const GalleryManagement = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({ title: '', category: 'wedding', image_url: '' });
    const [preview, setPreview] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => { fetchGallery(); }, []);

    const fetchGallery = async () => {
        try {
            const res = await mockApi.getGallery();
            setImages(res.data);
        } catch { toast.error('Failed to load gallery'); }
        finally { setLoading(false); }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setPreview(ev.target.result);
            setForm(f => ({ ...f, image_url: ev.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!form.title || !form.image_url) { toast.error('Please fill all fields and select an image.'); return; }
        setUploading(true);
        try {
            await mockApi.addGalleryImage(form);
            toast.success('Image added to gallery!');
            setShowUpload(false);
            setForm({ title: '', category: 'wedding', image_url: '' });
            setPreview(null);
            fetchGallery();
        } catch { toast.error('Upload failed.'); }
        finally { setUploading(false); }
    };

    const handleDelete = async (id) => {
        try {
            await mockApi.deleteGalleryImage(id);
            setImages(imgs => imgs.filter(img => img.id !== id));
            toast.success('Image deleted.');
        } catch { toast.error('Failed to delete.'); }
        setDeleteConfirm(null);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary flex items-center space-x-2">
                        <Image className="h-6 w-6" />
                        <span>Gallery Management</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Add and remove images from the public gallery.</p>
                </div>
                <button
                    onClick={() => setShowUpload(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Image</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {CATEGORIES.slice(0, 4).map(cat => (
                    <div key={cat} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-wider capitalize">{cat}</p>
                        <p className="text-2xl font-bold text-primary mt-1">
                            {images.filter(img => img.category === cat).length}
                        </p>
                    </div>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />)}
                </div>
            ) : images.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                    <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400">No images yet. Add your first gallery image!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map(img => (
                        <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden shadow-md bg-gray-100">
                            <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3">
                                <p className="text-white font-semibold text-sm text-center mb-1">{img.title}</p>
                                <span className="text-white/70 text-xs capitalize mb-3">{img.category}</span>
                                {deleteConfirm === img.id ? (
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleDelete(img.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1">
                                            <CheckCircle className="h-3.5 w-3.5" /><span>Confirm</span>
                                        </button>
                                        <button onClick={() => setDeleteConfirm(null)} className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1">
                                            <X className="h-3.5 w-3.5" /><span>Cancel</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setDeleteConfirm(img.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" /><span>Delete</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Add Gallery Image</h2>
                            <button onClick={() => { setShowUpload(false); setPreview(null); }} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="form-label">Image Title *</label>
                                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="form-input" placeholder="e.g. Wedding Card Design 2024" />
                            </div>
                            <div>
                                <label className="form-label">Category *</label>
                                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="form-input">
                                    {CATEGORIES.map(cat => <option key={cat} value={cat} className="capitalize">{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Upload Image *</label>
                                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition-colors bg-gray-50">
                                    {preview ? (
                                        <img src={preview} alt="preview" className="w-full h-full object-contain rounded-xl" />
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">Click to upload image</p>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </label>
                            </div>
                            <div className="flex space-x-3 pt-2">
                                <button type="button" onClick={() => { setShowUpload(false); setPreview(null); }} className="flex-1 btn-secondary">Cancel</button>
                                <button type="submit" disabled={uploading} className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-60">
                                    {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <><Upload className="h-4 w-4" /><span>Upload</span></>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryManagement;
