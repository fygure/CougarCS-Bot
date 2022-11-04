import { Command } from "../interfaces/Command";
import { ping } from "../commands/ping";
import { profile } from "../commands/dm_user";

export const CommandList: Command[] = [ping, profile];
