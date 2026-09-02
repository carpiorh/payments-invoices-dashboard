"use client";

import { createContext, useContext, useCallback, useState, type ReactNode } from "react";

export interface PaymentProof {
  id: string;
  type: "image" | "pdf" | "link" | "drive";
  url?: string;
  fileName?: string;
  amount: number;
  date: string;
  notes?: string;
  fileId?: string;
  fileUrl?: string;
  uploadedBy?: string;
}

type PaymentProofInput = Omit<PaymentProof, "id">;

interface PaymentProofContextValue {
  proofs: Map<string, PaymentProof[]>;
  addProof: (invoiceId: string, proof: PaymentProofInput) => void;
  getProofs: (invoiceId: string) => PaymentProof[];
  removeProof: (invoiceId: string, proofId: string) => void;
}

const PaymentProofContext = createContext<PaymentProofContextValue | null>(null);

export function PaymentProofProvider({ children }: { children: ReactNode }) {
  const [proofs, setProofs] = useState<Map<string, PaymentProof[]>>(new Map());

  const addProof = useCallback((invoiceId: string, proof: PaymentProofInput) => {
    const id = `${invoiceId}-${Date.now()}`;
    const newProof: PaymentProof = { ...proof, id };

    setProofs((prev) => {
      const updated = new Map(prev);
      const invoiceProofs = updated.get(invoiceId) || [];
      updated.set(invoiceId, [...invoiceProofs, newProof]);
      return updated;
    });
  }, []);

  const getProofs = useCallback((invoiceId: string) => {
    return proofs.get(invoiceId) || [];
  }, [proofs]);

  const removeProof = useCallback((invoiceId: string, proofId: string) => {
    setProofs((prev) => {
      const updated = new Map(prev);
      const invoiceProofs = updated.get(invoiceId) || [];
      updated.set(
        invoiceId,
        invoiceProofs.filter((p) => p.id !== proofId)
      );
      return updated;
    });
  }, []);

  return (
    <PaymentProofContext.Provider value={{ proofs, addProof, getProofs, removeProof }}>
      {children}
    </PaymentProofContext.Provider>
  );
}

export function usePaymentProofs(): PaymentProofContextValue {
  const ctx = useContext(PaymentProofContext);
  if (!ctx) throw new Error("usePaymentProofs must be used within PaymentProofProvider");
  return ctx;
}
