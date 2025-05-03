/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as businesses from "../businesses.js";
import type * as categories from "../categories.js";
import type * as fetchGooglePlaces from "../fetchGooglePlaces.js";
import type * as realBusinesses from "../realBusinesses.js";
import type * as refreshData from "../refreshData.js";
import type * as seed from "../seed.js";
import type * as updateBusinessCategories from "../updateBusinessCategories.js";
import type * as updateCategories from "../updateCategories.js";
import type * as utils_googlePlaces from "../utils/googlePlaces.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  businesses: typeof businesses;
  categories: typeof categories;
  fetchGooglePlaces: typeof fetchGooglePlaces;
  realBusinesses: typeof realBusinesses;
  refreshData: typeof refreshData;
  seed: typeof seed;
  updateBusinessCategories: typeof updateBusinessCategories;
  updateCategories: typeof updateCategories;
  "utils/googlePlaces": typeof utils_googlePlaces;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
