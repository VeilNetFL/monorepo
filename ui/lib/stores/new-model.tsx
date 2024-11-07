import { create } from "zustand";
import {
  ActivationFunctionTypeEnum,
  ModelTypeEnum,
  OptimizerTypeEnum,
} from "../types";

interface NewModelStore {
  modelDetails: {
    name: string | null;
    model: ModelTypeEnum | null;
    activationFunction: ActivationFunctionTypeEnum | null;
    optimizer: OptimizerTypeEnum | null;
    layers: number | null;
    feePerEpoch: number | null;
    epochs: number;
  };
  setModelDetails: <K extends keyof NewModelStore["modelDetails"]>(
    field: K,
    value: NewModelStore["modelDetails"][K]
  ) => void;
  clearModelDetails: () => void;    
}

export const useNewModelStore = create<NewModelStore>((set) => ({
  modelDetails: {
    name: null,
    model: null,
    activationFunction: null,
    optimizer: null,
    layers: null,
    feePerEpoch: null,
    epochs: 1,
  },
  setModelDetails: (field, value) =>
    set((state) => ({
      modelDetails: {
        ...state.modelDetails,
        [field]: value,
      },
    })),
    clearModelDetails: () =>
    set((state) => ({
      modelDetails: {
        name: null,
        model: null,
        activationFunction: null,
        optimizer: null,
        layers: null,
        feePerEpoch: null,
        epochs: 1,
      },
    })),
}));