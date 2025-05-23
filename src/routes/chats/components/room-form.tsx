import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useShipments } from "@/api/shipments";
import { type InsertRoom, insertRoomSchema } from "@/schemas/room";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { useCreateRoom } from "@/api/chat-rooms";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export default function RoomForm({ onClose }: { onClose: () => void }) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { data: shipments } = useShipments();
  const { mutate, isPending } = useCreateRoom();

  const form = useForm<InsertRoom>({
    resolver: zodResolver(insertRoomSchema),
    defaultValues: {},
  });

  const shipmentId = form.watch("shipmentId");

  const onSubmit = (data: InsertRoom) => {
    mutate(data, {
      onSuccess() {
        form.reset();
        onClose();
      },
      onError(e) {
        if ((e as AxiosError).status === 409) {
          form.reset();
          onClose();
        } else {
          toast.error(e.message);
        }
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Sala de Atendimento</h4>
            <p className="text-sm text-muted-foreground">
              Selecione uma remessa ativa para criar uma sala de atendimento.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width" className="col-span-1">
                Remessa
              </Label>

              <Popover open={isOpen} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-[200px] justify-between col-span-2"
                    onClick={() => {
                      setOpen(!open);
                    }}
                  >
                    {shipmentId
                      ? "Remessa N.º " +
                        shipments.find((shipment) => shipment.id === shipmentId)
                          ?.number
                      : "Select uma remessa..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Controller
                    name="shipmentId"
                    control={form.control}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <Command
                          filter={(_, search, keywords) => {
                            if (keywords![0]?.includes(search)) return 1;
                            return 0;
                          }}
                        >
                          <CommandInput placeholder="Perquise pelo número..." />
                          <CommandList>
                            <CommandEmpty>
                              Nenhuma remessa encontrada.
                            </CommandEmpty>
                            <CommandGroup>
                              {shipments.map((shipment) => (
                                <CommandItem
                                  key={shipment.id}
                                  value={shipment.id}
                                  keywords={[shipment.number]}
                                  onSelect={(currentValue) => {
                                    onChange(
                                      currentValue === value ? "" : currentValue
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      value === shipment.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {shipment.number}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      );
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-row gap-4 justify-end">
            <Button
              size="sm"
              variant="outline"
              type="reset"
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              type="submit"
              variant="default"
              disabled={isPending}
            >
              Adicionar
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
