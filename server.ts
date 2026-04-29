import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Quote Submission
  app.post("/api/quotes", async (req, res) => {
    try {
      const { name, email, address, propertyType, preferredDate } = req.body;

      // 1. In a real production app, you'd save to a DB here (e.g. Firestore Admin)
      // For now, we assume the client also handles Firestore via the direct SDK 
      // or we can implement it here.
      
      console.log("New Quote Received:", { name, email, address, propertyType, preferredDate });

      // 2. Send Email Alert
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.ethereal.email",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || "test@example.com",
          pass: process.env.SMTP_PASS || "password",
        },
      });

      const mailOptions = {
        from: '"Chargeev Alerts" <alerts@chargeev.uk>',
        to: process.env.ADMIN_EMAIL || "chargeev.uk@gmail.com",
        subject: "New Quote Request: " + name,
        text: `
          New Quote Request Received:
          Name: ${name}
          Email: ${email}
          Address: ${address}
          Property Type: ${propertyType}
          Preferred Date: ${preferredDate}
        `,
        html: `
          <h3>New Quote Request Received</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Property Type:</strong> ${propertyType}</p>
          <p><strong>Preferred Date:</strong> ${preferredDate}</p>
        `,
      };

      // Only attempted if SMTP is configured
      if (process.env.SMTP_HOST) {
        await transporter.sendMail(mailOptions);
        console.log("Email alert sent successfully.");
      } else {
        console.log("SMTP not configured. Skipping email alert. (Use .env to configure)");
      }

      res.status(200).json({ success: true, message: "Quote processed and alert sent." });
    } catch (error) {
      console.error("Error processing quote:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
