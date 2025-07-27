import { detSchema, type fileSchema } from "@/lib/schemas/shipment-file";
import { z } from "zod";
import type { Shipment } from "@/lib/schemas/shipment";
import type { Seamstress } from "@/lib/schemas/seamstress";
import type { Product } from "@/lib/schemas/product";
import type { Carrier } from "@/lib/schemas/carrier";
import { type NFEFinancialCalc } from "@/lib/schemas/nfe-calc";

const handleProduct = (item: z.infer<typeof detSchema>) => {
  const product = item.prod;
  const imposto = item.imposto || {};

  const icms = imposto.iCMS?.iCMS40 || {};
  const ipi = imposto.iPI?.iPINT || {};

  return {
    id: parseInt(item.nItem, 10),
    code: product.cProd,
    description: product.xProd,
    ncm: product.nCM,
    cst: icms.cST || "00",
    cfop: product.cFOP,
    unit: product.uCom,
    quantity: parseFloat(product.qCom),
    unitPrice: parseFloat(product.vUnCom),
    totalPrice: parseFloat(product.vProd),
    bcIcms: 0,
    icmsValue: 0,
    ipiValue: 0,
    icmsRate: parseFloat(icms.orig || "0"),
    ipiRate: parseFloat(ipi.cST || "0"),
  };
};

export class NfeToShipment implements Shipment {
  number: string;
  accessKey: string;
  series: string;
  type: "saida" | "entrada";
  authorizationProtocol: string;
  issueDate: string;
  entryExitDate: string;
  entryExitTime: string;
  recipient: Seamstress;
  products: Product[];
  carrier: Carrier;

  constructor(nfe: z.infer<typeof fileSchema>) {
    this.number = nfe.nFe.infNFe.ide.nNF;
    this.accessKey = nfe.protNFe.infProt.chNFe;
    this.series = nfe.nFe.infNFe.ide.serie;
    this.type = nfe.nFe.infNFe.ide.idDest === "1" ? "saida" : "entrada";
    this.authorizationProtocol = nfe.protNFe.infProt.nProt;
    this.issueDate = nfe.nFe.infNFe.ide.dhEmi;
    this.entryExitDate = nfe.nFe.infNFe.ide.dhEmi;
    this.entryExitTime = "";

    this.recipient = {
      address: {
        route: nfe.nFe.infNFe.dest.enderDest.xLgr,
        subpremise: nfe.nFe.infNFe.dest.enderDest.xCpl ?? "",
        street_number: nfe.nFe.infNFe.dest.enderDest.nro,
        sublocality: nfe.nFe.infNFe.dest.enderDest.xBairro,
        locality: nfe.nFe.infNFe.dest.enderDest.xMun,
        administrative_area_level_1: nfe.nFe.infNFe.dest.enderDest.uF,
        country: nfe.nFe.infNFe.dest.enderDest.xPais,
        formatted_address: `${nfe.nFe.infNFe.dest.enderDest.xLgr}, ${nfe.nFe.infNFe.dest.enderDest.nro} ${nfe.nFe.infNFe.dest.enderDest.xCpl} - ${nfe.nFe.infNFe.dest.enderDest.xBairro}, ${nfe.nFe.infNFe.dest.enderDest.cMun} - ${nfe.nFe.infNFe.dest.enderDest.uF}, ${nfe.nFe.infNFe.dest.enderDest.cEP}, ${nfe.nFe.infNFe.dest.enderDest.xPais}`,
        postal_code: nfe.nFe.infNFe.dest.enderDest.cEP,
      },
      businessInfo: {
        nameCorporateReason: nfe.nFe.infNFe.dest.xNome,
        cnpjCpf: nfe.nFe.infNFe.dest.cNPJ,
        email: nfe.nFe.infNFe.dest.email,
        phoneFax: nfe.nFe.infNFe.dest.enderDest.fone,
        internalCode: "",
        stateRegistration: nfe.nFe.infNFe.dest.iE,
        tradeName: "",
      },
    };

    this.financialCalc = {
      icmsBase: nfe.nFe.infNFe.total.iCMSTot.vBC,
      icmsValue: nfe.nFe.infNFe.total.iCMSTot.vICMS,
      stIcmsBase: nfe.nFe.infNFe.total.iCMSTot.vBCST,
      stIcmsValue: nfe.nFe.infNFe.total.iCMSTot.vST,
      fcpValue: nfe.nFe.infNFe.total.iCMSTot.vFCP,
      pisValue: nfe.nFe.infNFe.total.iCMSTot.vPIS,
      totalProductValue: nfe.nFe.infNFe.total.iCMSTot.vProd,
      freightValue: nfe.nFe.infNFe.total.iCMSTot.vFrete,
      insuranceValue: nfe.nFe.infNFe.total.iCMSTot.vSeg,
      discount: nfe.nFe.infNFe.total.iCMSTot.vDesc,
      otherExpenses: nfe.nFe.infNFe.total.iCMSTot.vOutro,
      ipiValue: nfe.nFe.infNFe.total.iCMSTot.vIPI,
      cofinsValue: nfe.nFe.infNFe.total.iCMSTot.vCOFINS,
      totalInvoiceValue: nfe.nFe.infNFe.total.iCMSTot.vNF,
    };

    this.carrier = {
      transportationType: nfe.nFe.infNFe.transp.modFrete,
    };

    this.products = Array.isArray(nfe.nFe.infNFe.det)
      ? nfe.nFe.infNFe.det?.map(handleProduct)
      : [handleProduct(nfe.nFe.infNFe.det!)];
  }
}
