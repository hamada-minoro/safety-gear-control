
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <img
          src="/lovable-uploads/89cf8eaf-8d86-4f1d-80b2-2b8c62e55ca7.png"
          alt="Barcelos Logo"
          className="h-16 w-auto mx-auto"
        />
        <h1 className="text-4xl font-bold">Página não encontrada</h1>
        <p className="text-muted-foreground">
          A página que você está tentando acessar não existe ou foi movida.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-barcelos hover:bg-barcelos-dark"
        >
          Voltar para o início
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
