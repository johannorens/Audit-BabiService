const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
  <path d="M3.25 11.9167C3.25 16.6999 7.1334 20.5833 11.9167 20.5833C16.6999 20.5833 20.5833 16.6999 20.5833 11.9167C20.5833 7.1334 16.6999 3.25 11.9167 3.25C7.1334 3.25 3.25 7.1334 3.25 11.9167V11.9167" stroke="white" stroke-width="2.16667" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22.7501 22.7501L18.0918 18.0918" stroke="white" stroke-width="2.16667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
)

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
  <path d="M8.66602 2.16699V6.50033" stroke="white" stroke-width="2.16667" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17.334 2.16699V6.50033" stroke="white" stroke-width="2.16667" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5.41667 4.33301H20.5833C21.7791 4.33301 22.75 5.30386 22.75 6.49967V21.6663C22.75 22.8622 21.7791 23.833 20.5833 23.833H5.41667C4.22085 23.833 3.25 22.8622 3.25 21.6663V6.49967C3.25 5.30386 4.22085 4.33301 5.41667 4.33301V4.33301" stroke="white" stroke-width="2.16667" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M3.25 10.833H22.75" stroke="white" stroke-width="2.16667" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9.75 17.3337L11.9167 19.5003L16.25 15.167" stroke="white" stroke-width="2.16667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
)

const PaymentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
  <path d="M7.58268 2.16699H18.416C19.6118 2.16699 20.5827 3.13784 20.5827 4.33366V21.667C20.5827 22.8628 19.6118 23.8337 18.416 23.8337H7.58268C6.38687 23.8337 5.41602 22.8628 5.41602 21.667V4.33366C5.41602 3.13784 6.38687 2.16699 7.58268 2.16699V2.16699" stroke="white" stroke-width="2.16667" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M13 19.5H13.0108" stroke="white" stroke-width="2.16667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
)

const ReviewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
  <path d="M12.4848 2.48646C12.5816 2.2908 12.781 2.16699 12.9994 2.16699C13.2177 2.16699 13.4171 2.2908 13.5139 2.48646L16.0164 7.55538C16.3511 8.23261 16.997 8.70234 17.7444 8.81204L23.3409 9.63104C23.5572 9.66239 23.7369 9.81384 23.8046 10.0217C23.8722 10.2296 23.8159 10.4578 23.6594 10.6104L19.612 14.5515C19.0702 15.0796 18.8227 15.8403 18.9501 16.586L19.9056 22.1544C19.9438 22.3706 19.8553 22.5897 19.6776 22.7188C19.4999 22.8478 19.2642 22.8642 19.0704 22.761L14.0675 20.1307C13.3984 19.7793 12.5993 19.7793 11.9301 20.1307L6.92836 22.761C6.7346 22.8636 6.49933 22.8469 6.32202 22.7179C6.14471 22.589 6.05631 22.3703 6.0942 22.1544L7.04861 16.5871C7.1766 15.841 6.92904 15.0797 6.3867 14.5515L2.33936 10.6115C2.18153 10.459 2.12439 10.23 2.19211 10.0213C2.25984 9.81254 2.4406 9.66068 2.65786 9.62996L8.25328 8.81204C9.00155 8.70318 9.64844 8.23331 9.98336 7.55538L12.4848 2.48646" stroke="white" stroke-width="2.16667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
)

const steps = [
  {
    number: 1,
    icon: <SearchIcon />,
    title: 'Cherchez un service',
    description: 'Choisissez parmi 12 catégories et filtrez par quartier, prix et disponibilité.'
  },
  {
    number: 2,
    icon: <BookIcon />,
    title: 'Réservez en 2 clics',
    description: 'Comparez les profils vérifiés, lisez les avis et réservez le créneau qui vous arrange.'
  },
  {
    number: 3,
    icon: <PaymentIcon />,
    title: 'Payez en toute sécurité',
    description: 'Réglez via Orange Money, MTN, Wave ou en espèces. Paiement protégé jusqu\'à la prestation.'
  },
  {
    number: 4,
    icon: <ReviewIcon />,
    title: 'Notez la prestation',
    description: 'Évaluez le prestataire pour aider la communauté à choisir en confiance.'
  }
]

function HowItWorks() {
  return (
    <section className="py-16 px-8 bg-babi-cream" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold text-babi-green uppercase tracking-wider relative px-10 mb-3">
            SIMPLE & RAPIDE
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-babi-green to-babi-green-light rounded"></span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-babi-green-light to-babi-green rounded"></span>
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-babi-dark mb-3 font-bricolage">
            Comment ça marche
          </h2>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            De la recherche au paiement, tout se passe au même endroit — en quelques minutes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="bg-white border border-gray-100 rounded-2xl p-8 relative shadow-sm">
              <span className="text-5xl font-extrabold text-emerald-100 absolute top-4 right-6 font-bricolage">
                {step.number}
              </span>
              <div className="flex items-center gap-4 mb-5">
                <span className="text-2xl bg-gradient-to-r from-babi-green to-babi-green-light p-3 rounded-xl text-white">
                  {step.icon}
                </span>
              </div>
              <h3 className="text-lg font-bold text-babi-dark mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
