/**
 * translations.js — English & Tamil strings for Sunlight Offset Printers
 * Usage: import t from '../i18n/translations'; then t[lang].key
 */
const translations = {
    en: {
        // ── Navbar ────────────────────────────────────────────────────────────
        nav: {
            home: 'Home',
            about: 'About',
            services: 'Services',
            gallery: 'Gallery',
            pricing: 'Pricing',
            getQuote: 'Get Quote',
            faq: 'FAQ',
            contact: 'Contact',
            login: 'Login',
            adminLogin: 'Admin',
            dashboard: 'Dashboard',
            logout: 'Logout',
        },

        // ── Hero Carousel ─────────────────────────────────────────────────────
        hero: [
            {
                tag: '🎉 Special Offer',
                title: 'Premium Wedding Invitation Printing',
                subtitle: 'Make your special day unforgettable with our elegant, customised invitation cards.',
                cta: 'Get a Free Quote',
            },
            {
                tag: '📣 Best Quality',
                title: 'High-Volume Offset Printing',
                subtitle: 'Brochures, leaflets, registers, and more — delivered fast with sharp print quality.',
                cta: 'Order Now',
            },
            {
                tag: '🎨 Wide Format',
                title: 'Flex & SunPack Printing',
                subtitle: 'Eye-catching outdoor banners and signboards that make your brand impossible to miss.',
                cta: 'View Gallery',
            },
        ],

        // ── Stats ─────────────────────────────────────────────────────────────
        stats: {
            happyCustomers: 'Happy Customers',
            projectsDone: 'Projects Done',
            yearsExp: 'Years Experience',
            starReviews: '5-Star Reviews',
        },

        // ── Services Section ──────────────────────────────────────────────────
        sections: {
            ourServices: 'Our Services',
            everythingToPrint: 'Everything You Need to Print',
            servicesDesc: 'Professional quality printing for all your personal and business needs.',
            whyUs: 'Why Us?',
            sunlightDiff: 'The Sunlight Difference',
            testimonials: 'Reviews',
            whatCustomersSay: 'What Our Customers Say',
            recentWork: 'Recent Work',
            viewAll: 'View all',
            readyToPrint: 'Ready to Start Printing?',
            getQuoteDesc: 'Get a free quote in minutes. Our team will get back to you within 2 hours!',
            getFreeQuote: 'Get Free Quote',
            chatWhatsApp: 'Chat on WhatsApp',
        },

        // ── Services Page ─────────────────────────────────────────────────────
        servicesPage: {
            title: 'Our Services',
            subtitle: 'Choose from our wide range of professional printing services',
            calculator: 'Instant Price Calculator',
            estimate: 'Estimate Your Project Cost',
            calcDesc: 'Select a service and adjust the quantity to see live pricing including GST and bulk discounts.',
            subtotal: 'Subtotal',
            totalGST: 'Total (Incl. GST)',
            chooseService: 'Choose Service',
            quantity: 'Quantity',
            units: 'Units',
            orderNow: 'Order This Now',
            bulkDiscount: 'You unlocked a {n}% Bulk Discount!',
            searchPlaceholder: 'Search services...',
            filter: 'Filter',
            hoverHint: 'Hover to see details →',
            noServices: 'No services found',
            clearSearch: 'Clear Search',
            whyChoose: 'Why Choose Our Services?',
        },

        // ── About Page ────────────────────────────────────────────────────────
        about: {
            title: 'About Us',
            subtitle: "Coimbatore's trusted printing partner since 2015",
            ourStory: 'Our Story',
            storyText: 'Sunlight Offset Printers started with a single Risograph machine and a dream to deliver premium print quality at honest prices. Today, we serve over 500 happy customers across Coimbatore and continue to grow.',
            ourTeam: 'Our Team',
            ourJourney: 'Our Journey',
        },

        // ── Contact Page ──────────────────────────────────────────────────────
        contact: {
            title: 'Contact Us',
            subtitle: "Have questions? Need a quote? We're just a message away!",
            chatWhatsApp: 'Chat on WhatsApp',
            yourName: 'Your Name',
            email: 'Email Address',
            phone: 'Phone Number',
            subject: 'Subject',
            message: 'Your Message',
            send: 'Send Message',
            sending: 'Sending...',
        },

        // ── Trust Badges ──────────────────────────────────────────────────────
        trust: {
            gst: '✓ GST Invoice',
            fastDelivery: '✓ Fast Delivery',
            satisfaction: '✓ 100% Satisfaction',
        },
    },

    // ════════════════════════════════════════════════════════════════════════
    ta: {
        // ── Navbar ────────────────────────────────────────────────────────────
        nav: {
            home: 'முகப்பு',
            about: 'பற்றி',
            services: 'சேவைகள்',
            gallery: 'கேலரி',
            pricing: 'விலை',
            getQuote: 'மதிப்பீடு பெறுங்கள்',
            faq: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
            contact: 'தொடர்பு',
            login: 'உள்நுழைவு',
            adminLogin: 'நிர்வாகி',
            dashboard: 'டாஷ்போர்டு',
            logout: 'வெளியேறு',
        },

        // ── Hero Carousel ─────────────────────────────────────────────────────
        hero: [
            {
                tag: '🎉 சிறப்பு சலுகை',
                title: 'திருமண அழைப்பிதழ் அச்சிடல்',
                subtitle: 'உங்கள் சிறப்பு நாளை மறக்க முடியாத அனுபவமாக்கும் அழகிய அழைப்பிதழ்கள்.',
                cta: 'இலவச மதிப்பீடு பெறுங்கள்',
            },
            {
                tag: '📣 சிறந்த தரம்',
                title: 'அதிக அளவு ஆஃப்செட் அச்சிடல்',
                subtitle: 'துண்டறிக்கைகள், வியாபார ஏடுகள் மற்றும் பலவற்றை வேகமாகவும் தரமாகவும் அச்சிடுகிறோம்.',
                cta: 'இப்போது ஆர்டர் செய்யுங்கள்',
            },
            {
                tag: '🎨 பரந்த வடிவம்',
                title: 'ஃப்ளெக்ஸ் & சன்பேக் அச்சிடல்',
                subtitle: 'உங்கள் பிராண்டை தனித்து காட்டும் கண்கவர் வெளிப்புற பதாகைகள் மற்றும் அடையாளப் பலகைகள்.',
                cta: 'கேலரி பாருங்கள்',
            },
        ],

        // ── Stats ─────────────────────────────────────────────────────────────
        stats: {
            happyCustomers: 'மகிழ்சியான வாடிக்கையாளர்கள்',
            projectsDone: 'முடிக்கப்பட்ட திட்டங்கள்',
            yearsExp: 'ஆண்டுகள் அனுபவம்',
            starReviews: '5 நட்சத்திர மதிப்புரைகள்',
        },

        // ── Services Section ──────────────────────────────────────────────────
        sections: {
            ourServices: 'எங்கள் சேவைகள்',
            everythingToPrint: 'அச்சிட தேவையான அனைத்தும்',
            servicesDesc: 'உங்கள் தனிப்பட்ட மற்றும் வணிக தேவைகளுக்கான தொழில்முறை அச்சிடல் சேவைகள்.',
            whyUs: 'ஏன் நாங்கள்?',
            sunlightDiff: 'சன்லைட் வித்தியாசம்',
            testimonials: 'மதிப்புரைகள்',
            whatCustomersSay: 'வாடிக்கையாளர்கள் என்ன கூறுகிறார்கள்',
            recentWork: 'சமீபத்திய வேலைகள்',
            viewAll: 'அனைத்தும் பாருங்கள்',
            readyToPrint: 'அச்சிட தயாரா?',
            getQuoteDesc: 'சில நிமிடங்களில் இலவச மதிப்பீடு பெறுங்கள். 2 மணி நேரத்தில் திரும்ப வருவோம்!',
            getFreeQuote: 'இலவச மதிப்பீடு பெறுங்கள்',
            chatWhatsApp: 'வாட்சாப்பில் பேசுங்கள்',
        },

        // ── Services Page ─────────────────────────────────────────────────────
        servicesPage: {
            title: 'எங்கள் சேவைகள்',
            subtitle: 'பரந்த வகையிலான தொழில்முறை அச்சிடல் சேவைகளிலிருந்து தேர்வு செய்யுங்கள்',
            calculator: 'உடனடி விலைக் கணிப்பு',
            estimate: 'உங்கள் திட்டத்தின் செலவை மதிப்பிடுங்கள்',
            calcDesc: 'சேவையைத் தேர்ந்தெடுத்து அளவை சரிசெய்து GST மற்றும் மொத்த தள்ளுபடிகள் உட்பட நேரடி விலையைப் பாருங்கள்.',
            subtotal: 'மொத்தம்',
            totalGST: 'மொத்தம் (GST உட்பட)',
            chooseService: 'சேவையைத் தேர்ந்தெடுங்கள்',
            quantity: 'அளவு',
            units: 'அலகுகள்',
            orderNow: 'இப்போது ஆர்டர் செய்யுங்கள்',
            bulkDiscount: '{n}% மொத்த தள்ளுபடி கிடைத்தது!',
            searchPlaceholder: 'சேவைகளை தேடுங்கள்...',
            filter: 'வடிகட்டு',
            hoverHint: 'விவரங்களுக்கு வட்டி நகர்த்துங்கள் →',
            noServices: 'சேவைகள் கிடைக்கவில்லை',
            clearSearch: 'தேடலை அழிக்கவும்',
            whyChoose: 'ஏன் எங்கள் சேவைகளை தேர்வு செய்யவேண்டும்?',
        },

        // ── About Page ────────────────────────────────────────────────────────
        about: {
            title: 'எங்களைப் பற்றி',
            subtitle: '2015 முதல் கோவையின் நம்பகமான அச்சிடல் பங்காளி',
            ourStory: 'எங்கள் கதை',
            storyText: 'சன்லைட் ஆஃப்செட் பிரிண்டர்ஸ் ஒரு ரைசோகிராஃப் இயந்திரத்துடன் தொடங்கி, நேர்மையான விலையில் சிறந்த தர அச்சிடல் வழங்கும் கனவுடன் கோவையில் 500க்கும் மேற்பட்ட வாடிக்கையாளர்களுக்கு சேவை செய்கிறோம்.',
            ourTeam: 'எங்கள் குழு',
            ourJourney: 'எங்கள் பயணம்',
        },

        // ── Contact Page ──────────────────────────────────────────────────────
        contact: {
            title: 'தொடர்பு கொள்ளுங்கள்',
            subtitle: 'கேள்விகள் உள்ளதா? மதிப்பீடு வேண்டுமா? ஒரு செய்தி மட்டுமே!',
            chatWhatsApp: 'வாட்சாப்பில் பேசுங்கள்',
            yourName: 'உங்கள் பெயர்',
            email: 'மின்னஞ்சல் முகவரி',
            phone: 'தொலைபேசி எண்',
            subject: 'தலைப்பு',
            message: 'உங்கள் செய்தி',
            send: 'செய்தி அனுப்பு',
            sending: 'அனுப்புகிறோம்...',
        },

        // ── Trust Badges ──────────────────────────────────────────────────────
        trust: {
            gst: '✓ GST விலைப்பட்டியல்',
            fastDelivery: '✓ விரைவான டெலிவரி',
            satisfaction: '✓ 100% திருப்தி',
        },
    },
};

export default translations;
