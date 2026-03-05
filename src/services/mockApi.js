// Mock API service to simulate backend responses
const mockUsers = {
  admin: {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    email: 'admin@sunlight.com'
  },
  customer: {
    id: 2,
    username: 'customer',
    password: 'customer123',
    role: 'customer',
    email: 'customer@sunlight.com'
  }
};

export const mockApi = {
  login: async (credentials) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = Object.values(mockUsers).find(u => u.username === credentials.username);

    if (!user || user.password !== credentials.password) {
      throw {
        response: {
          status: 401,
          data: { detail: 'Invalid username or password' }
        }
      };
    }

    return {
      data: {
        access_token: `mock_token_${user.id}_${Date.now()}`,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    };
  },

  register: async (userData) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userExists = Object.values(mockUsers).find(u => u.username === userData.username);
    if (userExists) {
      throw {
        response: {
          status: 400,
          data: { detail: 'Username already exists' }
        }
      };
    }

    return { data: { message: 'Registration successful' } };
  },

  getMe: async () => {
    // Get current user from token
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: {
        id: 2,
        username: 'customer',
        email: 'customer@sunlight.com',
        role: 'customer'
      }
    };
  },

  getOrders: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: [
        {
          id: 1,
          order_number: 'ORD-001',
          customer: { id: 1, full_name: 'John Doe', email: 'john@example.com', phone: '1234567890', is_active: true, created_at: '2024-01-01', role: 'customer' },
          service: { id: 1, name: 'Business Cards' },
          quantity: 500,
          total_amount: 450.00,
          status: 'completed',
          created_at: '2024-01-15'
        },
        {
          id: 2,
          order_number: 'ORD-002',
          customer: { id: 2, full_name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', is_active: true, created_at: '2024-01-05', role: 'customer' },
          service: { id: 2, name: 'Brochures' },
          quantity: 250,
          total_amount: 890.00,
          status: 'processing',
          created_at: '2024-01-18'
        }
      ]
    };
  },

  getServices: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: [
        { id: 1, name: 'Wedding Invitation Printing', description: 'Beautiful, customized wedding cards with premium paper and elegant designs. Make your special day unforgettable.', base_price: 5.00, gst_rate: 12 },
        { id: 2, name: 'Offset Printing', description: 'High-volume, high-quality offset printing for brochures, leaflets, catalogues and more at competitive prices.', base_price: 0.80, gst_rate: 18 },
        { id: 3, name: 'Bill Book & Register Printing', description: 'Custom bill books, receipt books, and registers with serial numbering and company branding.', base_price: 120.00, gst_rate: 12 },
        { id: 4, name: 'Visiting Cards', description: 'Professional business cards with matte, glossy, or soft-touch lamination. Single and double-sided printing available.', base_price: 1.50, gst_rate: 12 },
        { id: 5, name: 'Poster Printing', description: 'Vibrant, eye-catching posters for events, promotions, and advertising in various sizes up to A1.', base_price: 80.00, gst_rate: 18 },
        { id: 6, name: 'SunPack Printing', description: 'Durable SunPack boards ideal for signage, name boards, and outdoor displays at affordable rates.', base_price: 35.00, gst_rate: 18 },
        { id: 7, name: 'Flex Printing', description: 'Large format flex banners for outdoor advertising, shop fronts, events, and promotions. Weather resistant.', base_price: 25.00, gst_rate: 18 },
        { id: 8, name: 'Sticker Printing', description: 'Custom stickers in any shape and size — product labels, branding stickers, waterproof options available.', base_price: 30.00, gst_rate: 12 },
        { id: 9, name: 'A3+ Colour Printing', description: 'High-resolution A3+ colour printouts for photos, architectural drawings, artwork, and presentations.', base_price: 15.00, gst_rate: 18 }
      ]
    };
  },

  getAnalytics: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: {
        total_revenue: 15234.50,
        total_orders: 145,
        daily_breakdown: [
          { date: '2024-01-01', revenue: 1200 },
          { date: '2024-01-02', revenue: 1900 },
          { date: '2024-01-03', revenue: 1500 },
          { date: '2024-01-04', revenue: 2200 },
          { date: '2024-01-05', revenue: 2800 }
        ]
      }
    };
  },

  getInventory: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: [
        { id: 1, material_name: 'A4 Paper (Ream)', quantity: 250, unit_price: 5.99, service_name: 'Photocopy' },
        { id: 2, material_name: 'Color Ink (Cyan)', quantity: 15, unit_price: 45.00, service_name: 'Digital Print' },
        { id: 3, material_name: 'Glossy Paper', quantity: 120, unit_price: 8.99, service_name: 'Photo Print' }
      ]
    };
  },

  getInvoices: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: [
        { id: 1, order_id: 1, invoice_number: 'INV-001', amount: 450.00 }
      ]
    };
  },

  getOrderById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const orders = (await mockApi.getOrders()).data;
    const order = orders.find(o => o.id === Number(id)) || orders[0];
    return { data: { ...order, selling_price: order.total_amount * 0.8, gst_amount: order.total_amount * 0.2 } };
  },

  getTemplatesByService: async (serviceId) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Generate 12 varied templates for any service
    const serviceNames = {
      1: 'Wedding', 2: 'Offset', 3: 'Bill Book', 4: 'Visiting Card',
      5: 'Poster', 6: 'SunPack', 7: 'Flex', 8: 'Sticker', 9: 'A3+ Colour'
    };
    const sName = serviceNames[serviceId] || 'Print';

    const images = [
      'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=80',
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80',
      'https://images.unsplash.com/photo-1569974507005-6dc61f97fb6d?w=400&q=80',
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80',
      'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
      'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&q=80',
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&q=80',
      'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=400&q=80',
      'https://images.unsplash.com/photo-1589641371014-d519a6a2b2da?w=400&q=80',
      'https://images.unsplash.com/photo-1568051243859-1b8090b60be6?w=400&q=80'
    ];

    const styles = ['Modern', 'Classic', 'Minimalist', 'Floral', 'Premium', 'Corporate', 'Vintage', 'Artistic', 'Bold', 'Elegant', 'Creative', 'Professional'];

    return {
      data: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: `${styles[i]} ${sName} Design`,
        description: `High-quality ${styles[i].toLowerCase()} template for your ${sName.toLowerCase()} needs.`,
        image_url: images[i % images.length]
      }))
    };
  },

  getQuotation: async (serviceId, quantity) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const price = quantity * 10;
    return {
      data: {
        selling_price: price * 0.8,
        gst_amount: price * 0.2,
        total_amount: price
      }
    };
  },

  uploadFile: async (file) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: { url: 'https://via.placeholder.com/150' } };
  },

  createOrder: async (orderData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: { message: 'Order created successfully' } };
  },

  submitReview: async (reviewData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { message: 'Review submitted' } };
  },

  downloadInvoicePdf: async (invoiceId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' };
  },

  // ── Gallery ──────────────────────────────────────────────────────────────
  _galleryImages: [
    { id: 1, title: 'Royal Wedding Invitation', category: 'wedding', tag: 'Premium', description: 'Gold-foil embossed wedding card with floral border', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1470058716159-e389f8712fda?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Gold', 'Cream', 'Rose Gold'], size: '5×7 inches', technique: 'Foil Embossing', price: 450, rating: 5, customer: 'Rajesh Kumar', complexity: 'High', turnaround: '5-7 days', materials: '300gsm Matte Paper', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', processSteps: [{ step: 1, title: 'Design & Approval', duration: '2 days' }, { step: 2, title: 'Plate Making', duration: '1 day' }, { step: 3, title: 'Foil Embossing', duration: '2 days' }, { step: 4, title: 'Quality Check', duration: '1 day' }, { step: 5, title: 'Packing & Dispatch', duration: '1 day' }] },
    { id: 2, title: 'Corporate Visiting Cards', category: 'visiting', tag: 'Business', description: 'Matte laminated double-sided business cards', image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1631734212768-4ff1e7a28436?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Navy Blue', 'White', 'Black'], size: '3.5×2 inches', technique: 'Offset Printing', price: 199, rating: 4.8, customer: 'Priya Sharma', complexity: 'Medium', turnaround: '3-4 days', materials: '250gsm Matte Paper', video: 'https://www.youtube.com/embed/jNQXAC9IVRw', processSteps: [{ step: 1, title: 'File Preparation', duration: '1 day' }, { step: 2, title: 'Plate Making', duration: '1 day' }, { step: 3, title: 'Offset Printing', duration: '1 day' }, { step: 4, title: 'Lamination', duration: '1 day' }, { step: 5, title: 'Cutting & Binding', duration: '1 day' }] },
    { id: 3, title: 'Event Poster Design', category: 'poster', tag: 'A2', description: 'Vibrant full-colour event poster for music festival', image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1516738901601-5194e41af337?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Neon Pink', 'Electric Blue', 'Yellow'], size: 'A2 (420×594mm)', technique: 'Digital Printing', price: 350, rating: 4.7, customer: 'Arjun Singh', complexity: 'High', turnaround: '2-3 days', materials: '150gsm Gloss Paper', video: 'https://www.youtube.com/embed/0bl1FkamEFg', processSteps: [{ step: 1, title: 'Design Concept', duration: '2 days' }, { step: 2, title: 'Digital Printing', duration: '1 day' }, { step: 3, title: 'Color Matching', duration: '6 hours' }, { step: 4, title: 'Cutting & Finishing', duration: '6 hours' }, { step: 5, title: 'QC & Packing', duration: '4 hours' }] },
    { id: 4, title: 'Outdoor Flex Banner', category: 'flex', tag: '10×4 ft', description: 'Weather-resistant outdoor banner for shop inauguration', image_url: 'https://images.unsplash.com/photo-1601084607411-07134e71a2a9?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1600858621957-c9a39a7b4d7e?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Red', 'Gold', 'White'], size: '10×4 feet', technique: 'Flex Printing', price: 2500, rating: 4.9, customer: 'Mohan Das', complexity: 'Medium', turnaround: '2-3 days', materials: '13oz Flex Banner', video: 'https://www.youtube.com/embed/0bl1FkamEFg', processSteps: [{ step: 1, title: 'Design Approval', duration: '1 day' }, { step: 2, title: 'Flex Printing', duration: '1 day' }, { step: 3, title: 'Lamination & Edges', duration: '1 day' }, { step: 4, title: 'Grommets Fitting', duration: '4 hours' }, { step: 5, title: 'Packing & Delivery', duration: '1 day' }] },
    { id: 5, title: 'Product Sticker Labels', category: 'sticker', tag: 'Waterproof', description: 'Custom die-cut vinyl stickers for product packaging', image_url: 'https://images.unsplash.com/photo-1599720234625-424a1f3e6f13?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Multi-color'], size: 'Custom Die-cut', technique: 'Digital Die-cut', price: 299, rating: 4.6, customer: 'Sunita Patel', complexity: 'High', turnaround: '4-5 days', materials: 'Vinyl Sticker Sheet', video: 'https://www.youtube.com/embed/jNQXAC9IVRw', processSteps: [{ step: 1, title: 'Design & Die Template', duration: '2 days' }, { step: 2, title: 'Digital Printing', duration: '1 day' }, { step: 3, title: 'Die Cutting', duration: '1 day' }, { step: 4, title: 'Lamination & UV Coating', duration: '1 day' }, { step: 5, title: 'QC & Packing', duration: '6 hours' }] },
    { id: 6, title: 'Offset Catalogue Print', category: 'offset', tag: '5000 pcs', description: 'A4 tri-fold brochure for a real estate company', image_url: 'https://images.unsplash.com/photo-1600858621957-c9a39a7b4d7e?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Multi-color'], size: 'A4 Tri-fold', technique: 'Offset Printing', price: 8500, rating: 4.8, customer: 'Nirupam Tech', complexity: 'High', turnaround: '7-10 days', materials: '150gsm Gloss Paper', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', processSteps: [{ step: 1, title: 'Prepress & Proofing', duration: '2 days' }, { step: 2, title: 'Plate Making', duration: '1 day' }, { step: 3, title: 'Offset Printing', duration: '3 days' }, { step: 4, title: 'Folding & Finishing', duration: '2 days' }, { step: 5, title: 'Binding & Packing', duration: '1 day' }] },
    { id: 7, title: 'Traditional Wedding Card', category: 'wedding', tag: 'Classic', description: 'Pastel-themed card with traditional Tamil script', image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Pastel Pink', 'Cream', 'Green'], size: '5×7 inches', technique: 'Offset Printing', price: 350, rating: 4.9, customer: 'Lakshmi Devi', complexity: 'Medium', turnaround: '5-6 days', materials: '250gsm Matte Paper', video: 'https://www.youtube.com/embed/0bl1FkamEFg', processSteps: [{ step: 1, title: 'Tamil Script Design', duration: '2 days' }, { step: 2, title: 'Color Separation', duration: '1 day' }, { step: 3, title: 'Offset Printing', duration: '2 days' }, { step: 4, title: 'Quality Check', duration: '1 day' }, { step: 5, title: 'Packing', duration: '1 day' }] },
    { id: 8, title: 'SunPack Name Board', category: 'flex', tag: 'SunPack', description: '4mm SunPack signboard for a pharmacy shop', image_url: 'https://images.unsplash.com/photo-1577720643272-265e434f6b5f?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1600858621957-c9a39a7b4d7e?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['White', 'Green', 'Black'], size: '3×2 feet', technique: 'SunPack Board', price: 1800, rating: 4.7, customer: 'MediCare Pharmacy', complexity: 'Low', turnaround: '3-4 days', materials: '4mm SunPack', video: 'https://www.youtube.com/embed/jNQXAC9IVRw', processSteps: [{ step: 1, title: 'Design & CNC Setup', duration: '1 day' }, { step: 2, title: 'Digital Printing', duration: '1 day' }, { step: 3, title: 'Lamination', duration: '6 hours' }, { step: 4, title: 'Edge Binding', duration: '6 hours' }, { step: 5, title: 'Installation Ready', duration: '4 hours' }] },
    { id: 9, title: 'Business Brochure', category: 'offset', tag: 'Gloss', description: 'Glossy 6-panel brochure for an IT company', image_url: 'https://images.unsplash.com/photo-1631734212768-4ff1e7a28436?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Blue', 'White', 'Gray'], size: 'A4 Tri-fold', technique: 'Offset Printing', price: 5500, rating: 4.6, customer: 'TechVision Inc', complexity: 'Medium', turnaround: '6-8 days', materials: '200gsm Gloss Paper', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', processSteps: [{ step: 1, title: 'Design & Prepress', duration: '2 days' }, { step: 2, title: 'Proof Approval', duration: '1 day' }, { step: 3, title: 'Offset Printing', duration: '2 days' }, { step: 4, title: 'Varnishing & Folding', duration: '1 day' }, { step: 5, title: 'Binding & Dispatch', duration: '1 day' }] },
    { id: 10, title: 'Restaurant Menu Cards', category: 'visiting', tag: 'Menu', description: 'Laminated table menu cards for a restaurant chain', image_url: 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Brown', 'Gold', 'Cream'], size: '8.5×11 inches', technique: 'Digital Printing', price: 2200, rating: 4.8, customer: 'Spice Route Restaurant', complexity: 'Medium', turnaround: '3-4 days', materials: '300gsm Matte Paper + Lamination', video: 'https://www.youtube.com/embed/0bl1FkamEFg', processSteps: [{ step: 1, title: 'Menu Design & Approval', duration: '1 day' }, { step: 2, title: 'Digital Printing', duration: '1 day' }, { step: 3, title: 'Lamination (Glossy)', duration: '6 hours' }, { step: 4, title: 'Hole Punching & Binding', duration: '6 hours' }, { step: 5, title: 'QC & Delivery', duration: '6 hours' }] },
    { id: 11, title: 'Festival Poster', category: 'poster', tag: 'A1', description: 'Full-bleed A1 colour poster for Pongal celebrations', image_url: 'https://images.unsplash.com/photo-1611339555312-e607c90352fd?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1516738901601-5194e41af337?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Orange', 'Red', 'Gold', 'Green'], size: 'A1 (594×841mm)', technique: 'Digital Printing', price: 650, rating: 4.9, customer: 'Tamil Cultural Org', complexity: 'High', turnaround: '2-3 days', materials: '150gsm Matte Paper', video: 'https://www.youtube.com/embed/jNQXAC9IVRw', processSteps: [{ step: 1, title: 'Cultural Design Brief', duration: '2 days' }, { step: 2, title: 'Digital Printing', duration: '1 day' }, { step: 3, title: 'Lamination & Finishing', duration: '6 hours' }, { step: 4, title: 'Cutting to Size', duration: '4 hours' }, { step: 5, title: 'Quality Check', duration: '2 hours' }] },
    { id: 12, title: 'Custom Die-cut Stickers', category: 'sticker', tag: 'Die-cut', description: 'Logo stickers for a startup product range', image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1599720234625-424a1f3e6f13?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Multi-color'], size: '2×2 inches', technique: 'Digital Die-cut', price: 450, rating: 4.7, customer: 'StartupHub Labs', complexity: 'High', turnaround: '4-6 days', materials: 'Premium Vinyl', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', processSteps: [{ step: 1, title: 'Logo Design & Dies', duration: '2 days' }, { step: 2, title: 'Digital Printing', duration: '1 day' }, { step: 3, title: 'Die Cutting & Sorting', duration: '1 day' }, { step: 4, title: 'Backing & Lamination', duration: '1 day' }, { step: 5, title: 'Final Packing', duration: '6 hours' }] },
    { id: 13, title: 'Marble Texture Wedding Card', category: 'wedding', tag: 'Luxury', description: 'White marble print with golden foil typography', image_url: 'https://images.unsplash.com/photo-1499156731035-c6400be6031c?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['White', 'Gold', 'Gray'], size: '5×7 inches', technique: 'Foil + Digital', price: 550, rating: 5, customer: 'Deepak & Anjali', complexity: 'High', turnaround: '6-7 days', materials: '350gsm Premium Paper', video: 'https://www.youtube.com/embed/0bl1FkamEFg', processSteps: [{ step: 1, title: 'Marble Texture Design', duration: '2 days' }, { step: 2, title: 'Digital Base Print', duration: '1 day' }, { step: 3, title: 'Foil Stamping', duration: '2 days' }, { step: 4, title: 'Edge Treatment', duration: '1 day' }, { step: 5, title: 'Packaging', duration: '1 day' }] },
    { id: 14, title: 'Minimalist Business Card', category: 'visiting', tag: 'Minimal', description: 'Clean white card with spot UV on the logo', image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1631734212768-4ff1e7a28436?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Black', 'White'], size: '3.5×2 inches', technique: 'Spot UV Printing', price: 250, rating: 4.8, customer: 'DesignStudio Co', complexity: 'Medium', turnaround: '4-5 days', materials: '300gsm Matte Paper', video: 'https://www.youtube.com/embed/jNQXAC9IVRw', processSteps: [{ step: 1, title: 'Minimalist Design', duration: '1 day' }, { step: 2, title: 'Offset Printing', duration: '1 day' }, { step: 3, title: 'Spot UV Application', duration: '1 day' }, { step: 4, title: 'Cutting & Quality', duration: '1 day' }, { step: 5, title: 'Final Packaging', duration: '1 day' }] },
    { id: 15, title: 'Film Event Flex Banner', category: 'flex', tag: '20×8 ft', description: 'Large-format flex for a movie premiere event', image_url: 'https://images.unsplash.com/photo-1589973405469-1d737fcc2da1?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1600858621957-c9a39a7b4d7e?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Black', 'Gold', 'Red'], size: '20×8 feet', technique: 'Flex Printing', price: 8000, rating: 4.9, customer: 'CinemaMax Premiere', complexity: 'High', turnaround: '3-4 days', materials: '13oz Flex Banner', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', processSteps: [{ step: 1, title: 'Event Creative Design', duration: '2 days' }, { step: 2, title: 'Large Format Printing', duration: '1 day' }, { step: 3, title: 'Lamination & Edges', duration: '1 day' }, { step: 4, title: 'Rope & Grommets', duration: '6 hours' }, { step: 5, title: 'QC & Delivery', duration: '6 hours' }] },
    { id: 16, title: 'Floral Invitation Card', category: 'wedding', tag: 'Floral', description: 'Tropical floral print on 300gsm silk paper', image_url: 'https://images.unsplash.com/photo-1532623518882-7953faedd32f?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Pink', 'Green', 'Cream'], size: '5×7 inches', technique: 'Offset Printing', price: 400, rating: 4.8, customer: 'Botanical Gardens', complexity: 'Medium', turnaround: '5-6 days', materials: '300gsm Silk Paper', video: 'https://www.youtube.com/embed/0bl1FkamEFg', processSteps: [{ step: 1, title: 'Floral Art Direction', duration: '2 days' }, { step: 2, title: 'Plate Making', duration: '1 day' }, { step: 3, title: 'Offset Printing', duration: '2 days' }, { step: 4, title: 'Hand Finishing', duration: '1 day' }, { step: 5, title: 'Packing', duration: '6 hours' }] },
    { id: 17, title: 'Offset Bill Book Printing', category: 'offset', tag: 'Bill Book', description: '50-page carbonless copy bill register with staple', image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1600858621957-c9a39a7b4d7e?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['White', 'Black', 'Blue'], size: 'A5 (50 pages)', technique: 'Offset Printing', price: 3500, rating: 4.7, customer: 'BizExpense Tracker', complexity: 'Medium', turnaround: '5-6 days', materials: 'Carbonless Copy Paper', video: 'https://www.youtube.com/embed/jNQXAC9IVRw', processSteps: [{ step: 1, title: 'Bill Template Design', duration: '1 day' }, { step: 2, title: 'Plate Making & Prep', duration: '1 day' }, { step: 3, title: 'Offset Printing', duration: '2 days' }, { step: 4, title: 'Numbering & Stapling', duration: '1 day' }, { step: 5, title: 'Binding & Delivery', duration: '1 day' }] },
    { id: 18, title: 'Holographic Sticker Pack', category: 'sticker', tag: 'Holo', description: 'Rainbow holographic vinyl stickers for brand merch', image_url: 'https://images.unsplash.com/photo-1599720234625-424a1f3e6f13?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Holographic Rainbow'], size: '2×2 inches', technique: 'Holographic Vinyl', price: 550, rating: 4.9, customer: 'MerchMasters Brand', complexity: 'High', turnaround: '5-7 days', materials: 'Holographic Vinyl Sheet', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', processSteps: [{ step: 1, title: 'Design & Vector Art', duration: '1 day' }, { step: 2, title: 'Holographic Selection', duration: '6 hours' }, { step: 3, title: 'Vinyl Cutting', duration: '1 day' }, { step: 4, title: 'Weeding & Quality', duration: '1 day' }, { step: 5, title: 'Application Ready', duration: '1 day' }] },
    { id: 19, title: 'Retail Shop Signboard', category: 'flex', tag: 'Banner', description: 'Digital flex with LED border for a clothing store', image_url: 'https://images.unsplash.com/photo-1600858621957-c9a39a7b4d7e?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1577720643272-265e434f6b5f?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['White', 'Black', 'Gold'], size: '8×6 feet', technique: 'Flex + LED Border', price: 6500, rating: 4.8, customer: 'FashionHub Store', complexity: 'High', turnaround: '4-5 days', materials: '13oz Flex + LED', video: 'https://www.youtube.com/embed/0bl1FkamEFg', processSteps: [{ step: 1, title: 'Shop Branding Design', duration: '1 day' }, { step: 2, title: 'Flex Printing', duration: '1 day' }, { step: 3, title: 'LED Border Integration', duration: '1 day' }, { step: 4, title: 'Lamination & Edges', duration: '1 day' }, { step: 5, title: 'Installation Support', duration: '1 day' }] },
    { id: 20, title: 'Concert Event Poster', category: 'poster', tag: 'A1', description: 'Neon-glow typography poster for a local music night', image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1516738901601-5194e41af337?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Neon Green', 'Purple', 'Black'], size: 'A1 (594×841mm)', technique: 'Digital + Neon', price: 700, rating: 4.9, customer: 'MusicFest 2024', complexity: 'High', turnaround: '2-3 days', materials: '150gsm Gloss Paper', video: 'https://www.youtube.com/embed/jNQXAC9IVRw', processSteps: [{ step: 1, title: 'Music Event Design', duration: '1 day' }, { step: 2, title: 'Neon Typography', duration: '6 hours' }, { step: 3, title: 'Digital Printing', duration: '1 day' }, { step: 4, title: 'Glow Effect Finishing', duration: '6 hours' }, { step: 5, title: 'Final QC', duration: '2 hours' }] },
    { id: 21, title: 'Luxury Wedding Envelope', category: 'wedding', tag: 'Set', description: 'Custom printed envelopes to match the invitation set', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Gold', 'Cream', 'Rose'], size: '5×7 inches', technique: 'Foil + Offset', price: 500, rating: 4.9, customer: 'Elite Weddings', complexity: 'High', turnaround: '6-8 days', materials: '300gsm Matte + Foil', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', processSteps: [{ step: 1, title: 'Envelope Design', duration: '1 day' }, { step: 2, title: 'Plate Making', duration: '1 day' }, { step: 3, title: 'Offset Printing', duration: '2 days' }, { step: 4, title: 'Foil Stamping', duration: '2 days' }, { step: 5, title: 'Assembly & Packing', duration: '1 day' }] },
    { id: 22, title: 'Digital Visiting Card', category: 'visiting', tag: 'Premium', description: 'Soft-touch laminated card with QR code and NFC tag', image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1631734212768-4ff1e7a28436?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Navy', 'Gold', 'White'], size: '3.5×2 inches', technique: 'Digital QR/NFC', price: 400, rating: 4.8, customer: 'TechCard Solutions', complexity: 'High', turnaround: '4-5 days', materials: '300gsm + Soft Touch', video: 'https://www.youtube.com/embed/0bl1FkamEFg', processSteps: [{ step: 1, title: 'QR/NFC Design & Testing', duration: '2 days' }, { step: 2, title: 'Digital Printing', duration: '1 day' }, { step: 3, title: 'Soft Touch Lamination', duration: '1 day' }, { step: 4, title: 'QR Verification', duration: '6 hours' }, { step: 5, title: 'Final Packing', duration: '6 hours' }] },
    { id: 23, title: 'Offset Leaflet Campaign', category: 'offset', tag: '10000 pcs', description: 'Political campaign leaflet on 90gsm matte paper', image_url: 'https://images.unsplash.com/photo-1631734212768-4ff1e7a28436?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1600858621957-c9a39a7b4d7e?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['Multi-color'], size: 'A5 Leaflet', technique: 'Offset Printing', price: 12000, rating: 4.7, customer: 'Campaign Organizers', complexity: 'Medium', turnaround: '8-10 days', materials: '90gsm Matte Paper', video: 'https://www.youtube.com/embed/jNQXAC9IVRw', processSteps: [{ step: 1, title: 'Campaign Content Finalize', duration: '2 days' }, { step: 2, title: 'Plate Making', duration: '1 day' }, { step: 3, title: 'Bulk Offset Printing', duration: '4 days' }, { step: 4, title: 'Folding & Collation', duration: '2 days' }, { step: 5, title: 'Packing & Distribution', duration: '1 day' }] },
    { id: 24, title: 'Tear-off Sticker Roll', category: 'sticker', tag: 'Roll', description: 'Barcode sticker rolls for supermarket shelves', image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&auto=format&fit=crop&crop=entropy', beforeImage: 'https://images.unsplash.com/photo-1599720234625-424a1f3e6f13?w=600&q=80&auto=format&fit=crop&crop=entropy', colors: ['White', 'Black', 'Red'], size: '2×1 inches', technique: 'Thermal Printing', price: 4500, rating: 4.8, customer: 'RetailChain Corp', complexity: 'Low', turnaround: '3-4 days', materials: 'Thermal Sticker Roll', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', processSteps: [{ step: 1, title: 'Barcode Integration', duration: '1 day' }, { step: 2, title: 'Thermal Printing', duration: '1 day' }, { step: 3, title: 'Roll Assembly', duration: '6 hours' }, { step: 4, title: 'QA & Testing', duration: '6 hours' }, { step: 5, title: 'Delivery Ready', duration: '4 hours' }] },
  ],

  getGallery: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { data: [...mockApi._galleryImages] };
  },

  addGalleryImage: async (imageData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newImage = { id: Date.now(), ...imageData };
    mockApi._galleryImages.push(newImage);
    return { data: newImage };
  },

  deleteGalleryImage: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockApi._galleryImages.findIndex(img => img.id === id);
    if (index !== -1) mockApi._galleryImages.splice(index, 1);
    return { data: { message: 'Deleted successfully' } };
  },

  // ── Enquiries ─────────────────────────────────────────────────────────────
  _enquiries: [
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@gmail.com', phone: '9876543210', subject: 'Wedding Invitation Quote', message: 'I need 500 wedding invitations for my daughter\'s wedding in March. Please provide a quote for premium paper with gold foil.', type: 'quote', service: 'Wedding Invitation Printing', status: 'pending', created_at: '2024-01-20T10:00:00Z' },
    { id: 2, name: 'Priya Sharma', email: 'priya@company.com', phone: '9123456789', subject: 'Bulk Business Cards', message: 'We need 1000 double-sided business cards for our team. Can you deliver by next week?', type: 'quote', service: 'Visiting Cards', status: 'resolved', created_at: '2024-01-18T14:30:00Z' },
    { id: 3, name: 'Mohan Das', email: '', phone: '9988776655', subject: 'Flex Banner for Shop', message: 'Need a 10x4 feet flex banner for my new shop opening. What is your rate per sq.ft?', type: 'contact', service: 'Flex Printing', status: 'pending', created_at: '2024-01-19T09:15:00Z' },
    { id: 4, name: 'Sunita Patel', email: 'sunita.patel@mail.com', phone: '9871234560', subject: 'Offset Printing Order', message: 'Need 5000 copies of a 4-page leaflet for our product launch event.', type: 'quote', service: 'Offset Printing', status: 'pending', created_at: '2024-01-21T11:45:00Z' },
    { id: 5, name: 'Arjun Singh', email: 'arjun@startup.io', phone: '9765432109', subject: 'General Query', message: 'Do you provide door-to-door delivery for large orders? And what are your payment options?', type: 'contact', service: '', status: 'resolved', created_at: '2024-01-17T16:00:00Z' },
  ],

  getEnquiries: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { data: [...mockApi._enquiries] };
  },

  submitEnquiry: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newEnquiry = {
      id: Date.now(),
      status: 'pending',
      created_at: new Date().toISOString(),
      type: data.type || 'contact',
      ...data
    };
    mockApi._enquiries.unshift(newEnquiry);
    return { data: newEnquiry };
  },

  resolveEnquiry: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const enq = mockApi._enquiries.find(e => e.id === id);
    if (enq) enq.status = 'resolved';
    return { data: { message: 'Resolved' } };
  }
};

export default mockApi;
