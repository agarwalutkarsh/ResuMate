export const OWNER_NAME = "Utkarsh";

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://resumate-gisz.onrender.com";

export const SUGGESTED_QUESTIONS = [
  {
    title: "Walk me through the experience",
    text: `What is ${OWNER_NAME}'s work experience and current role?`,
  },
  {
    title: "Core technical skills",
    text: `What are ${OWNER_NAME}'s strongest technical skills and tools?`,
  },
  {
    title: "A project worth talking about",
    text: `Tell me about a project ${OWNER_NAME} has built and the impact it had.`,
  },
];
