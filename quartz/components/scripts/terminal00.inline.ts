import ForceGraph from "force-graph"
import { forceCollide, forceManyBody } from "d3-force"

const imageCache: Record<string, HTMLImageElement> = {}

function getImageForNode(nodeName: string): HTMLImageElement | null {
  if (imageCache[nodeName])
      return imageCache[nodeName];

  const img = new Image();
  img.src = `/static/Terminal00/images/${nodeName}.webp`;
  imageCache[nodeName] = img;
  return img;
}

document.addEventListener("nav", async () => {
  const container = document.getElementById("graph");
  if (!container) return

  const response = await fetch("/static/Terminal00/graph.json");
  const gData = await response.json();

  const unknownImg = new Image();
  unknownImg.src = "/static/Terminal00/images/Unknown.webp";

  container.innerHTML = "";

  const size = 50
  const Graph = ForceGraph()(container)
    .width(container.clientWidth)
    .height(800)
    .d3VelocityDecay(0.7)
    .d3Force('collide', forceCollide(size / 2 + 10))
    .d3Force('charge', forceManyBody().strength(-300))
    .graphData(gData)
    .cooldownTicks(100)
    .linkDirectionalParticles(2)
    .linkDirectionalParticleWidth(5)
    .linkDirectionalParticleSpeed(0.005)
    .nodeLabel((node: any) => node.name)
    .nodeLabel('name')
    .onNodeClick((node: any) => {
        const targetUrl = node.url || `https://angusnicneven.com/${node.name}`
        window.open(targetUrl, "_blank")
    })
    .onNodeHover((node: any) => {
        container.style.cursor = node ? "pointer" : "default"
    })
    .nodeCanvasObject((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const img = getImageForNode(node.name)
        if (img && img.complete && img.naturalWidth !== 0)
            ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size)
        else
            ctx.drawImage(unknownImg, node.x - size / 2, node.y - size / 2, size, size)
    })
    .nodePointerAreaPaint((node: any, color: string, ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = color
        ctx.fillRect(node.x - size/2, node.y - size/2, size, size)
    });

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      Graph.width(entry.contentRect.width)
    }
  })
  resizeObserver.observe(container)

  if (window.addCleanup) {
    window.addCleanup(() => resizeObserver.disconnect())
  }
})
