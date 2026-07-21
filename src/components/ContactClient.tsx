'use client';

import { useState, useRef } from 'react';
import { Send, Phone, Mail, Clock, MapPin, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function ContactClient() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    timeSlot: '10:00 AM - 12:00 PM',
    message: '',
    interest: 'imported-marble',
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useGSAP(() => {
    // Header reveals
    gsap.fromTo('.contact-reveal-header', 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out' }
    );
    // Contact cards reveal
    gsap.fromTo('.contact-card',
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.contact-grid',
          start: 'top 90%',
        }
      }
    );
    // Map reveal
    gsap.fromTo('.contact-map',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.contact-map',
          start: 'top 90%',
        }
      }
    );
    // Form reveal
    gsap.fromTo('.contact-form-container',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.contact-form-container',
          start: 'top 90%',
        }
      }
    );
  }, []);

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
      const response = await fetch('https://formspree.io/f/xoqypqrz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...formState,
          _subject: `New Slab Viewing Request from ${formState.name} (${formState.interest})`,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormState({
          name: '',
          email: '',
          phone: '',
          preferredDate: '',
          timeSlot: '10:00 AM - 12:00 PM',
          message: '',
          interest: 'imported-marble',
        });
      } else {
        throw new Error('Failed to submit booking request. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server connection error. Please try again later.');
      setStatus('error');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="relative min-h-screen bg-stone-950 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full">
        {/* Page Header */}
        <div className="max-w-2xl mb-16">
          <span className="contact-reveal-header text-garnet-400 text-xs font-bold uppercase tracking-[0.3em] block mb-4">
            Visit Studio
          </span>
          <h1 className="contact-reveal-header font-serif text-4xl md:text-6xl uppercase tracking-wide text-silver-100 mb-6">
            Schedule <span className="italic text-garnet-foil">Studio Visit</span>
          </h1>
          <p className="contact-reveal-header text-silver-300 text-sm leading-relaxed">
            Ready to inspect premium marble slabs and vitrified tile displays in person? Reserve a personal viewing appointment below or visit our Shankar Nagar studio at Pipli Chouraha, Jodhpur.
          </p>
        </div>

        {/* Contact details grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-start">
          
          {/* Left Column: Contact details */}
          <div className="flex flex-col gap-8">
            <div className="contact-grid grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-silver-300 font-sans">
              <div className="contact-card border border-stone-900 rounded-xl p-6 bg-stone-900/30 flex flex-col gap-3">
                <MapPin className="w-6 h-6 text-garnet-400" />
                <h4 className="font-bold text-silver-100 uppercase tracking-wider">Showroom Address</h4>
                <p className="leading-relaxed text-stone-400">
                  Krishna Kunj, 197, Pipli Chouraha, Shankar Nagar, Bhadu Market, Jodhpur, Rajasthan 342008
                </p>
              </div>

              <div className="contact-card border border-stone-900 rounded-xl p-6 bg-stone-900/30 flex flex-col gap-3">
                <Phone className="w-6 h-6 text-garnet-400" />
                <h4 className="font-bold text-silver-100 uppercase tracking-wider">Phone & WhatsApp</h4>
                <div className="text-stone-400 text-xs flex flex-col gap-2">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-semibold block">Main Studio Line (Sekhar Ji):</span>
                    <a href="https://wa.me/919929548511" target="_blank" rel="noopener noreferrer" className="text-silver-100 font-semibold hover:text-garnet-400 transition-colors">+91 99295 48511</a>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-semibold block">Direct Sales (Sanjeev Sharma Ji):</span>
                    <a href="https://wa.me/919928700997" target="_blank" rel="noopener noreferrer" className="text-silver-100 font-semibold hover:text-garnet-400 transition-colors">+91 99287 00997</a>
                  </div>
                </div>
              </div>

              <div className="contact-card border border-stone-900 rounded-xl p-6 bg-stone-900/30 flex flex-col gap-3">
                <Mail className="w-6 h-6 text-garnet-400" />
                <h4 className="font-bold text-silver-100 uppercase tracking-wider">Email Correspondence</h4>
                <p className="text-stone-400">
                  Direct Email: <br />
                  <a href="mailto:angeltilesju@gmail.com" className="text-silver-200 hover:text-garnet-400 transition-colors">angeltilesju@gmail.com</a>
                </p>
              </div>

              <div className="contact-card border border-stone-900 rounded-xl p-6 bg-stone-900/30 flex flex-col gap-3">
                <Clock className="w-6 h-6 text-garnet-400" />
                <h4 className="font-bold text-silver-100 uppercase tracking-wider">Showroom Hours</h4>
                <p className="text-stone-400">
                  10:00 AM – 6:00 PM <br />
                  Monday – Sunday (7 Days Open)
                </p>
              </div>
            </div>

            {/* Map Embed */}
            <div className="contact-map relative h-[300px] rounded-xl overflow-hidden border border-stone-900">
              <iframe
                title="Angel Tiles Showroom Location Map"
                src="https://maps.google.com/maps?q=Angel%20Tiles%20and%20Stone%20Studio%20Pipli%20Chouraha%20Jodhpur&t=&z=15&ie=UTF8&iwloc=&output=embed"
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

          {/* Right Column: Slab Viewing Appointment Form */}
          <div className="contact-form-container border border-stone-900 rounded-xl p-8 bg-stone-900/30">
            <h3 className="font-serif text-xl md:text-2xl text-silver-100 uppercase tracking-wider mb-6 border-b border-stone-900 pb-4">
              Book a Slab Viewing
            </h3>

            {status === 'success' ? (
              <div className="flex flex-col items-center text-center py-10 text-xs text-silver-300">
                <CheckCircle className="w-16 h-16 text-garnet-400 mb-6" />
                <h4 className="text-silver-100 text-base font-bold uppercase tracking-wider mb-2">Viewing Appointment Requested!</h4>
                <p className="max-w-xs leading-relaxed text-stone-400">
                  Thank you for scheduling with Angel Tiles & Stone. Our team will confirm your viewing slot and contact you via WhatsApp.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-6 py-2.5 border border-stone-800 rounded-full text-[10px] font-bold uppercase tracking-wider text-silver-200 hover:text-silver-50 hover:border-garnet-400/40 transition-colors"
                >
                  Book Another Appointment
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-xs text-silver-300 font-sans">
                {status === 'error' && (
                  <div className="flex gap-2 p-3.5 bg-garnet-900/30 border border-garnet-500/40 rounded-lg text-garnet-300 font-medium">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-semibold text-silver-100 uppercase tracking-wider">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Sanjeev Sharma"
                      className="bg-stone-950 border border-stone-800 rounded px-4 py-3 text-silver-100 focus:outline-none focus:border-garnet-400 transition-colors"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="font-semibold text-silver-100 uppercase tracking-wider">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="e.g. +91 81479 41542"
                      className="bg-stone-950 border border-stone-800 rounded px-4 py-3 text-silver-100 focus:outline-none focus:border-garnet-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-semibold text-silver-100 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="e.g. sanjeev@architects.com"
                      className="bg-stone-950 border border-stone-800 rounded px-4 py-3 text-silver-100 focus:outline-none focus:border-garnet-400 transition-colors"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="interest" className="font-semibold text-silver-100 uppercase tracking-wider">Primary Material</label>
                    <select
                      id="interest"
                      value={formState.interest}
                      onChange={(e) => setFormState({ ...formState, interest: e.target.value })}
                      className="bg-stone-950 border border-stone-800 rounded px-4 py-3 text-silver-100 focus:outline-none focus:border-garnet-400 transition-colors"
                    >
                      <option value="imported-marble">Imported Marble Slabs</option>
                      <option value="domestic-marble">Domestic Marble (Makrana/Indian)</option>
                      <option value="granite">High Density Granite Slabs</option>
                      <option value="tiles">Vitrified & Floor Tiles</option>
                      <option value="custom-tiles">Custom Architectural Tiles</option>
                      <option value="digital-3d-7d-tiles">Digital 3D / 7D Tiles</option>
                      <option value="ceramic-crystal-tiles">Ceramic Crystal Tiles</option>
                      <option value="sanitary-items">Sanitaryware & Fittings</option>
                    </select>
                  </div>
                </div>

                {/* Date & Time Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Preferred Date */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="preferredDate" className="font-semibold text-silver-100 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-garnet-400" />
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      id="preferredDate"
                      min={today}
                      value={formState.preferredDate}
                      onChange={(e) => setFormState({ ...formState, preferredDate: e.target.value })}
                      className="bg-stone-950 border border-stone-800 rounded px-4 py-3 text-silver-100 focus:outline-none focus:border-garnet-400 transition-colors"
                    />
                  </div>

                  {/* Preferred Time Slot */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="timeSlot" className="font-semibold text-silver-100 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-garnet-400" />
                      Preferred Slot (10 AM - 6 PM)
                    </label>
                    <select
                      id="timeSlot"
                      value={formState.timeSlot}
                      onChange={(e) => setFormState({ ...formState, timeSlot: e.target.value })}
                      className="bg-stone-950 border border-stone-800 rounded px-4 py-3 text-silver-100 focus:outline-none focus:border-garnet-400 transition-colors"
                    >
                      <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                      <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                      <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-semibold text-silver-100 uppercase tracking-wider">Project Notes / Requirements</label>
                  <textarea
                    id="message"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="e.g. Requiring approx 2,500 sq ft book-matched Statuario marble for villa living area."
                    rows={4}
                    className="bg-stone-950 border border-stone-800 rounded px-4 py-3 text-silver-100 focus:outline-none focus:border-garnet-400 resize-none transition-colors"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-garnet-500 to-garnet-600 hover:from-garnet-600 hover:to-garnet-700 text-silver-50 font-bold text-xs uppercase tracking-widest rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-md shadow-garnet-900/30 border border-garnet-400/30"
                  data-cursor="submit"
                >
                  <Send className="w-4 h-4 text-silver-50" />
                  <span>{status === 'loading' ? 'Scheduling...' : 'Book a Slab Viewing'}</span>
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

