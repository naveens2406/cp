import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import mockApi from '../services/mockApi';
import {
    Image, X, ChevronLeft, ChevronRight, Star, ZoomIn,
    Search, MessageCircle, ArrowRight, Heart, Tag, Play, Clock,
    Filter, BarChart3
} from 'lucide-react';

// ─── Category definitions ────────────────────────────────────────────────────
const CATEGORIES = [
    { id: 'all', label: 'All Works', emoji: '✨' },
    { id: 'wedding', label: 'Wedding Cards', emoji: '💒' },
    { id: 'visiting', label: 'Visiting Cards', emoji: '💼' },
    { id: 'offset', label: 'Offset Printing', emoji: '🖨️' },
    { id: 'flex', label: 'Flex & Banners', emoji: '📣' },
    { id: 'sticker', label: 'Stickers', emoji: '🏷️' },
    { id: 'poster', label: 'Posters', emoji: '📋' },
];

const BATCH = 12; // load-more batch size
const SORT_OPTIONS = [
    { id: 'recent', label: 'Recent', icon: '📅' },
    { id: 'rating', label: 'Highest Rated', icon: '⭐' },
    { id: 'price_low', label: 'Price: Low to High', icon: '💰' },
    { id: 'price_high', label: 'Price: High to Low', icon: '💎' },
    { id: 'complexity', label: 'Most Complex', icon: '🎯' },
    { id: 'turnaround', label: 'Fastest Turnaround', icon: '⚡' },
];

