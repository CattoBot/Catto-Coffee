declare module "@sapphire/framework" {
  interface Preconditions {
    AdminOnly: never;
    ModOnly:never;
    TempVoiceExists: never;
    OwnerOnly: never;
    // ...
  }
}

export default undefined;