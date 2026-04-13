import cron from "node-cron";
import { db } from "../db";
import { users } from "../../shared/schema";
import { isNotNull } from "drizzle-orm";
import { sendReminderEmail } from "./email";

export function initCronJobs() {
  // Run every Sunday at 10 AM ("0 10 * * 0")
  cron.schedule("0 10 * * 0", async () => {
    console.log("[Cron] Running weekly reminder cron job...");
    try {
      const allUsers = await db.select().from(users).where(isNotNull(users.email));
      for (const user of allUsers) {
        if (user.email) {
          await sendReminderEmail(user.email, user.name);
        }
      }
      console.log(`[Cron] Finished sending reminders to ${allUsers.length} users.`);
    } catch (error) {
      console.error("[Cron] Error in cron job:", error);
    }
  });
  console.log("Cron jobs initialized.");
}
