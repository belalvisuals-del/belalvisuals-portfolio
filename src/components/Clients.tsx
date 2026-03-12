import React from 'react';
import { motion } from 'motion/react';
import { ClientLogo } from '../types';
import { getGoogleDriveDirectLink } from '../utils';

interface ClientsProps {
  clients: ClientLogo[];
}

const Clients = ({ clients }: ClientsProps) => {
  if (clients.length === 0) return null;

  // Duplicate clients for infinite scroll effect
  const displayClients = [...clients, ...clients, ...clients];

  return (
    <section id="clients" className="py-16 lg:py-24 bg-primary-dark overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-bold text-white tracking-tight"
        >
          My <span className="text-primary-light">Clients</span>
        </motion.h2>
      </div>

      <div className="relative flex overflow-x-hidden">
        <motion.div
          animate={{
            x: [0, -100 * clients.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: clients.length * 3,
              ease: "linear",
            },
          }}
          className="flex whitespace-nowrap gap-12 md:gap-24 items-center"
        >
          {displayClients.map((client, idx) => (
            <div key={`${client.id}-${idx}`} className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 opacity-40 hover:opacity-100">
              <img
                src={getGoogleDriveDirectLink(client.logoUrl)}
                alt={client.name}
                className="h-12 md:h-20 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Clients;
