/**
 * Various utilities that aren't specific to any component.
 */

type NotAsked = { type: "NotAsked" };
type Loading<Data> = { type: "Loading"; oldData?: Data };
type Failure = { type: "Failure"; error: string };
type Success<Data> = { type: "Success"; data: Data };
// Types for expressing the state of a remote http call
export type RemoteData<Data> =
  | NotAsked
  | Loading<Data>
  | Failure
  | Success<Data>;

// Constructors for the corresponding remote data types
export const notAsked: NotAsked = { type: "NotAsked" };
export function loading<Data>(oldData?: Data): Loading<Data> {
  return { type: "Loading", oldData };
}
export function failure(error: string): Failure {
  return { type: "Failure", error };
}
export function success<Data>(data: Data): Success<Data> {
  return { type: "Success", data };
}

export function isSuccess(data: RemoteData<unknown>): data is Success<unknown> {
  return data.type === "Success";
}
export function isLoading(data: RemoteData<unknown>): data is Loading<unknown> {
  return data.type === "Loading";
}

/**
 * Force the typescript compiler to throw an error if this function is hit
 */
export function assertExhaustive(x: never): never {
  throw new Error(`Case not covered in exhaustive type: ${x}`);
}

// One second in miliseconds
export const SECOND = 1000;
