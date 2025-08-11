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

export function formatDate(date: string | Date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("pt-BR");
}

export function formatCEP(value: string) {
  return value.padStart(8, "0").replace(/(\d{5})(\d{3})/, "$1-$2");
}

export function formatToBRPhone(value: string) {
  // Remove any non-digit characters
  const cleanValue = value.replace(/\D/g, "");

  // Handle mobile numbers (11 digits)
  if (cleanValue.length === 11) {
    return cleanValue.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2$3-$4");
  }

  // Handle landline numbers (10 digits)
  if (cleanValue.length === 10) {
    return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  // Return original value if it doesn't match expected formats
  return value;
}

export function formatCPFOrCNPJ(value: string) {
  if (value.length === 11) {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else {
    return value.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }
}

export function add55IfDontHave(phone: string): string {
  if (!phone.startsWith("55")) {
    return `55${phone}`;
  }

  return phone;
}

export function formatDateTime(date: string | Date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
