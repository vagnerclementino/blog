import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as mailchimp from "mailchimp-api-v3";

admin.initializeApp();

const mailchimpConfig = {
  apiKey: functions.config().mailchimp?.api_key || process.env.MAILCHIMP_API_KEY,
  server: functions.config().mailchimp?.server || process.env.MAILCHIMP_SERVER,
};

const mailchimpClient = new mailchimp(mailchimpConfig.apiKey, { server: mailchimpConfig.server });

export const newsletterSignup = functions
  .runWith({
    memory: "256MiB",
    timeoutSeconds: 10,
    region: ["us-central1"],
  })
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { name, email } = req.body;

    // Validação simples
    if (!name || !email) {
      return res.status(400).json({ message: "Nome e email são obrigatórios." });
    }

    const listId = functions.config().mailchimp?.list_id || process.env.MAILCHIMP_LIST_ID;

    if (!listId) {
      functions.logger.error("MAILCHIMP_LIST_ID não configurada");
      return res.status(500).json({ message: "Configuração do servidor incompleta." });
    }

    try {
      await mailchimpClient.lists.addMembers(listId, [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: name,
          },
        },
      ]);

      functions.logger.info(`Inscrição adicionada: ${email}`);
      return res.status(200).json({ message: "Inscrição realizada com sucesso!" });
    } catch (err: any) {
      functions.logger.error("Erro no Mailchimp:", err);
      // Se o erro for de já existir, podemos retornar 409 ou mensagem amigável
      if (err.status === 400 && err.detail && typeof err.detail === 'string' && err.detail.includes('already a member')) {
        return res.status(200).json({ message: "Você já está inscrito!" });
      }
      return res.status(500).json({ message: "Erro ao processar inscrição. Tente novamente." });
    }
  });