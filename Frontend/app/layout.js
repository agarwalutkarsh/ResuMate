import "./globals.css";

export const metadata = {
  title: "Ask Utkarsh — AI Resume Assistant",
  description:
    "Chat with an AI assistant trained on Utkarsh's resume. Ask about experience, skills, education and projects.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
