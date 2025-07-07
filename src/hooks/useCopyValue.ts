import { useState } from "react";
import { toast } from "sonner";

export const useCopyValue = () => {
  const [isCopied, setIsCopied] = useState(false);

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

  return { isCopied, handleCopy };
};
