export type UserCase<T, R> = {
  execute: (params: T) => R
}
