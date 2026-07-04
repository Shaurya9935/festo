import { z } from 'zod'

export const createEventSchema = z.object({
    eventName: z.string().min(3).max(50),
    eventDescription: z.string().min(3),
    eventVenue: z.string().min(3),

    eventStartAt: z.coerce.date(),
    eventEndAt: z.coerce.date()

})