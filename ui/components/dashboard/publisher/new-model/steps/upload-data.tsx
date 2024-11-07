import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStepper } from "@/components/ui/stepper";
import { useNewModelStore } from "@/lib/stores/new-model";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import React, { useState } from "react";

const UploadData = ({
  hasCompletedAllSteps,
  setHasCompletedAllSteps,
}: {
  hasCompletedAllSteps: boolean;
  setHasCompletedAllSteps: (value: boolean) => void;
}) => {
  const [dataSet, setDataSet] = useState<File | null>(null);
  const { modelDetails: model } = useNewModelStore();

  const fees = model.epochs * model?.feePerEpoch || 0;

  const { nextStep, prevStep } = useStepper();

  function encryptAndUploadData() {
    console.log("Encrypting and uploading data");
    setHasCompletedAllSteps(true);
    nextStep();
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 my-2 text-sm *:rounded-lg">
        <div className="flex items-center justify-between flex-1 p-2 bg-secondary">
          <p className="font-medium">Epochs</p>
          <p className="bg-accent text-accent-foreground px-2 rounded font-bold text-xs py-1">
            {model.epochs}
          </p>
        </div>
        <div className="flex items-center justify-between flex-1 p-2 bg-secondary">
          <p className="font-medium">Fees</p>
          <p className="bg-accent text-primary px-2 rounded font-bold inline-flex text-xs py-1">
            {fees.toFixed(3)} NEAR
          </p>
        </div>
      </div>
      <div>
        <Label>Upload Dataset (for training the model)</Label>
        <Input
          type="file"
          onChange={(e) =>
            setDataSet(e.target.files ? e.target.files[0] : null)
          }
        />
      </div>
      <div className="w-full flex">
        <div className="flex-1"></div>
        <div className="flex flex-row items-center gap-2">
          <Button
            className="w-24 !h-10"
            variant={"ghost"}
            onClick={() => {
              prevStep();
            }}
          >
            <ChevronsLeft className="mr-1" size={16} /> Back
          </Button>
          <Button
            className="w-24 h-10"
            onClick={encryptAndUploadData}
          >
            Next <ChevronsRight className="ml-1" size={16} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default UploadData;
