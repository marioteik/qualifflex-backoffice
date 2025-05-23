import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  MoreVertical,
  Truck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@radix-ui/react-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { useChatStore } from "@/routes/chats/data/store";
import { toast } from "sonner";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  formatCPFOrCNPJ,
  formatToBRL,
  formatToBRNumber,
  formatToBRPhone,
} from "@/lib/utils/formatters";

export default function ShipmentDescription({
  next,
  prev,
}: {
  next: () => void;
  prev: () => void;
}) {
  const room = useChatStore((state) => state.room);
  const [isCopied, setIsCopied] = useState(false);

  const { shipment } = room!;
  const location = shipment.recipient.location;

  const handleCopy = async (textToCopy?: string | null) => {
    try {
      await navigator.clipboard.writeText(textToCopy ?? "");
      setIsCopied(true);

      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error("Falha ao copiar o dado");
      console.log(error);
    }
  };

  return (
    <>
      <CardHeader className="flex flex-row items-start bg-muted/50 shrink">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Remessa N.º {formatToBRNumber(Number(shipment?.number))}
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => handleCopy(shipment?.number)}
            >
              {isCopied ? (
                <Check className="text-success" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              <span className="sr-only">Copiar o número da remessa</span>
            </Button>
          </CardTitle>
          <CardDescription>
            Emissão:{" "}
            {format(shipment?.createdAt, "dd 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Truck className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              Rastrear
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Exportar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm flex-1 overflow-y-auto">
        <div className="grid gap-3">
          <div className="font-semibold">Detalhes da Remessa</div>
          <ul className="grid gap-3">
            {shipment.items?.map((item) => (
              <li className="flex items-center justify-between" key={item.id}>
                <span className="text-muted-foreground">
                  <span>{item.product?.description}</span>{" "}
                  <span className="text-nowrap">x {item.quantity}</span>
                </span>
                <span>
                  {formatToBRL(
                    Number(item.totalPrice ?? item.product?.totalPrice),
                  )}
                </span>
              </li>
            ))}
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Total dos produtos</span>
              <span>
                {formatToBRL(shipment.financialCalc.totalProductValue)}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Frete</span>
              <span>{formatToBRL(0)}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Impostos</span>
              <span>{formatToBRL(0)}</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>
                {formatToBRL(shipment.financialCalc.totalInvoiceValue)}
              </span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-4">
          <div className="grid gap-3">
            <div className="font-semibold">Informações de entrega</div>
            <address className="grid gap-0.5 not-italic text-muted-foreground">
              <span>{location.formattedAddress}</span>
            </address>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-2">
          <div className="font-semibold">Informações do Prestador</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Nome Fantasia</dt>
              <dd className="group flex items-center">
                {shipment.recipient.businessInfo.tradeName && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 mr-1 transition-opacity group-hover:opacity-100"
                    onClick={() =>
                      handleCopy(shipment.recipient.businessInfo.tradeName)
                    }
                  >
                    {isCopied ? (
                      <Check className="text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span className="sr-only">Copiar o Nome Fantasia</span>
                  </Button>
                )}
                {shipment.recipient.businessInfo.tradeName ?? "-"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Razão Social</dt>
              <dd className="group flex items-center">
                {shipment.recipient.businessInfo.nameCorporateReason && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 mr-1 transition-opacity group-hover:opacity-100"
                    onClick={() =>
                      handleCopy(
                        shipment.recipient.businessInfo.nameCorporateReason,
                      )
                    }
                  >
                    {isCopied ? (
                      <Check className="text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span className="sr-only">
                      Copiar Razão Social da Empresa
                    </span>
                  </Button>
                )}{" "}
                {shipment.recipient.businessInfo.nameCorporateReason}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">CPF/CNPJ</dt>
              <dd className="group flex items-center">
                {shipment.recipient.businessInfo.cnpjCpf && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 mr-1 transition-opacity group-hover:opacity-100"
                    onClick={() =>
                      handleCopy(shipment.recipient.businessInfo.cnpjCpf)
                    }
                  >
                    {isCopied ? (
                      <Check className="text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span className="sr-only">Copiar o nome CPF / CNPJ</span>
                  </Button>
                )}
                {formatCPFOrCNPJ(shipment.recipient.businessInfo.cnpjCpf) ??
                  "-"}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Inscrição Estadual</dt>
              <dd className="group flex items-center">
                {shipment.recipient.businessInfo.stateRegistration && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 mr-1 transition-opacity group-hover:opacity-100"
                    onClick={() =>
                      handleCopy(
                        shipment.recipient.businessInfo.stateRegistration,
                      )
                    }
                  >
                    {isCopied ? (
                      <Check className="text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span className="sr-only">Copiar Inscrição Estadual</span>
                  </Button>
                )}
                {shipment.recipient.businessInfo.stateRegistration ?? "-"}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                {shipment.recipient.businessInfo.email && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 mr-1 transition-opacity group-hover:opacity-100"
                    onClick={() =>
                      handleCopy(shipment.recipient.businessInfo.email)
                    }
                  >
                    {isCopied ? (
                      <Check className="text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span className="sr-only">Copiar o nome do contato</span>
                  </Button>
                )}
                <a href="mailto:">
                  {shipment.recipient.businessInfo.email ?? "-"}
                </a>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Telefone</dt>
              <dd className="group flex items-center">
                {shipment.recipient.businessInfo.phoneFax && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 mr-1 transition-opacity group-hover:opacity-100"
                    onClick={() =>
                      handleCopy(shipment.recipient.businessInfo.phoneFax)
                    }
                  >
                    {isCopied ? (
                      <Check className="text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span className="sr-only">Copiar o número de telefone</span>
                  </Button>
                )}{" "}
                <a href="tel:">
                  {formatToBRPhone(
                    shipment.recipient.businessInfo.phoneFax ?? "",
                  ) ?? "-"}
                </a>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Contato</dt>
              <dd className="group flex items-center">
                {shipment.recipient.businessInfo.contact && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 mr-1 transition-opacity group-hover:opacity-100"
                    onClick={() =>
                      handleCopy(shipment.recipient.businessInfo.contact)
                    }
                  >
                    {isCopied ? (
                      <Check className="text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span className="sr-only">Copiar o nome do contato</span>
                  </Button>
                )}
                {shipment.recipient.businessInfo.contact ?? "-"}
              </dd>
            </div>
          </dl>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3 shrink">
        <div className="text-xs text-muted-foreground">
          Última atualização:{" "}
          <time
            dateTime={format(
              shipment?.updatedAt || shipment?.createdAt,
              "yyyy-MM-dd",
            )}
          >
            {format(
              shipment?.updatedAt || shipment?.createdAt,
              "dd 'de' MMMM 'de' yyyy",
              {
                locale: ptBR,
              },
            )}
          </time>
        </div>
        <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6"
                onClick={prev}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Atendimento Anterior</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6"
                onClick={next}
              >
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Próximo Atendimento</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </>
  );
}
