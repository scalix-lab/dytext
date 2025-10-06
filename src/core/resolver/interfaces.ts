import { DottedPath } from "../../utils/types";
import {
  DytextResolutionResult,
  ResolvedValue,
  ModelData,
} from "../../types/results";

/**
 * Interface for resolution strategy implementations
 */
export interface IResolutionStrategy {
  canResolve(path: DottedPath): boolean;
  resolve(path: DottedPath): Promise<ResolvedValue>;
}

/**
 * Interface for the main resolver service
 */
export interface IResolver {
  resolve<T extends ResolvedValue = ModelData>(path: DottedPath): Promise<T>;
  addStrategy(strategy: IResolutionStrategy): void;

  // Optional method to get resolution metadata if needed
  getResolutionMetadata?(path: DottedPath): DytextResolutionResult | undefined;
}

/**
 * Interface for path parsing functionality
 */
export interface IPathParser {
  parse(path: DottedPath): {
    model: string;
    subpath: string;
  };
}
