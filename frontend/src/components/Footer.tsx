import { Link } from 'react-router-dom'
import doloniaLogo from '@/assets/dolonia-logo.png'
import { company, placeholders } from '@/components/marketing/siteContent'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-ocean-deep border-t border-ocean-surface py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={doloniaLogo} alt="Dolonia Data Tech logo" className="w-10 h-10" />
              <div>
                <p className="font-semibold text-foreground">{company.name}</p>
                <p className="text-sm text-cyan-soft">A technology division of {company.holding}</p>
              </div>
            </div>
            <p className="text-cyan-soft mb-4">{company.location}</p>
            <dl className="text-sm text-cyan-soft space-y-1">
              <div>UEI {company.uei}</div>
              <div>CAGE {company.cage}</div>
              <div>{company.certs.join(', ')}</div>
              <div className="pt-3">{placeholders.phone}</div>
              <div>{placeholders.email}</div>
              <div>{placeholders.address}</div>
              <div>{placeholders.linkedin}</div>
            </dl>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Paths</h2>
            <ul className="space-y-3 text-cyan-soft">
              <li>
                <Link to="/government" className="hover:text-cyan-bright">
                  Government & Primes
                </Link>
              </li>
              <li>
                <Link to="/build" className="hover:text-cyan-bright">
                  Businesses & Founders
                </Link>
              </li>
              <li>
                <Link to="/denizen" className="hover:text-cyan-bright">
                  Denizen
                </Link>
              </li>
              <li>
                <Link to="/ecosystem" className="hover:text-cyan-bright">
                  Ecosystem
                </Link>
              </li>
              <li>
                <Link to="/capability-statement" className="hover:text-cyan-bright">
                  Capability Statement
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Company</h2>
            <ul className="space-y-3 text-cyan-soft">
              <li>
                <Link to="/about" className="hover:text-cyan-bright">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-bright">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/engineering" className="hover:text-cyan-bright">
                  Engineering
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-cyan-bright">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-ocean-surface flex flex-col md:flex-row justify-between gap-4 text-sm text-cyan-soft">
          <p>
            © {currentYear} {company.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="hover:text-cyan-bright">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-cyan-bright">
              Terms
            </Link>
            <Link to="/accessibility" className="hover:text-cyan-bright">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
