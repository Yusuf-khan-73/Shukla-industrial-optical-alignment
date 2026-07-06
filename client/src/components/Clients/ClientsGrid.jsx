/**
 * Filterable clients grid.
 * Location: client/src/components/Clients/ClientsGrid.jsx
 */
import { useState } from 'react';
import { CLIENTS_DATA, CLIENT_FILTERS } from './clientsData';
import ClientCard from './ClientCard';

const ClientsGrid = ({ limit, showFilters = false }) => {
  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'all'
      ? CLIENTS_DATA
      : CLIENTS_DATA.filter((c) => c.category === filter);

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  return (
    <>
      {showFilters && (
        <div className="clients-grid__filters" role="tablist" aria-label="Filter clients">
          {CLIENT_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={`clients-grid__filter ${filter === f.id ? 'clients-grid__filter--active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              <span className="clients-grid__filter-count">
                {f.id === 'all'
                  ? CLIENTS_DATA.length
                  : CLIENTS_DATA.filter((c) => c.category === f.id).length}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="clients-grid">
        {displayed.map((client, index) => (
          <ClientCard key={client.id} client={client} index={index} />
        ))}
      </div>
    </>
  );
};

export default ClientsGrid;
