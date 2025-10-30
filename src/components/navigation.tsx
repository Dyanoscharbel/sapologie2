"use client";

import { Crown, Menu, X, User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

const navigationItems = [
  { href: "/", label: "Accueil" },
  //{ href: "/competitions", label: "Compétitions" },
  { href: "/vote", label: "Voter" },
  { href: "/about", label: "À propos" },
];

interface NavigationProps {
  user?: {
    name: string;
    isLoggedIn: boolean;
    isAdmin?: boolean;
  } | null;
}

export function Navigation({ user }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow">
      <nav className="container-premium" aria-label="Navigation principale">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group transition-opacity hover:opacity-80"
            aria-label="Retour à l'accueil"
          >
            <div className="relative">
              <Crown className="h-8 w-8 text-primary transition-transform group-hover:scale-110" aria-hidden="true" />
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hidden sm:block">
                Le Royaume de la Sapologie
              </h1>
              <h1 className="text-lg font-bold text-primary sm:hidden">
                LRDS
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-1">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        pathname === item.href
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground"
                      )}
                    >
                      <Link href={item.href}>
                        {item.label}
                        {pathname === item.href && (
                          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full" aria-hidden="true" />
                        )}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                {user?.isAdmin && (
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        pathname === "/admin"
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground"
                      )}
                    >
                      <Link href="/admin">
                        <Settings className="inline h-4 w-4 mr-1.5" aria-hidden="true" />
                        Admin
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user?.isLoggedIn ? (
              <>
                <span className="text-sm text-muted-foreground hidden lg:inline">
                  Bonjour, <span className="font-medium text-foreground">{user.name}</span>
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden sm:flex items-center gap-2 btn-glow"
                  asChild
                >
                  <Link href="/dashboard">
                    <User className="h-4 w-4" aria-hidden="true" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex items-center gap-2"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  aria-label="Se déconnecter"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hidden sm:flex"
                  asChild
                >
                  <Link href="/login">Connexion</Link>
                </Button>
                <Button 
                  size="sm" 
                  className="btn-glow hidden sm:flex"
                  asChild
                >
                  <Link href="/register">Participer</Link>
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    pathname === item.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {user?.isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    pathname === "/admin"
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Settings className="inline h-4 w-4 mr-1.5" aria-hidden="true" />
                  Admin
                </Link>
              )}
              
              <div className="border-t border-border/40 my-2" />
              
              {user?.isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium rounded-lg transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <User className="inline h-4 w-4 mr-1.5" aria-hidden="true" />
                    Mon Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <LogOut className="inline h-4 w-4 mr-1.5" aria-hidden="true" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium rounded-lg transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium rounded-lg transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Participer
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export function Footer() {
  const footerLinks = [
    { href: "/about", label: "À propos" },
    { href: "/rules", label: "Règlement" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="border-t border-border/40 bg-muted/30 mt-auto">
      <div className="container-premium py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <Crown className="h-6 w-6 text-primary transition-transform group-hover:scale-110" aria-hidden="true" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Le Roi de la Sapologie
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Le concours de style et d'élégance par excellence. Célébrons ensemble l'art de la sapologie.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground">
              Navigation
            </h3>
            <nav className="flex flex-col gap-3" aria-label="Navigation du pied de page">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit focus-ring rounded"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social & Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground">
              Suivez-nous
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Rejoignez notre communauté et restez informé des dernières tendances.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors focus-ring"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors focus-ring"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Le Roi de la Sapologie. Tous droits réservés.
          </p>
          <p className="text-sm text-muted-foreground italic">
            Que le meilleur style gagne ! ✨
          </p>
        </div>
      </div>
    </footer>
  );
}
