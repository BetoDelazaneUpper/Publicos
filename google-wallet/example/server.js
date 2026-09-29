require("dotenv").config();

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const port = Number(process.env.PORT || 8080);
const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const appOrigin = process.env.APP_ORIGIN || ("http://localhost:" + port);

function requireConfig() {
  const missing = [];
  if (!issuerId) missing.push("GOOGLE_WALLET_ISSUER_ID");
  if (!credentialsPath) missing.push("GOOGLE_APPLICATION_CREDENTIALS");

  if (missing.length) {
    throw new Error("Missing environment variables: " + missing.join(", "));
  }

  if (!fs.existsSync(credentialsPath)) {
    throw new Error("Service Account file was not found.");
  }
}

function loadCredentials() {
  requireConfig();
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error("GOOGLE_APPLICATION_CREDENTIALS must reference a Service Account JSON file.");
  }

  return credentials;
}

function suffix(prefix) {
  return prefix + "_" + crypto.randomUUID().replace(/-/g, "");
}

function createPayload() {
  const classId = issuerId + "." + suffix("beto_lab_class");
  const objectId = issuerId + "." + suffix("beto_lab_object");

  return {
    genericClasses: [
      {
        id: classId
      }
    ],
    genericObjects: [
      {
        id: objectId,
        classId,
        state: "ACTIVE",
        genericType: "GENERIC_TYPE_UNSPECIFIED",
        hexBackgroundColor: "#111111",
        cardTitle: {
          defaultValue: {
            language: "pt-BR",
            value: "Beto Delazane"
          }
        },
        header: {
          defaultValue: {
            language: "pt-BR",
            value: "Google Wallet Lab"
          }
        },
        subheader: {
          defaultValue: {
            language: "pt-BR",
            value: "Senior Software Engineer"
          }
        },
        barcode: {
          type: "QR_CODE",
          value: objectId,
          alternateText: "Generic Pass Demo"
        },
        textModulesData: [
          {
            id: "about",
            header: "Sobre",
            body: "Generic Pass assinado em um backend Node.js com Service Account."
          },
          {
            id: "security",
            header: "Segurança",
            body: "A chave privada permanece somente no servidor."
          }
        ],
        linksModuleData: {
          uris: [
            {
              id: "portfolio",
              uri: "https://betodelazaneupper.github.io/Publicos/",
              description: "Portfolio"
            }
          ]
        }
      }
    ]
  };
}

function createSaveUrl() {
  const credentials = loadCredentials();

  const claims = {
    iss: credentials.client_email,
    aud: "google",
    typ: "savetowallet",
    origins: [appOrigin],
    payload: createPayload()
  };

  const token = jwt.sign(claims, credentials.private_key, {
    algorithm: "RS256"
  });

  return "https://pay.google.com/gp/v/save/" + token;
}

app.disable("x-powered-by");
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  try {
    requireConfig();
    res.json({ ok: true, issuerConfigured: true, origin: appOrigin });
  } catch (error) {
    res.status(503).json({ ok: false, error: error.message });
  }
});

app.get("/api/wallet-link", (_req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    res.json({ saveUrl: createSaveUrl() });
  } catch (error) {
    console.error("Wallet link error:", error.message);
    res.status(500).json({
      error: "Could not generate Google Wallet save URL.",
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log("Google Wallet Lab running at " + appOrigin);
});
