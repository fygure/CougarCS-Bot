import { Command } from "../interfaces/Command";
import { ping } from "../commands/ping";
import { profile } from "../commands/profile";
import { echo } from "../commands/echo";

export const CommandList: Command[] = [ping, profile, echo];
