/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FinancialInfo = ({
  data,
  onChange,
}: {
  data: any;
  onChange: (data: any) => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ [e.target.id]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Informations Financières</h2>
      <div className="gap-4 grid grid-cols-2">
        <div>
          <Label htmlFor="bank_account_number">Numéro de compte bancaire</Label>
          <Input
            id="bank_account_number"
            value={data.bank_account_number}
            onChange={handleChange}
            placeholder="Entrez votre numéro de compte bancaire"
          />
        </div>
        <div>
          <Label htmlFor="bank_account_name">Nom du titulaire du compte</Label>
          <Input
            id="bank_account_name"
            value={data.bank_account_name}
            onChange={handleChange}
            placeholder="Nom associé au compte"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialInfo;
