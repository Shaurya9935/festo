import { db } from "@/db";
import { events } from "@/db/schema";
import { and, eq } from "drizzle-orm";

interface createEventInput {
  organizerId: string;

  eventName: string;
  eventDescription: string;

  eventVenue: string;
  // eventStatus:
  eventStartAt: Date;
  eventEndAt: Date;
}

export async function createEvent(data: createEventInput) {
  const now = new Date();

  if (data.eventStartAt < now) {
    throw new Error("Event cannot start in the past");
  }

  if (data.eventEndAt <= data.eventStartAt) {
    throw new Error("Event end time must be after start time");
  }

  if (data.eventStartAt > data.eventEndAt) {
    throw new Error("Start date cannot be after End date");
  }

  const [newEvent] = await db
    .insert(events)
    .values({
      organizerId: data.organizerId,

      eventName: data.eventName,

      eventDescription: data.eventDescription,

      eventVenue: data.eventVenue,

      eventStartAt: data.eventStartAt,

      eventEndAt: data.eventEndAt,
    })
    .returning();

  return newEvent;
}
