'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, X, Check, Phone, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '@/content/products';

interface ShowroomBookingProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductSlug?: string;
}

export default function ShowroomBooking({ isOpen, onClose, initialProductSlug }: ShowroomBookingProps) {
  const [selectedProduct, setSelectedProduct] = useState(
    initialProductSlug || PRODUCTS[0].slug
  );
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [visitorCount, setVisitorCount] = useState('2');
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen) return null;

  const timeSlots = [
    '10:30 AM', '11:30 AM', '12:30 PM', '2:00 PM', '3:30 PM', '5:00 PM', '6:30 PM'
  ];

  const handleWhatsAppBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const prod = PRODUCTS.find(p => p.slug === selectedProduct);
    const dateFormatted = new Date(selectedDate).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const msg = encodeURIComponent(
      `Hi Angel Tiles & Stone Jodhpur, I would like to book a slab viewing appointment:\n\n` +
      `📅 Date: ${dateFormatted}\n` +
      `🕒 Time Slot: ${selectedTime}\n` +
      `👥 Visitors: ${visitorCount} people\n` +
      `💎 Material of Interest: ${prod ? prod.name : 'Multiple Slabs'}\n\n` +
      `Please confirm slot availability at Shankar Nagar Showroom.`
    );

    window.open(`https://wa.me/918147941542?text=${msg}`, '_blank');
    setIsBooked(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in duration-300"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isBooked ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gold-400/10 border border-gold-400/30 rounded-full flex items-center justify-center mx-auto mb-6 text-gold-400">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl uppercase tracking-wider text-white mb-2">Booking Sent!</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed mb-6">
              Your appointment details have been compiled and sent via WhatsApp. Our team will review the slot and coordinate your slab viewing instantly.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-stone-800 hover:bg-stone-750 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors"
              >
                Close Booking Panel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleWhatsAppBooking} className="flex flex-col gap-6 text-xs text-stone-400 font-sans">
            <div>
              <span className="text-gold-400 text-[10px] font-bold uppercase tracking-[0.25em] block mb-1">
                Showroom Visit
              </span>
              <h3 className="font-serif text-xl md:text-2xl text-white uppercase tracking-wider">
                Book a Slab Viewing
              </h3>
              <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                Select a date and time slot below to schedule a personal lot walkthrough at our Mandore Road yard in Jodhpur.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Product Selector */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-white uppercase tracking-wider">Slab of Interest</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="bg-stone-950 border border-stone-850 rounded px-3 py-2.5 text-white focus:outline-none focus:border-gold-400 cursor-pointer"
                >
                  {PRODUCTS.map(p => (
                    <option key={p.slug} value={p.slug}>{p.name} ({p.category.toUpperCase()})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Date Picker */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-white uppercase tracking-wider">Select Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full bg-stone-950 border border-stone-850 rounded px-3 py-2.5 text-white focus:outline-none focus:border-gold-400 cursor-pointer appearance-none"
                    />
                  </div>
                </div>

                {/* Visitor Count */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-white uppercase tracking-wider">Visitor Count</label>
                  <select
                    value={visitorCount}
                    onChange={(e) => setVisitorCount(e.target.value)}
                    className="bg-stone-950 border border-stone-850 rounded px-3 py-2.5 text-white focus:outline-none focus:border-gold-400 cursor-pointer"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4+ People</option>
                  </select>
                </div>
              </div>

              {/* Time Slots */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-white uppercase tracking-wider">Preferred Time Slot</label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 rounded text-[9px] font-bold uppercase tracking-wider border text-center transition-all ${
                        selectedTime === slot
                          ? 'bg-gold-400 border-gold-400 text-stone-950 shadow-md shadow-gold-500/20'
                          : 'bg-stone-950 border-stone-850 text-stone-400 hover:text-white hover:border-stone-750'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Showroom info banner */}
            <div className="flex gap-2.5 p-3.5 bg-stone-950 rounded-lg border border-stone-850 items-start">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-white font-bold block">Angel Shankar Nagar Showroom</span>
                <span className="text-[9px] text-stone-600 block mt-0.5 leading-normal">
                  Shankar Nagar Showroom Studio is open 8 AM to 11 PM daily (Prior booking welcomed).
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gold-500/20"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Request Booking on WhatsApp</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
