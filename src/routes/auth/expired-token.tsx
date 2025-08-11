import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";

export default function ExpiredToken() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 bg-white dark:bg-background">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[450px] gap-10">
          <h1 className="text-3xl font-bold">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-auto w-full object-cover object-right dark:brightness-[0.2] dark:grayscale"
            />
          </h1>

          <div className="grid gap-6 text-center">
            {/* Icon and Title */}
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-semibold">Link Expirado</h2>
            </div>

            {/* Message */}
            <p className="text-gray-600 dark:text-gray-400">
              Link de acesso expirado, por favor requisite outro para o administrador.
            </p>

            {/* Action Buttons */}
            <div className="grid gap-3">
              {/* Request new link button */}
              <Button
                variant="default"
                className="w-full"
                asChild
              >
                <a href="mailto:renan@qualiflex.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Requisitar novo link
                </a>
              </Button>

              {/* Back to login button */}
              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <Link to="/auth/sign-in">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o Login
                </Link>
              </Button>
            </div>

            {/* Additional help text */}
            <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Por que isso aconteceu?</strong>
              </p>
              <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-500">
                <li>• O link de acesso expira após um período de tempo</li>
                <li>• O link já foi utilizado anteriormente</li>
                <li>• O link pode ter sido invalidado por segurança</li>
              </ul>
            </div>

            {/* Contact information */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Se precisar de ajuda adicional, entre em contato:</p>
              <a
                href="mailto:renan@qualiflex.com"
                className="font-medium text-primary underline hover:no-underline"
              >
                renan@qualiflex.com
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side image */}
      <div className="hidden bg-muted lg:block">
        <img
          src="/apolo_login.png"
          alt="Apolo Mascote"
          className="h-full w-full object-cover object-right"
        />
      </div>
    </div>
  );
}