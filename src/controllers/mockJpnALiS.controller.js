function nowDateTime() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    " " +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes()) +
    ":" +
    pad(d.getSeconds())
  );
}

function error(res, code, message) {
  return res.status(200).json({
    repdatetime: nowDateTime(),
    repindicator: 0,
    messagecode: code,
    message: message,
  });
}

/**
 * Mock rule (deterministic) for life/death scenario:
 * - last digit:
 *   - 0,1,2,3 => ALIVE (no messagecode/message)
 *   - 4,5,6   => DEAD with deathdate exists => ALS0014
 *   - 7,8,9   => DEAD but deathdate missing => ALS0013
 */
function getLifeStatus(requestkptno) {
  const lastDigit = Number(String(requestkptno).slice(-1));

  if ([0, 1, 2, 3].includes(lastDigit)) {
    return { isDead: false, hasDeathDate: false };
  }
  if ([4, 5, 6].includes(lastDigit)) {
    return { isDead: true, hasDeathDate: true };
  }
  return { isDead: true, hasDeathDate: false };
}

export const mockJpnALiSCheck = async (req, res) => {
  try {
    const {
      agencyid,
      loginid,
      password,
      ipaddress,
      requestorid,
      requestdatetime,
      requesttype,
      requestkptno,
    } = req.body || {};

    // ALS0001 / ALS0002
    if (!agencyid) return error(res, "ALS0001", "ID AGENSI TIADA NILAI");
    if (agencyid !== "ABCD001") return error(res, "ALS0002", "ID AGENSI TIDAK SAH");

    // ALS0003 / ALS0004
    if (!loginid || !password) return error(res, "ALS0003", "ID LOGIN ATAU KATA LALUAN TIADA NILAI");
    if (loginid !== "JPN_LOGIN_01" || password !== "VeryStrongPasswordHere")
      return error(res, "ALS0004", "ID LOGIN DAN KATA LALUAN TIDAK SAH");

    // ALS0005 / ALS0006
    if (!ipaddress) return error(res, "ALS0005", "ALAMAT IP TIADA NILAI");
    if (ipaddress !== "123.123.12.1")
      return error(res, "ALS0006", "ID AGENSI DAN ALAMAT IP TIDAK SAH");

    // ALS0007
    if (!requestorid) return error(res, "ALS0007", "ID REQUESTOR TIADA NILAI");

    // ALS0008 / ALS0009
    if (!requestdatetime) return error(res, "ALS0008", "TARIKH/MASA REQUEST TIADA NILAI");
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(requestdatetime))
      return error(res, "ALS0009", "TARIKH/MASA REQUEST TIDAK SAH");

    // ALS0010
    if (!requestkptno || !/^\d{12}$/.test(requestkptno))
      return error(res, "ALS0010", "FORMAT NO KAD PENGENALAN TIDAK SAH");

    // ALS0011 (record not found) — keep your deterministic rule here:
    // Example: odd last digit = not found
    const lastDigit = Number(requestkptno.slice(-1));
    if (lastDigit % 2 === 1)
      return error(res, "ALS0011", "REKOD NO KAD PENGENALAN TIDAK SAH");

    /* =================================================
     * SUCCESS RESPONSE (repindicator = 1)
     * with message rules from your screenshot
     * ================================================= */
    const { isDead, hasDeathDate } = getLifeStatus(requestkptno);

    const reply = {
      // echo request (as response spec shows "as request")
      agencyid,
      loginid,
      ipaddress,
      requestorid,
      requestdatetime,
      requesttype,
      requestkptno,

      // mandatory reply
      repdatetime: nowDateTime(),
      repindicator: 1,

      // optional demographic (your previous fields)
      kptno: requestkptno,
      kpno: "A234567",
      name: "MOHD HANIFF BIN ISHAK",
      birthdate: "1973-12-01",

      resstat: "B",
      resstatdesc: "WARGANEGARA",
      address1: "NO. 50",
      address2: "JALAN GEMILANG 1/12",
      address3: "TAMAN BUNGA RAYA",
      postcode: "56100",
      ctcode: "1401",
      stcode: "01",
      ctdesc: "KUALA TERENGGANU",
      stdesc: "TERENGGANU",
    };

    // Apply alive/dead messaging rules
    if (!isDead) {
      // No Value / No Value -> best practice: omit fields
      reply.deathdate = null; // optional
      // do NOT set messagecode/message
    } else if (hasDeathDate) {
      reply.deathdate = "2011-03-28";
      reply.messagecode = "ALS0014";
      reply.message = "INDIVIDU DIREKODKAN MENINGGAL DUNIA";
    } else {
      reply.deathdate = null;
      reply.messagecode = "ALS0013";
      reply.message = "INDIVIDU DIREKODKAN MENINGGAL DUNIA. TIADA MAKLUMAT TARIKH MATI";
    }

    // Biometric (if requesttype = 2)
    if (Number(requesttype) === 2) {
      reply.leftminutiae = "000000000000000000000049008486";
      reply.rightminutiae = "000000000000000000000049008487";
      reply.photo = "ffd8ffe000104a46494600010200006400640000";
    }

    return res.status(200).json(reply);
  } catch (err) {
    console.error("MOCK JPN ALiS SYSTEM ERROR:", err);
    return error(res, "ALS0012", "GAGAL AKSES MAKLUMAT DARI PANGKALAN DATA");
  }
};

export default {
  mockJpnALiSCheck,
};