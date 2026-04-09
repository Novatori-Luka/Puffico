export { auth as middleware } from "@/lib/auth";

export const config = {
  // Protect /admin and all sub-routes except /admin/login
  matcher: ["/admin/((?!login).*)"],
};
