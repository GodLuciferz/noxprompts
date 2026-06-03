import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || "gtKFFx";
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || "eCwWELxi";
const PAYU_BASE_URL = process.env.PAYU_ENV === "production"
  ? "https://secure.payu.in/_payment"
  : "https://test.payu.in/_payment";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { promptSlug, promptName, price, userEmail, userName } = body;

  const txnid = `NP_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const amount = parseFloat(price).toFixed(2);
  const productinfo = `NoxPrompts - ${promptName}`;
  const firstname = userName || "User";
  const email = userEmail || "user@noxprompts.com";

  const surl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?txnid=${txnid}&slug=${promptSlug}`;
  const furl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/failure?txnid=${txnid}&slug=${promptSlug}`;

  // Correct PayU hash formula:
  // key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
  const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}||||||||||${PAYU_MERCHANT_SALT}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  return NextResponse.json({
    payuUrl: PAYU_BASE_URL,
    params: {
      key: PAYU_MERCHANT_KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      surl,
      furl,
      hash,
      phone: "9999999999",
    },
  });
}
