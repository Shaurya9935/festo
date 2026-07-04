"use server"

import { db } from '@/db';
import { user } from '@/db/schema';
import { auth } from '@/lib/auth';
import { createEvent } from '@/services/event.service';
import { createEventSchema } from '@/validators/event.validate';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest){
    try{
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const body = createEventSchema.parse(await req.json()) ;

        const event = await createEvent({
            organizerId: session.user.id,
            ...body
        })
        return NextResponse.json({
            success: true,
            message: "Event created successfully",
            data: event,
        },
        {status: 201}
    );
    }catch(error){
        return NextResponse.json({
            success: false,
            message: error instanceof Error
                    ? error.message
                    : "Internal Server Error",
        }, 
            {status: 500}
        )
    }
}