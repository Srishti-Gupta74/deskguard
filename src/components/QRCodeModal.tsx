import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Download, QrCode } from 'lucide-react';

interface QRCodeModalProps {
  seatCode: string;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ seatCode, onClose }) => {
  const url = `${window.location.origin}/seat/${seatCode}`;

  const handleDownload = () => {
    const canvas = document.querySelector<HTMLCanvasElement>('#qr-canvas canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `DeskGuard-${seatCode}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          onClick={e => e.stopPropagation()}
          className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-xs w-full mx-4 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <QrCode size={18} className="text-violet-400" />
              <span className="font-bold text-white">Seat {seatCode}</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
            >
              <X size={18} />
            </button>
          </div>

          <div id="qr-canvas" className="flex justify-center mb-4 bg-white p-4 rounded-xl">
          <QRCodeCanvas
              value={url}
              size={180}
              level="M"
              includeMargin={false}
              bgColor="#ffffff"
              fgColor="#1e1b4b"
            />
          </div>

          <p className="text-xs text-slate-400 text-center mb-4 break-all">{url}</p>

          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 px-4 py-2.5 flex items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              title="Download QR Code"
            >
              <Download size={16} />
              Download QR
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
