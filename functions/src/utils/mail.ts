import { createTransport, SendMailOptions } from "nodemailer";
import { IRegistrationArgs } from "../types";

const gmailEmail = process.env.PATCA_EMAIL!;
const gmailPassword = process.env.PATCA_EMAIL_PASSWORD!;

export enum MethodOfPayment {
  PAY_NOW = "Paypal",
  PAY_LATER = "Pay Later",
  SPONSORED = "Sponsored",
}

const regFee = {
  cat1: 195,
  cat2: 175,
};

const APP_NAME = "IFATCA APRM 2022";

const sendWelcomeEmail = async (data: IRegistrationArgs) => {
  const { methodOfPayment, email, fullname, memberAssoc, id } = data;

  const mailTransport = createTransport({
    service: "gmail",
    auth: {
      user: gmailEmail,
      pass: gmailPassword,
    },
  });

  let paymentDetails = "";
  const categoryLevel = searchCat(memberAssoc);
  const fee = categoryLevel === 1 ? regFee.cat1 : regFee.cat2;

  if (methodOfPayment === MethodOfPayment.PAY_LATER) {
    paymentDetails = `
    <div>
      <h3>Payment Method: Pay Later - On site</h3>
      <p>Amount to Pay: <strong>${fee} USD</strong></p>

      <ul>
        <li>
          <div>
            <h4>GCASH</h4>
            <p>Account Name: <strong>CECILE H.</strong></p>
            <p>Account Number: <strong>09153519527</strong><p>
          <div>
        </li>
        <li>
          <div>
            <h4>Philippine National Bank (PNB)</h4>
            <p>Account Name: <strong>Philippine Air Traffic Controllers' Association</strong></p>
            <p>Account Number: <strong>1515-7000-4005</strong><p>
          <div>
        </li>
        <li>
          <div>
            <h4>Bank of the Philippine Islands (BPI)</h4>
            <p>Account Name: <strong>CECILE HURTADO</strong></p>
            <p>Account Number: <strong>7556699393</strong><p>
          <div>
        </li>
      </ul>
    </div>
    `;
  }

  const html = `
  <div style="max-width: 800px;
  margin-inline: auto;
  background: #fafafa;
  padding: 8px 32px;
  border-radius: 10px;">
  <h3>Thank you for registering! Here are the details of your registration:</h3>
  <ul>
      <li><p>Name: <strong>${fullname}</strong></p></li>
      <li><p>Member Association: <strong>${memberAssoc}</strong></p></li>
  </ul>
  <br />
  <div style="text-align: center;"><img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${id}" width="200" height="200" /></div>
  <br />
  <p>The QR code will be presented at the venue and would serve as your pass for the event.</p>
  <p>Feel free to reply to this email for any inquiries regarding your visit.</p>
<p>We can be also be contacted at the following channels: </p>
<ul>
  <li><p>WhatsApp: <strong>+63 929 317 9021</strong></p></li>
  <li><p>Facebook: <strong>https://www.facebook.com/PATCA1962</strong></p></li>
</ul>
  <p>See you at <strong>Cebu City</strong> on <strong>October 20-22, 2022</strong>!</p>
<br/>
${paymentDetails}
<br/>
<div style="padding: 32px 0;text-align: center;"><img src="https://firebasestorage.googleapis.com/v0/b/patca-aprm.appspot.com/o/patca-logo-long.png?alt=media&token=d6e56134-7412-4f5c-8005-6df22de3ca06" alt="PATCA logo" height="32px"/></div>
</div>
  `;

  const mailOptions: SendMailOptions = {
    from: `${APP_NAME} <noreply@patca.ph>`,
    to: email,
    subject: `Registration Details`,
    html,
  };

  await mailTransport.sendMail(mailOptions);

  return null;
};

function searchCat(atca: string) {
  const found = ATCAs.find((atc) => atc.atca === atca);
  if (!found) throw new Error("Could not find that atca");
  const category = found.category;

  return category;
}

export const ATCAs = [
  {
    atca: "ATC Council of the New Zealand Air Line Pilots Association",
    category: 1,
  },
  {
    atca: "Air Traffic Controllers' Association (Singapore)",
    category: 1,
  },
  {
    atca: "Air Traffic Controllers' Association of Indonesia",
    category: 2,
  },
  {
    atca: "Air Traffic Controllers' Association of Iran",
    category: 2,
  },
  {
    atca: "Air Traffic Controllers' Association of Sri Lanka",
    category: 2,
  },
  {
    atca: "Air Traffic Controllers' Guild of India",
    category: 2,
  },
  {
    atca: "Civil Air Operations Officers' Association of Australia",
    category: 1,
  },
  {
    atca: "Hong Kong Air Traffic Control Association",
    category: 1,
  },
  {
    atca: "Japan Federation of Air Traffic Controllers",
    category: 1,
  },
  {
    atca: "Kazahkstan - Kazaeronavigatsia",
    category: 2,
  },
  {
    atca: "Korea Air Traffic Controllers' Association",
    category: 1,
  },
  {
    atca: "Macau Air Traffic Controllers' Association",
    category: 1,
  },
  {
    atca: "Malaysian Air Traffic Controllers' Association",
    category: 2,
  },
  {
    atca: "Maldives Air Traffic Controllers Association",
    category: 2,
  },
  {
    atca: "Mongolian Air Traffic Controllers",
    category: 2,
  },
  {
    atca: "Nepal Air Traffic Controllers' Association",
    category: 2,
  },
  {
    atca: "Pakistan Air Traffic Controllers' Guild",
    category: 2,
  },
  {
    atca: "Philippine Air Traffic Controllers' Association",
    category: 2,
  },
  {
    atca: "ROCATCA - Taiwan",
    category: 1,
  },
];

export default sendWelcomeEmail;
