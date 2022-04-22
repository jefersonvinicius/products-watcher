export interface UseCase<Params = undefined, Result = void> {
  perform(params: Params): Promise<Result>;
}
