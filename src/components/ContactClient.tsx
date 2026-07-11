'use client';

import { useState } from 'react';
import { Send, Phone, Mail, Clock, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactClient() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interest: 'marble',
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.name || !formState.phone) {
      setErrorMessage('Please fill out your Name and Phone Number.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Formspree Form ID endpoint - using Web3Forms or Formspree placeholder endpoint
      const response = await fetch('https://formspree.io/f/xoqypqrz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...formState,
          _subject: `New Sourcing Inquiry from ${formState.name} (${formState.interest})`,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormState({
          name: '',
          email: '',
          phone: '',
          message: '',
          interest: 'marble',
        });
      } else {
        throw new Error('Failed to submit enquiry. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server connection error. Please try again later.');
      setStatus('error');
    }
  };

  return (
    <div className="relative min-h-screen bg-stone-950 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full">
        {/* Page Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.3em] block mb-4">
            Visit Studio
          </span>
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
            Connect With <span className="italic text-gold-foil">Our Studio</span>
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed">
            Ready to inspect premium slabs in person? Submit your requirements below, or head over to our Mandore Road showroom to inspect block runs.
          </p>
        </div>

        {/* Contact details grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-start">
          
          {/* Left Column: Contact details */}
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-stone-400 font-sans">
              <div className="border border-stone-900 rounded-xl p-6 bg-stone-900/10 flex flex-col gap-3">
                <MapPin className="w-6 h-6 text-gold-400" />
                <h4 className="font-bold text-white uppercase tracking-wider">Showroom Address</h4>
                <p className="leading-relaxed">
                  Plot No. 12, Industrial Area, Opposite New Mandi, Mandore Road, Jodhpur, Rajasthan, 342007
                </p>
              </div>

              <div className="border border-stone-900 rounded-xl p-6 bg-stone-900/10 flex flex-col gap-3">
                <Phone className="w-6 h-6 text-gold-400" />
                <h4 className="font-bold text-white uppercase tracking-wider">Phone & WhatsApp</h4>
                <p>
                  Slab Sourcing: +91 98765 43210 <br />
                  Office Landline: 0291 2940022
                </p>
              </div>

              <div className="border border-stone-900 rounded-xl p-6 bg-stone-900/10 flex flex-col gap-3">
                <Mail className="w-6 h-6 text-gold-400" />
                <h4 className="font-bold text-white uppercase tracking-wider">Email Correspondence</h4>
                <p>
                  General: info@angeltilesandstone.com <br />
                  Sourcing: orders@angeltilesandstone.com
                </p>
              </div>

              <div className="border border-stone-900 rounded-xl p-6 bg-stone-900/10 flex flex-col gap-3">
                <Clock className="w-6 h-6 text-gold-400" />
                <h4 className="font-bold text-white uppercase tracking-wider">Showroom Hours</h4>
                <p>
                  Monday - Saturday: 10:00 AM - 8:30 PM <br />
                  Sunday: Closed (Prior Booking Only)
                </p>
              </div>
            </div>

            {/* Map Embed */}
            <div className="relative h-[300px] rounded-xl overflow-hidden border border-stone-900">
              <iframe
                title="Angel Tiles Showroom Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14304.774431876558!2d73.04273874999999!3d26.31976075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418c39e2fdbdf9%3A0xe54d924cb4d142bd!2sMandore%20Road%2C%20Jodhpur%2C%20Rajasthan%20342007!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
            </div>
          </div>

          {/* Right Column: Sourcing Enquiry Form */}
          <div className="border border-stone-900 rounded-xl p-8 bg-stone-900/10">
            <h3 className="font-serif text-xl md:text-2xl text-white uppercase tracking-wider mb-6 border-b border-stone-900 pb-4">
              Enquiry Form
            </h3>

            {status === 'success' ? (
              <div className="flex flex-col items-center text-center py-10 text-xs text-stone-400">
                <CheckCircle className="w-16 h-16 text-gold-400 mb-6" />
                <h4 className="text-white text-base font-bold uppercase tracking-wider mb-2">Enquiry Submitted!</h4>
                <p className="max-w-xs leading-relaxed">
                  Thank you for connecting with Angel Tiles & Stone. Our sourcing executive will review your dimensions and contact you shortly via WhatsApp/Email.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-6 py-2.5 border border-stone-800 rounded-full text-[10px] font-bold uppercase tracking-wider hover:text-white transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-xs text-stone-400 font-sans">
                {status === 'error' && (
                  <div className="flex gap-2 p-3.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 font-medium">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-semibold text-white uppercase tracking-wider">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Rajvardhan Singh"
                      className="bg-stone-950 border border-stone-900 rounded px-4 py-3 text-white focus:outline-none focus:border-gold-400"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="font-semibold text-white uppercase tracking-wider">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="bg-stone-950 border border-stone-900 rounded px-4 py-3 text-white focus:outline-none focus:border-gold-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-semibold text-white uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="e.g. raj@luxuryinteriors.com"
                      className="bg-stone-950 border border-stone-900 rounded px-4 py-3 text-white focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="interest" className="font-semibold text-white uppercase tracking-wider">Material Interest</label>
                    <select
                      id="interest"
                      value={formState.interest}
                      onChange={(e) => setFormState({ ...formState, interest: e.target.value })}
                      className="bg-stone-950 border border-stone-900 rounded px-4 py-3 text-white focus:outline-none focus:border-gold-400"
                    >
                      <option value="marble">Italian / Indian Marble Slabs</option>
                      <option value="granite">High Density Granite Countertops</option>
                      <option value="tiles">Large Format Vitrified Tiles</option>
                      <option value="sanitaryware">Rimless Closets & Basin fittings</option>
                      <option value="all">Multiple Categories</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-semibold text-white uppercase tracking-wider">Inquiry details / Dimensions</label>
                  <textarea
                    id="message"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="e.g. Looking for approx 2,500 sq ft book-matched Statuario marble for living room floor. Please share active lot details."
                    rows={5}
                    className="bg-stone-950 border border-stone-900 rounded px-4 py-3 text-white focus:outline-none focus:border-gold-400 resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  data-cursor="submit"
                >
                  <Send className="w-4 h-4" />
                  <span>{status === 'loading' ? 'Sending Enquiry...' : 'Submit Sourcing Enquiry'}</span>
                </button>
              </form>
            )}
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
