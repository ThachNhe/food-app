import { Link } from '@tanstack/react-router'
import { LogOut, Plus, Menu, X, UtensilsCrossed } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useLogout } from '@/features/auths/hooks/useLogin'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const { isAuthenticated, user } = useAuthStore()
  const { mutate: logout } = useLogout()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-white">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold leading-tight tracking-tight text-gradient">
                Foodtour
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground leading-none">
                Phút Thật
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg hover:bg-accent"
            >
              Trang chủ
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/review/new">
                  <Button
                    size="sm"
                    className="gradient-primary text-white border-0 gap-1.5 shadow-md hover:shadow-lg transition-all hover:scale-105"
                  >
                    <Plus className="h-4 w-4" />
                    Đăng review
                  </Button>
                </Link>
                <div className="ml-2 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full gradient-warm flex items-center justify-center text-white text-sm font-bold">
                    {user?.email?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <button
                    onClick={() => logout()}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="gradient-primary text-white border-0 shadow-md"
                  >
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in-up">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-lg hover:bg-accent"
              >
                🏠 Trang chủ
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/review/new"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-lg hover:bg-accent"
                  >
                    ➕ Đăng review
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMobileOpen(false)
                    }}
                    className="px-3 py-2 text-sm font-medium text-left text-destructive hover:bg-accent rounded-lg"
                  >
                    🚪 Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-lg hover:bg-accent"
                  >
                    🔐 Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-lg hover:bg-accent"
                  >
                    ✨ Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
