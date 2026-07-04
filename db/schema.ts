import { relations } from "drizzle-orm";
import { date, datetime } from "drizzle-orm/mysql-core";
import { pgTable, text, timestamp, boolean, index, uuid, varchar, pgEnum } from "drizzle-orm/pg-core";

// User Schema 

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));


// Get started Schema

export const userTypeEnum = pgEnum("user_type_enum", ['event_organizer', 'college_representative', 'student', 'club', 'other']);

export const eventNumberEnum = pgEnum("event_number_enum", ['1-5', '5-20', '20-50', '50+']);

export const participantNumberEnum = pgEnum("participant_number_enum", ['<50', '50-100', '100-250', '250-500', '500+']);

export const featureEnum = pgEnum('feature_enum', ['QR_Entry', 'Registration', 'Attendance', 'Complete_Event_Management']);

export const features = [
  'QR_Entry', 'Registration', 'Attendance', 'Complete_Event_Management'
];

export const userProfile = pgTable("user_profile", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: text("user_id").references(()=> user.id), // Ensure 'user' is imported/defined above this!
  fullName: varchar("full_name", {length: 50}).notNull(),
  phoneNumber: varchar("phone_number", {length: 10}),
  // country: varchar("country", {length: 30}),
  // state: varchar("state", {length: 30}),

  profileImageUrl: text("profile_image_url")
});

// export const userType = pgTable("user_type", {
//   id: uuid("id").primaryKey().defaultRandom(),

//   userId: text("user_id").references(()=> user.id),
//   type: userTypeEnum('user_type').default('student'),
// });

export const institution = pgTable("organization", {
  id : uuid('id').primaryKey().defaultRandom(),

  userId: text('user_id').references(() => user.id),

  institutionName: text('institution_name').notNull(),
  // userRole: ,
  institutionWebsite: text('institution_website'),
  officalEmail : text('official_email').notNull(),
});

export const additionalInfo = pgTable('addtional_info', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(()=> user.id),

  eventNumber: eventNumberEnum('event_number').default('1-5'),
  participantNumber: participantNumberEnum('participant_number').default('50-100'),
  featureType: text('feature_type').array().notNull().default(['QR_Entry']) 
});


// Event Schema 

export const eventStatusEnum = pgEnum('event_status_enum', ['draft', 'published'])

export const events = pgTable("event", {
  id: uuid('id').primaryKey().defaultRandom(),

  organizerId: text('organizer_id').references(()=> user.id),

  eventName: varchar('event_name', {length: 50}).notNull(),
  eventDescription: text('event_description').notNull(),
  
  eventVenue: varchar('event_venue', {length:50}).notNull(),

  eventStatus: eventStatusEnum('event_status').notNull().default('draft'),
  
  eventStartAt: timestamp("event_start_at", { mode: "date" }).notNull(),
  eventEndAt: timestamp("event_end_at", { mode: "date" }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

