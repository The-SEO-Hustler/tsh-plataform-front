import nodemailer from "nodemailer";
import advancedKeywordAnalysisEmailMessage from "@/lib/emailMessage/advancedKeywordAnalysis";
import contentPlanningEmailMessage from "@/lib/emailMessage/contentPlanning";
import seoCheckEmailMessage from "@/lib/emailMessage/seoCheck";
import llmstxtEmailMessage from "@/lib/emailMessage/llmstxt";
import eeatCheckEmailMessage from "@/lib/emailMessage/searchQualityEvaluator";
import searchIntentEmailMessage from "@/lib/emailMessage/searchIntent";

const sendNotificationEmail = async (email, subject, body) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: "The SEO Hustler <noreply@theseohustler.com>",
    to: email,
    subject: subject,
    html: body,
  };
  await transporter.sendMail(mailOptions);
};

export async function POST(req) {
  const { email, type, id, keyword, score } = await req.json();

  let subject = "";
  let body = "";

  switch (type) {
    case "advanced-keyword-analysis":
      subject = "Advanced Keyword Analysis Completed - " + keyword;
      body = advancedKeywordAnalysisEmailMessage(keyword, id);
      break;
    case "content-planning":
      subject = "Content Planning Completed - " + keyword;
      body = contentPlanningEmailMessage(keyword, id);
      break;
    case "seo-check":
      subject = "SEO Check Completed - " + keyword;
      body = seoCheckEmailMessage(keyword, id, score);
      break;
    case "llmstxt":
      subject = "LLMSTxt Completed - " + keyword;
      body = llmstxtEmailMessage(keyword, id);
      break;
    case "evaluation":
      subject = "EEAT Check Completed - " + keyword;
      body = eeatCheckEmailMessage(keyword, id);
      break;
    case "search-intent":
      subject = "Search Intent Completed - " + keyword;
      body = searchIntentEmailMessage(keyword, id);
      break;
  }
  await sendNotificationEmail(email, subject, body);
  return new Response("OK");
}
