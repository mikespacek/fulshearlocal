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
import type * as addMissingBusinesses from "../addMissingBusinesses.js";
import type * as businesses from "../businesses.js";
import type * as categories from "../categories.js";
import type * as cleanDatabase from "../cleanDatabase.js";
import type * as cleanupDuplicateCategories from "../cleanupDuplicateCategories.js";
import type * as cleanupMockBusinesses from "../cleanupMockBusinesses.js";
import type * as completeReset from "../completeReset.js";
import type * as fetchGooglePlaces from "../fetchGooglePlaces.js";
import type * as importGooglePlaces from "../importGooglePlaces.js";
import type * as realBusinesses from "../realBusinesses.js";
import type * as realBusinessesWithDescriptions from "../realBusinessesWithDescriptions.js";
import type * as refreshData from "../refreshData.js";
import type * as removeUnnecessaryCategories from "../removeUnnecessaryCategories.js";
import type * as seed from "../seed.js";
import type * as syncCategories from "../syncCategories.js";
import type * as updateBusinessCategories from "../updateBusinessCategories.js";
import type * as updateBusinessPhotos from "../updateBusinessPhotos.js";
import type * as updateCategories from "../updateCategories.js";
import type * as updateCategoryImages from "../updateCategoryImages.js";
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
  addMissingBusinesses: typeof addMissingBusinesses;
  businesses: typeof businesses;
  categories: typeof categories;
  cleanDatabase: typeof cleanDatabase;
  cleanupDuplicateCategories: typeof cleanupDuplicateCategories;
  cleanupMockBusinesses: typeof cleanupMockBusinesses;
  completeReset: typeof completeReset;
  fetchGooglePlaces: typeof fetchGooglePlaces;
  importGooglePlaces: typeof importGooglePlaces;
  realBusinesses: typeof realBusinesses;
  realBusinessesWithDescriptions: typeof realBusinessesWithDescriptions;
  refreshData: typeof refreshData;
  removeUnnecessaryCategories: typeof removeUnnecessaryCategories;
  seed: typeof seed;
  syncCategories: typeof syncCategories;
  updateBusinessCategories: typeof updateBusinessCategories;
  updateBusinessPhotos: typeof updateBusinessPhotos;
  updateCategories: typeof updateCategories;
  updateCategoryImages: typeof updateCategoryImages;
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
