"use server";

import { db } from "@/db/index";
import { userProfile, userType, institution, additionalInfo } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function saveOnboardingData(data: {
  fullName: string;
  phoneNumber: string;
  country: string;
  state: string;
  orgName: string;
  orgType: string;
  eventNumber: "1-5" | "5-20" | "20-50" | "50+";
  participantNumber: "<50" | "50-100" | "100-250" | "250-500" | "500+";
  featureType: "QR_Entry" | "Registration" | "Attendance" | "Complete_Event_Management";
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  try {
    // 1. Save profile
    const existingProfiles = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1);

    // Limit phoneNumber to 10 chars per schema constraint varchar(10)
    const cleanPhone = data.phoneNumber.replace(/\D/g, "").slice(0, 10);

    if (existingProfiles.length > 0) {
      await db
        .update(userProfile)
        .set({
          fullName: data.fullName,
          phoneNumber: cleanPhone,
          country: data.country,
          state: data.state,
        })
        .where(eq(userProfile.userId, userId));
    } else {
      await db.insert(userProfile).values({
        userId,
        fullName: data.fullName,
        phoneNumber: cleanPhone,
        country: data.country,
        state: data.state,
      });
    }

    // 2. Save user type
    let mappedType: "event_organizer" | "college_representative" | "student" | "club" | "other" = "student";
    if (data.orgType === "Education") mappedType = "college_representative";
    else if (data.orgType === "Startup" || data.orgType === "SMB" || data.orgType === "Enterprise") mappedType = "event_organizer";
    else if (data.orgType === "Non-profit") mappedType = "other";

    const existingTypes = await db
      .select()
      .from(userType)
      .where(eq(userType.userId, userId))
      .limit(1);

    if (existingTypes.length > 0) {
      await db
        .update(userType)
        .set({ type: mappedType })
        .where(eq(userType.userId, userId));
    } else {
      await db.insert(userType).values({
        userId,
        type: mappedType,
      });
    }

    // 3. Save organization/institution
    const existingOrgs = await db
      .select()
      .from(institution)
      .where(eq(institution.userId, userId))
      .limit(1);

    if (existingOrgs.length > 0) {
      await db
        .update(institution)
        .set({
          institutionName: data.orgName,
          officalEmail: session.user.email,
        })
        .where(eq(institution.userId, userId));
    } else {
      await db.insert(institution).values({
        userId,
        institutionName: data.orgName,
        officalEmail: session.user.email,
      });
    }

    // 4. Save additional info
    const existingInfos = await db
      .select()
      .from(additionalInfo)
      .where(eq(additionalInfo.userId, userId))
      .limit(1);

    if (existingInfos.length > 0) {
      await db
        .update(additionalInfo)
        .set({
          eventNumber: data.eventNumber,
          participantNumber: data.participantNumber,
          featureType: data.featureType,
        })
        .where(eq(additionalInfo.userId, userId));
    } else {
      await db.insert(additionalInfo).values({
        userId,
        eventNumber: data.eventNumber,
        participantNumber: data.participantNumber,
        featureType: data.featureType,
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return { success: false, error: error.message || "Failed to save onboarding details" };
  }
}
