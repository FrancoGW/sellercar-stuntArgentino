import { withAuth } from 'next-auth/middleware';

/**
 * Protección de rutas admin: solo usuarios autenticados con role admin.
 */
export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token && token.role === 'admin',
  },
  pages: { signIn: '/admin/login' },
});

export const config = {
  matcher: ['/admin', '/admin/vehiculos/:path*', '/admin/contactos/:path*'],
};
