"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Crown, Heart, Star, Sparkles, TrendingUp, Users, Award } from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok, FaYoutube, FaTwitter } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Navigation, Footer } from "@/components/navigation";
import { mockParticipants as participants } from "@/lib/participants-data";

// --- Framer Motion imports
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const totalVotes = (list: typeof participants) => list.reduce((sum, p) => sum + (p.votes ?? 0), 0);

export default function Home() {
  const [votedFor, setVotedFor] = useState<number[]>([]);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 = down, -1 = up
  const lastScrollY = useRef(0);
  
  const participantsMasculin = useMemo(
    () => participants.filter((p) => p.gender === "Masculin"),
    []
  );
  const participantsFeminin = useMemo(
    () => participants.filter((p) => p.gender === "Féminin"),
    []
  );
  const trendingMasculin = useMemo(
    () => [...participantsMasculin].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0)).slice(0, 3),
    [participantsMasculin]
  );
  const trendingFeminin = useMemo(
    () => [...participantsFeminin].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0)).slice(0, 3),
    [participantsFeminin]
  );
  const socialChannels = useMemo(
    () => [
      {
        name: "Instagram",
        href: "https://www.instagram.com/leroidelasapologie",
        icon: FaInstagram,
        label: "Suivez-nous sur Instagram"
      },
      {
        name: "Facebook",
        href: "https://www.facebook.com/leroidelasapologie",
        icon: FaFacebook,
        label: "Rejoignez-nous sur Facebook"
      },
      {
        name: "TikTok",
        href: "https://www.tiktok.com/@leroidelasapologie",
        icon: FaTiktok,
        label: "Découvrez nos vidéos TikTok"
      },
      {
        name: "YouTube",
        href: "https://www.youtube.com/@leroidelasapologie",
        icon: FaYoutube,
        label: "Regardez nos coulisses sur YouTube"
      },
      {
        name: "Twitter",
        href: "https://twitter.com/leroisapologie",
        icon: FaTwitter,
        label: "Suivez l'actualité sur Twitter"
      }
    ],
    []
  );
  const juryPick = useMemo(() => participants.slice(0, 3), []);

  const handleVote = (participantId: number) => {
    if (!votedFor.includes(participantId)) {
      setVotedFor([...votedFor, participantId]);
    }
  };

  // Detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection(1); // scrolling down
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection(-1); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ---------- Motion: global scroll progress ----------
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  // 🎬 Intro cinematic transforms
  const introScale = useTransform(smoothProgress, [0, 0.15], [1.15, 1]);
  const introY = useTransform(smoothProgress, [0, 0.15], ["0%", "-20%"]);
  const introFilter = useTransform(smoothProgress, [0, 0.15], ["blur(0px)", "blur(4px)"]);
  const introTextY = useTransform(smoothProgress, [0, 0.15], ["0%", "-160%"]);
  const introTextRotate = useTransform(smoothProgress, [0, 0.15], ["0deg", "-18deg"]);
  const introTextOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

  // HERO transforms - Interactive scroll-based animation (custom ranges)
  const heroTextX = useTransform(smoothProgress, [0.05, 0.11], [300, 0]); // Badge: 5-11%
  const heroTextRotate = useTransform(smoothProgress, [0.05, 0.11], [15, 0]); // Rotation effect
  const heroTextOpacity = useTransform(smoothProgress, [0.05, 0.09], [0, 1]); // Fade in
  
  const heroTitleX = useTransform(smoothProgress, [0.06, 0.13], [400, 0]); // Title: 6-13%
  const heroTitleRotate = useTransform(smoothProgress, [0.06, 0.13], [20, 0]);
  const heroTitleOpacityScroll = useTransform(smoothProgress, [0.06, 0.11], [0, 1]);
  
  const heroSubtitleY = useTransform(smoothProgress, [0.05, 0.3], ["0%", "-10%"]);
  const heroButtonsY = useTransform(smoothProgress, [0.1, 0.35], ["0%", "-14%"]);
  const heroImageX = useTransform(smoothProgress, [0.05, 0.15], ["100%", "0%"]); // Slide from right to left
  const heroImageY = useTransform(smoothProgress, [0, 0.25], ["0%", "10%"]);
  const heroImageScale = useTransform(smoothProgress, [0, 0.25], [1, 1.06]);
  const heroImageBlur = useTransform(smoothProgress, [0.18, 0.45], ["blur(0px)", "blur(4px)"]);
  const heroImageRotateX = useTransform(smoothProgress, [0, 0.25], ["0deg", "-6deg"]);
  const heroImageOpacity = useTransform(smoothProgress, [0.05, 0.12], [0, 1]); // Fade in while sliding

  // Navigation opacity: hidden on intro, appears on hero (earlier trigger)
  const navOpacity = useTransform(smoothProgress, [0, 0.07, 0.12], [0, 0, 1]);

  // Decorative orbs/background subtle move
  const orb1Y = useTransform(smoothProgress, [0, 0.5], ["0%", "-8%"]);
  const orb2Y = useTransform(smoothProgress, [0, 0.5], ["0%", "6%"]);

  // Trending + features transforms (inchangés)
  const trendingCardYBase = (i: number) => useTransform(smoothProgress, [0.15, 0.45], [`${i * 2}%`, `${-6 - i * 3}%`]);
  const trendingCardRotate = (i: number) => useTransform(smoothProgress, [0.15, 0.45], ["0deg", `${(i - 1) * 6}deg`]);
  const featureCardYBase = (i: number) => useTransform(smoothProgress, [0.28, 0.56], [`${10 - i * 6}%`, `${-6 + i * 2}%`]);
  const featureCardRotate = (i: number) => useTransform(smoothProgress, [0.28, 0.56], ["0deg", `${(i + 1) * 4}deg`]);
  const participantY = (i: number) => useTransform(smoothProgress, [0.45, 0.8], [`${i % 3 * 4}%`, `${-8 + (i % 3) * 2}%`]);
  const ctaScale = useTransform(smoothProgress, [0.7, 1], [1, 1.12]);
  const ctaY = useTransform(smoothProgress, [0.7, 1], ["0%", "-14%"]);
  const ctaBlur = useTransform(smoothProgress, [0.75, 1], ["blur(0px)", "blur(3px)"]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <motion.div style={{ y: orb1Y }} className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <motion.div style={{ y: orb2Y }} className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <motion.div style={{ y: useTransform(smoothProgress, [0, 1], ["0%", "-6%"]) }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/5 to-primary/10 blur-3xl" />
      </div>

      <motion.div style={{ opacity: navOpacity }} className="sticky top-0 z-50">
        <Navigation />
      </motion.div>

      <main className="flex-1">
        {/* Intro Cinematic Section */}
        <section className="absolute top-0 left-0 right-0 h-[100vh] overflow-hidden z-0">
          <motion.div
            style={{ scale: introScale, y: introY, filter: introFilter }}
            className="absolute inset-0 z-10"
          >
            <img
              src="/couple.jpg"
              alt="Mode élégante"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>

          <motion.div
            style={{ y: introTextY, rotateZ: introTextRotate, opacity: introTextOpacity }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg">
              Qui sera sacré <span className="text-primary">Roi/Reine ?</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl drop-shadow">
              Laissez votre style parler. Défiez la mode. Devenez une légende.
            </p>
          </motion.div>
        </section>

        {/* Spacer to preserve intro height in document flow */}
        <div className="h-[100vh]" aria-hidden="true" />

        {/* Hero Section */}
        <section className="relative py-20 sm:py-28 overflow-hidden -mt-[15vh]">
          <div className="container-premium">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Text Content */}
              <div className="space-y-8 animate-fade-in-up">
                <motion.div
                  initial={{ x: 200, rotate: 10, opacity: 0 }}
                  animate={{ x: 0, rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.07, ease: "easeOut" }}
                  style={{ 
                    x: heroTextX, 
                    rotate: heroTextRotate, 
                    opacity: heroTextOpacity 
                  }}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border text-sm font-medium will-change-transform"
                >
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>Édition Premium 2025</span>
                </motion.div>

                <motion.h1
                  initial={{ x: 300, rotate: 15, opacity: 0 }}
                  animate={{ x: 0, rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.07, ease: "easeOut" }}
                  style={{ 
                    x: heroTitleX, 
                    rotate: heroTitleRotate, 
                    opacity: heroTitleOpacityScroll 
                  }}
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight will-change-transform"
                >
                  <span className="text-gradient">Le royaume</span>
                  <br />
                  du style et de
                  <br />
                  <span className="text-gradient">l'élégance</span>
                </motion.h1>

                <motion.p
                  style={{ y: heroSubtitleY }}
                  className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed will-change-transform"
                >
                  Rejoignez le plus prestigieux concours de sapologie. Inspirez, défilez, votez. 
                  Qui montera sur le podium des tendances cette saison ?
                </motion.p>

                <motion.div style={{ y: heroButtonsY }} className="flex flex-col sm:flex-row gap-4 will-change-transform">
                  <Button 
                    size="lg" 
                    className="h-12 px-8 rounded-xl text-base btn-glow hover-lift group"
                    asChild
                  >
                    <Link href="/vote">
                      <TrendingUp className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" aria-hidden="true" />
                      Découvrir et voter
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="h-12 px-8 rounded-xl text-base hover-lift"
                    asChild
                  >
                    <Link href="/register">
                      Participer au concours
                    </Link>
                  </Button>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                  <motion.div
                    style={{ y: useTransform(smoothProgress, [0.02, 0.18], ["0%", "-6%"]), rotateY: useTransform(smoothProgress, [0.02, 0.18], ["0deg", "6deg"]) }}
                    className="card-premium p-4 hover-lift will-change-transform"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{participants.length}</div>
                        <div className="text-xs text-muted-foreground">Participants</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    style={{ y: useTransform(smoothProgress, [0.04, 0.2], ["0%", "-8%"]), rotateY: useTransform(smoothProgress, [0.04, 0.2], ["0deg", "6deg"]) }}
                    className="card-premium p-4 hover-lift will-change-transform"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Heart className="h-5 w-5 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{totalVotes(participants)}</div>
                        <div className="text-xs text-muted-foreground">Votes</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    style={{ y: useTransform(smoothProgress, [0.06, 0.22], ["0%", "-10%"]), rotateY: useTransform(smoothProgress, [0.06, 0.22], ["0deg", "6deg"]) }}
                    className="card-premium p-4 hover-lift sm:col-span-1 col-span-2 will-change-transform"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Award className="h-5 w-5 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">24h</div>
                        <div className="text-xs text-muted-foreground">Avant la finale</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Hero Image */}
              <motion.div
                style={{
                  opacity: heroImageOpacity,
                }}
                className="relative"
              >
                <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-200/50">
                  <img
                    src="/couple.jpg"
                    alt="Portrait élégant du concours de sapologie"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
                  
                  {/* Floating badge */}
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="absolute bottom-6 left-6 right-6 glass-dark rounded-2xl p-4"
                  >
                    <p className="text-white text-sm font-medium mb-1">Édition actuelle</p>
                    <p className="text-white/80 text-xs">Le Roi de la Sapologie 2025</p>
                  </motion.div>
                </div>
                
                {/* Decorative elements */}
                <motion.div
                  style={{ translateZ: 0 }}
                  className="absolute -z-10 -top-4 -right-4 h-full w-full rounded-3xl bg-primary/20 blur-xl"
                  aria-hidden="true"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-14 bg-primary/5">
          <div className="container-premium space-y-8">
            <div className="max-w-2xl space-y-3">
              <span className="uppercase text-xs tracking-[0.3em] text-primary">Réseaux sociaux</span>
              <h2 className="text-3xl sm:text-4xl font-bold">Suivez l'aventure sapologie au quotidien</h2>
              <p className="text-muted-foreground">Coulisses, looks exclusifs, interviews des participants et annonces en direct vous attendent sur nos plateformes.</p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white">
              <motion.div
                className="flex items-center gap-8 px-10 py-6"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 22, ease: "linear", repeat: Infinity }}
              >
                {[...socialChannels, ...socialChannels].map((channel, index) => {
                  const Icon = channel.icon;
                  return (
                    <Link
                      key={`${channel.name}-${index}`}
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-2xl bg-white/10 px-6 py-3 backdrop-blur transition hover:bg-white/20"
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                      <div className="text-left">
                        <p className="text-sm font-semibold">{channel.name}</p>
                        <p className="text-xs text-white/70">{channel.label}</p>
                      </div>
                    </Link>
                  );
                })}
              </motion.div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-neutral-900 via-neutral-900/20 to-transparent" aria-hidden="true" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-neutral-900 via-neutral-900/20 to-transparent" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section className="py-16 bg-muted/30">
          <div className="container-premium">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">Tendances du moment</h2>
                <p className="text-muted-foreground">Les styles les plus appréciés de la semaine</p>
              </div>
              <Button variant="ghost" className="group" asChild>
                <Link href="/vote">
                  Voir tout
                  <TrendingUp className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            
            <div className="grid gap-10 lg:grid-cols-2">
              {[
                { title: "Catégorie masculine", list: trendingMasculin },
                { title: "Catégorie féminine", list: trendingFeminin }
              ].map(({ title, list }) => (
                <div key={title} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold">{title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {list.length} sélectionné{list.length > 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {list.length > 0 ? (
                      list.map((participant, index) => (
                        <motion.article
                          key={participant.id}
                          className="card-premium group p-4 md:flex md:items-center md:gap-5"
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: false, amount: 0.2, margin: "100px" }}
                          variants={{
                            hidden: {
                              scaleY: 0,
                              opacity: 0
                            },
                            visible: {
                              scaleY: 1,
                              opacity: 1
                            }
                          }}
                          custom={scrollDirection}
                          transition={{
                            duration: 0.7,
                            delay: index * 0.15,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          style={{
                            transformOrigin: scrollDirection > 0 ? "bottom" : "top"
                          }}
                        >
                          <div className="relative h-48 w-full rounded-xl overflow-hidden md:h-56 md:w-40">
                            <img
                              src={participant.photos?.[0] || `https://images.unsplash.com/photo-149036753220${index}-b9bc1dc483f6?w=400&h=400&fit=crop`}
                              alt={`Style de ${participant.name}`}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <Badge className="absolute top-3 left-3 bg-white/90 text-foreground">
                              #{index + 1}
                            </Badge>
                          </div>
                          <div className="flex-1 space-y-4">
                            <CardHeader className="px-0 pt-0">
                              <CardTitle className="text-xl">
                                <Link href={`/participant/${participant.id}`} className="hover:text-primary transition-colors">
                                  {participant.name}
                                </Link>
                              </CardTitle>
                              <CardDescription>{participant.category ?? "Style"}</CardDescription>
                            </CardHeader>
                            <CardContent className="px-0 pb-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Heart className="h-4 w-4 text-rose-500" aria-hidden="true" />
                                  <span className="font-semibold">{participant.votes ?? 0}</span>
                                  <span>votes</span>
                                </div>
                                <Button variant="outline" size="sm" className="hover-lift" asChild>
                                  <Link href={`/participant/${participant.id}`}>Voir le profil</Link>
                                </Button>
                              </div>
                            </CardContent>
                          </div>
                        </motion.article>
                      ))
                    ) : (
                      <div className="card-premium p-6 text-sm text-muted-foreground">
                        Aucun participant pour cette catégorie pour le moment.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container-premium">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Pourquoi nous rejoindre ?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Une expérience unique dédiée à la célébration du style et de l'élégance
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card-flip-container h-64">
                <div className="card-premium card-flip h-full">
                  {/* Front */}
                  <div className="card-flip-front p-8 text-center flex flex-col items-center justify-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                      <Star className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Sélection premium</h3>
                    <p className="text-muted-foreground">
                      Des looks de haute qualité, curatés par la communauté et notre jury d'experts
                    </p>
                  </div>
                  {/* Back */}
                  <div className="card-flip-back card-premium p-8 text-center flex flex-col items-center justify-center bg-primary text-primary-foreground">
                    <Star className="h-12 w-12 mb-4" aria-hidden="true" />
                    <h3 className="text-xl font-bold mb-3">Excellence</h3>
                    <p className="text-sm">
                      Rejoignez une plateforme où seul le meilleur du style est mis en avant
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="card-flip-container h-64">
                <div className="card-premium card-flip h-full">
                  {/* Front */}
                  <div className="card-flip-front p-8 text-center flex flex-col items-center justify-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                      <Heart className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Communauté engagée</h3>
                    <p className="text-muted-foreground">
                      Un système de vote transparent et équitable pour chaque participant
                    </p>
                  </div>
                  {/* Back */}
                  <div className="card-flip-back card-premium p-8 text-center flex flex-col items-center justify-center bg-primary text-primary-foreground">
                    <Heart className="h-12 w-12 mb-4" aria-hidden="true" />
                    <h3 className="text-xl font-bold mb-3">Équité</h3>
                    <p className="text-sm">
                      Chaque vote compte et contribue à célébrer le talent authentique
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="card-flip-container h-64">
                <div className="card-premium card-flip h-full">
                  {/* Front */}
                  <div className="card-flip-front p-8 text-center flex flex-col items-center justify-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                      <Crown className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Expérience raffinée</h3>
                    <p className="text-muted-foreground">
                      Un design moderne, accessible et optimisé pour tous les appareils
                    </p>
                  </div>
                  {/* Back */}
                  <div className="card-flip-back card-premium p-8 text-center flex flex-col items-center justify-center bg-primary text-primary-foreground">
                    <Crown className="h-12 w-12 mb-4" aria-hidden="true" />
                    <h3 className="text-xl font-bold mb-3">Élégance</h3>
                    <p className="text-sm">
                      Une interface pensée pour sublimer votre style et votre présence
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Participants Section */}
        <section className="py-16 bg-muted/30">
          <div className="container-premium">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tous les participants</h2>
              <p className="text-lg text-muted-foreground">
                Découvrez tous les talents de cette édition
              </p>
            </div>
            
            <div className="space-y-12">
              {[
                { title: "Participants masculins", list: participantsMasculin },
                { title: "Participants féminins", list: participantsFeminin }
              ].map(({ title, list }) => (
                <div key={title} className="space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold">{title}</h3>
                      <p className="text-sm text-muted-foreground">Styles emblématiques et personnalités inspirantes</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
                        <Link href="/vote">Voir plus</Link>
                      </Button>
                      <Badge variant="secondary" className="text-xs">
                        {list.length} participant{list.length > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
                      {list.length > 0 ? (
                        list.map((participant) => (
                          <article
                            key={participant.id}
                            className="card-premium group min-w-[260px] max-w-[260px] flex-shrink-0 snap-center p-4"
                          >
                            <CardHeader className="pb-4 text-center">
                              <Link href={`/participant/${participant.id}`} className="block">
                                <Avatar className="h-20 w-20 mx-auto mb-4 ring-2 ring-muted group-hover:ring-primary transition-all">
                                  <AvatarImage src={participant.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.name}`} alt={participant.name} />
                                  <AvatarFallback className="text-xl">
                                    {participant.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                  {participant.name}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                  {participant.category ?? "Style"}
                                </CardDescription>
                              </Link>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {participant.bio}
                              </p>
                              {participant.socialLinks && Object.keys(participant.socialLinks).length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(participant.socialLinks).slice(0, 2).map(([platform]) => (
                                    <Badge key={platform} variant="secondary" className="text-xs capitalize">
                                      {platform}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <Separator />
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <Heart className={`h-4 w-4 ${votedFor.includes(participant.id) ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} aria-hidden="true" />
                                  <span className="font-semibold">{participant.votes ?? 0}</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleVote(participant.id)}
                                    disabled={votedFor.includes(participant.id)}
                                    size="sm"
                                    variant={votedFor.includes(participant.id) ? "default" : "outline"}
                                    className={votedFor.includes(participant.id) ? "bg-rose-500 hover:bg-rose-600" : ""}
                                  >
                                    {votedFor.includes(participant.id) ? "Voté !" : "Voter"}
                                  </Button>
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/participant/${participant.id}`}>
                                      Voir
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </article>
                        ))
                      ) : (
                        <div className="card-premium p-6 text-sm text-muted-foreground">
                          Aucun participant pour cette catégorie pour le moment.
                        </div>
                      )}
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-muted/60 to-transparent" aria-hidden="true" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-muted/60 to-transparent" aria-hidden="true" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground via-primary to-[#B8860B]" aria-hidden="true" />
          
          <div className="container-premium relative">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-4xl sm:text-5xl font-bold text-white">
                Prêt à montrer votre style ?
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Inscrivez-vous dès maintenant, créez votre profil avec vos plus belles photos 
                et laissez la communauté voter pour votre style unique.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="h-12 px-8 rounded-xl text-base hover-lift bg-white text-foreground hover:bg-white/90"
                  asChild
                >
                  <Link href="/register">
                    <Crown className="mr-2 h-5 w-5" aria-hidden="true" />
                    Rejoindre le concours
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-12 px-8 rounded-xl text-base border-white text-white bg-transparent hover:bg-white hover:text-foreground hover-lift transition-all"
                  asChild
                >
                  <Link href="/about">
                    En savoir plus
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
