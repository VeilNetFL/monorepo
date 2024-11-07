"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectBox } from "@/components/ui/select-box";
import { Separator } from "@/components/ui/separator";
import { useStepper } from "@/components/ui/stepper";
import { useNewModelStore } from "@/lib/stores/new-model";
import {
  ActivationFunctionTypeEnum,
  ModelTypeEnum,
  OptimizerTypeEnum,
} from "@/lib/types";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ChevronsRight } from "lucide-react";
import React from "react";

const ModelDetails = () => {
  const ModelTypeEnums: string[] = Object.values(ModelTypeEnum);
  const ActivationFunctionTypeEnums: string[] = Object.values(
    ActivationFunctionTypeEnum
  );
  const OptimizerTypeEnums: string[] = Object.values(OptimizerTypeEnum);

  const { modelDetails: formState, setModelDetails: handleChange } =
    useNewModelStore();


  const { nextStep } = useStepper();

  return (
    <>
      <div className="flex flex-row gap-4 *:flex-1">
        <div>
          <Label>Type</Label>
          <SelectBox
            options={ModelTypeEnums}
            value={formState.model}
            setValue={(value) => handleChange("model", value)}
            placeholder="Select model type..."
          />
        </div>
        <div>
          <Label>Activation Function</Label>
          <SelectBox
            options={ActivationFunctionTypeEnums}
            value={formState.activationFunction}
            setValue={(value) => handleChange("activationFunction", value)}
            placeholder="Select function..."
          />
        </div>
      </div>
      <div className="flex flex-row gap-4 *:flex-1">
        <div>
          <Label>Optimizer</Label>
          <SelectBox
            options={OptimizerTypeEnums}
            value={formState.optimizer}
            setValue={(value) => handleChange("optimizer", value)}
            placeholder="Select optimizer..."
          />
        </div>
        <div>
          <Label>No. of Layers</Label>
          <Input
            type="number"
            placeholder="No. of layers"
            onChange={(e) => handleChange("layers", parseInt(e.target.value))}
            defaultValue={formState.layers || ""}
          />
        </div>
      </div>
      <Separator />
      <div>
        <Label>No. of epochs</Label>
        <Input
          type="number"
          placeholder="No. of epochs"
          onChange={(e) => handleChange("epochs", parseInt(e.target.value))}
          defaultValue={formState.epochs || ""}
        />
      </div>
      <div>
        <Label>Fee per epoch</Label>
        <Input
          type="number"
          placeholder="Fee per epoch (in NEAR)"
          onChange={(e) =>
            handleChange("feePerEpoch", parseFloat(e.target.value))
          }
          defaultValue={formState.feePerEpoch || ""}
        />
      </div>

      <div className="flex flex-row px-1">
        <div className="flex-1" />
        <Button
          onClick={() => {
            nextStep();
          }}
          disabled={!formState.feePerEpoch}
          className="flex items-center"
        >
          Next <ChevronsRight className="ml-1" size={16} />
        </Button>
      </div>
    </>
  );
};

export default ModelDetails;
