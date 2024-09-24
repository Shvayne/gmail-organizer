import axios from "axios"; //make HTTPS requests

export const getEmailsFromAllowedSenders = async (
  accessToken,
  allowedEmails
) => {
  try {
    const emailPromises = allowedEmails.map(async (email) => {
      const response = await axios.get(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { q: `from:${email}`, maxResults: 20 },
        }
      );
      return response.data.messages || [];
    });
    const emailsFromAllowedSenders = await Promise.all(emailPromises);
    return emailsFromAllowedSenders.flat();
  } catch (err) {
    console.error("Error fetching emails", err);
    return [];
  }
};

export const getEmailDetailsById = async (accessToken, messageId) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const message = response.data;

    const headers = message.payload.headers;
    const subject = headers.find((header) => header.name === "Subject")?.value;
    const from = headers.find((header) => header.name === "From")?.value;
    const date = headers.find((header) => header.name === "Date")?.value;

    // Extract body (can be more complex depending on MIME type)
    let body = "";
    if (message.payload?.body?.data) {
      body = atob(
        message.payload.body.data.replace(/-/g, "+").replace(/_/g, "/")
      ); // Decoding base64 body
    } else if (message.payload?.parts) {
      const part = message.payload.parts.find(
        (part) => part.mimeType === "text/plain"
      );
      if (part?.body?.data) {
        body = atob(part.body.data.replace(/-/g, "+").replace(/_/g, "/")); // Decoding base64 part
      }
    }
    return {
      id: message.id,
      threadId: message.threadId,
      from,
      subject,
      body,
      date
    };
  } catch (error) {
    console.error(`Error fetching details for message ID ${messageId}:`, error);
    return null;
  }
};
