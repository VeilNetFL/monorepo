import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNewModelStore } from "@/lib/stores/new-model";
import { BadgeCheck, Check } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Step, StepItem, Stepper } from "@/components/ui/stepper";
import ModelDetails from "./steps/model-details";
import UploadData from "./steps/upload-data";

const NewModel = () => {
  const [hasCompletedAllSteps, setHasCompletedAllSteps] = useState(false);
  const { clearModelDetails } = useNewModelStore();

  const steps = [
    { label: "Model Details" },
    { label: "Upload Data" },
  ] satisfies StepItem[];

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setHasCompletedAllSteps(false);
          clearModelDetails();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="gradient-metal w-32 rounded-full border bg-gradient-to-tr">
          New Model
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="font-display font-normal text-3xl">
            New Model
          </DialogTitle>
        </DialogHeader>
        <Stepper
          initialStep={0}
          steps={steps}
          orientation="horizontal"
          variant="circle"
          className="w-[72%] justify-start"
        >
          {steps.map(({ label }, index) => {
            return (
              <Step key={label} label={label}>
                {index == 0 && <ModelDetails />}
                {index == 1 && (
                  <UploadData
                    hasCompletedAllSteps={hasCompletedAllSteps}
                    setHasCompletedAllSteps={setHasCompletedAllSteps}
                  />
                )}
              </Step>
            );
          })}
        </Stepper>
        {hasCompletedAllSteps && (
          <div className="flex flex-col gap-2 items-center justify-around pt-4 pb-2">
            <div className="flex items-center gap-2">
              <Check size={32} className="text-primary" />
              <p className="ml-2 text-xl font-medium text-primary inline">
                Model created successfully!
              </p>
            </div>
            <p className="text-base text-muted-foreground px-2 text-center">
                Your model has now been published for training. You can view it under My Models section.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewModel;
