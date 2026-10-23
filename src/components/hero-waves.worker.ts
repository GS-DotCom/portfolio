// Web Worker che disegna il nastro della hero su un OffscreenCanvas: il canvas si aggiorna
// senza passare dal thread principale, che resta libero per lo scorrimento e il resto della pagina.
import { createWavesAnimation, type WavesAnimation, type WavesMessage, type WavesReply } from "@/lib/hero-waves";

let animation: WavesAnimation | null = null;

function reply(message: WavesReply) {
  self.postMessage(message);
}

self.addEventListener("message", (event: MessageEvent<WavesMessage>) => {
  const message = event.data;
  if (message.type === "init") {
    animation = createWavesAnimation(message.canvas, () => reply({ type: "drawn" }));
    if (!animation) reply({ type: "failed" });
  } else if (message.type === "resize") {
    animation?.resize(message);
  } else {
    animation?.setState(message);
  }
});
