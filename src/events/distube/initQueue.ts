import { Queue } from "distube";
import { Server } from "../../models/server";
import { ServerService } from "../../services/serverService";

export const data = {
  name: "initQueue",
  distube: true
}

export async function execute(queue: Queue) {
  const serverService = new ServerService()
  let data: Server | undefined = await serverService.getServerById(queue.textChannel?.guild.id as string)
  queue.autoplay = false;
  queue.volume = data?.volume as number || 100
  queue.voice.setSelfDeaf(true);
}
