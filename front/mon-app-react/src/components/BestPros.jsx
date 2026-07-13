import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ServiceCard from './services/ServiceCard'
import { apiGetServices } from '../services/api'

function BestPros() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGetServices().then((res) => {
      if (res.ok) setServices(res.data.slice(0, 4))
      setLoading(false)
    })
  }, [])

  return (
    <section className="py-16 px-8" id="pros">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-babi-green uppercase tracking-wider relative pl-10">
              TOP PRESTATAIRES
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-babi-green to-babi-green-light rounded"></span>
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-babi-dark font-bricolage">
              Les pros les mieux notés
            </h2>
          </div>
          <Link to="/services" className="bg-white border border-gray-200 px-5 py-2.5 rounded-full text-sm font-semibold text-gray-700 hover:border-babi-green hover:text-babi-green transition-colors">
            Voir tout →
          </Link>
        </div>

        {!loading && services.length === 0 ? (
          <p className="text-sm text-gray-500 bg-emerald-50 rounded-xl p-6 text-center">
            Aucun service disponible pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-[420px] rounded-3xl bg-emerald-50 animate-pulse"></div>
                ))
              : services.map((service) => (
                  <ServiceCard key={service.id_service} service={service} />
                ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default BestPros
