import GallerySection from "@/components/GallerySection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { testimonials } from "@/lib/mock-data";
import { services } from "@/lib/services";
import { Instagram, MapPin, Menu, Phone, Quote, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { href: "#who-are-we", label: "Sobre" },
  { href: "#services", label: "Serviços" },
  { href: "#gallery", label: "Galeria" },
  { href: "#testimony", label: "Depoimentos" },
  { href: "#location", label: "Onde estamos" },
];

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav
        id="navbar"
        className="fixed top-0 left-0 w-full z-50 bg-sb-white/90 backdrop-blur-md border-b border-sb-sand/30"
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              className="h-10 md:h-14 w-auto"
              src="/images/logo-studio-blessed.svg"
              alt="Logo do Studio Blessed"
            />
          </div>

          {/* Nav + Button agrupados à direita */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 font-sans text-sm uppercase font-bold tracking-widest text-sb-warm">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-sb-primary transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <Button
              asChild
              className="bg-sb-primary text-sb-white hover:bg-sb-primary-dark font-sans shadow-md px-6 py-5 text-xs uppercase tracking-wider"
            >
              <Link to="/agendar">Agendar Agora</Link>
            </Button>
          </div>

          {/* Mobile Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero with Video Background */}
      <header
        id="hero"
        className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden h-screen flex items-center"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Overlay escuro usando o novo preto ébano sb-dark */}
        <div className="absolute inset-0 bg-sb-dark/60" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-sb-primary-light leading-tight mb-10 animate-fade-in">
            Realce sua beleza,
            <br />
            descubra sua melhor versão.
          </h1>
          <p
            className="font-sans text-lg md:text-xl text-sb-white/80 max-w-2xl mx-auto mb-12 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Venha sentir-se única, valorizada e bem cuidada
          </p>
          <Button
            asChild
            size="lg"
            className="bg-sb-primary text-sb-white hover:bg-sb-primary-dark font-sans text-base px-10 py-6 shadow-lg animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <Link to="/agendar">Agendar Agora</Link>
          </Button>
        </div>
      </header>

      {/* Quem Somos? */}
      <section id="who-are-we" className="py-20 bg-sb-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="order-1 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-sm lg:max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-sb-sand/10">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                  <source src="/videos/about.mp4" type="video/mp4" />
                </video>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-md">
                  <MapPin className="w-4 h-4 text-sb-primary" />
                  <span className="text-xs font-bold text-sb-dark tracking-wide uppercase">
                    Parque Viana, Barueri
                  </span>
                </div>
              </div>
            </div>

            <div className="order-2 space-y-8">
              <div className="space-y-2 text-center lg:text-left">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-sb-primary">
                  Quem somos
                </h2>
                <div className="w-20 h-1 bg-sb-primary/30 mx-auto lg:mx-0 rounded-full" />
              </div>

              <div className="space-y-6 font-sans text-sb-warm text-lg leading-relaxed">
                <p className="indent-8">
                  A história do Studio Blessed é, acima de tudo, uma jornada de resiliência. O sonho
                  começou na sala da casa da mãe de{" "}
                  <strong className="text-sb-dark">Caroline</strong>, onde ela e a irmã deram os
                  primeiros passos. Entre quartos improvisados e a conquista do primeiro espaço
                  comercial, Caroline viu sua estrutura mudar e parcerias ficarem pelo caminho, mas
                  sua paixão pela beleza e seu propósito nunca vacilaram.
                </p>
                <p className="indent-8">
                  Hoje, sob a liderança exclusiva de Caroline, o
                  <em className="font-cursive text-3xl text-sb-primary ml-2 not-italic">
                    Studio Blessed
                  </em>{" "}
                  reflete a força de uma mulher que escolheu continuar. Cada detalhe do atendimento
                  personalizado carrega sua essência e dedicação total. Aqui, seu momento de
                  autocuidado é sagrado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Serviços - AJUSTADO */}
      <section id="services" className="py-20 bg-sb-sand/10">
        <div className="container mx-auto px-4">
          {/* Título Padronizado */}
          <div className="text-center mb-16 space-y-2">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-sb-primary">
              Nossos Serviços
            </h2>
            <div className="w-20 h-1 bg-sb-primary/30 mx-auto rounded-full" />
            <p className="font-sans text-sb-warm mt-4 italic">
              Cuidados especializados para realçar sua beleza com qualidade e carinho.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service) => (
              <Card
                key={service.id}
                className="group border-sb-sand/30 hover:border-sb-primary/40 transition-all duration-300 bg-white overflow-hidden shadow-sm hover:shadow-xl"
              >
                <CardContent className="p-0 flex flex-col sm:flex-row h-full">
                  <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-sb-dark mb-2 leading-tight">
                        {service.name}
                      </h3>
                      <p className="font-sans text-sm text-sb-warm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <Button
                      asChild
                      className="w-full sm:w-max bg-sb-primary text-white hover:bg-sb-primary-dark shadow-md"
                    >
                      <Link to="/agendar">Agendar Agora</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria */}
      <GallerySection />

      {/* Depoimentos - AJUSTADO */}
      <section id="testimony" className="py-20 bg-sb-white">
        <div className="container mx-auto px-4">
          {/* Título Padronizado */}
          <div className="text-center mb-16 space-y-2">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-sb-primary">
              Depoimentos
            </h2>
            <div className="w-20 h-1 bg-sb-primary/30 mx-auto rounded-full" />
            <p className="font-sans text-sb-warm mt-4 italic">
              O que nossos clientes estão dizendo sobre nós.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Carousel opts={{ align: "center", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2">
                    <Card className="border-sb-sand/30 bg-white h-full shadow-sm">
                      <CardContent className="p-8 flex flex-col h-full">
                        <Quote className="w-8 h-8 text-sb-primary/20 mb-4" />
                        <p className="font-sans text-sb-warm italic mb-6 flex-1 leading-relaxed">
                          "{testimonial.text}"
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-sb-sand/20 flex items-center justify-center font-serif font-bold text-sb-primary">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-sans font-semibold text-sb-dark text-sm">
                              {testimonial.name}
                            </p>
                            <div className="flex gap-0.5">
                              {Array.from({ length: testimonial.rating }).map((_, i) => (
                                <span key={i} className="text-sb-primary text-xs">
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 border-sb-sand text-sb-warm hover:text-sb-primary" />
              <CarouselNext className="hidden md:flex -right-12 border-sb-sand text-sb-warm hover:text-sb-primary" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Localização - AJUSTADO */}
      <section id="location" className="py-20 bg-sb-sand/10">
        <div className="container mx-auto px-4">
          {/* Título Padronizado */}
          <div className="text-center mb-16 space-y-2">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-sb-primary">
              Onde Estamos
            </h2>
            <div className="w-20 h-1 bg-sb-primary/30 mx-auto rounded-full" />
            <p className="font-sans text-sb-warm mt-4 italic">
              Estamos localizados no coração de Barueri, em um espaço feito para você.
            </p>
          </div>

          <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
            <iframe
              title="Localização Studio Blessed"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d914.4239767335863!2d-46.868603573856554!3d-23.54343731687892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf010616dab381%3A0x4175f5c99c534a69!2sR.%20Imbauva%2C%2020%20-%20Parque%20Viana%2C%20Barueri%20-%20SP%2C%2006449-310!5e0!3m2!1spt-BR!2sbr!4v1772156771289!5m2!1spt-BR!2sbr"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="w-full grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="footer"
        className="bg-sb-dark text-sb-white py-16 border-t border-sb-primary-dark/30"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            <div className="space-y-4 flex flex-wrap flex-col items-start md:items-center md:flex-row">
              <div className="flex items-center gap-2">
                <img
                  src="/images/logo-studio-blessed-secondary.svg"
                  alt="Logo Studio Blessed Branco"
                  className="w-20"
                />
                <span className="font-cursive text-4xl text-sb-primary">Studio Blessed</span>
              </div>
              <p className="font-sans text-sm text-sb-white/60 leading-relaxed max-w-xs">
                Transformando a beleza com amor e dedicação. Seu momento de cuidado começa aqui.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-serif text-xl text-sb-primary uppercase tracking-widest">
                Contato
              </h4>
              <div className="space-y-3 font-sans text-sm text-sb-white/80">
                <p className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-sb-primary" /> (11) 98888-0015
                </p>
                <p className="flex items-center gap-3">
                  <Instagram className="w-4 h-4 text-sb-primary" /> @studioblessed
                </p>
                <div className="flex items-start gap-3 italic">
                  <MapPin className="w-4 h-4 text-sb-primary shrink-0 mt-1" />
                  <span>
                    R. Imbauva, 20 - Pq. Viana, Sala 3<br />
                    Barueri-SP
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-serif text-xl text-sb-primary uppercase tracking-widest">
                Horário de Atendimento
              </h4>
              <div className="space-y-3 font-sans text-sm">
                <div className="flex justify-between border-b border-sb-white/10 pb-1">
                  <span className="text-sb-white/60">Segunda a Sexta</span>
                  <span className="text-sb-primary-light font-medium">08h às 18h</span>
                </div>
                <div className="flex justify-between border-b border-sb-white/10 pb-1">
                  <span className="text-sb-white/60">Sábado</span>
                  <span className="text-sb-primary-light font-medium">08h às 15h</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-sb-white/40 italic">Domingo</span>
                  <span className="text-sb-white/40 font-bold uppercase tracking-tighter">
                    Fechado
                  </span>
                </div>
                <p className="text-[10px] text-sb-white/50 pt-4 uppercase tracking-[0.2em] leading-relaxed italic">
                  * Atendemos somente com agendamento prévio.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-sb-white/5 mt-16 pt-8 text-center">
            <p className="font-sans text-[10px] tracking-[0.3em] text-sb-white/30 uppercase">
              © 2026 Studio Blessed. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
