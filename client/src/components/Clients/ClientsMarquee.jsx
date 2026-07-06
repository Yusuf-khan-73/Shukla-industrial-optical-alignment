/**
 * Infinite marquee of client names for premium motion effect.
 * Location: client/src/components/Clients/ClientsMarquee.jsx
 */
import { CLIENTS_DATA } from './clientsData';

const MarqueeRow = ({ clients, reverse = false }) => (
  <div className={`clients-marquee__row ${reverse ? 'clients-marquee__row--reverse' : ''}`}>
    <div className="clients-marquee__track">
      {[...clients, ...clients].map((client, i) => (
        <div key={`${client.id}-${i}`} className="clients-marquee__item">
          <span className="clients-marquee__initials">{client.initials}</span>
          <span className="clients-marquee__name">{client.name}</span>
        </div>
      ))}
    </div>
  </div>
);

const ClientsMarquee = () => {
  const half = Math.ceil(CLIENTS_DATA.length / 2);
  const row1 = CLIENTS_DATA.slice(0, half);
  const row2 = CLIENTS_DATA.slice(half);

  return (
    <div className="clients-marquee" aria-hidden="true">
      <MarqueeRow clients={row1} />
      <MarqueeRow clients={row2} reverse />
    </div>
  );
};

export default ClientsMarquee;
