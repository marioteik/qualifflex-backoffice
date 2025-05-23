export function formatToBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatToBRNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatCEP(value: string) {
  return value.replace(/(\d{5})(\d{3})/, "$1-$2");
}

export function formatToBRPhone(value: string) {
  return value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2$3-$4");
}

export function formatCPFOrCNPJ(value: string) {
  if (value.length === 11) {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else {
    return value.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  }
}

export function add55IfDontHave(phone: string): string {
  if (!phone.startsWith("55")) {
    return `55${phone}`;
  }

  return phone;
}
