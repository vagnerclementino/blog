import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import mailchimp from "mailchimp-api-v3";

admin.initializeApp();

export const newsletterSignup = functions
  .runWith({
    memory: "256MB",
    timeoutSeconds: 10,
  })
  .https.onRequest(async (req: any, res: any) => {
    if (req.method !== "POST") {
      res.status(405).json({ message: "Method Not Allowed" });
      return;
    }

    const { name, email } = req.body;

    // Validação simples
    if (!name || !email) {
      res.status(400).json({ message: "Nome e email são obrigatórios." });
      return;
    }

    const listId = process.env.MAILCHIMP_LIST_ID;

    if (!listId) {
      functions.logger.error("MAILCHIMP_LIST_ID não configurada");
      res.status(500).json({ message: "Configuração do servidor incompleta." });
      return;
    }

    const apiKey = process.env.MAILCHIMP_API_KEY;
    if (!apiKey) {
      functions.logger.error("MAILCHIMP_API_KEY não configurada");
      res.status(500).json({ message: "Configuração do servidor incompleta." });
      return;
    }

    const mailchimpConfig = {
      apiKey,
      server: process.env.MAILCHIMP_SERVER,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mailchimpClient = new mailchimp(mailchimpConfig.apiKey) as any;

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
      res.status(200).json({ message: "Inscrição realizada com sucesso!" });
    } catch (err: any) {
      functions.logger.error("Erro no Mailchimp:", err);
      // Se o erro for de já existir, podemos retornar mensagem amigável
      if (err.status === 400 && err.detail && typeof err.detail === 'string' && (err.detail.includes('already a member') || err.detail.includes('Member Exists'))) {
        res.status(200).json({ message: "Você já está inscrito!" });
        return;
      }
      res.status(500).json({ message: "Erro ao processar inscrição. Tente novamente." });
    }
  });
