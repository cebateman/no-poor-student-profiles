"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/lib/LanguageContext";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const { locale, setLocale, t } = useLanguage();

  useEffect(() => {
    const token = localStorage.getItem("npa_token");
    if (!token && pathname !== "/login") {
      router.replace("/login");
    } else {
      setAuthenticated(true);
    }
    setChecking(false);
  }, [pathname, router]);

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("npa_token")}`,
        },
      });
    } catch {
      // Proceed with local cleanup even if the API call fails
    }
    localStorage.removeItem("npa_token");
    router.replace("/login");
  }

  if (checking) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#CEDBD5",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <p style={{ color: "#6b7280", fontSize: "16px" }}>{t("nav.loading")}</p>
      </div>
    );
  }

  // Login page renders without the sidebar
  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (!authenticated) {
    return null;
  }

  const navItems = [
    { href: "/", label: t("nav.dashboard"), icon: "\u2302" },
    { href: "/students/new", label: t("nav.addStudent"), icon: "+" },
    { href: "/settings", label: t("nav.siteSettings"), icon: "\u2699" },
    { href: "/admins", label: t("nav.manageAdmins"), icon: "\u263A" },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
        }}
      >
        {/* Branding */}
        <div
          style={{
            padding: "20px 16px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Link
            href="/"
            style={{ textDecoration: "none" }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 700,
                color: "#335D63",
                letterSpacing: "-0.5px",
              }}
            >
              {t("nav.brand")}
            </h1>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "12px",
                color: "#6b7280",
              }}
            >
              {t("nav.subtitle")}
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  marginBottom: "4px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#335D63" : "#374151",
                  backgroundColor: isActive ? "#E8F0EC" : "transparent",
                  transition: "background-color 0.15s",
                }}
              >
                <span style={{ fontSize: "18px", width: "20px", textAlign: "center" }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Language Toggle + Logout */}
        <div
          style={{
            padding: "12px 8px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          {/* Language Toggle */}
          <div
            style={{
              display: "flex",
              gap: "2px",
              marginBottom: "8px",
              padding: "2px",
              borderRadius: "6px",
              backgroundColor: "#f3f4f6",
            }}
          >
            <button
              onClick={() => setLocale("en")}
              style={{
                flex: 1,
                padding: "6px 0",
                border: "none",
                borderRadius: "4px",
                backgroundColor: locale === "en" ? "#ffffff" : "transparent",
                color: locale === "en" ? "#335D63" : "#6b7280",
                fontSize: "12px",
                fontWeight: locale === "en" ? 600 : 400,
                cursor: "pointer",
                boxShadow: locale === "en" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
              }}
            >
              English
            </button>
            <button
              onClick={() => setLocale("pt")}
              style={{
                flex: 1,
                padding: "6px 0",
                border: "none",
                borderRadius: "4px",
                backgroundColor: locale === "pt" ? "#ffffff" : "transparent",
                color: locale === "pt" ? "#335D63" : "#6b7280",
                fontSize: "12px",
                fontWeight: locale === "pt" ? 600 : 400,
                cursor: "pointer",
                boxShadow: locale === "pt" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
              }}
            >
              Portugues
            </button>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              padding: "10px 12px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontSize: "14px",
              color: "#dc2626",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "18px", width: "20px", textAlign: "center" }}>
              &larr;
            </span>
            {t("nav.logout")}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: "240px",
          backgroundColor: "#CEDBD5",
          minHeight: "100vh",
        }}
      >
        <div style={{ padding: "24px 32px", maxWidth: "1200px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </LanguageProvider>
  );
}
