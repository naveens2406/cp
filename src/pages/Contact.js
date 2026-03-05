import React, { useState } from 'react';
import { Sun, MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import mockApi from '../services/mockApi';

const WHATSAPP_NUMBER = '919876543210';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await mockApi.submitEnquiry({ ...formData, type: 'contact' });
      toast.success('Message sent! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappLink = (msg = 'Hello! I would like to enquire about your printing services.') =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
            <Sun className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Have questions? Need a quote? We're just a message away!
          </p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: Info + Map */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-5">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      No. 45, Market Street, Near Bus Stand,<br />
                      Coimbatore – 641 001,<br />
                      Tamil Nadu, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-50 rounded-xl flex-shrink-0">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Call / WhatsApp</h3>
                    <a href="tel:+919876543210" className="text-primary hover:underline text-sm block">+91 98765 43210</a>
                    <a href="tel:+919123456789" className="text-primary hover:underline text-sm block">+91 91234 56789</a>
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 text-green-600 hover:underline text-sm mt-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 rounded-xl flex-shrink-0">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a href="mailto:info@sunlightprinters.com" className="text-primary hover:underline text-sm block">info@sunlightprinters.com</a>
                    <p className="text-xs text-gray-400 mt-1">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-yellow-50 rounded-xl flex-shrink-0">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between space-x-8">
                        <span>Mon – Sat:</span><span className="font-medium">9:00 AM – 7:00 PM</span>
                      </div>
                      <div className="flex justify-between space-x-8">
                        <span>Sunday:</span><span className="font-medium">10:00 AM – 4:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Find Us on Map</span>
                </h3>
              </div>
              <div className="relative">
                <iframe
                  title="Sunlight Offset Printers Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.2688548956424!2d76.97534737416!3d11.00419038917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba857d3d4a7bde7%3A0x9faa5c2a9d3f8c66!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-3 bg-gray-50">
                <a
                  href="https://maps.google.com?q=Coimbatore+Tamil+Nadu"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary hover:underline flex items-center space-x-1"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-500 text-sm mb-6">We'll get back to you within 2 hours during business hours.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="form-label">Full Name *</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="form-input" placeholder="Rajesh Kumar" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="form-label">Phone Number *</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="form-input" placeholder="+91 98765 43210" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="you@example.com" />
                </div>

                <div>
                  <label htmlFor="subject" className="form-label">Subject *</label>
                  <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="form-input" placeholder="What can we help you with?" />
                </div>

                <div>
                  <label htmlFor="message" className="form-label">Message *</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} className="form-input" placeholder="Tell us about your printing requirements..." />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-60 py-3"
                  >
                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <><Send className="h-5 w-5" /><span>Send Message</span></>}
                  </button>
                  <a
                    href={whatsappLink(`Hi! I have a query: ${formData.subject || 'Printing enquiry'}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </form>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <a
                href="/gallery"
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-2xl mb-1">🖼️</div>
                <p className="text-sm font-medium text-gray-900">View Gallery</p>
                <p className="text-xs text-gray-400">See our work</p>
              </a>
              <a
                href="/get-quote"
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-2xl mb-1">💰</div>
                <p className="text-sm font-medium text-gray-900">Get a Quote</p>
                <p className="text-xs text-gray-400">Free estimate</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
};

export default Contact;
