
export interface TestStores {
  createSession:(sessionId:string) => Promise<any>;
  createToken:(sessionId: string) => Promise<any>;
}
