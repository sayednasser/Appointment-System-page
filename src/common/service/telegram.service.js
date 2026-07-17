import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from "../../../config/config.js";

const TELEGRAM_API = (token) =>
  `https://api.telegram.org/bot${token}/sendMessage`;


const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};


const formatTime = (time) => {
  if (!time) return "";

  const [hour, minute] = time.split(":");

  let h = Number(hour);

  const period = h >= 12 ? "م" : "ص";

  h = h % 12 || 12;

  return `${String(h).padStart(2, "0")}:${minute} ${period}`;
};


const sendTelegramMessage = async (text) => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log("Telegram not configured");
    return;
  }

  try {
    await fetch(TELEGRAM_API(TELEGRAM_BOT_TOKEN), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    });

  } catch (error) {
    console.log(error.message);
  }
};


export const telegramService = {

  notifyNewAppointment: (appointment) =>
    sendTelegramMessage(
`📅 <b>حجز موعد جديد</b>

👤 الاسم: ${appointment.patientName}

📞 الهاتف: ${appointment.phone}

🗓 التاريخ: ${formatDate(appointment.appointmentDate)}

⏰ الموعد: ${formatTime(appointment.appointmentTime)}
`
    ),

};