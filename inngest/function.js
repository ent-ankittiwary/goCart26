
import { prisma } from "@/lib/prisma";
import { inngest } from "./client";

// Inngest function to save user data in the database

export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-create",
    triggers: { event: "clerk/user.created" },
  },
  async ({ event }) => {
    const { data } = event;

    const email =
      data.email_addresses?.find(
        (item) => item.id === data.primary_email_address_id
      )?.email_address ?? data.email_addresses?.[0]?.email_address;

    if (!email) {
      throw new Error(
        `No email address found for Clerk user ${data.id}`
      );
    }

    await prisma.user.upsert({
      where: {
        id: data.id,
      },
      update: {
        email,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        image: data.image_url ?? null,
      },
      create: {
        id: data.id,
        email,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        image: data.image_url ?? null,
      },
    });
  }
);

// Inngest function to update user data in the database

export const syncUserUpdate = inngest.createFunction(
  {
    id: "sync-user-update",
    triggers: { event: "clerk/user.updated" },
  },
  async ({ event }) => {
    const { data } = event;

    const email =
      data.email_addresses?.find(
        (item) => item.id === data.primary_email_address_id
      )?.email_address ?? data.email_addresses?.[0]?.email_address;

    if (!email) {
      throw new Error(
        `No email address found for Clerk user ${data.id}`
      );
    }

    await prisma.user.upsert({
      where: {
        id: data.id,
      },
      update: {
        email,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        image: data.image_url ?? null,
      },
      create: {
        id: data.id,
        email,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        image: data.image_url ?? null,
      },
    });
  }
);

// Inngest function to delete a user from the database

export const syncUserDeletion = inngest.createFunction(
  {
    id: "sync-user-delete",
    triggers: { event: "clerk/user.deleted" },
  },
  async ({ event }) => {
    const { data } = event;

    if (!data.id) {
      throw new Error("Clerk user ID is missing from deletion event");
    }

    await prisma.user.deleteMany({
      where: {
        id: data.id,
      },
    });
  }
);
