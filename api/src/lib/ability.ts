import { AbilityBuilder, createMongoAbility } from "@casl/ability";

export type AppAbility = ReturnType<typeof createMongoAbility>;

export function createAbility(role: string, professionalId: number): AppAbility {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  if (role === "OWNER") {
    can("manage", "all");
  } else if (role === "PARTNER") {
    can("read", "Appointment");
    can(["create", "update", "cancel", "setStatus"], "Appointment", {
      professionalId,
    });
    can("read", "Client");
    can(["read", "create", "update", "delete"], "Service", { professionalId });
    can(["read", "update"], "Professional", { id: professionalId });
    can(["read", "create", "delete"], "Block", { professionalId });
  }

  return build();
}
