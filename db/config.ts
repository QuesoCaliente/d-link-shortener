import { column, defineDb, defineTable, NOW } from "astro:db";

const User = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    username: column.text({ unique: true, notNull: true, optional: false }),
    email: column.text({ unique: true, optional: true }),
    image: column.text({ optional: true }),
    password: column.text({ optional: true }),
    created: column.date({ default: NOW }),
    updated: column.date({ default: NOW }),
    github_id: column.text({ unique: true, optional: true }),
  },
});

const Session = defineTable({
  columns: {
    id: column.text({
      primaryKey: true,
    }),
    expiresAt: column.date(),
    userId: column.text({
      references: () => User.columns.id,
    }),
  },
});

const Link = defineTable({
  columns: {
    short: column.text({ primaryKey: true }),
    original: column.text(),
    created: column.date({ default: NOW }),
    updated: column.date({ default: NOW }),
    userId: column.text({
      references: () => User.columns.id,
    }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
    Session,
    Link,
  },
});
