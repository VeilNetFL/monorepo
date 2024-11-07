export enum ModelTypeEnum {
  CNN = "CNN",
  RNN = "RNN",
  MLP = "LSTM",
}
type ModelTypeUnion = `${ModelTypeEnum}`;

export enum ActivationFunctionTypeEnum {
  ReLU = "ReLU",
  Sigmoid = "Sigmoid",
  Tanh = "Tanh",
}
type ActivationFunctionTypeUnion = `${ActivationFunctionTypeEnum}`;

export enum OptimizerTypeEnum {
  Adam = "Adam",
  SGD = "SGD",
  RMSProp = "RMSProp",
}
type OptimizerTypeUnion = `${OptimizerTypeEnum}`;

export type PublishedModel = {
  id?: string;
  name: string;
  type: ModelTypeUnion;
  activationFunction: ActivationFunctionTypeUnion;
  optimizer: OptimizerTypeUnion;
  layers: number;
  feePerEpoch: number;
  epochs: number;
  status: "Waiting For Clients" | "Training" | "Completed";
}

export type TrainerModel = Omit<PublishedModel, "status"> & {
  status: "Available" | "Training" | "Completed";
};

export enum FilterModesEnum {
  All = "All",
  Training = "Training",
  Completed = "Completed",
  Waiting = "Waiting For Clients",
}
export type FilterModesUnion = `${FilterModesEnum}`;