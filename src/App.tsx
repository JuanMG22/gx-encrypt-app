"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { decrypt64, encrypt64 } from "@/helpers/twofish";
import PWABadge from "./PWABadge";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [key, setKey] = useState("");
  const [activeTab, setActiveTab] = useState("encrypt");

  const handleEncrypt = () => {
    if (!inputText) return;
    try {
      const encrypted = encrypt64(inputText, key);
      setOutputText(encrypted);
    } catch (error) {
      setOutputText(
        `Error al encriptar: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const handleDecrypt = () => {
    if (!inputText) return;
    try {
      const decrypted = decrypt64(inputText, key);
      setOutputText(decrypted);
    } catch (error) {
      setOutputText(
        `Error al desencriptar: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <>
    <div className="min-h-screen  flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Encriptación TwoFish GeneXus</CardTitle>
          <p className="text-sm ">
            Replica algoritmos de encriptación del metodo Encript64 & Decrypt64
          </p>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full min-h-72"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encrypt">Encriptar</TabsTrigger>
              <TabsTrigger value="decrypt">Desencriptar</TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key">
                  Clave de encriptación (hex 32 chars)
                </Label>
                <Input
                  id="key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Ingresa tu clave hexadecimal de 32 caracteres"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="input">
                  {activeTab === "encrypt"
                    ? "Texto a encriptar"
                    : "Texto a desencriptar"}
                </Label>
                <Input
                  id="input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    activeTab === "encrypt"
                      ? "Ingresa el texto a encriptar"
                      : "Ingresa el texto a desencriptar"
                  }
                />
              </div>

              <TabsContent value="encrypt">
                <Button className="w-full" onClick={handleEncrypt}>
                  Encriptar Texto
                </Button>
              </TabsContent>

              <TabsContent value="decrypt">
                <Button className="w-full" onClick={handleDecrypt}>
                  Desencriptar Texto
                </Button>
              </TabsContent>
            </div>
          </Tabs>

          {outputText && (
            <div className="mt-6 space-y-2">
              <Label>Resultado:</Label>
              <Card className="p-4  overflow-auto max-h-60">
                <pre className="text-sm whitespace-pre-wrap break-words">
                  {outputText}
                </pre>
              </Card>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => navigator.clipboard.writeText(outputText)}
              >
                Copiar resultado
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="text-xs text-muted-foreground">
          <p>
            Nota: La clave debe ser una cadena hexadecimal de 32 caracteres para
            128 bits
          </p>
        </CardFooter>
      </Card>
    </div>
    <PWABadge />
    </>
  );
}
