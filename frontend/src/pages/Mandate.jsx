import React from 'react';
import { Button } from '../components/ui/button';
import { Radio, Tv, Mail, Wifi, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Mandate = () => {
  const mandates = [
    {
      id: 'telecommunications',
      title: 'Telecommunications',
      icon: Radio,
      accent: '#2C7DA0',
      bg: 'bg-[#E8F0F9]',
      description:
        'BOCRA regulates telecommunications services to ensure competitive, reliable, and affordable access for citizens and businesses across Botswana.',
      responsibilities: [
        'Licensing of telecommunications operators',
        'Spectrum management and allocation',
        'Numbering plan administration',
        'Interconnection and infrastructure sharing',
        'Quality of Service monitoring and enforcement',
        'Consumer protection and dispute resolution',
        'Tariff regulation and price controls',
      ],
    },
    {
      id: 'broadcasting',
      title: 'Broadcasting',
      icon: Tv,
      accent: '#C62828',
      bg: 'bg-[#FDEAEA]',
      description:
        'We regulate radio and television broadcasting to promote diversity, local content, public interest programming, and technical quality.',
      responsibilities: [
        'Broadcasting licence issuance and renewal',
        'Content regulation and standards',
        'Local content quota enforcement',
        'Frequency assignment for broadcasting',
        'Technical standards compliance',
        'Monitoring broadcast quality',
        'Public interest broadcasting oversight',
      ],
    },
    {
      id: 'postal',
      title: 'Postal Services',
      icon: Mail,
      accent: '#2EAD6F',
      bg: 'bg-[#E6F4EC]',
      description:
        'BOCRA oversees postal services to promote safe, reliable, efficient, and affordable service delivery throughout Botswana.',
      responsibilities: [
        'Postal service licensing framework',
        'Universal postal service obligations',
        'Postal service quality standards',
        'Tariff approval and monitoring',
        'Consumer complaint handling',
        'Innovation and modernisation support',
        'Courier and express mail regulation',
      ],
    },
    {
      id: 'internet',
      title: 'Internet & ICT',
      icon: Wifi,
      accent: '#F2C94C',
      bg: 'bg-[#FFF5DA]',
      description:
        'We support the digital economy through .bw domain administration, internet service regulation, and ICT-related oversight.',
      responsibilities: [
        '.bw country code top-level domain management',
        'Internet Service Provider licensing',
        'Cybersecurity coordination through bw-CIRT',
        'Electronic transactions regulation',
        'Data protection and privacy oversight',
        'Digital infrastructure development',
        'Internet governance participation',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3] relative">
      <section className="relative bg-[#003366] py-24 overflow-hidden">
        <div className="heritage-overlay basket-pattern text-white opacity-[0.04]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
          <p className="section-kicker text-[#F47920] mb-3">Regulatory scope</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Our Mandate</h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto text-white/80 leading-relaxed">
            BOCRA regulates four key communications areas to ensure efficient, reliable, and accessible services throughout Botswana.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {mandates.map((mandate, index) => {
            const Icon = mandate.icon;
            const reverse = index % 2 !== 0;

            return (
              <div
                key={mandate.id}
                className={`grid lg:grid-cols-2 gap-8 items-center ${reverse ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}
              >
                <div className="section-shell p-8 sm:p-10 relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full w-1.5 rounded-full"
                    style={{ backgroundColor: mandate.accent }}
                  ></div>

                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl ${mandate.bg} flex items-center justify-center`}
                      style={{ color: mandate.accent }}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">BOCRA Sector</p>
                      <h2 className="text-3xl font-bold text-slate-900">{mandate.title}</h2>
                    </div>
                  </div>

                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    {mandate.description}
                  </p>

                  <h3 className="text-xl font-bold text-slate-900 mb-4">Key Responsibilities</h3>
                  <ul className="space-y-3 mb-8">
                    {mandate.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#003366] mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{resp}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="rounded-xl">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="section-shell-soft p-8 sm:p-10 min-h-[340px] flex items-center justify-center relative overflow-hidden">
                  <div className="subtle-grid absolute inset-0 opacity-30"></div>
                  <div className="heritage-overlay basket-pattern text-[#003366] opacity-[0.03]"></div>

                  <div className="relative text-center">
                    <div
                      className="w-28 h-28 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm"
                      style={{
                        backgroundColor: `${mandate.accent}18`,
                        color: mandate.accent,
                      }}
                    >
                      <Icon className="h-14 w-14" />
                    </div>

                    <div
                      className="h-1.5 w-20 rounded-full mx-auto mb-5"
                      style={{ backgroundColor: mandate.accent }}
                    ></div>

                    <h3 className="text-2xl font-bold text-[#003366] mb-3">{mandate.title}</h3>
                    <p className="text-slate-600 max-w-md mx-auto">
                      BOCRA’s regulatory work in this domain supports national connectivity, service quality, public interest, and digital development.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-20 bg-[#001F40] relative overflow-hidden">
        <div className="heritage-overlay basket-pattern text-white opacity-[0.04]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-[#F47920] text-sm font-semibold uppercase tracking-[0.1em] mb-4">
            Need guidance?
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Questions about our regulatory framework?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Our team is available to provide support on licensing, compliance, obligations, and regulatory procedures.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="cta" className="rounded-xl px-8">
                Contact Regulatory Team
              </Button>
            </Link>

            <Link to="/documents">
              <Button size="lg" variant="outline" className="rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10 px-8">
                View Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mandate;