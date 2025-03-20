"use server";

export async function sendReminderEmail(
  email: string,
  taskTitle: string,
  dueDate: Date
) {
  console.log(
    `Sending reminder email to ${email} for task "${taskTitle}" due on ${dueDate.toDateString()}`
  );
  return {
    success: true,
    message: "Reminder email sent successfully!",
  };
}
