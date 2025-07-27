import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  formatCEP,
  formatCPFOrCNPJ,
  formatDate,
  formatToBRPhone,
} from "@/lib/utils/formatters";

import { cn } from "@/lib/utils";
import { formatToBRNumber } from "@/lib/utils/formatters";
import { Card } from "@/components/ui/card";
import { formatToBRL } from "@/lib/utils/formatters";
import { SelectShipment } from "@/schemas/shipments";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useCopyValue } from "@/hooks/useCopyValue";
import { Copy } from "lucide-react";
import { useMemo } from "react";
import { useState } from "react";
import { useRelatedShipments } from "@/api/shipments";

const DetailPill = ({
  label,
  value,
  className,
}: {
  label: string;
  value?: string | null;
  className?: string;
}) => {
  const { isCopied, handleCopy } = useCopyValue();

  return (
    <div className={cn("flex flex-col items-start", className)}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="group flex items-center gap-2">
        {value || "-"}
        {value && (
          <Button
            size="icon"
            variant="outline"
            className="h-6 w-6 opacity-0 mr-1 transition-opacity group-hover:opacity-100"
            onClick={() => handleCopy(value)}
          >
            {isCopied ? (
              <Check className="text-success" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            <span className="sr-only">Copiar o {label}</span>
          </Button>
        )}
      </dd>
    </div>
  );
};

const RelatedShipmentCard = ({ shipment }: { shipment: SelectShipment }) => {
  return (
    <Card className="flex-1 cursor-pointer hover:shadow-md transition-shadow ">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-base">
              Remessa {formatToBRNumber(Number(shipment.number))}
            </div>
            <Badge
              variant="outline"
              className={cn(
                shipment.status === "Pendente" &&
                  "bg-yellow-500/60 text-white dark:bg-yellow-400/70",
                shipment.status === "Pendente aprovação" &&
                  "bg-yellow-500/80 text-white dark:bg-yellow-400/80",
                shipment.status === "Confirmado" &&
                  "bg-primary/80 text-primary-foreground",
                shipment.status === "Produzindo" &&
                  "bg-warning/80 text-warning-foreground dark:bg-warning/70",
                shipment.status === "Finalizado" &&
                  "bg-success text-success-foreground dark:bg-success/70",
                shipment.status === "Coletado" &&
                  "bg-muted text-muted-foreground",
                "text-xs"
              )}
            >
              {shipment.status}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Total:{" "}
            <span className="font-medium text-foreground">
              {formatToBRL(shipment.totalInvoiceValue ?? 0)}
            </span>
          </div>
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to={`/shipments/${shipment.id}`}>Ver detalhes</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ShipmentDetailOverview({
  shipment,
}: {
  shipment: SelectShipment;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: relatedShipments } = useRelatedShipments(
    shipment?.recipient?.id,
    !!shipment?.recipient?.id
  );

  const itemsPerPage = 3;
  const totalPages = Math.ceil((relatedShipments?.length ?? 0) / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentRelatedShipments = useMemo(() => {
    const startIndex = currentIndex * itemsPerPage;
    return relatedShipments?.slice(startIndex, startIndex + itemsPerPage);
  }, [currentIndex, relatedShipments]);

  return (
    <>
      <Card>
        <CardContent className="text-sm flex-1 overflow-y-auto flex flex-col w-full gap-4 p-5">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="text-left">
              <p className="text-xl font-medium text-primary font-mono">
                {shipment.ordersToBuy?.codeReference ?? "-"}
              </p>
              <p className="text-sm text-muted-foreground">Ordem de Compra</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-medium text-muted-foreground font-mono">
                {formatDate(shipment.entryExitDate ?? "")}
              </p>
              <p className="text-sm text-muted-foreground">Data de Emissão</p>
            </div>
            <div>
              <p className="text-xl font-medium text-muted-foreground font-mono">
                {formatDate(shipment.systemEstimation ?? "")}
              </p>
              <p className="text-sm text-muted-foreground">Prazo de Produção</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-medium text-primary font-mono">
                {formatToBRNumber(shipment.offsetDays ?? 0)} dias
              </p>
              <p className="text-sm text-muted-foreground">
                Offset de Produção
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="text-sm flex-1 overflow-y-auto flex flex-col w-full gap-4 p-5">
          <div className="font-semibold text-base">
            Informações do Prestador
          </div>
          <dl className="grid gap-x-3 gap-y-3 grid-cols-3">
            <DetailPill
              label="Nome Fantasia"
              value={shipment.recipient.businessInfo.tradeName}
            />
            <DetailPill
              label="Razão Social"
              value={shipment.recipient.businessInfo.nameCorporateReason}
              className="col-span-2"
            />
            <DetailPill
              label="CPF/CNPJ"
              value={formatCPFOrCNPJ(
                shipment.recipient.businessInfo.cnpjCpf ?? ""
              )}
              className="font-mono"
            />

            <DetailPill
              label="Inscrição Estadual"
              value={shipment.recipient.businessInfo.stateRegistration}
              className="font-mono"
            />

            <DetailPill
              label="Email"
              value={shipment.recipient.businessInfo.email}
            />

            <DetailPill
              label="Telefone"
              value={formatToBRPhone(
                shipment.recipient.businessInfo.phoneFax ?? ""
              )}
              className="font-mono"
            />

            <DetailPill
              label="Contato"
              value={shipment.recipient.businessInfo.contact}
            />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="text-sm flex-1 overflow-y-auto flex flex-col w-full gap-4 p-5">
          <div className="font-semibold text-base">Endereço do Prestador</div>
          <dl className="grid gap-x-3 gap-y-3 grid-cols-3">
            <DetailPill
              label="Logradouro"
              value={shipment.recipient.location.route}
            />
            <DetailPill
              label="Número"
              value={shipment.recipient.location.streetNumber}
            />
            <DetailPill
              label="Complemento"
              value={shipment.recipient.location.subpremise}
            />
            <DetailPill
              label="Bairro"
              value={shipment.recipient.location.sublocality}
            />
            <DetailPill
              label="Cidade"
              value={shipment.recipient.location.locality}
            />
            <DetailPill
              label="Estado"
              value={shipment.recipient.location.administrativeAreaLevel1}
            />
            <DetailPill
              label="CEP"
              value={formatCEP(shipment.recipient.location.postalCode)}
              className="font-mono"
            />

            <DetailPill
              className="col-span-2"
              label="Endereço formatado"
              value={shipment.recipient.location.formattedAddress}
            />
          </dl>
        </CardContent>
      </Card>

      <div className="flex flex-row gap-4 items-center w-full justify-between">
        <div className="flex flex-col">
          <div className="font-semibold text-base">
            Remessas relacionadas ({relatedShipments?.length})
          </div>
          <div className="flex flex-col text-sm text-muted-foreground">
            Estas remessas estão em andamento para o mesmo prestador.
          </div>
        </div>

        {!!relatedShipments?.length && relatedShipments?.length > 0 && (
          <div className="flex flex-row gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} de {totalPages}
            </span>
            <div className="flex flex-row gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={prevSlide}
                disabled={currentIndex === 0}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={nextSlide}
                disabled={currentIndex === totalPages - 1}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row gap-4">
        {relatedShipments?.length === 0 ? (
          <Card className="basis-1/3 min-h-[150px]">
            <CardContent className="text-muted-foreground p-4 flex items-center justify-center text-center h-full">
              <span className="text-sm">
                Nenhuma remessa em produção para este prestador.
              </span>
            </CardContent>
          </Card>
        ) : (
          <>
            {currentRelatedShipments?.map((item, index) => (
              <RelatedShipmentCard shipment={item} key={index} />
            ))}
            {/* Fill empty space if less than 2 items on current page */}
            {currentRelatedShipments?.length &&
              currentRelatedShipments?.length < itemsPerPage && (
                <div className="flex-1" />
              )}
          </>
        )}
      </div>
    </>
  );
}
