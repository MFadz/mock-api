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

    /* =================================================
     * ALS0001 / ALS0002 – Agency ID
     * ================================================= */
    if (!agencyid) {
      return error(res, "ALS0001", "ID AGENSI TIADA NILAI");
    }

    if (agencyid !== "ABCD001") {
      return error(res, "ALS0002", "ID AGENSI TIDAK SAH");
    }

    /* =================================================
     * ALS0003 / ALS0004 – Login / Password
     * ================================================= */
    if (!loginid || !password) {
      return error(res, "ALS0003", "ID LOGIN ATAU KATA LALUAN TIADA NILAI");
    }

    if (
      loginid !== "JPN_LOGIN_01" ||
      password !== "VeryStrongPasswordHere"
    ) {
      return error(res, "ALS0004", "ID LOGIN DAN KATA LALUAN TIDAK SAH");
    }

    /* =================================================
     * ALS0005 / ALS0006 – IP Address
     * ================================================= */
    if (!ipaddress) {
      return error(res, "ALS0005", "ALAMAT IP TIADA NILAI");
    }

    if (ipaddress !== "123.123.12.1") {
      return error(
        res,
        "ALS0006",
        "ID AGENSI DAN ALAMAT IP TIDAK SAH"
      );
    }

    /* =================================================
     * ALS0007 – Requestor ID
     * ================================================= */
    if (!requestorid) {
      return error(res, "ALS0007", "ID REQUESTOR TIADA NILAI");
    }

    /* =================================================
     * ALS0008 / ALS0009 – Request Datetime
     * ================================================= */
    if (!requestdatetime) {
      return error(res, "ALS0008", "TARIKH/MASA REQUEST TIADA NILAI");
    }

    if (
      !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(requestdatetime)
    ) {
      return error(res, "ALS0009", "TARIKH/MASA REQUEST TIDAK SAH");
    }

    /* =================================================
     * ALS0010 / ALS0011 – IC Number
     * ================================================= */
    if (!requestkptno || !/^\d{12}$/.test(requestkptno)) {
      return error(
        res,
        "ALS0010",
        "FORMAT NO KAD PENGENALAN TIDAK SAH"
      );
    }

    // Deterministic mock rule:
    // odd last digit → record not found
    const lastDigit = Number(requestkptno.slice(-1));
    if (lastDigit % 2 === 1) {
      return error(
        res,
        "ALS0011",
        "REKOD NO KAD PENGENALAN TIDAK SAH"
      );
    }

    /* =================================================
     * SUCCESS RESPONSE (repindicator = 1)
     * ================================================= */
    const reply = {
      agencyid,
      loginid,
      ipaddress,
      requestorid,
      requestdatetime,
      requesttype,
      requestkptno,

      repdatetime: nowDateTime(),
      repindicator: 1,

      messagecode: "AL0000",
      message: "SUCCESS",

      kptno: requestkptno,
      kpno: "A234567",
      name: "MOHD HANIFF BIN ISHAK",
      birthdate: "1973-12-01",
      deathdate: null,

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

    if (Number(requesttype) === 2) {
      reply.leftminutiae =
        "000000000000000000000049008486";
      reply.rightminutiae =
        "000000000000000000000049008487";
      reply.photo =
        "ffd8ffe000104a46494600010200006400640000";
    }

    return res.status(200).json(reply);

  } catch (err) {
    console.error("MOCK JPN ALiS SYSTEM ERROR:", err);

    /* =================================================
     * ALS0012 – Database / system error
     * ================================================= */
    return error(
      res,
      "ALS0012",
      "GAGAL AKSES MAKLUMAT DARI PANGKALAN DATA"
    );
  }
};

export default {
  mockJpnALiSCheck,
};