// Point every Jest worker at a dedicated SQLite test database BEFORE any module
// (lib/prisma) reads DATABASE_URL. Resolved relative to prisma/schema.prisma,
// so the file lives at prisma/test.db.
process.env.DATABASE_URL = "file:./test.db";