// ─── Before/After Slider Component ──────────────────────────────────────────
const BeforeAfterSlider = ({ before, after, title }) => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const newPos = ((e.clientX - rect.left) / rect.width) * 100;
        setSliderPos(Math.max(0, Math.min(100, newPos)));
    };

    const handleTouchMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const newPos = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
        setSliderPos(Math.max(0, Math.min(100, newPos)));
    };

    return (
        <div 
            ref={containerRef}
            className="relative w-full aspect-square rounded-xl overflow-hidden cursor-col-resize mb-4 bg-gray-900"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {}}
            onTouchMove={handleTouchMove}
        >
            {/* After image (base) */}
            <img src={after} alt="After" className="w-full h-full object-cover" />

            {/* Before image (overlay) */}
            <div 
                className="absolute top-0 left-0 h-full overflow-hidden"
                style={{ width: `${sliderPos}%` }}
            >
                <img src={before} alt="Before" className="w-screen h-full object-cover" style={{ width: `${100 * (100/sliderPos)}%` }} />
            </div>

            {/* Slider handle */}
            <div 
                className="absolute top-0 bottom-0 w-1 bg-[var(--color-gold)] transition-all"
                style={{ left: `${sliderPos}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg flex items-center space-x-1">
                    <ChevronLeft className="w-4 h-4 text-gray-800" />
                    <ChevronRight className="w-4 h-4 text-gray-800" />
                </div>
            </div>

            {/* Labels */}
            <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full">Before</div>
            <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full">After</div>
        </div>
    );
};

// ─── Process Timeline Component ──────────────────────────────────────────────
const ProcessTimeline = ({ steps }) => {
    return (
        <div className="bg-white/5 rounded-xl p-6 space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--color-gold)]" />
                Production Timeline
            </h4>
            <div className="space-y-3">
                {steps.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-[var(--color-gold)] text-white' : 'bg-white/10 text-white/50'}`}>
                                {item.step}
                            </div>
                            {idx < steps.length - 1 && (
                                <div className="w-0.5 h-6 bg-gradient-to-b from-[var(--color-gold)]/30 to-transparent mt-2" />
                            )}
                        </div>
                        <div className="flex-1 pt-1">
                            <p className="text-white text-sm font-semibold">{item.title}</p>
                            <p className="text-white/60 text-xs">{item.duration}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Project Stats Component ───────────────────────────────────────────────
const ProjectStats = ({ img }) => {
    const complexityLevels = { 'Low': '🟢', 'Medium': '🟡', 'High': '🔴' };
    
    return (
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-white/60 text-xs mb-1">Complexity</p>
                <p className="text-white font-semibold text-sm">{complexityLevels[img.complexity]} {img.complexity}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-white/60 text-xs mb-1">Turnaround</p>
                <p className="text-white font-semibold text-sm flex items-center justify-center gap-1">⚡ {img.turnaround}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 col-span-2">
                <p className="text-white/60 text-xs mb-1">Materials</p>
                <p className="text-white text-sm font-mono">{img.materials}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 col-span-2">
                <p className="text-white/60 text-xs mb-1">Colors Used</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                    {img.colors?.map((color, i) => (
                        <span key={i} className="text-white text-xs bg-white/10 px-2 py-1 rounded-full">
                            {color}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─── Single Gallery Card ─────────────────────────────────────────────────────
const GalleryCard = ({ img, index, onClick }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [liked, setLiked] = useState(false);

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                        key={star} 
                        className={`w-3.5 h-3.5 ${star <= Math.floor(rating) ? 'fill-[var(--color-gold)] text-[var(--color-gold)]' : 'text-white/30'}`} 
                    />
                ))}
                <span className="text-white/70 text-xs ml-1">{rating.toFixed(1)}</span>
            </div>
        );
    };

    return (
        <div
            className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer bg-gradient-to-br from-[var(--color-primary-glass)] to-[var(--color-gold)]/5 animate-fade-in hover:shadow-2xl transition-all duration-300"
            style={{ animationDelay: `${(index % BATCH) * 40}ms`, breakInside: 'avoid', marginBottom: '1rem' }}
            onClick={() => onClick(index)}
        >
            {/* Skeleton Loading */}
            {!loaded && !error && (
                <div className="w-full aspect-square bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-gold)]/10 animate-pulse flex items-center justify-center">
                    <div className="text-center">
                        <Image className="w-8 h-8 text-white/40 mx-auto mb-2" />
                        <p className="text-xs text-white/30">Loading...</p>
                    </div>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="w-full aspect-square bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)]/80 flex items-center justify-center">
                    <div className="text-center">
                        <Image className="w-10 h-10 text-white/40 mx-auto mb-2" />
                        <p className="text-xs text-white/50">Image unavailable</p>
                    </div>
                </div>
            )}

            {/* Image */}
            <img
                src={img.image_url}
                alt={img.title}
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${loaded && !error ? 'opacity-100' : 'opacity-0 absolute'}`}
                onLoad={() => setLoaded(true)}
                onError={() => { setError(true); setLoaded(true); }}
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)] via-[var(--color-primary)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                {/* Top badge + like */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    {img.tag && (
                        <span className="text-xs font-semibold bg-[var(--color-gold)] text-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-md">
                            <Tag className="h-3 w-3" /><span>{img.tag}</span>
                        </span>
                    )}
                    <button
                        className={`ml-auto p-2 rounded-full transition-all backdrop-blur-sm ${liked ? 'bg-red-500 text-white shadow-lg shadow-red-500/40' : 'bg-white/20 text-white hover:bg-red-500 hover:text-white'}`}
                        onClick={e => { e.stopPropagation(); setLiked(!liked); }}
                    >
                        <Heart className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                    <div className="flex items-end justify-between">
                        <div className="flex-1">
                            <p className="text-white font-bold text-sm leading-tight">{img.title}</p>
                            {img.description && (
                                <p className="text-white/70 text-xs mt-1 line-clamp-1">{img.description}</p>
                            )}
                        </div>
                        <ZoomIn className="h-5 w-5 text-white/80 flex-shrink-0 ml-2 group-hover:scale-110 transition-transform" />
                    </div>
                    {/* Rating overlay */}
                    {img.rating && (
                        <div className="pt-2 border-t border-white/20">
                            {renderStars(img.rating)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Enhanced Lightbox with all features ──────────────────────────────────────
const Lightbox = ({ images, index, onClose, onPrev, onNext }) => {
    const img = images[index];
    const [activeTab, setActiveTab] = useState('info'); // info, timeline, comparison

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose, onPrev, onNext]);

    const shareWhatsApp = () => {
        const text = encodeURIComponent(`Check out this amazing print work: ${img.title} by Sunlight Offset Printers! 🖨️`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= Math.floor(rating) ? 'fill-[var(--color-gold)] text-[var(--color-gold)]' : 'text-white/30'}`} 
                    />
                ))}
                <span className="text-white/70 text-sm ml-1">{rating.toFixed(1)}</span>
            </div>
        );
    };

    if (!img) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.97)' }}>
            <div className="absolute inset-0" onClick={onClose} />

            <button
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                onClick={onClose}
            >
                <X className="h-6 w-6" />
            </button>

            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/10 text-white text-sm px-4 py-1.5 rounded-full">
                {index + 1} / {images.length}
            </div>

            <button
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/25 rounded-full text-white transition-all hover:scale-110"
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
            >
                <ChevronLeft className="h-7 w-7" />
            </button>

            <button
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/25 rounded-full text-white transition-all hover:scale-110"
                onClick={(e) => { e.stopPropagation(); onNext(); }}
            >
                <ChevronRight className="h-7 w-7" />
            </button>

            <div className="z-10 flex flex-col lg:flex-row max-w-6xl w-full max-h-[95vh] px-4 gap-4 lg:gap-6 items-start lg:items-stretch overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* Main Image Section */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-0 lg:max-h-[80vh]">
                    {/* Tab Buttons */}
                    <div className="flex gap-2 mb-4 self-start flex-wrap">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'info' ? 'bg-[var(--color-gold)] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                            Info
                        </button>
                        {img.beforeImage && (
                            <button
                                onClick={() => setActiveTab('comparison')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${activeTab === 'comparison' ? 'bg-[var(--color-gold)] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                <ZoomIn className="w-4 h-4" />
                                Before/After
                            </button>
                        )}
                        {img.processSteps && (
                            <button
                                onClick={() => setActiveTab('timeline')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${activeTab === 'timeline' ? 'bg-[var(--color-gold)] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                <Clock className="w-4 h-4" />
                                Timeline
                            </button>
                        )}
                    </div>

                    {/* Main Image Display */}
                    {activeTab === 'info' && (
                        <img
                            src={img.image_url}
                            alt={img.title}
                            className="max-w-full max-h-[60vh] lg:max-h-[70vh] object-contain rounded-2xl shadow-2xl animate-scale-in"
                            key={img.id}
                        />
                    )}

                    {/* Before/After Comparison */}
                    {activeTab === 'comparison' && img.beforeImage && (
                        <div className="w-full">
                            <BeforeAfterSlider before={img.beforeImage} after={img.image_url} title={img.title} />
                        </div>
                    )}

                    {/* Process Timeline */}
                    {activeTab === 'timeline' && img.processSteps && (
                        <div className="w-full bg-white/5 rounded-2xl p-6 max-h-[70vh] overflow-y-auto">
                            <ProcessTimeline steps={img.processSteps} />
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="lg:w-80 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 flex flex-col space-y-4 flex-shrink-0">
                    {img.tag && (
                        <span className="self-start text-xs font-semibold bg-[var(--color-gold)] text-white px-3 py-1 rounded-full flex items-center space-x-1">
                            <Tag className="h-3 w-3" /><span>{img.tag}</span>
                        </span>
                    )}
                    
                    <div>
                        <h3 className="text-white text-xl font-bold mb-1">{img.title}</h3>
                        <p className="text-white/50 text-sm capitalize">{img.category}</p>
                    </div>

                    {/* Testimonial Section */}
                    {img.customer && (
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-white/70 text-xs mb-2">Customer Testimonial</p>
                            <p className="text-white text-sm font-semibold">👤 {img.customer}</p>
                            {img.rating && (
                                <div className="mt-2">
                                    {renderStars(img.rating)}
                                </div>
                            )}
                        </div>
                    )}

                    {img.description && (
                        <p className="text-white/70 text-sm leading-relaxed">{img.description}</p>
                    )}

                    {/* Project Details */}
                    {img.size && img.price && (
                        <div className="bg-white/5 rounded-lg p-3 space-y-2 border border-white/10">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Size</span>
                                <span className="text-white font-semibold">{img.size}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Technique</span>
                                <span className="text-white font-semibold">{img.technique}</span>
                            </div>
                            <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                                <span className="text-white/60">Price</span>
                                <span className="text-[var(--color-gold)] font-bold">₹{img.price?.toLocaleString()}</span>
                            </div>
                        </div>
                    )}

                    {/* Stats Section */}
                    {img.complexity && (
                        <div>
                            <p className="text-white/70 text-xs mb-3 flex items-center gap-1">
                                <BarChart3 className="w-4 h-4 text-[var(--color-gold)]" />
                                Project Stats
                            </p>
                            <ProjectStats img={img} />
                        </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="mt-auto pt-4 border-t border-white/10 space-y-3">
                        <button
                            onClick={shareWhatsApp}
                            className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
                        >
                            <MessageCircle className="h-4 w-4" />
                            <span>Share on WhatsApp</span>
                        </button>
                        <Link
                            to="/get-quote"
                            className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
                            onClick={onClose}
                        >
                            <ArrowRight className="h-4 w-4" />
                            <span>Order Similar Print</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Thumbnail navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2 overflow-x-auto max-w-xs sm:max-w-lg scrollbar-hide px-2 pb-1">
                {images.map((thumb, i) => (
                    <button
                        key={thumb.id}
                        onClick={(e) => { e.stopPropagation(); }}
                        className={`flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === index ? 'border-white scale-110' : 'border-white/30 opacity-50 hover:opacity-80'}`}
                    >
                        <img src={thumb.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
};

// ─── Video Testimonials Section ──────────────────────────────────────────────
const VideoTestimonials = ({ videos }) => {
    if (!videos || videos.length === 0) return null;

    return (
        <div className="my-16 bg-gradient-to-br from-[var(--color-primary)] via-[#441f37] to-[var(--color-primary-dark)] rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-[var(--color-gold)]/10 rounded-full animate-float" />
            
            <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-2 flex items-center gap-3">
                    <Play className="w-8 h-8 text-[var(--color-gold)] fill-[var(--color-gold)]" />
                    Customer Testimonials
                </h2>
                <p className="text-white/70 mb-8">See what our satisfied clients have to say about our print quality and service</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.slice(0, 4).map((vid, idx) => (
                        <div key={idx} className="group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-[var(--color-gold)]/50 transition-all">
                            {/* Video Thumbnail */}
                            <div className="relative w-full aspect-video bg-black/50 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/0 to-[var(--color-gold)]/10 group-hover:to-[var(--color-gold)]/20 transition-all" />
                                <a
                                    href={vid.video}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="relative z-10 w-16 h-16 bg-[var(--color-gold)] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
                                >
                                    <Play className="w-7 h-7 fill-white ml-0.5" />
                                </a>
                            </div>

                            {/* Video Info */}
                            <div className="p-4">
                                <p className="text-white font-semibold text-sm">{vid.customer}</p>
                                <p className="text-white/60 text-xs mt-1">{vid.category === 'wedding' ? '💒 Wedding Cards' : vid.category === 'offset' ? '🖨️ Offset Printing' : '📦 ' + vid.category}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star 
                                            key={star} 
                                            className={`w-3.5 h-3.5 ${star <= Math.floor(vid.rating) ? 'fill-[var(--color-gold)] text-[var(--color-gold)]' : 'text-white/30'}`} 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─── Advanced Filter Panel ────────────────────────────────────────────────
const FilterPanel = ({ images, onFilter, isOpen, onClose }) => {
    const [filters, setFilters] = useState({
        priceMin: 0,
        priceMax: 12000,
        complexity: [],
        colors: [],
        techniques: [],
    });

    const allColors = [...new Set(images.flatMap(img => img.colors || []))];
    const allTechniques = [...new Set(images.map(img => img.technique).filter(Boolean))];
    const complexities = ['Low', 'Medium', 'High'];

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        onFilter(newFilters);
    };

    const toggleArrayFilter = (key, value) => {
        const newArray = filters[key].includes(value)
            ? filters[key].filter(v => v !== value)
            : [...filters[key], value];
        handleFilterChange({ ...filters, [key]: newArray });
    };

    return (
        <div className={`fixed inset-0 z-40 ${isOpen ? 'visible' : 'invisible'} lg:relative lg:visible`}>
            <div 
                className={`fixed inset-0 bg-black/50 lg:hidden transition-all ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            
            <div className={`fixed left-0 top-0 bottom-0 lg:relative w-80 max-w-full bg-white p-6 lg:p-4 space-y-6 overflow-y-auto transition-transform lg:transition-none ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="flex justify-between items-center lg:hidden">
                    <h3 className="text-lg font-bold text-[var(--color-ink)]">Filters</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-[var(--color-ink)]">Price Range</h4>
                    <div className="space-y-2">
                        <input 
                            type="range"
                            min="0"
                            max="12000"
                            value={filters.priceMax}
                            onChange={(e) => handleFilterChange({ ...filters, priceMax: parseInt(e.target.value) })}
                            className="w-full"
                        />
                        <p className="text-sm text-[var(--color-ink-muted)]">₹0 - ₹{filters.priceMax?.toLocaleString()}</p>
                    </div>
                </div>

                {/* Complexity */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-[var(--color-ink)]">Complexity</h4>
                    <div className="space-y-2">
                        {complexities.map(c => (
                            <label key={c} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={filters.complexity.includes(c)}
                                    onChange={() => toggleArrayFilter('complexity', c)}
                                    className="rounded"
                                />
                                <span className="text-sm text-[var(--color-ink)]">{c}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Techniques */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-[var(--color-ink)]">Techniques</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {allTechniques.map(tech => (
                            <label key={tech} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={filters.techniques.includes(tech)}
                                    onChange={() => toggleArrayFilter('techniques', tech)}
                                    className="rounded"
                                />
                                <span className="text-sm text-[var(--color-ink)]">{tech}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Colors */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-[var(--color-ink)]">Colors</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {allColors.map(color => (
                            <label key={color} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={filters.colors.includes(color)}
                                    onChange={() => toggleArrayFilter('colors', color)}
                                    className="rounded"
                                />
                                <span className="text-sm text-[var(--color-ink)]">{color}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => {
                        setFilters({ priceMin: 0, priceMax: 12000, complexity: [], colors: [], techniques: [] });
                        onFilter({ priceMin: 0, priceMax: 12000, complexity: [], colors: [], techniques: [] });
                    }}
                    className="w-full py-2 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-lg text-sm font-semibold transition-colors"
                >
                    Clear All Filters
                </button>
            </div>
        </div>
    );
};

// ─── Main Gallery Component ───────────────────────────────────────────────────
const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');
    const [search, setSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(BATCH);
    const [lightbox, setLightbox] = useState({ open: false, index: 0 });
    const [sort, setSort] = useState('recent');
    const [filters, setFilters] = useState({ priceMin: 0, priceMax: 12000, complexity: [], colors: [], techniques: [] });
    const [showFilters, setShowFilters] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        mockApi.getGallery()
            .then(r => setImages(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { setVisibleCount(BATCH); }, [category, search, sort, filters]);

    useEffect(() => {
        const handler = (e) => { if (e.key === '/' && !lightbox.open) { e.preventDefault(); searchRef.current?.focus(); } };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [lightbox.open]);

    // Apply filters and sorting
    const getFilteredAndSorted = () => {
        let result = images.filter(img => {
            const matchCat = category === 'all' || img.category === category;
            const matchSearch = !search || img.title.toLowerCase().includes(search.toLowerCase()) || img.description?.toLowerCase().includes(search.toLowerCase()) || img.tag?.toLowerCase().includes(search.toLowerCase());
            const matchPrice = !img.price || (img.price >= filters.priceMin && img.price <= filters.priceMax);
            const matchComplexity = filters.complexity.length === 0 || filters.complexity.includes(img.complexity);
            const matchTechnique = filters.techniques.length === 0 || filters.techniques.includes(img.technique);
            const matchColors = filters.colors.length === 0 || filters.colors.some(c => img.colors?.includes(c));

            return matchCat && matchSearch && matchPrice && matchComplexity && matchTechnique && matchColors;
        });

        // Sort results
        switch(sort) {
            case 'rating':
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'price_low':
                result.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price_high':
                result.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'complexity':
                const complexityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                result.sort((a, b) => (complexityOrder[b.complexity] || 0) - (complexityOrder[a.complexity] || 0));
                break;
            case 'turnaround':
                const getTurnaroundDays = (str) => parseInt(str?.split('-')[0]) || 999;
                result.sort((a, b) => getTurnaroundDays(a.turnaround) - getTurnaroundDays(b.turnaround));
                break;
            default: // recent
                break;
        }

        return result;
    };

    const filtered = getFilteredAndSorted();
    const visible = filtered.slice(0, visibleCount);
    const hasMore = visibleCount < filtered.length;

    const openLightbox = useCallback((index) => setLightbox({ open: true, index }), []);
    const closeLightbox = useCallback(() => setLightbox({ open: false, index: 0 }), []);
    const prevImage = useCallback(() => setLightbox(lb => ({ ...lb, index: (lb.index - 1 + filtered.length) % filtered.length })), [filtered.length]);
    const nextImage = useCallback(() => setLightbox(lb => ({ ...lb, index: (lb.index + 1) % filtered.length })), [filtered.length]);

    const catCounts = images.reduce((acc, img) => { acc[img.category] = (acc[img.category] || 0) + 1; return acc; }, {});

    // Get unique videos from images
    const uniqueVideos = [...new Map(images.filter(img => img.video).map(img => [img.id, img])).values()];

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            {/* ── Hero Section ───────────────────────────────────────────────────── */}
            <div className="relative bg-gradient-to-br from-[var(--color-primary)] via-[#441f37] to-[var(--color-primary-dark)] text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-gold)]/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--color-gold)]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-gold)]/20 backdrop-blur-sm rounded-2xl mb-6 animate-bounce-soft border border-[var(--color-gold)]/30">
                        <Image className="h-8 w-8 text-[var(--color-gold)]" />
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 animate-fade-in leading-tight">
                        Our Work Gallery
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8 animate-fade-in delay-100 font-light">
                        {images.length} portfolio pieces — from premium wedding invitations to large-format flex prints. Every project showcases our commitment to quality.
                    </p>

                    {/* Rating */}
                    <div className="flex items-center justify-center space-x-2 mb-10 animate-fade-in delay-200">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} className="h-5 w-5 fill-[var(--color-gold)] text-[var(--color-gold)]" />
                            ))}
                        </div>
                        <span className="text-white/80 font-semibold ml-2">4.9 — 500+ Happy Clients</span>
                    </div>

                    {/* Search bar */}
                    <div className="relative max-w-md mx-auto animate-fade-in delay-300">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="Search by title, tag, or type... (press /)"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 rounded-xl text-[var(--color-ink)] text-sm font-medium shadow-xl outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 bg-white/95 backdrop-blur-sm"
                        />
                        {search && (
                            <button 
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]" 
                                onClick={() => setSearch('')}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Category Filter ─────────────────────────────────────────────── */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-[var(--color-border)] z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex overflow-x-auto space-x-2 py-4 scrollbar-hide">
                        {CATEGORIES.map(cat => {
                            const count = cat.id === 'all' ? images.length : (catCounts[cat.id] || 0);
                            const active = category === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategory(cat.id)}
                                    className={`flex-shrink-0 flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                                        active 
                                            ? 'bg-[var(--color-primary)] text-white shadow-lg hover:shadow-[0_0_20px_rgba(84,35,68,0.4)] scale-105' 
                                            : 'bg-white border border-[var(--color-border)] text-[var(--color-ink-muted)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-glass)]'
                                    }`}
                                >
                                    <span className="text-base">{cat.emoji}</span>
                                    <span>{cat.label}</span>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                                        active 
                                            ? 'bg-white/30 text-white' 
                                            : 'bg-[var(--color-border)] text-[var(--color-ink-muted)]'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Filters and Sort Bar ──────────────────────────────────────────── */}
            <div className="bg-white border-b border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        {/* Filter Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 font-semibold text-sm transition-colors lg:hidden"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>

                        {/* Sort Dropdown */}
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-ink)] font-semibold text-sm hover:border-[var(--color-primary)] outline-none focus:ring-2 focus:ring-[var(--color-gold)]/30"
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.icon} {opt.label}
                                </option>
                            ))}
                        </select>

                        {/* Result count */}
                        <p className="text-sm text-[var(--color-ink-muted)]">
                            <strong className="text-[var(--color-ink)]">{filtered.length}</strong> results
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Gallery Content with Filters ──────────────────────────────────── */}
            <div className="flex">
                {/* Filter Panel (Desktop) */}
                <FilterPanel 
                    images={images} 
                    onFilter={setFilters} 
                    isOpen={showFilters}
                    onClose={() => setShowFilters(false)}
                />

                {/* Main Gallery */}
                <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                    {/* Loading skeletons */}
                    {loading ? (
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-gold)]/10 animate-pulse break-inside-avoid mb-4" style={{ height: `${160 + (i % 3) * 60}px` }} />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20 animate-fade-in">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-[var(--color-ink)] mb-2">No results found</h3>
                            <p className="text-[var(--color-ink-muted)] mb-6">Try a different search term, adjust filters, or browse all categories.</p>
                            <button onClick={() => { setSearch(''); setCategory('all'); setFilters({ priceMin: 0, priceMax: 12000, complexity: [], colors: [], techniques: [] }); setSort('recent'); }} className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-primary-dark)] transition-all">
                                View All Gallery
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Masonry grid */}
                            <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                                {visible.map((img, i) => (
                                    <GalleryCard key={img.id} img={img} index={i} onClick={() => openLightbox(filtered.indexOf(img))} />
                                ))}
                            </div>

                            {/* Load More */}
                            {hasMore && (
                                <div className="text-center mt-12">
                                    <button
                                        onClick={() => setVisibleCount(c => c + BATCH)}
                                        className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-10 py-3 rounded-xl font-semibold hover:bg-[var(--color-primary-dark)] transition-all text-base"
                                    >
                                        <span>Load More</span>
                                        <span className="text-white/70 text-sm">({filtered.length - visibleCount} remaining)</span>
                                    </button>
                                </div>
                            )}

                            {/* All loaded */}
                            {!hasMore && filtered.length > BATCH && (
                                <p className="text-center mt-8 text-sm text-[var(--color-ink-muted)]">✓ All {filtered.length} photos loaded</p>
                            )}
                        </>
                    )}

                    {/* Video Testimonials Section */}
                    {!loading && uniqueVideos.length > 0 && (
                        <VideoTestimonials videos={uniqueVideos} />
                    )}

                    {/* Final CTA Section */}
                    {!loading && (
                        <div className="mt-16 bg-gradient-to-br from-[var(--color-primary)] to-[#3a1830] rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
                            <div className="absolute -top-8 -right-8 w-40 h-40 bg-[var(--color-gold)]/10 rounded-full animate-float" />
                            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 relative z-10">Love What You See?</h2>
                            <p className="text-white/80 mb-6 relative z-10">Get your own custom print job done by our expert team!</p>
                            <div className="flex flex-wrap justify-center gap-4 relative z-10">
                                <Link
                                    to="/get-quote"
                                    className="bg-white text-[var(--color-primary)] font-bold px-8 py-3 rounded-xl hover:-translate-y-1 transition-all shadow-lg flex items-center space-x-2"
                                >
                                    <ArrowRight className="h-4 w-4" />
                                    <span>Get a Free Quote</span>
                                </Link>
                                <a
                                    href="https://wa.me/919876543210?text=Hi! I saw your gallery and I'd like to get a similar print done."
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl hover:-translate-y-1 transition-all shadow-lg flex items-center space-x-2"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    <span>WhatsApp Us</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Lightbox ──────────────────────────────────────────────────────── */}
            {lightbox.open && (
                <Lightbox
                    images={filtered}
                    index={lightbox.index}
                    onClose={closeLightbox}
                    onPrev={prevImage}
                    onNext={nextImage}
                />
            )}
        </div>
    );
};

export default Gallery;
