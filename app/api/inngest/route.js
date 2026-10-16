import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { deleteCouponOnExpiry, syncUserCreation, syncUserDeletion, syncUserUpdate } from "@/inngest/function";


export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,syncUserUpdate,syncUserDeletion,deleteCouponOnExpiry
  ],
});