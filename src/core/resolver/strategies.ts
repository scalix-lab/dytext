import { DytextApiService } from "../../api/apiService";
import { dytextCache } from "../../state/cache";
import { DottedPath } from "../../utils/types";
import { IResolutionStrategy } from "./interfaces";

export class WildcardResolutionStrategy implements IResolutionStrategy {
  canResolve(path: DottedPath): boolean {
    return !path || path === "*";
  }

  async resolve(path: DottedPath): Promise<any> {
    const cache = dytextCache.getCache();
    const cached = cache.get(path);

    if (cached !== undefined) return cached;

    const result = await DytextApiService.get("*");
    cache.set(path, result);
    return result;
  }
}

export class ModuleResolutionStrategy implements IResolutionStrategy {
  private dlv: any;

  constructor() {
    // Lazy load dlv to avoid issues with SSR
    import("dlv").then((module) => {
      this.dlv = module.default;
    });
  }

  canResolve(path: DottedPath): boolean {
    return path !== "*" && path !== "";
  }

  async resolve(path: DottedPath): Promise<any> {
    const { model, subpath } = this.parsePath(path);
    const cache = dytextCache.getCache();

    // Check if module is cached
    let moduleObj = cache.get(model);

    if (moduleObj === undefined) {
      moduleObj = await DytextApiService.get(model);
      cache.set(model, moduleObj);
    }

    if (!moduleObj) {
      return undefined;
    }

    // Resolve subpath locally
    return subpath ? this.dlv(moduleObj, subpath) : moduleObj;
  }

  private parsePath(path: string): { model: string; subpath: string } {
    const dotIndex = path.indexOf(".");
    const model = dotIndex === -1 ? path : path.substring(0, dotIndex);
    const subpath = dotIndex === -1 ? "" : path.substring(dotIndex + 1);
    return { model, subpath };
  }
}
